import { Component, OnDestroy, ViewChild } from '@angular/core';
import { timeInterval } from 'rxjs';
import { MultiChoiceComponent } from '../multi-choice/multi-choice.component';
import { NavService } from '../navigation/nav.service';
import { TypingComponent } from '../typing/typing.component';
import { WinScreenComponent } from '../win-screen/win-screen.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})



export class QuizComponent {
  @ViewChild(TypingComponent) typingComponent!: TypingComponent;
  @ViewChild(MultiChoiceComponent) multiChoiceComponent!: MultiChoiceComponent;
  @ViewChild(WinScreenComponent) winScreenComponent!: WinScreenComponent;

  shake: boolean = false;
  activeQuiz: string = 'typing';
  correctCounter: number = 0;

  showWinScreen: boolean = false;

  currentWordTime!: Date;

  showCounter: boolean = false;
  showTable: boolean = false;
  showTimer: boolean = false;
  timerOn: boolean = false;
  timerId!: NodeJS.Timeout;
  timeLeft: number = 15;




  constructor(private navService: NavService) 
  {
    navService.setFunction(this.changeComponent)
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.navService.getQuizMode() === 'timed' && event.key != 'Tab')
    {
      if(this.timerOn == false)
      {
        this.currentWordTime = new Date();
        this.timeLeft = this.navService.getActiveTime();
        this.timerId = setInterval(this.countDown, 1000);
      }
      this.timerOn = true;
      
    } else if (this.navService.getQuizMode() === 'endless')
    {
      this.currentWordTime = new Date();
    }
  }

  changeComponent = () => 
  {
    this.typingComponent.clearTypedWord();

    this.activeQuiz = this.navService.getActiveQuiz()
    this.timerOn = false;
    this.showTimer = false;

    if (this.navService.getQuizMode() === 'timed')
    {
      this.showTimer = true;
      this.showCounter = true;
      this.timeLeft = this.navService.getActiveTime();
    }
    if (this.navService.getQuizMode() === 'endless')
    {
      this.showCounter = true;
    }
    this.typingComponent.ipa.setDifficulty(this.navService.getDifficulty());
    this.multiChoiceComponent.ipa.setDifficulty(this.navService.getDifficulty());
  }

  gotCorrectWord = () =>
  {
    if (this.navService.getQuizMode() === 'endless' || this.navService.getQuizMode() === 'timed')
    {
      let bruh = new Date();
      console.log(bruh.getTime() - this.currentWordTime.getTime() )
      this.winScreenComponent.wpm[this.correctCounter].time = bruh.getTime() - this.currentWordTime.getTime() 
      this.winScreenComponent.wpm.push({time: 0, errors: -1});
      this.correctCounter++;
      this.currentWordTime = new Date();
    }
  }

  gotWrongWord = () =>
  {
    this.shake = true;
    if (this.navService.getQuizMode() === 'endless')
    {
      this.activateWinScreen();
      this.correctCounter = 0;
    } else if (this.navService.getQuizMode() === 'timed')
    {
      if (this.winScreenComponent.wpm[this.correctCounter].errors < 0)
      {
        this.winScreenComponent.wpm[this.correctCounter].errors = 0;
      }
      this.winScreenComponent.wpm[this.correctCounter].errors += 1;
    }
    setTimeout(this.stopShake, 500)
  }

  stopShake = () => {
    this.shake = false;
  }
  
  countDown = () =>
  {
    this.timeLeft--;
    if (this.timeLeft < 0)
    {
      this.timerOn = false;
      clearInterval(this.timerId);
      this.activateWinScreen();
      this.typingComponent.clearTypedWord();
      this.timeLeft = this.navService.getActiveTime();
      this.correctCounter = 0;
    }
  }

  activateWinScreen = () =>
  {
    this.gotCorrectWord();
    this.winScreenComponent.wpm.pop();
    // alert("You got " + this.correctCounter + " words correct!");
    console.log(this.winScreenComponent.wpm);
    this.winScreenComponent.updateData();
    this.showWinScreen = true;
  }

  restartQuiz = () => 
  {
    this.showWinScreen = false;
    this.correctCounter = 0;
    this.winScreenComponent.wpm = [];
    this.winScreenComponent.updateData();
    this.changeComponent();
  }

}

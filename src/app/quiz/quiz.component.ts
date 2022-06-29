import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavService } from '../navigation/nav.service';
import { TypingComponent } from '../typing/typing.component';

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

  shake: boolean = false;
  activeQuiz: string = 'typing';
  correctCounter: number = 0;


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
        this.timerId = setInterval(this.countDown, 1000);
      }
      this.timerOn = true;
      
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
      this.timeLeft = this.navService.getActiveTime();
    }
  
  }

  gotCorrectWord = () =>
  {
    if (this.navService.getQuizMode() === 'endless')
    {
      this.correctCounter++;
    }
  }
  gotWrongWord = () =>
  {
    this.shake = true;
    setTimeout(this.stopShake, 500)
  }

  stopShake = () => {
    this.shake = false;
  }
  
  countDown = () =>
  {
    this.timeLeft--;
    if (this.timeLeft < 1)
    {
      this.timerOn = false;
      clearInterval(this.timerId);
    }
  }


}

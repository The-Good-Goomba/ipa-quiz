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

  shake: boolean = false; // Shake the screen if the user gets the answer wrong
  activeQuiz: string = 'typing'; // The quiz mode that is currently active
  correctCounter: number = 0; // The number of correct answers

  showWinScreen: boolean = false;

  currentWordTime!: number; // The countdown timer for the current word if the mode is timed

  showCounter: boolean = false; // Show the correct counter if in endless or timed mode
  showTimer: boolean = false; // Show the timer if in timed mode
  timerOn: boolean = false; // Whether the timer is on or not, starts when the user is typing or selects the first answer
  timerId!: NodeJS.Timeout; // The id of the timer
  timeLeft: number = 15; // The time left on the timer

  doingQuiz: boolean = false; // Whether the user is doing the quiz or not


  constructor(private navService: NavService) 
  {
    navService.setFunction(this.changeComponent)
  }

  handleKeyboardEvent = (event: KeyboardEvent) => {
    if (this.navService.getQuizMode() === 'timed' && event.key != 'Tab' && !this.showWinScreen)
    {
      if(this.timerOn == false)
      {
        // If the timer hasn't started, start it
        this.currentWordTime = Date.now();
        this.timeLeft = this.navService.getActiveTime();
        this.timerId = setInterval(this.countDown, 1000);
      }
      this.timerOn = true;
      
    } else if (this.navService.getQuizMode() === 'endless' && !this.showWinScreen)
    {
      // If the user is in endless mode, start the timer for the current word (needed to show words per minute)
      if (!this.doingQuiz) { this.currentWordTime = Date.now(); this.doingQuiz = true; }
    }
  }

  changeComponent = () => 
  {
    // Sets all the variables to the correct state if the user changes mode, ie. from timed to endless or vice versa
    this.typingComponent.clearTypedWord();

    // Resets the quiz component
    this.activeQuiz = this.navService.getActiveQuiz()
    this.timerOn = false;
    this.showTimer = false;
    this.showCounter = false;
    this.correctCounter = 0;
    this.doingQuiz = false;
    clearInterval(this.timerId);
    this.winScreenComponent.wpm = [];
    this.winScreenComponent.wpm.push({time: 0, errors: -1});

    // Updates the quiz component based on the game mode
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
    // Sets the difficulty of the quiz
    this.typingComponent.ipa.setDifficulty(this.navService.getDifficulty());
    this.multiChoiceComponent.ipa.setDifficulty(this.navService.getDifficulty());
  }

  gotCorrectWord = () =>
  {
    if (this.activeQuiz === 'multiChoice' && this.navService.getQuizMode() === 'timed')
    {
      if(this.timerOn == false)
      {
        // Starts the timer if it hasn't started yet
        this.currentWordTime = Date.now();
        this.timeLeft = this.navService.getActiveTime();
        this.timerId = setInterval(this.countDown, 1000);
      }
      this.timerOn = true;
    } 
    if (this.navService.getQuizMode() === 'endless' || this.navService.getQuizMode() === 'timed')
    {
      let bruh = Date.now();
      // Adds ths time taken to get the word to the wpm array
      // Also addes the amount of errors to the wpm array
      this.winScreenComponent.wpm[this.correctCounter].time = bruh - this.currentWordTime;
      console.log(this.winScreenComponent.wpm[this.correctCounter].time);
      this.winScreenComponent.wpm.push({time: 0, errors: -1});
      // Increases the correct counter
      this.correctCounter++;
      // Restarts the timestamp for the current word
      this.currentWordTime = Date.now();
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
        // They start on -1 so it doesn't show the errors on the graph
        this.winScreenComponent.wpm[this.correctCounter].errors = 0;
      }
      this.winScreenComponent.wpm[this.correctCounter].errors += 1;
    }
    // A function is called to stop the shake after half a second
    setTimeout(this.stopShake, 500)
  }

  stopShake = () => {
    this.shake = false;
  }
  
  // Guess
  countDown = () =>
  {
    this.timeLeft--;
    if (this.timeLeft < 0)
    {
      this.timerOn = false;
      clearInterval(this.timerId);
      this.typingComponent.clearTypedWord();
      this.timeLeft = this.navService.getActiveTime();
      this.correctCounter = 0;
      this.activateWinScreen();
      
    }
  }

  // Activates the win screen
  activateWinScreen = () =>
  {
    this.showWinScreen = true;
    this.winScreenComponent.updateData();
  }

  restartQuiz = (sameWords: boolean) => 
  {
    // Not sure if you can guess what this does 🤨
    this.doingQuiz = false;
    this.showWinScreen = false;
    this.correctCounter = 0;
    this.winScreenComponent.wpm = [];
    this.winScreenComponent.updateData();
    this.typingComponent.ipa.restartTest(sameWords);
    this.typingComponent.clearTypedWord();
    this.multiChoiceComponent.ipa.restartTest(sameWords);
  }

}

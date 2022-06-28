import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavService } from '../navigation/nav.service';
import { TypingComponent } from '../typing/typing.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})



export class QuizComponent {
  @ViewChild(TypingComponent) typingComponent!: TypingComponent;

  bigClass: string = '';
  activeQuiz: string = 'typing';
  endlessCounter: number = 0;


  constructor(private navService: NavService) 
  {
    navService.setFunction(this.changeComponent)
  }

  changeComponent = () => 
  {
    this.activeQuiz = this.navService.getActiveQuiz()
    this.typingComponent.clearTypedWord();
  }


  gotCorrectWord = () =>
  {
    if (this.navService.getQuizMode() === 'endless')
    {
      this.endlessCounter++;
    }
  }
  gotWrongWord = () =>
  {
    this.bigClass = 'shake';
    setTimeout(this.stopShake, 500)
  }

  stopShake = () => {
    this.bigClass = '';
  }
  


}

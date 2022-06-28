import { Component, OnDestroy } from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { NavService } from '../navigation/nav.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})



export class QuizComponent {

  bigClass: string = '';
  typingActive: boolean = true;


  constructor(private navService: NavService) 
  {
    navService.setFunction(this.changeComponent)
  }

  activeComponent = (): string =>
  {
    return this.navService.getActiveQuiz()
  }

  changeComponent = () => 
  {
    this.typingActive = this.activeComponent() == 'typing'
  }


  gotCorrectWord = () =>
  {
    
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

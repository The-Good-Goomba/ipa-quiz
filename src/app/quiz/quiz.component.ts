import { Component, OnInit } from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { NavService } from '../navigation/nav.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  host: {
    '(document:mouseDown)' : 'handleKeyDown($event)'
  }
})



export class QuizComponent {



  constructor(private navService: NavService) { 
    console.log('bruh')
  }

  activeComponent = (): string =>
  {
    return this.navService.getActiveQuiz()
  }

  typingActive = (): boolean => { return this.activeComponent() == 'typing'}

  handleKeyDown()
  {

  }

  gotCorrectWord = () =>
  {
    
  }

  gotWrongWord = () =>
  {
    
  }
  


}

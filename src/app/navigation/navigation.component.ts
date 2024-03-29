import { Component, Output, EventEmitter } from '@angular/core';
import { faKeyboard, faCrown, faInfoCircle, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { NavService } from './nav.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  faKeyboard = faKeyboard;
  faCrown = faCrown;
  faInfo = faInfoCircle;
  multiChoice = faObjectGroup

  quizMode: string = 'zen';
  activeTime: number = 15;
  difficulty: string = 'easy';

  // This component is used to access the global variables

  constructor(private navService: NavService) { }

  setActiveQuiz = (input: string) =>
  {
    this.navService.setActiveQuiz(input);
  }

  setQuizMode = (input: string) =>
  {
    this.quizMode = input;
    this.navService.setQuizMode(input);
  }

  setActiveTime = (input: number) =>
  {
    this.activeTime = input;
    this.navService.setActiveTime(input);
  }

  setDifficulty = (input: string) =>
  {
    this.difficulty = input;
    this.navService.setDifficulty(input);
  }

}

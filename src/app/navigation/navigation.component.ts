import { Component, Output, EventEmitter } from '@angular/core';
import { faKeyboard, faCrown, faInfo, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { TypingComponent } from '../typing/typing.component';
import { NavService } from './nav.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  faKeyboard = faKeyboard;
  faCrown = faCrown;
  faInfo = faInfo;
  multiChoice = faObjectGroup

  constructor(private navService: NavService) { }

  setActiveQuiz = (input: string) =>
  {
    this.navService.setActiveQuiz(input);
  }

}

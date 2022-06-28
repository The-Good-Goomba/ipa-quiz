import { Component, Output, EventEmitter} from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { Ipa } from '../ipa/ipa';
import { ipaStruct } from '../ipaStruct';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class TypingComponent {
  @Output() correctWord = new EventEmitter<string>();
  @Output() incorrectWord = new EventEmitter<string>();


  caret: string = 'caret flashing';
  typedWord:string = '';
  ipa: Ipa;


  constructor(private dictionary: DictionaryService) {
    this.ipa = new Ipa(this.dictionary, this.callbackFunc);
  }
  
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == 'Backspace') {
      this.typedWord = this.typedWord.slice(0,-1);
      if (this.typedWord == '')
      {
        this.caret = 'caret flashing';
      }
    } else if (event.key == 'Enter') {
      if (this.typedWord == this.ipa.currentIPA.word) {
        this.typedWord = this.typedWord.concat(event.key);
        this.correctWord.emit();
        this.ipa.nextWordIPA();
        this.typedWord = '';
        this.caret = 'caret flashing'
      }  else {
        this.incorrectWord.emit();
      }
    } else if (event.key.length > 1) {
      
    } else {
      this.typedWord = this.typedWord.concat(event.key);
      this.caret = 'caret';

      
    }
  }


  // Below is the callback function for the ipa class
  // Big arrow function allows it to be passed to the subclass 😎
  callbackFunc = (struct: ipaStruct): void => {
  
  }

  

}

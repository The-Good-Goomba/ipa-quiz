import { Component, Input} from '@angular/core';
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
  
  caret: string = 'caret flashing';
  typedWord:string = '';
  ipa: Ipa;
  filter: string;
  IPAFontSize: string;

  constructor(private dictionary: DictionaryService) {
    this.ipa = new Ipa(this.dictionary, this.callbackFunc);
    this.filter = 'blur(0px)'
    this.IPAFontSize = '5vw';
  }
  
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == 'Backspace') {
      this.typedWord = this.typedWord.slice(0,-1);
      if (this.typedWord == '')
      {
        this.caret = 'caret flashing';
      }
    } else if (event.key.length > 1) {

    } else {
      this.typedWord = this.typedWord.concat(event.key);
      this.caret = 'caret';

      if (this.typedWord == this.ipa.currentIPA.word) {
        this.typedWord = this.typedWord.concat(event.key);
        this.ipa.nextWordIPA();
        this.typedWord = '';
        this.caret = 'caret flashing'
      } 
    }
  }


  // Below is the callback function for the ipa class
  // Big arrow function allows it to be passed to the subclass 😎
  callbackFunc = (struct: ipaStruct): void => {
    if (struct.ipa.length < 8)
    {
      this.IPAFontSize = '5vw';
   
    } else {
      this.IPAFontSize = `${36/struct.ipa.length}vw`;
    }
  }

}

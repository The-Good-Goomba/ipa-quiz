import { Component, Output, EventEmitter} from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { NavService } from '../navigation/nav.service';
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
// These are the event emmiters to communicate with the quiz component

  caret: string = 'caret flashing'; // The classes for the caret (flashing or not)
  typedWord:string = ''; // The string containing the typed word
  ipa: Ipa; // A class that generates the ipa for the current word


  constructor(private dictionary: DictionaryService) {
    this.ipa = new Ipa(this.dictionary, this.callbackFunc);
  }
  
  handleKeyboardEvent(event: KeyboardEvent) {
    // If we press backspace, delete the last character in the typed word
    if(event.key == 'Backspace') {
      this.typedWord = this.typedWord.slice(0,-1);
      if (this.typedWord == '')
      {
        // If the word is empty, the caret is flashing, else it isnt
        this.caret = 'caret flashing';
      }
    } else if (event.key == 'Enter') {
      event.preventDefault(); // Prevents the page from refreshing
      if (this.typedWord == this.ipa.currentIPA.word) {
        // If the word is correct, send signal to parent that we got it right
        this.typedWord = this.typedWord.concat(event.key);
        this.correctWord.emit();
        this.ipa.nextWordIPA();
        // Clear the typed word and make the caret flash again
        this.typedWord = '';
        this.caret = 'caret flashing'
      }  else {
        // If the word is incorrect, send signal to parent that we got it wrong
        this.incorrectWord.emit();
      }
    } else if (event.key == 'Tab') {
      // Little sneaky way to get the answer to the current word
      alert(this.ipa.currentIPA.word);
    } else if (event.key.length > 1) {
      // Dont handle long keys like shift, caps, command etc
    } else {
      // If the key is a letter, add it to the typed word and make the caret static
      this.typedWord = this.typedWord.concat(event.key);
      this.caret = 'caret';
    }
  }

  clearTypedWord = () => {
    this.ipa.nextWordIPA();
    this.typedWord = '';
    this.caret = 'caret flashing';
  }

  callbackFunc = (struct: ipaStruct): void => { }
// An empty function that needs to be passed to the ipa class
  

}

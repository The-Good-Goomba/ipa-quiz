import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input} from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { ipaStruct } from '../ipaStruct';
let english_1k = require('./../../assets/english_1k.json');
let english_450k = require('./../../assets/english_450k.json');

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class TypingComponent {
  @Input() fileConent: any;
  
  caret: string = 'caret flashing';
  typedWord:string = '';
  currentIPA: ipaStruct;
  nextIPA: ipaStruct;
  IPAFontSize: string = '';
  english = english_1k;
  filter: string;
  nextWord: Boolean = false;


  constructor(private dictionary: DictionaryService) {
    this.currentIPA = {
      ipa: '',
      word:'',
      audio: ''
    }
    this.nextIPA = {
      ipa: '',
      word:'',
      audio: ''
    }
    this.filter = 'blur(0px)'
    
    this.runIpa(this.currentIPA);
    this.runIpa(this.nextIPA);
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

      if (this.typedWord == this.currentIPA.word) {
        this.typedWord = this.typedWord.concat(event.key);
        try {
          this.currentIPA.ipa = this.nextIPA.ipa;
          this.currentIPA.word = this.nextIPA.word;
          this.currentIPA.audio = this.nextIPA.audio;
          this.IPAFontSize = `${this.wordSize()}vw`;
        } catch(error) {
          this.nextWord = true;
          console.log("Waiting for API...");
        }
        
        this.runIpa(this.nextIPA);
        this.typedWord = '';
        this.caret = 'caret flashing'
      } 
    }
  }

  setCurrentIPA()
  {
    this.currentIPA.ipa = this.nextIPA.ipa;
    this.currentIPA.word = this.nextIPA.word;
    this.currentIPA.audio = this.nextIPA.audio;
    this.IPAFontSize = `${this.wordSize()}vw`;
  }

  setStruct(data: any,struct: ipaStruct) {
    try {
      struct.ipa = data[0].phonetic;
      struct.word = data[0].word;
      struct.audio = data[0].phonetics[0].audio;
    } catch(error)
    {
      for(let i = 0;1 < data[0].phonetics.length; i++)
      {
        try {
          struct.ipa = data[0].phonetics[i].text;
          if (struct.ipa != null)
          {
            return;
          }
        } catch(error) {
          
        }
      }
      this.runIpa(struct);
    }
    if (this.nextWord)
    {
      this.setCurrentIPA();
      this.nextWord = false;
    }


  }

  wordSize(): number
  {
    if (this.currentIPA.ipa.length < 8)
    {
      return 5
    } else {
      return 36/this.currentIPA.ipa.length
    }
  }

  runIpa(inputIPA: ipaStruct)
  {
    var index = Math.floor(Math.random() * this.english.words.length);
    let word: string = this.english.words[index];

    console.log("Looking for " + word)

    this.dictionary.getData(word).subscribe(
        (data: any) => {
          this.setStruct(data, inputIPA);
          console.log('found word')
        },
        (error: HttpErrorResponse) => {
          console.warn('Cant find this word', error)
          this.runIpa(inputIPA);
      });


  }

}

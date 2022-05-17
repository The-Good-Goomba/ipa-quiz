import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, HostListener} from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { ipaStruct } from '../ipaStruct';
let fs = require('fs');
let english_1k = require('./text-files/english_1k.json');
let ipa_1k = require('./text-files/ipa_1k.json');

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
  title = 'ipa-quiz';
  typedWord:string = '';
  currentIPA: ipaStruct;
  useFile: boolean = true;
  IPAFontSize: string = '';

  // allWords: ipaStruct[] = [];
  // indexEnglish: number = 0;
  // indexIPA: number = 0;

  constructor(private dictionary: DictionaryService) {
    this.currentIPA = {
      ipa: '',
      word:'',
      audio: ''
    }

    let amongus = fs.readFileSync('./text-files/english_1k.json');
    console.log(amongus);
    
    this.runIpa();
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
        this.runIpa()
        this.typedWord = '';
        this.caret = 'caret flashing'
      } 
    }
  }

  setStruct(data: any) {

    this.currentIPA.ipa = data[0].phonetic;
    this.currentIPA.word = data[0].word;
    this.currentIPA.audio = data[0].phonetics[0].audio;

    if ( this.currentIPA.ipa == null)
    {
      this.currentIPA = data[0].phonetics[0].text || data[0].phonetics[1].text;
      for(let i = 0;1 < data[0].phonetics.length; i++)
      {
        this.currentIPA = data[0].phonetics[i].text;
        if (this.currentIPA.ipa != null)
        {
          break
        }
      }

      if ( this.currentIPA.ipa == null)
        this.runIpa();
    }

    // let tempIPA: ipaStruct = {
    //   word: this.currentIPA.word,
    //   audio: this.currentIPA.audio,
    //   ipa: this.currentIPA.ipa
    // };
    // tempIPA.audio = this.currentIPA.audio;
    // this.allWords[this.indexIPA] = tempIPA;
    // this.indexIPA += 1;

  }

  wordSize(): number
  {
    if (this.currentIPA.ipa.length < 8)
    {
      return 4
    } else {
      return 32/this.currentIPA.ipa.length
    }
  }

  runIpa()
  {

    if (this.useFile){
      var index = Math.floor(Math.random() * ipa_1k.hi.length);
      this.currentIPA = ipa_1k.hi[index];
  
      // if (this.indexEnglish > english_1k.words.length)
      // {
      //   this.writeContents(amongus,'ipa_1k.json','text/json');
      // }
      if (this.currentIPA.ipa == null)
      {
        console.log(`No IPA for ${this.currentIPA.word}`)
        this.runIpa();
      }

      this.IPAFontSize = `${this.wordSize()}vw`;
      
    } else {
      var index = Math.floor(Math.random() * english_1k.words.length);
      let word: string = english_1k.words[index];

      this.dictionary.getData(word).subscribe(
        (data: any) => {
          this.setStruct(data);
        },
        (error: HttpErrorResponse) => {
          console.log('Cant find this word');
          this.runIpa();
      });
    }

  }

}

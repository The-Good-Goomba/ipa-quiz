import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { ipaStruct } from '../ipaStruct';
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

  title = 'ipa-quiz';
  typedWord:string = '';
  currentIPA: ipaStruct;
  allWords: ipaStruct[] = [];
  indexEnglish: number = 0;
  indexIPA: number = 0;

  constructor(private dictionary: DictionaryService) {
    this.currentIPA = {
      ipa: '',
      word:'',
      audio: ''
    }
    this.currentIPA.word = this.newWord();
    this.runIpa(this.currentIPA.word);
  }

  
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == 'Backspace') {
      this.typedWord = this.typedWord.slice(0,-1);
    } else if (event.key.length > 1) {

    } else {
      this.typedWord = this.typedWord.concat(event.key);

      if (this.typedWord == this.currentIPA.word) {
        this.currentIPA.word = this.newWord();
        this.typedWord = '';
        this.runIpa(this.currentIPA.word);
      } 
    }
  }

  newWord(): string
  {
    var index = Math.floor(Math.random() * english_1k.words.length);
    let word: string = english_1k.words[index];
    // if (this.indexEnglish > english_1k.words.length)
    // {
    //   this.writeContents(amongus,'ipa_1k.json','text/json');
    // }
    return word;
  }

  writeContents(content: string, fileName: string, contentType: string) {
    var a = document.createElement('a');
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  setStruct(data: any) {
    // console.log(data);
    this.currentIPA.ipa = data[0].phonetic;
    this.currentIPA.word = data[0].word;
    this.currentIPA.audio = data[0].phonetics[0].audio;

    if ( this.currentIPA.ipa == null)
    {
      this.runIpa(this.newWord());
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

  runIpa(wordToConvert: string)
  {
    this.dictionary.getData(wordToConvert).subscribe(
      (data: any) => {
        this.setStruct(data);
      },
      (error: HttpErrorResponse) => {
        console.log('Cant find this word');
        this.runIpa(this.newWord());
    }
    );

  }



}

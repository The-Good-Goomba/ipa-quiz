import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
  useFile: boolean = true;

  // allWords: ipaStruct[] = [];
  // indexEnglish: number = 0;
  // indexIPA: number = 0;

  constructor(private dictionary: DictionaryService) {
    this.currentIPA = {
      ipa: '',
      word:'',
      audio: ''
    }
    
    this.runIpa();
  }

  
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == 'Backspace') {
      this.typedWord = this.typedWord.slice(0,-1);
    } else if (event.key.length > 1) {

    } else {
      this.typedWord = this.typedWord.concat(event.key);

      if (this.typedWord == this.currentIPA.word) {
        this.runIpa()
        this.typedWord = '';
      } 
    }
  }

  writeContents(content: string, fileName: string, contentType: string) {
    var a = document.createElement('a');
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  setStruct(data: any) {

    this.currentIPA.ipa = data[0].phonetic;
    this.currentIPA.word = data[0].word;
    this.currentIPA.audio = data[0].phonetics[0].audio;

    if ( this.currentIPA.ipa == null)
    {
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
        console.log(`No IPI for ${this.currentIPA.word}`)
      }
      
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

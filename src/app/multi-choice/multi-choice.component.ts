import { Component, OnInit } from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { Ipa } from '../ipa/ipa';
import { ipaStruct } from '../ipaStruct';

@Component({
  selector: 'app-multi-choice',
  templateUrl: './multi-choice.component.html',
  styleUrls: ['./multi-choice.component.scss']
})
export class MultiChoiceComponent implements OnInit {
  ipa: Ipa;
  wordFontSize: string = '5vw';


  constructor(private dictionary: DictionaryService) {
    this.ipa = new Ipa(this.dictionary, this.callbackFunc);
  }

  ngOnInit(): void {
  }

  callbackFunc = (struct: ipaStruct): void => {
    this.wordFontSize = struct.word.length > 10 ? `${25/struct.word.length}vw` : '5vw';
  }

}

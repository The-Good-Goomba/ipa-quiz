import { DictionaryService } from "../dictionary/dictionary.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ipaStruct } from "../ipaStruct";
let english_1k = require('./../../assets/english_1k.json');
let english_450k = require('./../../assets/english_450k.json');

export class Ipa {
	currentIPA: ipaStruct;
	nextIPA: ipaStruct;
	nextWord: boolean = false;
	english = english_1k;

	constructor(private dictionary: DictionaryService, wordSize: (struct: ipaStruct) => void) {
		this.currentIPA = {
			ipa: '',
			word: '',
			audio: '',
		}
		this.nextIPA = {
			ipa: '',
			word: '',
			audio: '',
		}

		this.wordSizeFunc = wordSize;
		this.runIpa(this.currentIPA);
		this.runIpa(this.nextIPA);
	}

	wordSizeFunc(struct: ipaStruct) { }

	private setCurrentIPA() {
		this.currentIPA.ipa = this.nextIPA.ipa;
		this.currentIPA.word = this.nextIPA.word;
		this.currentIPA.audio = this.nextIPA.audio;
		this.wordSizeFunc(this.currentIPA);
	}

	nextWordIPA() {

		try {
			this.setCurrentIPA();
			this.runIpa(this.nextIPA);
		} catch (error) {
			this.nextWord = true;
			console.log("Waiting for API...", error);
			this.runIpa(this.nextIPA);
		}
	}

	private setStruct(data: any, struct: ipaStruct) {
		try {
			struct.ipa = data[0].phonetic;
			struct.word = data[0].word;
			struct.audio = data[0].phonetics[0].audio;
			if (struct.ipa == undefined) { throw "No IPA" }
		} catch (error) {
			console.log(error);
			this.runIpa(struct);
		}
		if (this.nextWord) {

			this.setCurrentIPA();
			this.runIpa(this.nextIPA);
			this.nextWord = false;
		}

		if (struct === this.currentIPA) {
			this.wordSizeFunc(this.currentIPA);
		}

	}

	private runIpa(inputIPA: ipaStruct) {
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

import { DictionaryService } from "../dictionary/dictionary.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ipaStruct } from "../ipaStruct";
let english_1k = require('./../../assets/english_1k.json');
let english_25k = require('./../../assets/english_25k.json');
let english_5k = require('./../../assets/english_5k.json');


export class Ipa {
	// It handles two instances of the ipaStruct so that it doesn't lag (very smart)
	currentIPA: ipaStruct;
	nextIPA: ipaStruct;
	nextWord: boolean = false;
	english = english_1k;

	tryAgain: boolean = false;
	lastWords: ipaStruct[] = [];
	lastWordsIndex: number = 1;

	constructor(private dictionary: DictionaryService,  wordSize: (struct: ipaStruct) => void) {
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
		// The way that typescript handles memory means i need to reset each thing individually

		this.wordSizeFunc = wordSize; // This is the function that is called when the word is changed
		this.runIpa(this.currentIPA);
		this.runIpa(this.nextIPA);
	}

	wordSizeFunc(struct: ipaStruct) { }

	private setCurrentIPA() {
		this.currentIPA.ipa = this.nextIPA.ipa;
		this.currentIPA.word = this.nextIPA.word;
		this.currentIPA.audio = this.nextIPA.audio;
		this.wordSizeFunc(this.currentIPA);
		this.lastWords.push( {
			ipa: this.currentIPA.ipa,
			word: this.currentIPA.word,
			audio: this.currentIPA.audio,
		});
		// Changes the word, but doesnt change the memory location
	}

	setDifficulty = (difficulty: string) => {
		if (difficulty === 'easy') {
			this.english = english_1k;
		} else if (difficulty === 'hard') {
			this.english = english_25k;
		} else {
			this.english = english_5k;
		}
		// Difficulty is base off of the word range in the json file
	}

	restartTest = (sameWords: boolean) => {
		this.tryAgain = sameWords;
		if (this.tryAgain) {
			this.currentIPA = this.lastWords[0];
		} else {
			this.lastWords = [];
		}
		
	}

	nextWordIPA() {
		if (this.tryAgain && this.lastWords.length > this.lastWordsIndex) {
			this.currentIPA = this.lastWords[this.lastWordsIndex];
			this.lastWordsIndex += 1;
		} else {
			this.tryAgain = false;
			try {
				this.setCurrentIPA();
				this.runIpa(this.nextIPA);
			} catch (error) {
				this.nextWord = true;
				// console.log("Waiting for API...", error);
				this.runIpa(this.nextIPA);
			}
		}
	}

	private setStruct(data: any, struct: ipaStruct) {
		try {
			// Set each variable in the struct
			struct.ipa = data[0].phonetic;
			struct.word = data[0].word;
			struct.audio = data[0].phonetics[0].audio;
			if (struct.ipa == undefined) { throw "No IPA" }
		} catch (error) {
			// If we dont receive the phonetic, then try again
			this.runIpa(struct);
		}
		// If the programs lagging, then we need to run the function again for he second word
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

		// Make a call to get the word
		this.dictionary.getData(word).subscribe(
			(data: any) => {
				// If we receive data from the API, then get the info we need
				this.setStruct(data, inputIPA);
			},
			(error: HttpErrorResponse) => {
				// If we receive an error, we need to try again
				this.runIpa(inputIPA);
			}
		);


	}

}

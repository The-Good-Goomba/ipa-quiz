
import { Component, Output, EventEmitter } from '@angular/core';
import { DictionaryService } from '../dictionary/dictionary.service';
import { Ipa } from '../ipa/ipa';
import { ipaStruct, parsedValue } from '../ipaStruct';
let mistakes = require('./../../assets/mistakes.json');

@Component({
	selector: 'app-multi-choice',
	templateUrl: './multi-choice.component.html',
	styleUrls: ['./multi-choice.component.scss']
})


export class MultiChoiceComponent {
	@Output() correctWord = new EventEmitter<string>();
	@Output() incorrectWord = new EventEmitter<string>();



	ipa: Ipa;
	wordFontSize: string = '5vw';
	boxInfo: string[] = [];
	correctIndex: number = 0;

	constructor(private dictionary: DictionaryService) {
		this.ipa = new Ipa(this.dictionary, this.callbackFunc);
	}

	callbackFunc = (struct: ipaStruct): void => {
		this.wordFontSize = struct.word.length > 10 ? `${25 / struct.word.length}vw` : '5vw';
		console.log(struct)
		let temp = this.parseIpa(struct.ipa)
		this.boxNamed(temp, struct.ipa);
	}


	parseIpa = (ipa: string): parsedValue[] => {
		let parsed: parsedValue[] = [];
		let ipaArray: string[] = ipa.split('');
		console.log(ipaArray);
	
		var i = 0;

		do {
			if (ipaArray[i + 1] == 'ː')
			{
				if (this.checkLetter(ipaArray[i].concat(':')))
				{
					parsed.push({index: i, length: 2});
				}
				i++;
			} else if (ipaArray[i + 1] == ' ͡' && ipaArray[i] == 't' && ipaArray[i + 2] == 'ʃ') {
				parsed.push({index: i, length: 3});
				i += 2;
			} else {
				if (this.checkLetter(ipaArray[i].concat(ipaArray[i + 1])))
				{
					parsed.push({index: i, length: 2});
					i++;
				}  else if (this.checkLetter(ipaArray[i]))
				{
					parsed.push({index: i, length: 1});
				}
			}
			i++;
		} while (i < ipaArray.length);
		console.log(parsed);
		return parsed;
	}

	randNumbers = (len: number, quantity: number): number[] => {

		let array: number[] = Array.from(Array(len).keys())

		var shuffled = array.sort(function(){return .5 - Math.random()});

		var selected = shuffled.slice(0,quantity);
		return selected;
	}

	boxNamed = (bruh: parsedValue[], originalIPA: string) => {
		let indices: number[] = this.randNumbers(bruh.length, 3);
		this.correctIndex = Math.floor(Math.random() * 3);
		for (var i = 0; i < 4; i++) {

			if (i == this.correctIndex) {
				this.boxInfo[i] = originalIPA;
			} else {
				let randomNoIndex: number = ((i > this.correctIndex) ? i - 1 : i);
				let among: string = originalIPA.substring(bruh[indices[randomNoIndex]].index, bruh[indices[randomNoIndex]].index + bruh[indices[randomNoIndex]].length);
				console.log(among);
				let amongIndex: number = Math.floor(Math.random() * (mistakes[among].length - 1));
				let replacement = mistakes[among][amongIndex];
				this.boxInfo[i] = originalIPA.substring(0,bruh[indices[randomNoIndex]].index) + replacement + originalIPA.substring(bruh[indices[randomNoIndex]].index + bruh[indices[randomNoIndex]].length);
			}
		}
	}

	checkLetter = (letter: string): boolean => {
		let bruh: string[] = mistakes[letter];
		if (bruh == undefined){ return false; }
		else { return true; }
	}

	guess = (index: number): void => {
		if (index == this.correctIndex) {
			this.correctWord.emit();
			this.ipa.nextWordIPA();
		} else {
			this.incorrectWord.emit();
		}
	}

}

// An array of numbers that point to the index of valid letters
// And array of 3 numbers random numbers, that point to the index of the valid letters

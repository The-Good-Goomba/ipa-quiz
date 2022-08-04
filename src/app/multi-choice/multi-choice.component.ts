
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
	boxInfo: string[] = [];
	correctIndex: number = 0;

	constructor(private dictionary: DictionaryService) {
		this.ipa = new Ipa(this.dictionary, this.callbackFunc);
	}


  // Below is the callback function for the ipa class
  // Big arrow function allows it to be passed to the subclass 😎

	callbackFunc = (struct: ipaStruct): void => {
		// An array of the indexes of the mutable letters in the phonetic
		let temp = this.parseIpa(struct.ipa)
		// Creates the boxes
		this.boxNamed(temp, struct.ipa);
	}


	parseIpa = (ipa: string): parsedValue[] => {
		let parsed: parsedValue[] = [];
		// Split the ipa into an array of characters
		let ipaArray: string[] = ipa.split('');
	
		var i = 0;
		// Loop through the array of characters
		do {
			if (ipaArray[i + 1] == 'ː')
			{
				// If we have a suspender, add it's index with lenth of 2 to the array
				// A suspender is the 'ː' character
				if (this.checkLetter(ipaArray[i].concat(':')))
				{
					// Check that it has correlating mistakes
					parsed.push({index: i, length: 2});
				}
				i++;
			} else if (ipaArray[i + 1] == ' ͡' && ipaArray[i] == 't' && ipaArray[i + 2] == 'ʃ') {
				// If we have a tch sound (chair), add it's index with lenth of 3 to the array
				parsed.push({index: i, length: 3});
				i += 2;
			} else {
				if (this.checkLetter(ipaArray[i].concat(ipaArray[i + 1])))
				{
					// Just check if it and the next letter have correlating mistakes
					parsed.push({index: i, length: 2});
					i++;
				}  else if (this.checkLetter(ipaArray[i]))
				{ 
					// If it is just a single letter, check if it has correlating mistakes and add it to the array
					parsed.push({index: i, length: 1});
				}
			}
			i++;
		} while (i < ipaArray.length);
		return parsed;
	}

	randNumbers = (len: number, quantity: number): number[] => {

		let array: number[] = Array.from(Array(len).keys())

		var shuffled = array.sort(function(){return .5 - Math.random()});

		var selected = shuffled.slice(0,quantity);
		return selected;
	}

	boxNamed = (bruh: parsedValue[], originalIPA: string) => {
		// Create an array of the indexes of 3 mutable letters in the phonetic
		let indices: number[] = this.randNumbers(bruh.length, 3);
		// Correct index (duh)
		this.correctIndex = Math.floor(Math.random() * 3);
		for (var i = 0; i < 4; i++) {
			// Loop through each box
			if (i == this.correctIndex) {
				// If it is the correct box, set the text to the correct phonetic
				this.boxInfo[i] = originalIPA;
			} else {
				// If it is not the correct box, set the text to the incorrect phonetic
				// Do this by getting the index of the mutable letter and setting character to a mistake
				let randomNoIndex: number = ((i > this.correctIndex) ? i - 1 : i);
				let among: string = originalIPA.substring(bruh[indices[randomNoIndex]].index, bruh[indices[randomNoIndex]].index + bruh[indices[randomNoIndex]].length);
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

	// Go figure
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

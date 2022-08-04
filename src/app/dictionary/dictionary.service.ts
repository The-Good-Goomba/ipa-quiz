import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ipaStruct } from '../ipaStruct';

@Injectable({providedIn: 'root'})

export class DictionaryService {


  constructor(private http:HttpClient) { }

  // Input the word that we want to look up
  getData(word: string) {
    // Add the word to the url
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    url = url.concat(word);

    // Return the data from the url
    return this.http.get(url);
  }
}

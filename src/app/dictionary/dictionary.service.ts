import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ipaStruct } from '../ipaStruct';

@Injectable({providedIn: 'root'})

export class DictionaryService {



  constructor(private http:HttpClient) { 
    
  }

  getData(word: string) {
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    url = url.concat(word);

    return this.http.get(url);
  }
}

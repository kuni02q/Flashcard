import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { WordPair } from '../models/word-pair';

export interface WordPairRequest {

  sourceWord: string;

  targetWord: string;

  exampleSentence?: string;

}

@Injectable({
  providedIn: 'root'
})
export class WordPairService {

  private api = environment.apiUrl + '/groups';

  constructor(private http: HttpClient) {}


  addWord(groupId: number, data: WordPairRequest) {

    return this.http.post<WordPair>(`${this.api}/${groupId}/words`, data);

  }


  updateWord(id: number, data: WordPairRequest) {

    return this.http.put<WordPair>(`${this.api}/words/${id}`, data);

  }


  deleteWord(id: number) {

    return this.http.delete(`${this.api}/words/${id}`);

  }

}

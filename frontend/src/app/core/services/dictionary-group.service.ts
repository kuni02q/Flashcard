import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { DictionaryGroupCard } from '../models/dictionary-group-card';


export interface QuizSettings {

  mode: 'ONCE' | 'UNTIL_CORRECT';

  wordCount: number;

}


@Injectable({
  providedIn:'root'
})
export class DictionaryGroupService {


  private api =
    environment.apiUrl + '/groups';


  constructor(private http:HttpClient){}


  getMyGroups(){

    return this.http.get<DictionaryGroupCard[]>(this.api + '/my/cards');

  }

  createGroup(data:any){

    return this.http.post(this.api, data);

  }

  deleteGroup(id:number){
    return this.http.delete(`${this.api}/${id}`);

  }

  updateQuizSettings(id: number, settings: QuizSettings) {

    return this.http.put(`${this.api}/${id}/quiz-settings`, settings);

  }


}

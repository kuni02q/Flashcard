import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Language } from '../models/language';


@Injectable({
  providedIn:'root'
})
export class LanguageService {

  private api =
    environment.apiUrl + '/languages';


  constructor(private http:HttpClient){}


  getLanguages(){

    return this.http.get<Language[]>(this.api);

  }


}

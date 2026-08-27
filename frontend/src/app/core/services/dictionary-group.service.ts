import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { DictionaryGroupCard } from '../models/dictionary-group-card';
import { DictionaryGroup } from '../models/dictionary-group';
import { QuizSettings } from '../models/quiz-settings';
import {UpdateGroupRequest} from '../models/update-group-request';

@Injectable({
  providedIn: 'root',
})
export class DictionaryGroupService {
  private api = environment.apiUrl + '/groups';

  constructor(private http: HttpClient) {}

  getMyGroups() {
    return this.http.get<DictionaryGroupCard[]>(this.api + '/my/cards');
  }

  getById(id: number) {
    return this.http.get<DictionaryGroup>(`${this.api}/${id}`);
  }

  createGroup(data: any) {
    return this.http.post(this.api, data);
  }

  updateGroup(id: number, request: UpdateGroupRequest) {
    return this.http.put<DictionaryGroup>(`${this.api}/${id}`, request);
  }

  deleteGroup(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  updateQuizSettings(id: number, settings: QuizSettings) {
    return this.http.put<DictionaryGroup>(`${this.api}/${id}/quiz-settings`, settings);
  }

  completeQuiz(id: number) {
    return this.http.post<DictionaryGroup>(`${this.api}/${id}/quiz-completed`, {});
  }
}

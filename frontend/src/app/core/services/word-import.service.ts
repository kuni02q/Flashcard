import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportPreview } from '../models/import-preview';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WordImportService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  preview(groupId: number, file: File): Observable<ImportPreview> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<ImportPreview>(
      `${this.apiUrl}/groups/${groupId}/words/import/preview`,
      formData,
    );
  }

  confirm(groupId: number, file: File): Observable<void> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<void>(`${this.apiUrl}/groups/${groupId}/words/import`, formData);
  }
}

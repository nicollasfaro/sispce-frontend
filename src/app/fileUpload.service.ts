import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadUrl = 'http://localhost:3000/';  // URL do endpoint de upload

  constructor(private http: HttpClient) {}

  uploadFiles(nceId: any, files: File[]): Observable<any> {
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file, file.name);
      }
      return this.http.post(`${this.uploadUrl}/uploads`, formData, {withCredentials: true});
    }
}
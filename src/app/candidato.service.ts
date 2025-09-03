import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService {
  private apiUrl = '/api/candidato';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  update(id: string, candidato: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, candidato);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`/api/candidato/${id}`);
  }
}

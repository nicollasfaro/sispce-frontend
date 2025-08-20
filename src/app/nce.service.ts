import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'

}) export class NceService { 
    private baseUrl = 'http://localhost:8080/nces'; // URL da API para buscar NCEs

    constructor(private http: HttpClient, private authService: AuthService) {}
    
    // Método para buscar NCE pelo ID 
    
    getNceById(nceId: string): Observable<any> { 
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get<any[]>(`${this.baseUrl}/${nceId}`, { headers });
    } 

    // Atualizar uma NCE
  updateNce(nce: any): Observable<any> {
  const payload = {
    titulo: nce.titulo,
    descricao: nce.descricao,
    status: nce.status
    // demais campos editáveis do NceRequest
  };
  return this.http.put(`${this.baseUrl}/${nce.id}`, payload);
}

  // Busca o usuário logado
  getUser(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>('api/login', { headers });
  }

  // Busca as NCEs e filtra pela Organização Militar do usuário logado
  getNcesByOrganizacaoMilitar(): Observable<any[]> {
  return this.http.get<any[]>(this.baseUrl);
}

}
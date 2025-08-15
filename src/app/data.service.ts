import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>('/api/candidatos').pipe(
        map((data: any) => {
          console.log('Received candidatos:', data);
          return Array.isArray(data) ? data : [];  // Garantir que seja um array
        })
      );
  }

  getNCEs(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get('/api/nces', { headers, responseType: 'text' }).pipe(
    map(response => {
      try {
        return JSON.parse(response); // Faz parse manualmente
      } catch (error) {
        console.error("Erro ao converter JSON:", error);
        return [];
      }
    })
  );
  }

  getOms(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]> ('/api/oms', {headers});
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>('/api/users', { headers });
  }
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`'/api/users'/${userId}`);
  }

  // Busca as NCEs e filtra pela Organização Militar do usuário logado
  getNcesByOrganizacaoMilitar(): Observable<any[]> {
    return this.getUser().pipe(
      map(user => user.organizacaoMilitar.nomeInstituicao),  // Obtém a organização militar do usuário
      switchMap(organizacaoMilitar => {
        return this.http.get<any[]>('/api/nces').pipe(
          map(nces => nces.filter(nce => nce.organizacaoMilitarResponsavel.nomeInstituicao === organizacaoMilitar)) // Filtra as NCEs
        );
      })
    );
  }

  getPostos(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>('/api/nces/postos', { headers });
  }

  getStatusNCE(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>('/api/nces/status', { headers });
  }

  getCandidatosParaNce(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/candidatosParaNce`)
  }

  getCandidatos2(): Observable<any[]> {
    return this.http.get<any[]>('/api/');
  }

  addCandidato(candidatoData: any, cursosData: any): Observable<any> {
    return this.http.post<any>('/api/', candidatoData, cursosData);
  }

  updateCandidato(candidato: any): Observable<any> {
    return this.http.put<any>(`'/api/'/${candidato.id}`, candidato);
  }

  deleteCandidato(id: number): Observable<any> {
    return this.http.delete<any>(`'/api/'/candidatosParaNce/${id}`);
  }

  // Função para adicionar candidato à NCE
  addCandidateToNce(candidatoData: any): Observable<any> {
    return this.http.post(`'/api/'/candidatosParaNce`, candidatoData);
  }

  getAttachments(nceId: string): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>(`/api/nces/${nceId}/attachments`, { headers });
}
}

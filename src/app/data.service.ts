import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>('/api/candidatos').pipe(
      map((data: any) => {
        console.log('Received candidatos:', data);
        return Array.isArray(data) ? data : []; // Garantir que seja um array
      })
    );
  }

  getNCEs(ano?: number): Observable<any[]> {

  let url = '/api/nces';
  if (ano) {
    url += `?ano=${ano}`;
  }

  return this.http.get<any[]>(url);
}

  getOms(): Observable<any> {
    return this.http.get<any[]>('/api/oms');
  }

  getUser(): Observable<any> {
    return this.http.get<any>('/api/users');
  }
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`'/api/users'/${userId}`);
  }

  // Busca as NCEs e filtra pela Organização Militar do usuário logado
  getNcesByOrganizacaoMilitar(): Observable<any[]> {
    return this.getUser().pipe(
      map((user) => user.organizacaoMilitar.nomeInstituicao), // Obtém a organização militar do usuário
      switchMap((organizacaoMilitar) => {
        return this.http.get<any[]>('/api/nces').pipe(
          map((nces) =>
            nces.filter(
              (nce) =>
                nce.organizacaoMilitarResponsavel.nomeInstituicao ===
                organizacaoMilitar
            )
          ) // Filtra as NCEs
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

  // Lista todos os candidatos
  getCandidatos(): Observable<any[]> {
    return this.http.get<any[]>('/api/candidato');
  }

  // Cadastra novo candidato
  addCandidate(candidato: any): Observable<any> {
    return this.http.post('/api/candidato', candidato);
  }

  // Vincula candidato existente a um NCE
  incluirCandidatoNaNce(nceId: number, candidatoId: number): Observable<any> {
    return this.http.post(
      `/api/candidato/${nceId}/vincular/${candidatoId}`,
      {}
    );
  }

  // Carrega candidatos de uma NCE específica
  getCandidatosParaNce(nceId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/candidato/nce/${nceId}`)
  }

  updateCandidato(candidato: any): Observable<any> {
    return this.http.put<any>(`'/api/'/${candidato.id}`, candidato);
  }

  deleteCandidatoDaNce(nceId: string, candidatoId: number): Observable<any> {
  return this.http.delete(`/api/candidato/${nceId}/desvincular/${candidatoId}`);
}

  getAttachments(nceId: string): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>(`/api/nces/${nceId}/attachments`, { headers });
  }

  getAnosCapacitacao(): Observable<number[]> {

  return this.http.get<number[]>('/api/nces/anos');
}
}

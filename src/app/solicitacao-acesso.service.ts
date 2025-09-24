import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SolicitacaoAcessoService {
  private apiUrl = '/api/solicitacoes'; // ajuste conforme seu backend

  constructor(private http: HttpClient) {}

  criarSolicitacao(usuarioId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { usuarioId });
  }
  listarPendentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendentes`);
  }

  aprovarSolicitacao(solicitacaoId: string, roleId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${solicitacaoId}/aprovar`, {
      roleId,
    });
  }
}

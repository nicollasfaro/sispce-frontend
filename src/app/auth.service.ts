import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private rolesSubject = new BehaviorSubject<string[]>([]); // Novo BehaviorSubject para roles
  roles: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}
  

  login(username: string, password: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<any>('/api/login', { username, password }, { headers })
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            this.setSession(response.accessToken);
          }
        }),
        catchError(this.handleError<any>('login'))
      );
  }

  getAuthStatus() {
    return this.authSubject.asObservable();
  }

  getUser(loggedInUsername: string) {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    console.log(
      'Fazendo requisição para o endpoint de usuários com o token:',
      token
    );

    return this.http
      .get<any[]>('/api/users', { headers }) // Note que agora esperamos um array de usuários
      .pipe(
        tap((response) => {
          // Verifica se a resposta contém a lista de usuários
          console.log('Resposta recebida do servidor:', response);

          // Filtra o usuário que está logado
          const currentUser = response.find(
            (user) =>
              user.username.toLowerCase() === loggedInUsername.toLowerCase()
          );

          if (currentUser) {
            console.log('Usuário logado encontrado:', currentUser);
            localStorage.setItem('username', currentUser.username);

            // Verifica e armazena roles do usuário logado
            if (currentUser.roles && currentUser.roles.length > 0) {
              const roles = currentUser.roles.map(
                (role: { roleId: number; name: string }) => role.name
              ); // Extrai o nome das roles
              console.log('Roles do usuário logado:', roles);
              localStorage.setItem('userRoles', JSON.stringify(roles)); // Armazena as roles no localStorage
              this.rolesSubject.next(roles);
              const organizacaoMilitarUsuario = currentUser.organizacaoMilitar.nomeInstituicao;
              sessionStorage.setItem('organizacaoMilitarUsuario', JSON.stringify(organizacaoMilitarUsuario));
              console.log('Organização Militar do usuário logado:', organizacaoMilitarUsuario);
              if (roles.includes('ROLE_APROVADOR')) {
                console.log(this.roles);
                this.router.navigate(['/listaNce']);
              } else {
                this.router.navigate(['/courses']);
              } // Atualiza as roles no BehaviorSubject
            } else {
              console.log('Nenhuma role encontrada para o usuário logado');
            }
          } else {
            console.log('Usuário logado não encontrado na resposta');
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar usuário:', error);
          return of(null); // Retorna um Observable vazio para evitar quebra do fluxo
        })
      )
      .subscribe(); // O subscribe é necessário para efetivar a chamada
  }

  getUserRoles(): Observable<string[]> {
    return this.rolesSubject.asObservable(); // Retorna um Observable para as roles
  }

  setSession(token: string): void {
    // Armazena o token JWT no localStorage
    console.log('Armazenando token:', token); // Adicione este log
    localStorage.setItem('authToken', token);
    this.authSubject.next(true);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  isLoggedIn(): boolean {
    // Verifica se o token de autenticação está presente
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRoles');
    sessionStorage.removeItem('organizacaoMilitarUsuario');
    this.rolesSubject.next([]); // Limpa as roles no BehaviorSubject
    this.authSubject.next(false); // Indica que o usuário foi deslogado
  }

  registerUser(user: any){
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any[]> ('/api/oms', user, {headers});
  }
  changePassword(user: any){
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any[]> ('/api/oms', user, {headers});
  }
}

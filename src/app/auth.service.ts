import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private rolesSubject = new BehaviorSubject<string[]>(
  JSON.parse(localStorage.getItem('userRoles') || '[]')
);
  roles: any[] = [];

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  login(username: string, password: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<any>('/api/login', { username, password }, { headers })
      .pipe(
        tap((response) => {
          if (response.accessToken && response.refreshToken) {
            this.setSession(response.accessToken, response.refreshToken);
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
              const organizacaoMilitarUsuario =
                currentUser.organizacaoMilitar;
              sessionStorage.setItem(
                'organizacaoMilitarUsuario',
                JSON.stringify(organizacaoMilitarUsuario)
              );
              console.log(
                'Organização Militar do usuário logado:',
                organizacaoMilitarUsuario
              );
              this.router.navigate(['/listaNce']);
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

  setSession(token: string, refreshToken: string): void {
    // Armazena o token JWT no localStorage
    console.log('Armazenando token:', token); // Adicione este log
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
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
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    sessionStorage.removeItem('organizacaoMilitarUsuario');
    this.rolesSubject.next([]); // Limpa as roles no BehaviorSubject
    this.authSubject.next(false); // Indica que o usuário foi deslogado
  }

  registerUser(user: any) {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any[]>('/api/oms', user, { headers });
  }
  changePassword(user: any) {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any[]>('/api/oms', user, { headers });
  }

  // 🔄 Refresh token
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.logout();
      this.snackBar.open('Sua sessão expirou. Faça login novamente.', 'Fechar', {
        duration: 4000,
        panelClass: ['snackbar-error']
      });
      return of(null);
    }

    return this.http.post<any>('/api/refresh', { refreshToken }).pipe(
      tap((response) => {
        if (response.accessToken) {
          localStorage.setItem('authToken', response.accessToken);
          this.snackBar.open('Sessão renovada automaticamente ✅', 'Ok', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        }
      }),
      catchError((error) => {
        console.error('Erro ao renovar token:', error);
        this.snackBar.open('Sua sessão expirou. Faça login novamente.', 'Fechar', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
        this.logout();
        return of(null);
      })
    );
  }


  loginWithDgp(): void {
  const clientId = '54b37e55f816312ba0e57a0ef4c1b3cb';
  const redirectUri = encodeURIComponent('https://localhost:8080/auth/callback');
  const scope = 'INF_MIL_BASICO';
  const state = 'xyz123'; // pode ser random/nonce

  window.location.href =
    `https://acesso.dgp.eb.mil.br/authorize?` +
    `client_id=${clientId}&redirect_uri=${redirectUri}` +
    `&response_type=code&scope=${scope}&state=${state}`;
}

private currentUserSubject = new BehaviorSubject<any | null>(
  JSON.parse(localStorage.getItem('user') || 'null')
);
currentUser$ = this.currentUserSubject.asObservable();

getUserDgp(): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<any>('/api/usuarios-dgp/me', { headers }).pipe(
    tap((currentUser) => {
      console.log('Usuário DGP logado encontrado:', currentUser);

      localStorage.setItem('username', currentUser.nomeMilitar);
      localStorage.setItem('user', JSON.stringify(currentUser));

      const roles = currentUser.roles || [];
      localStorage.setItem('userRoles', JSON.stringify(roles));
      this.rolesSubject.next(roles);

      const organizacaoMilitarUsuario = {
        sigla: currentUser.omSigla,
        nome: currentUser.omNome,
      };
      sessionStorage.setItem(
        'organizacaoMilitarUsuario',
        JSON.stringify(organizacaoMilitarUsuario)
      );

      this.currentUserSubject.next(currentUser);
    }),
    catchError((error) => {
      console.error('Erro ao buscar usuário DGP:', error);
      return of(null);
    })
  );
}



getCurrentUser(): any {
  const user = this.currentUserSubject.value;
  if (user) return user;

  const stored = localStorage.getItem('username');
  return stored ? JSON.parse(stored) : null;
}



}

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    let authReq = req;

    // ❌ não adiciona Authorization no refresh/login/callback
    if (token && 
        !req.url.includes('/refresh') && 
        !req.url.includes('/login') && 
        !req.url.includes('/auth/callback')) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Sessão expirada
          this.snackBar.open('Sua sessão expirou. Faça login novamente.', 'Fechar', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}


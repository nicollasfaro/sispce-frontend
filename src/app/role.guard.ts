import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';  // Importa seu serviço de autenticação

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: string[] = route.data['roles'] || [];
    const userRoles: string[] = JSON.parse(localStorage.getItem('userRoles') || '[]') || [];

    // Verifica se o usuário tem pelo menos uma das roles necessárias
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      // Redireciona para uma página de erro ou login se o acesso for negado
      this.router.navigate(['/acesso-negado']);
      return false;
    }

    return true;
  }
}

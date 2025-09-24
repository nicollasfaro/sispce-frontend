import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');

    if (roles.includes('ROLE_ADMIN')) {
      return true;
    }

    // Se não for admin, redireciona
    this.router.navigate(['/acesso-negado']); 
    return false;
  }
}

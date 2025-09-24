import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model: any = {};
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;
  userRoles: string[] = [];
  isLoggedIn: boolean = false;
  captchaCode: string = '';
  captchaInput: string = '';

  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
    // window.location.reload()
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'dados_usuario_nao_encontrados') {
        this.errorMessage = 'Não foi possível recuperar seus dados no DGP. Por favor, tente realizar o login novamente.';
      } else if (params['error'] === 'invalid_code') {
        this.errorMessage = 'Código de autenticação inválido. Tente novamente.';
      }
    });
    this.generateCaptcha();
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    this.captchaCode = Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    this.captchaInput = '';
  }
onLoginWithDgp() {
  this.authService.loginWithDgp();
}
}

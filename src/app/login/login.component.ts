import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // window.location.reload()
    this.generateCaptcha();
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    this.captchaCode = Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    this.captchaInput = '';
  }

  onLogin() {
  if (this.captchaInput !== this.captchaCode) {
      this.errorMessage = 'Captcha incorreto, tente novamente.';
      this.generateCaptcha();
      return;
    }
  this.authService.login(this.username, this.password).subscribe({
    next: () => this.authService.getUser(this.username), // ele mesmo navega
    error: err => this.errorMessage = 'Usuário ou senha inválidos'
  });
}
onLoginWithDgp() {
  this.authService.loginWithDgp();
}
}

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // window.location.reload()
  }

  onLogin() {
  this.authService.login(this.username, this.password).subscribe({
    next: () => this.authService.getUser(this.username), // ele mesmo navega
    error: err => this.errorMessage = 'Usuário ou senha inválidos'
  });
}
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-success',
  template: '<p>Redirecionando...</p>',
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];

      if (accessToken && refreshToken) {
        this.authService.setSession(
          accessToken,
          refreshToken,
          Number(params['expiresIn']) // 👈 garante que é number
        ); // ✅ garante que authSubject = true
        console.log('Tokens armazenados com sucesso! ✅');

        this.authService.getUserDgp().subscribe({
          next: (user) => {
            if (user) {
              console.log('Usuário carregado após login:', user);
              this.router.navigate(['/listaNce']);
            } else {
              this.router.navigate(['/login']);
            }
          },
        });
      }
    });
  }
}

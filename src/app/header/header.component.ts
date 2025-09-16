import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userRoles: string[] = [];
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.getUserRoles().subscribe((roles) => {
      this.userRoles = roles || [];
    });

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.username = user.nomeMilitar;
      } else {
        this.username = localStorage.getItem('username');
      }
    });
    console.log(
      'Username atualizado no header:',
      this.username,
      this.isLoggedIn,
      this.userRoles
    );

    this.authService.getAuthStatus().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userRoles = [];
    this.username = null;
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }
}

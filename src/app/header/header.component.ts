import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Certifique-se de que o caminho está correto
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userRoles: string[] = []; // Definir a propriedade userRoles
  username: string | null | undefined;
  roles: any[] = [];


  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.authService.getUserRoles().subscribe(roles => {
      this.userRoles = roles;
      console.log('Roles atualizadas no header:', this.userRoles);
      this.username = localStorage.getItem('username');
    });
    this.authService.getAuthStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
    // window.location.reload()
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }
}

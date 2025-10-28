import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ThemeService } from '../theme.service';
import { SolicitacaoAcessoService } from '../solicitacao-acesso.service';
import { SolicitarAcessoDialogComponent } from '../socilitar-acesso-dialog/socilitar-acesso-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userRoles: string[] = [];
  username: string | null = null;
  remainingTime: number = 0;
  pendentesCount = 0;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private solicitacaoService: SolicitacaoAcessoService,
    private router: Router,
    private themeService: ThemeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getUserRoles().subscribe((roles) => {
      this.userRoles = roles || [];
      console.log('Roles atualizadas no header:', this.userRoles);
      if (this.userRoles.includes('ROLE_ADMIN')) {
      this.solicitacaoService.listarPendentes().subscribe((res) => {
        this.pendentesCount = res.length;
        console.log('Pendentes atualizados:', this.pendentesCount);
      });
    }
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
    this.authService.countdown$.subscribe((secs) => {
      this.remainingTime = secs;
    });
    // Aqui você pode verificar se o usuário logado tem role ADMIN
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    this.isAdmin = roles.includes('ROLE_ADMIN');

    
  }

  formatTime(secs: number): string {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  abrirModalSolicitacoes(): void {
    const dialogRef = this.dialog.open(SolicitarAcessoDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((refresh) => {
      if (refresh) {
        this.solicitacaoService.listarPendentes().subscribe((res) => {
          this.pendentesCount = res.length;
          console.log('Pendentes atualizados:', this.pendentesCount);
        });
      }
    });
  }
}

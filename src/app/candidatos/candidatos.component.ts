import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CandidatoService } from '../candidato.service';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {
  candidatos: any[] = [];
  errorMessage: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private candidatoService: CandidatoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.carregarCandidatos();
    
  }

  carregarCandidatos() {
    this.candidatoService.getAll().subscribe({
      next: (dados) => (this.candidatos = dados),
      error: () => (this.errorMessage = 'Erro ao carregar candidatos')
    });
    console.log(this.candidatos);
  }

  visualizar(candidato: any) {
    this.router.navigate(['/candidatos', candidato.id]);
  }

  editar(candidato: any) {
    this.router.navigate(['/candidatos/editar', candidato.id]);
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir este candidato?')) {
      this.candidatoService.delete(id).subscribe({
        next: () => this.carregarCandidatos(),
        error: () => (this.errorMessage = 'Erro ao excluir candidato')
      });
    }
  }
}

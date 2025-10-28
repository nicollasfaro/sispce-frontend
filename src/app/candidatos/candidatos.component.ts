import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CandidatoService } from '../candidato.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {
  candidatos: any[] = [];
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['nome', 'email', 'posto', 'acoes'];
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
      next: (dados) => {
        this.candidatos = dados;
        this.dataSource = new MatTableDataSource(this.candidatos);
        this.dataSource.paginator = this.paginator;
        console.log(this.candidatos);
      },
      error: () => (this.errorMessage = 'Erro ao carregar candidatos')
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
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

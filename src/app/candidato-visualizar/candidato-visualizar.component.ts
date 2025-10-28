import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatoService } from '../candidato.service';

@Component({
  selector: 'app-candidato-visualizar',
  templateUrl: './candidato-visualizar.component.html'
})
export class CandidatoVisualizarComponent implements OnInit {
  candidato: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatoService: CandidatoService
  ) {}

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id')!;
  this.candidatoService.getById(id).subscribe(data => {
    this.candidato = data;
    console.log('Candidato carregado:', this.candidato);
  });
  console.log('ID buscado:', id);
}

goBack() {
    this.router.navigate(['/candidatos']);
  }
}

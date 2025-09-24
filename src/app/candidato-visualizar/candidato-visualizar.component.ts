import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CandidatoService } from '../candidato.service';

@Component({
  selector: 'app-candidato-visualizar',
  templateUrl: './candidato-visualizar.component.html'
})
export class CandidatoVisualizarComponent implements OnInit {
  candidato: any;

  constructor(
    private route: ActivatedRoute,
    private candidatoService: CandidatoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.candidatoService.getById(id).subscribe(data => this.candidato = data);
    console.log(this.candidato);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatoService } from '../candidato.service';

@Component({
  selector: 'app-candidato-editar',
  templateUrl: './candidato-editar.component.html'
})
export class CandidatoEditarComponent implements OnInit {
  candidato: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatoService: CandidatoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.candidatoService.getById(id).subscribe(data => this.candidato = data);
  }

  salvar() {
  const payload: any = {
    nome: this.candidato.nome,
    dataDeNascimento: this.candidato.dataDeNascimento,
    naturalidade: this.candidato.naturalidade,
    estadoCivil: this.candidato.estadoCivil,
    celular: this.candidato.celular,
    email: this.candidato.email,
    posto: this.candidato.posto,
    organizacaoMilitarId: this.candidato.organizacaoMilitar?.omId
  };

  // só manda cursos se tiver seleção na tela
  if (this.candidato.cursos && this.candidato.cursos.length > 0) {
    payload.cursos = this.candidato.cursos.map((c: any) => c.id);
  }

  // só manda nce se tiver seleção na tela
  if (this.candidato.nces && this.candidato.nces.length > 0) {
    payload.nce = this.candidato.nces.map((n: any) => n.id);
  }

  this.candidatoService.update(this.candidato.id, payload).subscribe({
    next: () => this.router.navigate(['/candidatos']),
    error: (err) => console.error('Erro ao atualizar candidato:', err)
  });
}




}

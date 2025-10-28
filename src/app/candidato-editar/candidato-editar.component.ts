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
  this.candidatoService.getById(id).subscribe(data => {
    // Normaliza datas para o formato do input date
    if (data.dataDeNascimento) {
      data.dataDeNascimento = this.formatDate(data.dataDeNascimento);
    }
    if (data.apresentacaoOm) {
      data.apresentacaoOm = this.formatDate(data.apresentacaoOm);
    }
    if (data.inclusaoOm) {
      data.inclusaoOm = this.formatDate(data.inclusaoOm);
    }
    if (data.ultimaPromocao) {
      data.ultimaPromocao = this.formatDate(data.ultimaPromocao);
    }
    this.candidato = data;
  });
}

// helper para transformar timestamp ou ISO em yyyy-MM-dd
private formatDate(date: any): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // "2025-09-23"
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

    // só manda cursos se existir
    if (this.candidato.curso && this.candidato.curso.length > 0) {
      payload.curso = this.candidato.curso.map((c: any) => c.id ?? c.cursoId);
    }

    // só manda NCEs se existir
    if (this.candidato.nce && this.candidato.nce.length > 0) {
      payload.nce = this.candidato.nce.map((n: any) => n.nceId ?? n.id);
    }

    this.candidatoService.update(this.candidato.id, payload).subscribe({
      next: () => {
        console.log('✅ Candidato atualizado com sucesso!');
        this.router.navigate(['/candidatos']);
      },
      error: (err) => console.error('❌ Erro ao atualizar candidato:', err)
    });
  }

  cancelar() {
    this.router.navigate(['/candidatos']);
  }
}

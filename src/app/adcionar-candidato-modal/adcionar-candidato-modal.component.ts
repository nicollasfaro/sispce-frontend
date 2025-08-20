import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface OrganizacaoMilitar {
  omId: number;
  nomeInstituicao: string;
  sigla: string;
}
@Component({
  selector: 'app-adcionar-candidato-modal',
  templateUrl: './adcionar-candidato-modal.component.html',
  styleUrl: './adcionar-candidato-modal.component.css',
})
export class AdicionarCandidatoModalComponent implements OnInit {
  filtroOm: string = '';
  organizacoesFiltradas: any[] = [];
  candidateForm!: FormGroup;
  tabIndex = 0;
  cadastrandoNovo = false;
  candidatos: any[] = [];
  organizacoesMilitares: OrganizacaoMilitar[] = [];
  cursosDisponiveis = [
    { cursoId: 7, nome: 'Curso de Formação' },
    { cursoId: 8, nome: 'Curso Avançado' },
  ];

  candidatoSelecionado: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: DataService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AdicionarCandidatoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nceId: number }
  ) {}

  ngOnInit(): void {
    this.service
      .getCandidatos()
      .subscribe((cs) => (this.candidatos = cs || []));

    this.candidateForm = this.fb.group({
      // pessoais
      nome: ['', Validators.required],
      dataDeNascimento: [null, Validators.required],
      naturalidade: [''],
      estadoCivil: ['SOLTEIRO', Validators.required],
      email: [''],
      celular: [''],
      posto: ['SEGUNDO_TENENTE', Validators.required],

      // outras
      inclusaoOm: [null],
      apresentacaoOm: [null],
      ultimaPromocao: [null],
      tempoGuarnicao: [0],
      inspecaoSaude: ['true'], // String p/ bater com seu DTO (String)
      designadoOrMatriculado: [false],
      subJudice: [false],
      movimentado: [false],

      // cursos
      cursos: [[]],

      // OM (somente ID para facilitar)
      organizacaoMilitarId: [1, Validators.required],
    });
    // carrega lista de OMs
    this.service.getOms().subscribe((oms) => {
      this.organizacoesMilitares = oms;
      this.organizacoesFiltradas = oms; // inicia com todas
    });
  }

  ativarCadastroNovo() {
    this.cadastrandoNovo = true;
    this.tabIndex = 0;
  }

  filtrarOms(valor: string) {
    const filterValue = valor.toLowerCase();
    this.organizacoesFiltradas = this.organizacoesMilitares.filter((om) =>
      (om.sigla + ' ' + om.nomeInstituicao).toLowerCase().includes(filterValue)
    );
  }

  incluir() {
    // 1) Vínculo de candidato existente
    if (!this.cadastrandoNovo && this.candidatoSelecionado) {
    this.service
      .incluirCandidatoNaNce(this.data.nceId, this.candidatoSelecionado)
      .subscribe({
        next: () => {
          this.snackBar.open('Candidato vinculado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.dialogRef.close(true);
        },
        error: (e) => {
          console.error(e);
          this.snackBar.open('Erro ao vincular candidato.', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    return;
  }

    // 2) Cadastro + vínculo de candidato novo
    if (this.candidateForm.invalid) {
      this.tabIndex = 0;
      this.candidateForm.markAllAsTouched();
      return;
    }

    const v = this.candidateForm.value;

    const payload = {
      posto: v.posto,
      organizacaoMilitarId: v.organizacaoMilitarId, // 👈 agora bate com o DTO
      apresentacaoOm: v.apresentacaoOm,
      inclusaoOm: v.inclusaoOm,
      ultimaPromocao: v.ultimaPromocao,
      inspecaoSaude: String(v.inspecaoSaude),
      movimentado: !!v.movimentado,
      subJudice: !!v.subJudice,
      designadoOrMatriculado: !!v.designadoOrMatriculado,

      nome: v.nome,
      dataDeNascimento: v.dataDeNascimento,
      naturalidade: v.naturalidade,
      estadoCivil: v.estadoCivil,
      celular: v.celular,
      email: v.email,

      tempoGuarnicao: Number(v.tempoGuarnicao) || 0,

      cursos: (v.cursos || []).map((c: any) => c.cursoId || c),
      nce: [this.data.nceId],
    };

    this.service.addCandidate(payload).subscribe({
    next: () => {
      this.snackBar.open('Candidato cadastrado com sucesso!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.dialogRef.close(true);
    },
    error: (err) => {
      console.error(err);
      this.snackBar.open('Erro ao cadastrar candidato.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    },
  });
  console.log(payload);
  }

  close() {
    this.dialogRef.close();
  }
}

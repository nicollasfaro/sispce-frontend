import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DataService } from '../data.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NovoCursoDialogComponent } from '../novo-curso-dialog/novo-curso-dialog.component';
import { CoursesService } from '../courses.service';
import { CandidatoService } from '../candidato.service';

export interface Curso {
  curso_id: number;
  nomeCurso: string;
  descricao: string;
  local: string;
  dataConclusao: string;
  grau: number;
  mencao: string;
  classificacao: number;
}

interface OrganizacaoMilitar {
  cursosDoCandidato: any[];
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
  cursosDisponiveis: any[] = []; // vem da API
  cursosDoCandidato: any[] = []; // lista do candidato atual
  postos: any[] = [];

  candidatoSelecionado: any;

  candidatoIdCriado: string | null = null;

  constructor(
    private fb: FormBuilder,
    private service: DataService,
    private coursesService: CoursesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private candidatoService: CandidatoService,
    private dataService: DataService,
    private dialogRef: MatDialogRef<AdicionarCandidatoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nceId: number }
  ) {}

  ngOnInit(): void {
    this.loadPostos();

    console.log(this.candidatos);

    this.candidateForm = this.fb.group({
      // pessoais
      nome: ['', Validators.required],
      dataDeNascimento: [null, Validators.required],
      naturalidade: [''],
      estadoCivil: ['SOLTEIRO', Validators.required],
      email: [''],
      celular: [''],
      postoId: ['', Validators.required],

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
    // 🔹 Carregar cursos salvos no banco
    this.coursesService.getCourses().subscribe({
      next: (cursos: Curso[]) => {
        this.cursosDisponiveis = cursos;
      },
      error: (err) => console.error('Erro ao carregar cursos', err),
    });
    // 🔹 Carrega candidatos
  this.candidatoService.getAll().subscribe({
    next: (candidatos) => {
      this.candidatos = candidatos;
      console.log('Candidatos carregados:', candidatos);
    },
    error: (err) => console.error('Erro ao carregar candidatos', err),
  });
  }

  getCursoNome(cursoId: number): string {
    const curso = this.cursosDisponiveis.find((c) => c.curso_id === cursoId);
    return curso ? curso.nomeCurso : 'Curso não encontrado';
  }

  abrirModalNovoCurso() {
    if (!this.candidatoIdCriado) {
      this.proximo(); // força criar o candidato primeiro
    }
    const dialogRef = this.dialog.open(NovoCursoDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((cursoNovo) => {
      console.log('>>> afterClosed retornou:', cursoNovo); // DEBUG

      if (cursoNovo) {
        if (!this.candidatoIdCriado) {
          console.error('Nenhum candidato criado ainda');
          return;
        }
        console.log('>>> candidatoIdCriado:', this.candidatoIdCriado);

        this.coursesService
          .salvarCurso(this.candidatoIdCriado, cursoNovo)
          .subscribe((cursoSalvo: Curso) => {
            console.log('>>> Curso salvo:', cursoSalvo); // DEBUG
            this.cursosDoCandidato.push(cursoSalvo);
            this.cursosDoCandidato = [...this.cursosDoCandidato];
          });
      }
    });
  }

  removerCurso(curso: any) {
    this.cursosDoCandidato = this.cursosDoCandidato.filter((c) => c !== curso);
    // opcional: chamar API de delete
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

  proximo() {
    // Se estiver na aba de Dados pessoais ou Outras informações
    if (this.tabIndex < 2) {
      if (this.candidateForm.invalid) {
        this.candidateForm.markAllAsTouched();
        return;
      }

      // Se ainda não criou no banco
      if (this.tabIndex === 1 && !this.candidatoIdCriado) {
        const payload = this.candidateForm.value;
        this.service.addCandidate(payload).subscribe({
          next: (res) => {
            this.candidatoIdCriado = res.id; // <- guarda o ID
            this.snackBar.open('Candidato criado!', 'Fechar', {
              duration: 3000,
            });
            this.tabIndex++;
          },
          error: () =>
            this.snackBar.open('Erro ao criar candidato', 'Fechar', {
              duration: 3000,
            }),
        });
      } else {
        this.tabIndex++;
      }
    }
    console.log(this.candidatoIdCriado);
    console.log(this.candidateForm.value);
  }

  concluir() {
    this.snackBar.open('Cadastro concluído!', 'Fechar', { duration: 3000 });
    this.dialogRef.close(true);
  }

  loadPostos() {
    this.dataService.getPostos().subscribe(
      (data) => {
        this.postos = data;
        console.log(this.postos);
      },
      (error) => {
        console.error('Erro ao carregar postos', error);
      }
    );
  }
}

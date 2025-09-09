import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CoursesService } from '../courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IbgeService } from '../ibge.service';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service'; // importa o serviço

@Component({
  selector: 'app-add-course-modal',
  templateUrl: './add-course-modal.component.html',
  styleUrl: './add-course-modal.component.css',
})
export class AddCourseModalComponent {
  
  qcpDetalhes: any;
  activeSuggestion = -1;
  emailBeforeAt: string = '';
  showSuggestions: boolean = false;
  domains: string[] = [
    'eb.mil.br',
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
  ];
  filteredDomains: string[] = [];
  courseForm!: FormGroup;
  oms: any[] = [];
  postos: any[] = [];
  estados: any[] = [];
  municipios: any[] = [];
  selectedUf: string = '';
  newCourse: any = { name: '' };
  courses: any[] = [];
  tipoIES: any[] = [];
  selectedIndex = 0; // Controla o índice da aba atual
  lastIndex = 7; // Número da última aba (zero-indexed)
  isLoading = false; // Propriedade para controlar o estado de carregamento
  saveMessage: string | null = null;
  acaoEstrategica: string[] = [
    '5.2.1.1 - Aperfeiçoar a capacitação da Força Terrestre para atuar na dimensão humana e informacional das operações (Operações de Informação, Operações Psicológicas ...)',
    '5.2.1.2 - Aperfeiçoar a capacidade integradora da Superioridade de Informações (Operações de Informações',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];

  courseData = {
    postoCompativelOcupacaoCargo: '',
    posto: '',
    especialidade: '',
    conhecimentoEspacifico: '',
    qcp: '',
    tipoIES: '',
    ies: '',
    pais: '',
    uf: '',
    municipio: '',
    programaConcentacaoPesquisa: '',
    aplicacaoPac: '',
    responsavel: '',
    duracaoAnos: '',
    observacao: '',
    objetivoEstrategico: '',
    estrategia: '',
    organizacaoMilitar: {} as any,
    postoResponsavel: '',
    funcao: '',
    ritex: '',
    cellphone: '',
    mail: '',
    organizacaoMilitarResponsavel: [],
    ativo: true,
    statusNce: 'CRIADA',
    pendente: 'CMT',
    dataCriacao: new Date(),
  };

  constructor(
    private coursesService: CoursesService,
    public dialogRef: MatDialogRef<AddCourseModalComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private ibgeService: IbgeService,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      postoCompativelOcupacaoCargo: ['', Validators.required],
      posto: ['', Validators.required],
      especialidade: ['', Validators.required],
      conhecimentoEspacifico: ['', Validators.required],
      qcp: ['', Validators.required],
      tipoIES: ['', Validators.required],
      ies: ['', Validators.required],
      pais: ['', Validators.required],
      uf: ['', Validators.required],
      municipio: ['', Validators.required],
      programaConcentacaoPesquisa: ['', Validators.required],
      aplicacaoPac: ['', Validators.required],
      responsavel: ['', Validators.required],
      duracaoAnos: ['', Validators.required],
      observacao: ['', Validators.required],
      objetivoEstrategico: ['', Validators.required],
      estrategia: ['', Validators.required],
      organizacaoMilitar: [[], Validators.required],
      postoResponsavel: ['', Validators.required],
      funcao: ['', Validators.required],
      ritex: ['', Validators.required],
      cellphone: ['', Validators.required],
      mail: ['', Validators.required],
      organizacaoMilitarResponsavel: [[], Validators.required],
      ativo: [Boolean, Validators.required],
      statusNce: ['', Validators.required],
      pendente: ['', Validators.required],
    });
    this.loadEstados();
    this.loadOms();
    this.loadPostos();
    this.loadTipoIes();

    // 🔑 Recupera a OM do usuário logado
    const omUsuario = sessionStorage.getItem('organizacaoMilitarUsuario');
    if (omUsuario) {
      try {
        const omObj = JSON.parse(omUsuario); // Exemplo: { id: 1, nomeInstituicao: "Colégio Militar Do Rio De Janeiro" }
        this.courseData.organizacaoMilitar = omObj;
        this.courseForm.get('organizacaoMilitar')?.setValue(omObj);
        console.log('OM preenchida automaticamente:', omObj);
      } catch (e) {
        console.error('Erro ao converter OM do sessionStorage', e);
      }
    }
  }

  loadOms() {
    this.coursesService.getOms().subscribe(
      (data) => {
        this.oms = data;
        console.log(this.oms);
      },
      (error) => {
        console.error('Erro ao carregar oms', error);
      }
    );
  }
  loadTipoIes() {
    this.coursesService.getTipoIes().subscribe(
      (data) => {
        this.tipoIES = data;
        console.log(this.tipoIES);
      },
      (error) => {
        console.error('Erro ao carregar oms', error);
      }
    );
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

  // Carrega a lista de estados
  loadEstados() {
    this.ibgeService.getEstados().subscribe(
      (data) => {
        this.estados = data;
        console.log(this.estados);
      },
      (error) => {
        console.error('Erro ao carregar estados', error);
      }
    );
  }
  // Carrega a lista de municípios baseado na UF selecionada
  onUfChange(ufId: any) {
    this.selectedUf = ufId.nome;
    console.log(this.selectedUf);
    console.log(ufId.id);
    this.ibgeService.getMunicipios(ufId.id).subscribe(
      (data) => {
        this.municipios = data;
        console.log(this.municipios);
      },
      (error) => {
        console.error('Erro ao carregar municípios', error);
      }
    );
  }

  onNext(): void {
    if (this.selectedIndex < this.lastIndex) {
      this.selectedIndex += 1; // Avança para a próxima aba
    } else {
      this.onSave(); // Salva os dados na última aba
    }
  }

  onSave(): void {
    // if(this.courseForm.valid){
    this.isLoading = true;
    console.log(this.courseData);
    this.courseData.uf = this.selectedUf;
    this.coursesService.addCourse(this.courseData).subscribe(
      (course) => {
        this.courses.push(course);
        this.isLoading = false;
        console.log(this.courses);
        this.resetForm(); // Limpa os campos do formulário
        this.snackBar.open('NCE adicionada com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
        // window.location.reload();
        // setTimeout(function(){location.reload()}, 3000);
      },
      (error) => {
        console.error('Erro ao salvar curso', error);
        this.snackBar.open('Erro ao adicionar a NCE!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
        this.isLoading = false;
      }
    );
    // }
    // else {
    //   this.courseForm.markAllAsTouched(); // Marca todos os campos como "tocados" para exibir os erros
    //   this.snackBar.open('Alguns campos que são obrigatórios não foram preenchidos', 'Fechar', {
    //     duration: 3000,
    //     verticalPosition: 'bottom',
    //     horizontalPosition: 'center'
    // });
    // }
  }

  resetForm(): void {
    this.courseData = {
      postoCompativelOcupacaoCargo: '',
      posto: '',
      especialidade: '',
      conhecimentoEspacifico: '',
      qcp: '',
      tipoIES: '',
      ies: '',
      pais: '',
      uf: '',
      municipio: '',
      programaConcentacaoPesquisa: '',
      aplicacaoPac: '',
      responsavel: '',
      duracaoAnos: '',
      observacao: '',
      objetivoEstrategico: '',
      estrategia: '',
      organizacaoMilitar: [],
      postoResponsavel: '',
      funcao: '',
      ritex: '',
      cellphone: '',
      mail: '',
      organizacaoMilitarResponsavel: [],
      ativo: true,
      statusNce: '',
      pendente: '',
      dataCriacao: new Date(),
    };
    this.selectedIndex = 0; // Volta para a primeira aba
  }

  formatarNomeCompleto() {
    // Divide o valor em palavras
    const words = this.courseData.responsavel.split(' ');

    // Formata cada palavra
    const formattedWords = words.map((word) => {
      // Mantém a palavra como está se tiver 2 caracteres
      if (word.length === 2) {
        return word.toLowerCase();
      }
      // Caso contrário, coloca a primeira letra maiúscula e o resto minúsculo
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Junta as palavras de volta e atualiza o campo
    this.courseData.responsavel = formattedWords.join(' ');
  }

  onEmailInput() {
    const email = this.courseData.mail || ''; // Garante que 'email' seja uma string
    const emailParts = email.split('@');

    if (emailParts.length > 1) {
      this.emailBeforeAt = emailParts[0] + '@';
      const typedDomain = emailParts[1].toLowerCase();
      this.filteredDomains = this.domains.filter((domain) =>
        domain.startsWith(typedDomain)
      );
      this.showSuggestions = this.filteredDomains.length > 0;
      this.activeSuggestion = -1; // Reseta a sugestão ativa
    } else {
      this.showSuggestions = false;
    }
  }

  onEmailKeydown(event: KeyboardEvent) {
    if (this.showSuggestions) {
      if (event.key === 'ArrowDown') {
        // Desce na lista de sugestões
        this.activeSuggestion =
          (this.activeSuggestion + 1) % this.filteredDomains.length;
      } else if (event.key === 'ArrowUp') {
        // Sobe na lista de sugestões
        this.activeSuggestion =
          (this.activeSuggestion - 1 + this.filteredDomains.length) %
          this.filteredDomains.length;
      } else if (event.key === 'Enter') {
        // Aplica a sugestão selecionada
        if (this.activeSuggestion >= 0) {
          this.applySuggestion(this.filteredDomains[this.activeSuggestion]);
          this.showSuggestions = false;
        }
      }
    }
  }

  applySuggestion(domain: string) {
    this.courseData.mail = this.emailBeforeAt + domain;
    this.showSuggestions = false;
  }

  onQcpChange(value: string) {
    const upper = (value || '').toUpperCase();
    this.courseData.qcp = upper;

    const clean = upper.replace(/\./g, '');

    if (clean.length >= 2) {
      this.coursesService.getQcpDetalhes(clean).subscribe({
        next: (res) => {
          this.qcpDetalhes = res;

          // 🔹 Usa os campos achatados
          this.courseData.posto = res.postoDescricao || '';
          this.courseData.postoCompativelOcupacaoCargo =
            res.qualificacaoDescricao || '';
          this.courseData.especialidade =
            res.habilitacoes?.map((h: any) => h.descricao).join(', ') || '';

          this.courseForm.patchValue({
            posto: res.postoDescricao || '',
            qualificacao: res.qualificacaoDescricao || '',
            habilitacao:
              res.habilitacoes?.map((h: any) => h.descricao).join(', ') || '',
            postoCompativelOcupacaoCargo: res.qualificacaoDescricao || '',
          });

          console.log('🔎 QCP Detalhes:', res);
        },
        error: (err) => {
          console.warn('Código QCP não encontrado:', err);
        },
      });
    }
  }
}

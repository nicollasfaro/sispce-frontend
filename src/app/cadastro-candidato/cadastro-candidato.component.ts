import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

export interface Cursos {
  id: number | null;
  curso: string;
  escola: string;
  local: string;
  dtConclusao: string;
  grau: number;
  mencao: number;
  classificacao: number;
}

@Component({
  selector: 'app-cadastro-candidato',
  templateUrl: './cadastro-candidato.component.html',
  styleUrl: './cadastro-candidato.component.css',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    provideNativeDateAdapter()],
})
export class CadastroCandidatoComponent {
  activeSuggestion = -1;
  emailBeforeAt: string = '';
  showSuggestions: boolean = false;
  domains: string[] = ['eb.mil.br','gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  filteredDomains: string[] = [];
  candidateForm!: FormGroup;
  candidatos: any[] = [];
  isLoading = false;
  selectedIndex = 0;
  lastIndex = 2; 
  displayedColumns: string[] = ['curso', 'escola', 'local', 'dataConclusao', 'grau', 'mencao', 'classificacao', 'actions'];
  courses: Cursos[] = [];
  newCourse: Cursos = { id: 0,curso: '', escola: '', local: '', dtConclusao: '', grau:0, mencao:0, classificacao:0 };

  constructor(private fb: FormBuilder, private dataService: DataService, private snackBar: MatSnackBar) {
    this.candidateForm = this.fb.group({
      fullName: ['', Validators.required],
      dtNascimento: ['', [Validators.required, Validators.required]],
      naturalidade: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      dtUltPromo: ['', Validators.required],
      dtIncOM: ['', Validators.required],
      dtAprOM: ['', Validators.required],
      tmpGuar: [Number, Validators.required],
      funDes: ['', Validators.required],
      naoMatriculado: [Boolean, Validators.required],
      judice: [Boolean, Validators.required],
      inspSaude: [Boolean, Validators.required],
      movimentado: [Boolean, Validators.required],
      contatoEmail: ['', Validators.required],
      contatoCelular: ['', Validators.required],
      courses: [this.courses]
    });
  }

  onEmailInput() {
    const email = this.candidateForm.get('contatoEmail')?.value || '';
    const emailParts = email.split('@');

    if (emailParts.length > 1) {
      // A parte antes do '@'
      this.emailBeforeAt = emailParts[0] + '@';
      // Filtrar sugestões de domínio
      const typedDomain = emailParts[1].toLowerCase();
      this.filteredDomains = this.domains.filter(domain =>
        domain.startsWith(typedDomain)
      );
      this.showSuggestions = this.filteredDomains.length > 0;
    } else {
      this.showSuggestions = false;
    }
  }

  selectDomain(domain: string) {
    const emailBeforeAt = this.emailBeforeAt;
    this.candidateForm.patchValue({
      contatoEmail: emailBeforeAt + domain
    });
    this.showSuggestions = false;
  }

  onKeyDown(event: KeyboardEvent) {
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
      } else if (event.key === 'Tab') {
        // Aplica a sugestão selecionada
        if (this.activeSuggestion >= 0) {
          this.applySuggestion(this.filteredDomains[this.activeSuggestion]);
          this.showSuggestions = false;
        }
      }
    }
  }

  applySuggestion(domain: string) {
    const email = this.emailBeforeAt + domain;
    this.candidateForm.patchValue({ contatoEmail: email });
    this.showSuggestions = false;
  }

  addCourse() {
    if (this.newCourse.curso && this.newCourse.escola && this.newCourse.local) {
      this.courses.push({ ...this.newCourse });
      this.newCourse = { id: 0 ,curso: '', escola: '', local: '', dtConclusao: '', grau:0, mencao:0 , classificacao:0 };
      console.log(this.courses)
    }
  }

  editCourse(cursos: Cursos) {
    // Lógica para editar o curso
  }
  deleteCourse(index: number) {
    this.courses.splice(index, 1);
  }

  ngOnInit(): void {}

  onNext(): void {
    if (this.selectedIndex < this.lastIndex) {
      this.selectedIndex += 1;  // Avança para a próxima aba
    } else {
      this.onSave();  // Salva os dados na última aba
    }
  }

  onSave(): void {
    if(this.candidateForm.valid){
      this.isLoading = true;
    this.dataService.addCandidate(this.candidateForm.value).subscribe(candidato => {
      this.candidatos.push(candidato);
      this.isLoading = false;
      this.candidateForm.reset(); // Limpa os campos do formulário
        this.snackBar.open('Candidato adicionado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
        });
      // window.location.reload();
      // setTimeout(function(){location.reload()}, 3000);
    }, error => {
      console.error('Erro ao salvar curso', error);
      this.snackBar.open('Erro ao adicionar o candidato!', 'Fechar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
    });
      this.isLoading = false;
  });
    } else {
      this.snackBar.open('Alguns campos que são obrigatórios não foram preenchidos', 'Fechar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
    });
    // Marca todos os campos como "tocados" para exibir os erros
    this.candidateForm.markAllAsTouched();
    }
    
  }

  formatarNomeCompleto() {
  // Divide o valor em palavras
  const words = this.candidateForm.get('fullName')?.value.split(' ');

  // Formata cada palavra
  const formattedWords = words.map((word: string) => {
    // Mantém a palavra como está se tiver 2 caracteres
    if (word.length === 2) {
      return word.toLowerCase();
    }
    // Caso contrário, coloca a primeira letra maiúscula e o resto minúsculo
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Junta as palavras de volta e atualiza o campo
  this.candidateForm.get('fullName')?.setValue(formattedWords.join(' '));
}
}
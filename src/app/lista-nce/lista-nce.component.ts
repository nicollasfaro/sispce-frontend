import { Component } from '@angular/core';
import { CoursesService } from '../courses.service';
import { MatDialog } from '@angular/material/dialog';
import { AdicionarCandidatoModalComponent } from '../adcionar-candidato-modal/adcionar-candidato-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { FileUploadService } from '../fileUpload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthService } from '../auth.service';

declare var $: any;

@Component({
  selector: 'app-lista-nce',
  templateUrl: './lista-nce.component.html',
  styleUrl: './lista-nce.component.css',
})
export class ListaNceComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'ações'];
  courses: any[] = [];
  candidatos: any[] = [];
  editingCourse: any = null;
  dataSource = new MatTableDataSource(this.courses);
  expandedCourseId: number | null = null;
  selectedFile: File | null = null;
  selectedFiles: File[] = [];
  nceId: number | null = null;
  private uploadUrl = 'http://localhost:3000/api/upload';
  userRoles: string[] = [];
  status: any[] = [];
  postos: any[] = [];

  selectedAnoCapacitacao: string = '';
  anosCapacitacao: number[] = [];

  statusSteps: string[] = [
    'CRIADA',
    'EM_ANALISE_CMT',
    'DEFERIDO_CMT',
    'INDEFERIDO_CMT',
    'EM_ANALISE_CADESM',
    'DEFERIDO_CADESM',
    'INDEFERIDO_CADESM',
    'EM_ANALISE_DIRETORIA',
    'DEFERIDO_DIRETORIA',
    'INDEFERIDO_DIRETORIA',
    'EM_ANALISE_EME',
    'APROVADO_EME',
    'REPROVADO_EME',
    'LIBERADO_CANDIDATO',
  ];

  // labels para exibir no lugar dos enums
  statusLabels: Record<string, string> = {
    CRIADA: 'Criada',
    EM_ANALISE_CMT: 'Em análise (CMT)',
    DEFERIDO_CMT: 'Deferido pelo Cmt',
    INDEFERIDO_CMT: 'Indeferido pelo Cmt',
    EM_ANALISE_CADESM: 'Em análise (CADESM)',
    DEFERIDO_CADESM: 'Deferido (CADESM)',
    INDEFERIDO_CADESM: 'Indeferido (CADESM)',
    EM_ANALISE_DIRETORIA: 'Em análise (Diretoria)',
    DEFERIDO_DIRETORIA: 'Deferido (Diretoria)',
    INDEFERIDO_DIRETORIA: 'Indeferido (Diretoria)',
    EM_ANALISE_EME: 'Em análise (EME)',
    APROVADO_EME: 'Aprovado (EME)',
    REPROVADO_EME: 'Reprovado (EME)',
    LIBERADO_CANDIDATO: 'Liberado para candidato',
    DELETADO: 'Deletado',
  };

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private dataService: DataService,
    private http: HttpClient,
    private fileUpload: FileUploadService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNCES();
    this.loadPostos();
    this.getRoles();

    this.status = this.courses.map((c) => ({
      ...c,
      statusLabel: this.statusLabels[c.statusNce] || c.statusNce,
    }));

    this.carregaStatus();
  }

  // função auxiliar que retorna a posição do status atual
  getStatusIndex(status: string): number {
    return this.statusSteps.indexOf(status);
  }

  getRoles() {
    this.authService.getUserRoles().subscribe((roles) => {
      this.userRoles = roles;
      console.log('Roles atualizadas no header:', this.userRoles);
    }); // Verifique se o método está correto
  }

  loadNCES() {
    this.dataService.getNCEs().subscribe((cursos) => {
      this.courses = cursos.map((c: any) => {
        const anoCriacao = new Date(c.dataCriacao).getFullYear();
        const anoCapacitacao = anoCriacao + 2;
        return { ...c, anoCapacitacao };
      });

      this.dataSource.data = this.courses;

      // gera lista única de anos disponíveis
      this.anosCapacitacao = Array.from(
        new Set(this.courses.map((c) => c.anoCapacitacao.toString()))
      ).sort();
    });
  }

  applyAnoCapacitacaoFilter() {
  if (!this.selectedAnoCapacitacao) {
    this.dataSource.data = this.courses; // sem filtro
  } else {
    const anoSelecionado = Number(this.selectedAnoCapacitacao);
    this.dataSource.data = this.courses.filter(
      (c) => c.anoCapacitacao === anoSelecionado
    );
  }
}

  carregaStatus() {
    this.dataService.getStatusNCE().subscribe((data) => {
      this.status = data;
      console.log('status:', this.status);
    });
  }

  // Método chamado ao soltar o item após arrastar
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.dataSource.data,
      event.previousIndex,
      event.currentIndex
    );

    const idsOrdenados = this.dataSource.data.map((c) => c.nceId);

    this.coursesService.updatePrioridades(idsOrdenados).subscribe(() => {
      this.snackBar.open('Ordem de prioridade salva!', 'Fechar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    });
  }

  // Função para salvar a nova ordem no servidor (json-server)
  saveReorderedCourses() {
    // Atualize o servidor aqui após o reordenamento
    // Exemplo de chamada HTTP para salvar a nova ordem
    this.http.put('/api/nces', this.courses).subscribe(
      (response) => {
        console.log('Ordem salva com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao salvar a ordem:', error);
      }
    );
  }

  toggleExpand(cursoId: number, event: Event): void {
    // Evitar que o clique no botão propague o evento de clique na linha
    event.stopPropagation();

    // Alterna a expansão do curso selecionado
    this.expandedCourseId = this.expandedCourseId === cursoId ? null : cursoId;
  }

  editCourse(course: any): void {
    this.editingCourse = { ...course };
    console.log(course);
  }

  aprovarNce(course: any) {
    let novoStatus = '';
    let novoPendente = '';

    switch (true) {
      case this.userRoles.includes('ROLE_APROVADOR') &&
        (course.statusNce === 'CRIADA' ||
          course.statusNce === 'EM_ANALISE_CMT'):
        novoStatus = 'EM_ANALISE_CMT';
        novoPendente = 'CMT';
        break;

      case this.userRoles.includes('ROLE_CMT') &&
        course.statusNce === 'EM_ANALISE_CMT':
        novoStatus = 'EM_ANALISE_CADESM';
        novoPendente = 'CADESM';
        break;

      case this.userRoles.includes('ROLE_CADESM') &&
        course.statusNce === 'EM_ANALISE_CADESM':
        novoStatus = 'EM_ANALISE_DIRETORIA';
        novoPendente = 'DIRETORIA';
        break;

      case this.userRoles.includes('ROLE_DIRETORIA') &&
        course.statusNce === 'EM_ANALISE_DIRETORIA':
        novoStatus = 'EM_ANALISE_EME';
        novoPendente = 'EME';
        break;

      case this.userRoles.includes('ROLE_EME') &&
        course.statusNce === 'EM_ANALISE_EME':
        novoStatus = 'LIBERADO_CANDIDATO';
        novoPendente = 'CANDIDATO';
        break;

      default:
        window.alert(
          'Perfil sem autorização ou status incorreto para aprovação!'
        );
        return;
    }

    if (novoStatus && novoPendente) {
      course.statusNce = novoStatus;
      course.pendente = novoPendente;

      this.coursesService.updateCourse(course).subscribe((updatedCourse) => {
        console.log(updatedCourse);
        this.loadNCES();
      });
    }
  }

  reprovarNce(course: any) {
    let novoStatus = '';
    let novoPendente = '';

    switch (true) {
      case this.userRoles.includes('ROLE_APROVADOR') &&
        (course.statusNce === 'CRIADA' ||
          course.statusNce === 'EM_ANALISE_CMT'):
        novoStatus = 'INDEFERIDO_CMT';
        novoPendente = 'CADESM';
        break;

      case this.userRoles.includes('ROLE_CMT') &&
        course.statusNce === 'EM_ANALISE_CMT':
        novoStatus = 'INDEFERIDO_CMT';
        novoPendente = 'CADESM';
        break;

      case this.userRoles.includes('ROLE_CADESM') &&
        course.statusNce === 'EM_ANALISE_CADESM':
        novoStatus = 'INDEFERIDO_CADESM';
        novoPendente = 'DIRETORIA';
        break;

      case this.userRoles.includes('ROLE_DIRETORIA') &&
        course.statusNce === 'EM_ANALISE_DIRETORIA':
        novoStatus = 'INDEFERIDO_DIRETORIA';
        novoPendente = 'EME';
        break;

      case this.userRoles.includes('ROLE_EME') &&
        course.statusNce === 'EM_ANALISE_EME':
        novoStatus = 'REPROVADO_EME';
        novoPendente = 'CANDIDATO';
        break;

      default:
        window.alert(
          'Perfil sem autorização ou status incorreto para reprovação!'
        );
        return;
    }

    if (novoStatus) {
      course.statusNce = novoStatus;
      course.pendente = novoPendente;

      this.coursesService.updateCourse(course).subscribe((updatedCourse) => {
        console.log(updatedCourse);
        this.loadNCES();
      });
    }
  }

  updateCourse(): void {
    if (this.editingCourse.nceId) {
      console.log(this.editingCourse.nceId);
      this.coursesService
        .updateCourse(this.editingCourse)
        .subscribe((updatedCourse) => {
          console.log(updatedCourse);
          console.log(this.courses);
          // const index = this.courses.findIndex(course => course.nceId === updatedCourse.nceId);
          // if (index !== -1) {
          //   this.courses[index] = updatedCourse;
          // }
          this.loadNCES();
          this.editingCourse = null;
        });
    }
    window.alert('NCE atualizada com sucesso!');
  }

  confirmDelete(id: number): void {
    const confirmation = window.confirm(
      'Você tem certeza que deseja deletar esta NCE?'
    );
    if (confirmation) {
      this.deleteCourse(id);
    }
  }

  deleteCourse(id: number): void {
    this.coursesService.deleteCourse(id).subscribe(() => {
      this.courses = this.courses.filter((course) => course.id !== id);
      this.loadNCES();
    });
  }

  openAddCandidateModal(nceId: number): void {
    const dialogRef = this.dialog.open(AdicionarCandidatoModalComponent, {
      width: '600px', // define um tamanho fixo (senão pode ficar invisível)
      data: { nceId }, // passa dados para o modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('O modal foi fechado');
    });
    console.log(nceId);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método para abrir o modal
  openUploadModal(id: number) {
    this.nceId = id;
    const modalElement = document.getElementById('uploadModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Método chamado quando o arquivo é selecionado
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
    // const files: FileList = event.target.files;

    // // Adiciona cada arquivo selecionado ao array
    // for (let i = 0; i < files.length; i++) {
    //   this.selectedFiles.push(files[i]);
    // }

    // // Limpar o campo de input após selecionar para permitir re-seleção dos mesmos arquivos
    // event.target.value = '';
  }

  // Método para fazer o upload do arquivo
  uploadDocument() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      // Substitua 'http://localhost:8080/upload' pelo endpoint correto do seu backend
      this.http.post('http://localhost:8080/upload', formData).subscribe(
        (response) => {
          console.log('Upload realizado com sucesso', response);
          this.selectedFile = null;
        },
        (error) => {
          console.error('Erro ao fazer upload', error);
        }
      );
    } else {
      alert('Selecione um arquivo antes de enviar.');
    }
  }

  // Dispara o clique no campo de input de arquivos oculto
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Remove o arquivo individualmente e atualiza a interface
  removeAttachment(index: number) {
    this.selectedFiles.splice(index, 1); // Remove o arquivo da lista
  }

  // Função para definir o status da NCE com base no nome do arquivo
  determineStatus(fileName: string): string {
    if (fileName.toLowerCase().includes('relatorio')) {
      return 'Aguardando Relatório';
    } else if (fileName.toLowerCase().includes('certificado')) {
      return 'Certificado Recebido';
    } else if (fileName.toLowerCase().includes('diex')) {
      return 'Diex Recebido';
    } else {
      return 'Em Análise';
    }
  }

  // Função para simular o upload do arquivo e atualizar a NCE no db.json
  uploadFile(nceId: number | null) {
    if (!nceId || this.selectedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('file', file);
    });

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(`http://localhost:8080/nces/${nceId}/upload`, formData, { headers })
      .subscribe(
        () => {
          console.log('Arquivo enviado com sucesso!');

          // ⚠️ Aguarda 1 segundo e recarrega a lista de NCEs para evitar bugs
          setTimeout(() => {
            this.dataService.getNCEs().subscribe(
              (data) => {
                this.courses = data;
              },
              (error) => {
                console.error('Erro ao recarregar NCEs:', error);
              }
            );
          }, 1000);
        },
        (error) => {
          console.error('Erro ao enviar arquivo:', error);
        }
      );
  }

  // Limpar os arquivos anexados ao fechar o modal
  clearFiles() {
    this.selectedFiles = [];
    this.nceId = null;
  }

  viewNce(nceId: string) {
    console.log(nceId);
    this.router.navigate(['/nce', nceId]);
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

  despacharCourse(course: any) {
    const updatedCourse = {
      ...course,
      statusNce: 'EM_ANALISE_CMT',
    };

    this.coursesService.updateCourse(updatedCourse).subscribe({
      next: () => {
        alert('Curso despachado com sucesso!');
        course.statusNce = 'EM_ANALISE_CMT'; // Atualiza na tela sem precisar recarregar
      },
      error: (err) => {
        console.error('Erro ao despachar curso', err);
        alert('Erro ao despachar curso.');
      },
    });
  }

  gerarRelatorioPrioridades() {
    this.http
      .get('/api/nces/relatorio-prioridades', { responseType: 'blob' })
      .subscribe((res: Blob) => {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio_prioridades.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}

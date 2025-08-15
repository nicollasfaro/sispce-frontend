import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NceService } from '../nce.service';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-visualizar-nce',
  templateUrl: './visualizar-nce.component.html',
  styleUrl: './visualizar-nce.component.css'
})
export class VisualizarNceComponent {
  nceId!: string;
  nceDetails: any;
  candidatoDetails: any [] = []; // Você pode definir o tipo correto de acordo com seus dados
  candidatoId!: number;
  userRoles: string[] =[];
  attachments: any[] = [];

  constructor(private route: ActivatedRoute, private nceService: NceService, private router: Router, private dataService: DataService, private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    
    this.nceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadNceDetails(this.nceId);
    this.loadAttachments(this.nceId);
    console.log(this.nceId)
    this.loadCandidatoParaNce();
    this.authService.getUserRoles().subscribe(roles => {
      this.userRoles = roles;
      console.log('Roles atualizadas no header:', this.userRoles);
    }); // Verifique se o método está correto
  }

  loadAttachments(nceId: string) {
    this.dataService.getAttachments(this.nceId).subscribe(
        (attachments) => {
            console.log("Anexos carregados:", attachments);
            this.attachments = attachments;
        },
        (error) => {
            console.error("Erro ao buscar anexos:", error);
        }
    );
}

downloadFile(fileName: string) {
  const decodedFileName = decodeURIComponent(fileName); // 🔹 Decodifica antes de enviar a requisição
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  this.http.get(`/api/nces/attachments/download/${decodedFileName}`, {
    headers,
    responseType: 'blob' // 🔹 Indica que a resposta é um arquivo binário
  }).subscribe(blob => {
    if (blob.size < 150) { // 🔹 Se for muito pequeno, pode ser um erro
      console.error("❌ Erro: Servidor retornou uma resposta inválida.");
      return;
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = decodedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, error => {
    console.error("❌ Erro ao baixar o arquivo:", error);
  });
}

  loadNceDetails(nceId: string) {
    
    this.nceService.getNceById(nceId).subscribe(
      (data) => {
        this.nceDetails = data;
        this.nceId = data.nceId;
        console.log(data)
      },
      (error) => {
        console.error('Erro ao buscar detalhes da NCE', error);
      }
    );
    
  }
  loadCandidatoParaNce(){
    this.dataService.getCandidatosParaNce().subscribe((data: any[] =[]) => {
      this.candidatoDetails = data.filter(a => a.nceId == this.nceId);
      console.log(data.filter(a => a.nceId == this.nceId))
    });
  }


  confirmDelete(id: number): void {
    const confirmation = window.confirm('Você tem certeza que deseja deletar este Candidato?');
    console.log(id)
    if (confirmation) {
      this.deleteCandidato(id);
    }
  }
  deleteCandidato(id: number): void {
    this.dataService.deleteCandidato(id).subscribe(() => {
      this.candidatoDetails = this.candidatoDetails.filter(c => c.nceId == this.nceId);
    });
    window.location.reload();
    setTimeout(function(){location.reload()}, 5000);
  }

  // Método para voltar à página anterior
  goBack() {
    this.router.navigate(['/listaNce']);
  }
  // Função para redirecionar para a página de edição
  editNce(id: string): void {
    this.router.navigate(['/nce/edit', id]); // Redireciona para a página de edição com o ID
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NceService } from '../nce.service';
import { DataService } from '../data.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-editar-nce',
  templateUrl: './editar-nce.component.html',
  styleUrl: './editar-nce.component.css',
})
export class EditarNceComponent {
  nceDetails: any;
  postos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private nceService: NceService,
    private coursesService: CoursesService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const nceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPostos();
    this.loadNceDetails(nceId);
  }

  loadNceDetails(id: string): void {
    this.nceService.getNceById(id).subscribe((data) => {
      console.log(data);
      this.nceDetails = data;
    });
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

  updateNce(): void {
    const nivelMap: any = {
      Mestrado: 'M',
      Doutorado: 'D',
      'Pós-doutorado': 'PD',
    };

    const payload = {
      ...this.nceDetails,
      nivelEnsino:
        nivelMap[this.nceDetails.nivelEnsino] || this.nceDetails.nivelEnsino,
    };

    this.coursesService.updateCourse(payload).subscribe(() => {
      this.router.navigate(['/nce', this.nceDetails.nceId]);
      window.alert('NCE atualizada com sucesso!');
    });
  }

  // Função para cancelar e voltar para a página de visualização sem salvar
  cancelEdit(): void {
    this.router.navigate(['/nce', this.nceDetails.nceId]); // Redireciona para a página de visualização
  }
}

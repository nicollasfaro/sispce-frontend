import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NceService } from '../nce.service';
import { DataService } from '../data.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-editar-nce',
  templateUrl: './editar-nce.component.html',
  styleUrl: './editar-nce.component.css'
})
export class EditarNceComponent {
  nceDetails: any;
  postos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private nceService: NceService,
    private coursesService: CoursesService,
    private router: Router,
    private dataService: DataService, 
  ) {}

  ngOnInit(): void {
    const nceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPostos();
    this.loadNceDetails(nceId);
  }

  loadNceDetails(id: string): void {
    this.nceService.getNceById(id).subscribe((data) => {
      console.log(data)
      this.nceDetails = data;
    });
  }

  loadPostos(){
    this.dataService.getPostos().subscribe(
      (data) => {
        this.postos = data;
        console.log(this.postos)
      },
      (error) => {
        console.error('Erro ao carregar postos', error);
      }
    );
  }

  updateNce(): void {
    this.coursesService.updateCourse(this.nceDetails).subscribe(() => {
      this.router.navigate(['/nce', this.nceDetails.nceId]); // Redireciona de volta para visualização
    });
    window.alert('NCE atualizada com sucesso!');
  }

  // updateCourse(): void {
  //   if (this.editingCourse.nceId) {
  //     console.log(this.editingCourse.nceId);
  //     this.coursesService
  //       .updateCourse(this.editingCourse)
  //       .subscribe((updatedCourse) => {
  //         console.log(updatedCourse);
  //         console.log(this.courses);
  //         // const index = this.courses.findIndex(course => course.nceId === updatedCourse.nceId);
  //         // if (index !== -1) {
  //         //   this.courses[index] = updatedCourse;
  //         // }
  //         this.loadNCES();
  //         this.editingCourse = null;
  //       });
  //   }
  //   window.alert('NCE atualizada com sucesso!');
  // }
  // Função para cancelar e voltar para a página de visualização sem salvar
  cancelEdit(): void {
    this.router.navigate(['/nce', this.nceDetails.nceId]); // Redireciona para a página de visualização
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from './adcionar-candidato-modal/adcionar-candidato-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'http://localhost:8080/nces'; // URL do endpoint de cursos

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOms(): Observable<any[]> {
    return this.http.get<any[]>('/api/oms');
  }

  getTipoIes(): Observable<any[]> {
    return this.http.get<any[]>('/api/nces/tipoIES');
  }

  addCourse(courseData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, courseData);
  }

  updateCourse(course: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${course.nceId}`, course);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updatePrioridades(ids: number[]): Observable<any> {
    return this.http.put('/api/nces/prioridades', ids);
  }

  salvarCurso(candidatoId: string, curso: Curso): Observable<Curso> {
  console.log('>>> Chamando API salvarCurso com:', candidatoId, curso);
  return this.http.post<Curso>(`/api/candidato/${candidatoId}/cursos`, curso);
}

getQcpDetalhes(codigo: string): Observable<any> {
  return this.http.get<any>(`/api/qcp/detalhes/${codigo}`);
}

getQualificacoesPorFaixa(postoCodigo: string): Observable<any[]> {
  return this.http.get<any[]>(`/api/qcp/qualificacoes/${postoCodigo}`);
}


}

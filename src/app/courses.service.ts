import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from './adcionar-candidato-modal/adcionar-candidato-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'https://localhost:8080/nces'; // URL do endpoint de cursos

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {withCredentials: true});
  }

  getOms(): Observable<any[]> {
    return this.http.get<any[]>('/api/oms', {withCredentials: true});
  }

  getTipoIes(): Observable<any[]> {
    return this.http.get<any[]>('/api/nces/tipoIES', {withCredentials: true});
  }

  addCourse(courseData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, courseData, {withCredentials: true});
  }

  updateCourse(course: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${course.nceId}`, course, {withCredentials: true});
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {withCredentials: true});
  }

  updatePrioridades(ids: number[]): Observable<any> {
    return this.http.put('/api/nces/prioridades', ids, {withCredentials: true});
  }

  salvarCurso(candidatoId: string, curso: Curso): Observable<Curso> {
  console.log('>>> Chamando API salvarCurso com:', candidatoId, curso);
  return this.http.post<Curso>(`/api/candidato/${candidatoId}/cursos`, curso, {withCredentials: true});
}

getQcpDetalhes(codigo: string): Observable<any> {
  return this.http.get<any>(`/api/qcp/detalhes/${codigo}`, {withCredentials: true});
}

getQualificacoesPorFaixa(postoCodigo: string): Observable<any[]> {
  return this.http.get<any[]>(`/api/qcp/qualificacoes/${postoCodigo}`, {withCredentials: true});
}
getOmByCodom(codom: string): Observable<any> {
  return this.http.get(`/api/oms/by-codom/${codom}`, {withCredentials: true});
}


}

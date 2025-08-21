import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CoursesComponent } from './courses/courses.component';
import { ListaNceComponent } from './lista-nce/lista-nce.component';
import { CadastroCandidatoComponent } from './cadastro-candidato/cadastro-candidato.component';
import { CursosCandidatoTabelaComponent } from './cursos-candidato-tabela/cursos-candidato-tabela.component';
import { VisualizarNceComponent } from './visualizar-nce/visualizar-nce.component';
import { EditarNceComponent } from './editar-nce/editar-nce.component';
import { RoleGuard } from './role.guard';
import { NaoAutorizadoComponent } from './nao-autorizado/nao-autorizado.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_BASIC'] },
  },
  {
    path: 'listaNce',
    component: ListaNceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_BASIC', 'ROLE_APROVADOR'] },
  },
  {
    path: 'cadastroCandidato',
    component: CadastroCandidatoComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_BASIC'] },
  },
  {
    path: 'cadastroUsuario',
    component: CadastroUsuarioComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'nce/:id',
    component: VisualizarNceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'nce/edit/:id',
    component: EditarNceComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'teste', component: CursosCandidatoTabelaComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
  {
    path: 'naoAutorizado',
    canActivate: [RoleGuard],
    component: NaoAutorizadoComponent, // Página para usuários não autorizados
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

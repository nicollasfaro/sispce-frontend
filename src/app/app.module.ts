import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogContent, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { CoursesComponent } from './courses/courses.component';
import { HeaderComponent } from './header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AddCourseModalComponent } from './add-course-modal/add-course-modal.component';
import { ListaNceComponent } from './lista-nce/lista-nce.component';
import { CadastroCandidatoComponent } from './cadastro-candidato/cadastro-candidato.component';
import { AdicionarCandidatoModalComponent } from './adcionar-candidato-modal/adcionar-candidato-modal.component';
import { CursosCandidatoTabelaComponent } from './cursos-candidato-tabela/cursos-candidato-tabela.component';
import { VisualizarNceComponent } from './visualizar-nce/visualizar-nce.component';
import { EditarNceComponent } from './editar-nce/editar-nce.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DatePipe, registerLocaleData } from '@angular/common';
import { NaoAutorizadoComponent } from './nao-autorizado/nao-autorizado.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UsuarioEditModalComponent } from './usuario-edit-modal/usuario-edit-modal.component';
import { DetalhesCandidatoModalComponent } from './detalhes-candidato-modal/detalhes-candidato-modal.component';
import localePt from '@angular/common/locales/pt';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NovoCursoDialogComponent } from './novo-curso-dialog/novo-curso-dialog.component';
import { CandidatosComponent } from './candidatos/candidatos.component';
import { CandidatoVisualizarComponent } from './candidato-visualizar/candidato-visualizar.component';
import { CandidatoEditarComponent } from './candidato-editar/candidato-editar.component';
import { NgxMaskPipe  } from 'ngx-mask';
import { LoginSuccessComponent } from './login-success/login-success.component';
// registra o locale
registerLocaleData(localePt, 'pt');
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CoursesComponent,
    HeaderComponent,
    AddCourseModalComponent,
    ListaNceComponent,
    CadastroCandidatoComponent,
    AdicionarCandidatoModalComponent,
    CursosCandidatoTabelaComponent,
    VisualizarNceComponent,
    EditarNceComponent,
    NaoAutorizadoComponent,
    CadastroUsuarioComponent,
    ChangePasswordComponent,
    UsuarioEditModalComponent,
    DetalhesCandidatoModalComponent,
    NovoCursoDialogComponent,
    CandidatosComponent,
    CandidatoVisualizarComponent,
    CandidatoEditarComponent,
    LoginSuccessComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // Certifique-se de que o módulo HTTP está importado
    FormsModule,  // Se você está usando ngModel
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    MatTableModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    NgxMaskDirective,
    DragDropModule,
    NgxMaskPipe
  ],
  providers: [ AuthService, provideNgxMask({ /* opções de cfg */ }), DatePipe, { provide: LOCALE_ID, useValue: 'pt' },
    {
    provide: MatDialogRef,
    useValue: {}
  },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true, },
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

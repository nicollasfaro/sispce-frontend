import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // serviço de auth que você já deve ter
import { SolicitacaoAcessoService } from '../solicitacao-acesso.service';

@Component({
  selector: 'app-nao-autorizado',
  templateUrl: './nao-autorizado.component.html',
  styleUrls: ['./nao-autorizado.component.css']
})
export class NaoAutorizadoComponent {
  isLoggedIn = false;
  loading = false;
  message = '';

  constructor(
    private authService: AuthService,
    private solicitacaoService: SolicitacaoAcessoService
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  solicitarAcesso() {
  this.loading = true;
  const user = this.authService.getCurrentUser();
  console.log(user);

  if (!user || !user.identidade) {
    this.message = '❌ Usuário não encontrado. Faça login novamente.';
    this.loading = false;
    return;
  }

  this.solicitacaoService.criarSolicitacao(user.id).subscribe({
    next: () => {
      this.message = '✅ Solicitação enviada com sucesso! Aguarde aprovação do administrador.';
      this.loading = false;
    },
    error: () => {
      this.message = '❌ Erro ao enviar solicitação. Tente novamente.';
      this.loading = false;
    }
  });
}

}

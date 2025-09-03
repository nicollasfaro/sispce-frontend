import { Component } from '@angular/core';

@Component({
  selector: 'app-nao-autorizado',
  templateUrl: './nao-autorizado.component.html',
  styleUrl: './nao-autorizado.component.css',
  template: `
    <div class="container mt-4">
      <div class="alert alert-danger">
        <h4>Acesso negado 🚫</h4>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  `
})
export class NaoAutorizadoComponent {

}

import { Component, Inject, OnInit } from '@angular/core';
import { SolicitacaoAcessoService } from '../solicitacao-acesso.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-socilitar-acesso-dialog',
  templateUrl: './socilitar-acesso-dialog.component.html',
  styleUrl: './socilitar-acesso-dialog.component.css',
})
export class SolicitarAcessoDialogComponent implements OnInit {
  solicitacoes: any[] = [];
  rolesDisponiveis: any[] = [];

  constructor(
    private solicitacaoService: SolicitacaoAcessoService,
    private roleService: RoleService,
    private dialogRef: MatDialogRef<SolicitarAcessoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.solicitacaoService.listarPendentes().subscribe((res) => {
      this.solicitacoes = res;
    });

    this.roleService.listarRoles().subscribe((roles) => {
      this.rolesDisponiveis = roles;
    });
  }

  aprovar(solicitacaoId: string, roleId: number) {
    console.log('>>> aprovando', solicitacaoId, 'com roleId:', roleId);

    this.solicitacaoService
      .aprovarSolicitacao(solicitacaoId, roleId)
      .subscribe(() => {
        this.solicitacoes = this.solicitacoes.filter(
          (s) => s.solicitacaoId !== solicitacaoId
        );
        if (this.solicitacoes.length === 0) {
          this.dialogRef.close(true);
        }
      });
  }
}

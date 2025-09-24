import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-candidato-modal',
  templateUrl: './detalhes-candidato-modal.component.html',
  styleUrls: ['./detalhes-candidato-modal.component.css']
})
export class DetalhesCandidatoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalhesCandidatoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
  if (this.data) {
    this.data.dataDeNascimento = new Date(this.data.dataDeNascimento);
    this.data.apresentacaoOm = new Date(this.data.apresentacaoOm);
    this.data.inclusaoOm = new Date(this.data.inclusaoOm);
    this.data.ultimaPromocao = new Date(this.data.ultimaPromocao);
  }
  console.log(this.data);
  console.log(this.data.curso);
}

  fechar(): void {
    this.dialogRef.close();
  }
}

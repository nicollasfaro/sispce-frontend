import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-novo-curso-dialog',
  templateUrl: './novo-curso-dialog.component.html',
  styleUrls: ['./novo-curso-dialog.component.css'], // aqui é styleUrls (plural)
})
export class NovoCursoDialogComponent {
  formCurso: FormGroup;
  curso = {
    nomeCurso: '',
    classificacao: '',
    data_conclusao: null,
    descricao: '',
    grau: '',
    local: '',
    mencao: '',
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NovoCursoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // opcional, caso queira passar dados
  ) {
    this.formCurso = this.fb.group({
      nomeCurso: ['', Validators.required],
      classificacao: ['', Validators.required],
      dataConclusao: [null, Validators.required],
      descricao: ['', Validators.required],
      grau: ['', Validators.required],
      local: ['', Validators.required],
      mencao: ['', Validators.required],
    });
  }

  salvar() {
  console.log('>>> salvar chamado', this.formCurso.value); // DEBUG
  if (this.formCurso.valid) {
    this.dialogRef.close(this.formCurso.value); // devolve pro afterClosed()
  } else {
    console.warn('Form inválido', this.formCurso.value);
  }
}


  fechar() {
    this.dialogRef.close(); // fecha sem retornar nada
  }
}

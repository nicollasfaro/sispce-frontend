import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoCursoDialogComponent } from './novo-curso-dialog.component';

describe('NovoCursoDialogComponent', () => {
  let component: NovoCursoDialogComponent;
  let fixture: ComponentFixture<NovoCursoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NovoCursoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoCursoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

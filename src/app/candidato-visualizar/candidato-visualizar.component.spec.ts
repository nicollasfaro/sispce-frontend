import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatoVisualizarComponent } from './candidato-visualizar.component';

describe('CandidatoVisualizarComponent', () => {
  let component: CandidatoVisualizarComponent;
  let fixture: ComponentFixture<CandidatoVisualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatoVisualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatoVisualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

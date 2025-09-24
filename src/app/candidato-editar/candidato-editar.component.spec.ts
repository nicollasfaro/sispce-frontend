import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatoEditarComponent } from './candidato-editar.component';

describe('CandidatoEditarComponent', () => {
  let component: CandidatoEditarComponent;
  let fixture: ComponentFixture<CandidatoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatoEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

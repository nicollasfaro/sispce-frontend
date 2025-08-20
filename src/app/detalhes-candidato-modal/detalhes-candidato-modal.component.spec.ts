import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesCandidatoModalComponent } from './detalhes-candidato-modal.component';

describe('DetalhesCandidatoModalComponent', () => {
  let component: DetalhesCandidatoModalComponent;
  let fixture: ComponentFixture<DetalhesCandidatoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalhesCandidatoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesCandidatoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

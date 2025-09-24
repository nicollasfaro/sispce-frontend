import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocilitarAcessoDialogComponent } from './socilitar-acesso-dialog.component';

describe('SocilitarAcessoDialogComponent', () => {
  let component: SocilitarAcessoDialogComponent;
  let fixture: ComponentFixture<SocilitarAcessoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocilitarAcessoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocilitarAcessoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

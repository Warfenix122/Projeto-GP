import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadesProjetoComponent } from './atividades-projeto.component';

describe('AtividadesProjetoComponent', () => {
  let component: AtividadesProjetoComponent;
  let fixture: ComponentFixture<AtividadesProjetoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtividadesProjetoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtividadesProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SondagemComponent } from './sondagem.component';

describe('QuestionarioComponent', () => {
  let component: SondagemComponent;
  let fixture: ComponentFixture<SondagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SondagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SondagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

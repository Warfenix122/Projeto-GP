import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSondagemComponent } from './create-sondagem.component';

describe('CreateSondagemComponent', () => {
  let component: CreateSondagemComponent;
  let fixture: ComponentFixture<CreateSondagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSondagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSondagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

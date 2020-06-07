import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterPasswordComponent } from './alter-password.component';

describe('AlterPasswordComponent', () => {
  let component: AlterPasswordComponent;
  let fixture: ComponentFixture<AlterPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

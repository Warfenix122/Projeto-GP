import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredProjectsComponent } from './registered-projects.component';

describe('RegisteredProjectsComponent', () => {
  let component: RegisteredProjectsComponent;
  let fixture: ComponentFixture<RegisteredProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

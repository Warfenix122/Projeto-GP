import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AproveProjectsComponent } from './aprove-projects.component';

describe('AproveProjectsComponent', () => {
  let component: AproveProjectsComponent;
  let fixture: ComponentFixture<AproveProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AproveProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AproveProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoseTopComponent } from './chose-top.component';

describe('ChoseTopComponent', () => {
  let component: ChoseTopComponent;
  let fixture: ComponentFixture<ChoseTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoseTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoseTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

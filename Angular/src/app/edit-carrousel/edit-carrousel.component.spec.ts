import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarrouselComponent } from './edit-carrousel.component';

describe('EditCarrouselComponent', () => {
  let component: EditCarrouselComponent;
  let fixture: ComponentFixture<EditCarrouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCarrouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

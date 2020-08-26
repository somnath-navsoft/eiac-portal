import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionBodiesFormComponent } from './inspection-bodies-form.component';

describe('InspectionBodiesFormComponent', () => {
  let component: InspectionBodiesFormComponent;
  let fixture: ComponentFixture<InspectionBodiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionBodiesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionBodiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

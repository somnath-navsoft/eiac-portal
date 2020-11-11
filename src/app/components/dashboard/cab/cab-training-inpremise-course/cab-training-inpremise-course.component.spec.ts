import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingInpremiseCourseComponent } from './cab-training-inpremise-course.component';

describe('CabTrainingInpremiseCourseComponent', () => {
  let component: CabTrainingInpremiseCourseComponent;
  let fixture: ComponentFixture<CabTrainingInpremiseCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingInpremiseCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingInpremiseCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

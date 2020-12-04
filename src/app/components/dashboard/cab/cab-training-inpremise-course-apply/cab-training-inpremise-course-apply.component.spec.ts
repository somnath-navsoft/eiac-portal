import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingInpremiseCourseApplyComponent } from './cab-training-inpremise-course-apply.component';

describe('CabTrainingInpremiseCourseApplyComponent', () => {
  let component: CabTrainingInpremiseCourseApplyComponent;
  let fixture: ComponentFixture<CabTrainingInpremiseCourseApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingInpremiseCourseApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingInpremiseCourseApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

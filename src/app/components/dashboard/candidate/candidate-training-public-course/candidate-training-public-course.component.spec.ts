import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTrainingPublicCourseComponent } from './candidate-training-public-course.component';

describe('CandidateTrainingPublicCourseComponent', () => {
  let component: CandidateTrainingPublicCourseComponent;
  let fixture: ComponentFixture<CandidateTrainingPublicCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateTrainingPublicCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTrainingPublicCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

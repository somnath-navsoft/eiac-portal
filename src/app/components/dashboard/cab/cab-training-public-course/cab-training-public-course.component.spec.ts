import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingPublicCourseComponent } from './cab-training-public-course.component';

describe('CabTrainingPublicCourseComponent', () => {
  let component: CabTrainingPublicCourseComponent;
  let fixture: ComponentFixture<CabTrainingPublicCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingPublicCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingPublicCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

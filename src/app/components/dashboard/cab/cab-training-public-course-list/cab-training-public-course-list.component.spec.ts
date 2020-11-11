import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingPublicCourseListComponent } from './cab-training-public-course-list.component';

describe('CabTrainingPublicCourseListComponent', () => {
  let component: CabTrainingPublicCourseListComponent;
  let fixture: ComponentFixture<CabTrainingPublicCourseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingPublicCourseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingPublicCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAttendanceListComponent } from './candidate-attendance-list.component';

describe('CandidateAttendanceListComponent', () => {
  let component: CandidateAttendanceListComponent;
  let fixture: ComponentFixture<CandidateAttendanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateAttendanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

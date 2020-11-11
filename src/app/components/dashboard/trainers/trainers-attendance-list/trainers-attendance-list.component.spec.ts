import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersAttendanceListComponent } from './trainers-attendance-list.component';

describe('TrainersAttendanceListComponent', () => {
  let component: TrainersAttendanceListComponent;
  let fixture: ComponentFixture<TrainersAttendanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersAttendanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

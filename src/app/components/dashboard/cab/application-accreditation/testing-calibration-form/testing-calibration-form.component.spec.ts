import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingCalibrationFormComponent } from './testing-calibration-form.component';

describe('TestingCalibrationFormComponent', () => {
  let component: TestingCalibrationFormComponent;
  let fixture: ComponentFixture<TestingCalibrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingCalibrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingCalibrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

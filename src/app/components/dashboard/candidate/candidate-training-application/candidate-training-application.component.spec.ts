import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTrainingApplicationComponent } from './candidate-training-application.component';

describe('CandidateTrainingApplicationComponent', () => {
  let component: CandidateTrainingApplicationComponent;
  let fixture: ComponentFixture<CandidateTrainingApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateTrainingApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTrainingApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

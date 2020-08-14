import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTrainerServiceComponent } from './candidate-trainer-service.component';

describe('CandidateTrainerServiceComponent', () => {
  let component: CandidateTrainerServiceComponent;
  let fixture: ComponentFixture<CandidateTrainerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateTrainerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTrainerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

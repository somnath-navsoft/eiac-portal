import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTrainerServiceListComponent } from './candidate-trainer-service-list.component';

describe('CandidateTrainerServiceListComponent', () => {
  let component: CandidateTrainerServiceListComponent;
  let fixture: ComponentFixture<CandidateTrainerServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateTrainerServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTrainerServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

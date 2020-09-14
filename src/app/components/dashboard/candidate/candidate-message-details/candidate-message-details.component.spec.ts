import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateMessageDetailsComponent } from './candidate-message-details.component';

describe('CandidateMessageDetailsComponent', () => {
  let component: CandidateMessageDetailsComponent;
  let fixture: ComponentFixture<CandidateMessageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateMessageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateMessageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

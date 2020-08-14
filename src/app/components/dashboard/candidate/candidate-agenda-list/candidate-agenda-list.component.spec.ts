import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAgendaListComponent } from './candidate-agenda-list.component';

describe('CandidateAgendaListComponent', () => {
  let component: CandidateAgendaListComponent;
  let fixture: ComponentFixture<CandidateAgendaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateAgendaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateAgendaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

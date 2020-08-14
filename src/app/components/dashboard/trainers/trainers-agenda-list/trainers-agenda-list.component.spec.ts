import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersAgendaListComponent } from './trainers-agenda-list.component';

describe('TrainersAgendaListComponent', () => {
  let component: TrainersAgendaListComponent;
  let fixture: ComponentFixture<TrainersAgendaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersAgendaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersAgendaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

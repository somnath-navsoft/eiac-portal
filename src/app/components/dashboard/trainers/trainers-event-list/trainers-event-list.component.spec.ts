import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersEventListComponent } from './trainers-event-list.component';

describe('TrainersEventListComponent', () => {
  let component: TrainersEventListComponent;
  let fixture: ComponentFixture<TrainersEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

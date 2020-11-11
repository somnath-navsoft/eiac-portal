import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersMessageDetailsComponent } from './trainers-message-details.component';

describe('TrainersMessageDetailsComponent', () => {
  let component: TrainersMessageDetailsComponent;
  let fixture: ComponentFixture<TrainersMessageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersMessageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersMessageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

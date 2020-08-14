import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersHomeComponent } from './trainers-home.component';

describe('TrainersHomeComponent', () => {
  let component: TrainersHomeComponent;
  let fixture: ComponentFixture<TrainersHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

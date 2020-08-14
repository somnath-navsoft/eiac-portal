import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersEditComponent } from './trainers-edit.component';

describe('TrainersEditComponent', () => {
  let component: TrainersEditComponent;
  let fixture: ComponentFixture<TrainersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

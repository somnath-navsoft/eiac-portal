import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersProfileComponent } from './trainers-profile.component';

describe('TrainersProfileComponent', () => {
  let component: TrainersProfileComponent;
  let fixture: ComponentFixture<TrainersProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

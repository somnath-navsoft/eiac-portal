import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersDashboardComponent } from './trainers-dashboard.component';

describe('TrainersDashboardComponent', () => {
  let component: TrainersDashboardComponent;
  let fixture: ComponentFixture<TrainersDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainersDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

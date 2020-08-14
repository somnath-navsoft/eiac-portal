import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerServiceListComponent } from './trainer-service-list.component';

describe('TrainerServiceListComponent', () => {
  let component: TrainerServiceListComponent;
  let fixture: ComponentFixture<TrainerServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainerServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

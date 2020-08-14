import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerServiceComponent } from './trainer-service.component';

describe('TrainerServiceComponent', () => {
  let component: TrainerServiceComponent;
  let fixture: ComponentFixture<TrainerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

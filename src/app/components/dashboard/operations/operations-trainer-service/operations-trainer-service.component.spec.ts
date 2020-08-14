import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsTrainerServiceComponent } from './operations-trainer-service.component';

describe('OperationsTrainerServiceComponent', () => {
  let component: OperationsTrainerServiceComponent;
  let fixture: ComponentFixture<OperationsTrainerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsTrainerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsTrainerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

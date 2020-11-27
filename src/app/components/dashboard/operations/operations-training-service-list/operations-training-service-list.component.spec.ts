import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsTrainingServiceListComponent } from './operations-training-service-list.component';

describe('OperationsTrainingServiceListComponent', () => {
  let component: OperationsTrainingServiceListComponent;
  let fixture: ComponentFixture<OperationsTrainingServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsTrainingServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsTrainingServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsTrainingServiceDetailsComponent } from './operations-training-service-details.component';

describe('OperationsTrainingServiceDetailsComponent', () => {
  let component: OperationsTrainingServiceDetailsComponent;
  let fixture: ComponentFixture<OperationsTrainingServiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsTrainingServiceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsTrainingServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

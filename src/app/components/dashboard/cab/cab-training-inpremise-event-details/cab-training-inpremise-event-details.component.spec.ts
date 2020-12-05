import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingInpremiseEventDetailsComponent } from './cab-training-inpremise-event-details.component';

describe('CabTrainingInpremiseEventDetailsComponent', () => {
  let component: CabTrainingInpremiseEventDetailsComponent;
  let fixture: ComponentFixture<CabTrainingInpremiseEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingInpremiseEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingInpremiseEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

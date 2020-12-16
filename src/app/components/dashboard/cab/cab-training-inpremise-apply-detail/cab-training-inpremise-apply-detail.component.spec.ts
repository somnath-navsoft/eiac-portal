import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingInpremiseApplyDetailComponent } from './cab-training-inpremise-apply-detail.component';

describe('CabTrainingInpremiseApplyDetailComponent', () => {
  let component: CabTrainingInpremiseApplyDetailComponent;
  let fixture: ComponentFixture<CabTrainingInpremiseApplyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingInpremiseApplyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingInpremiseApplyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingInpremiseDetailComponent } from './cab-training-inpremise-detail.component';

describe('CabTrainingInpremiseDetailComponent', () => {
  let component: CabTrainingInpremiseDetailComponent;
  let fixture: ComponentFixture<CabTrainingInpremiseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingInpremiseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingInpremiseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingInpremiseFormComponent } from './cab-training-inpremise-form.component';

describe('CabTrainingInpremiseFormComponent', () => {
  let component: CabTrainingInpremiseFormComponent;
  let fixture: ComponentFixture<CabTrainingInpremiseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingInpremiseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingInpremiseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

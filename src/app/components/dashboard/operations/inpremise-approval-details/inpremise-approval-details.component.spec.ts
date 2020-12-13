import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InpremiseApprovalDetailsComponent } from './inpremise-approval-details.component';

describe('InpremiseApprovalDetailsComponent', () => {
  let component: InpremiseApprovalDetailsComponent;
  let fixture: ComponentFixture<InpremiseApprovalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InpremiseApprovalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InpremiseApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

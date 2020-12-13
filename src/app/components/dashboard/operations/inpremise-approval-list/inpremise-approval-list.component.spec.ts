import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InpremiseApprovalListComponent } from './inpremise-approval-list.component';

describe('InpremiseApprovalListComponent', () => {
  let component: InpremiseApprovalListComponent;
  let fixture: ComponentFixture<InpremiseApprovalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InpremiseApprovalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InpremiseApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

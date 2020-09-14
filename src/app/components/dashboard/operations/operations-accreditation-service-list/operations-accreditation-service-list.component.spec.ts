import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsAccreditationServiceListComponent } from './operations-accreditation-service-list.component';

describe('OperationsAccreditationServiceListComponent', () => {
  let component: OperationsAccreditationServiceListComponent;
  let fixture: ComponentFixture<OperationsAccreditationServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsAccreditationServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsAccreditationServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

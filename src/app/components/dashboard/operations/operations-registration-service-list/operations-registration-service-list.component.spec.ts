import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsRegistrationServiceListComponent } from './operations-registration-service-list.component';

describe('OperationsRegistrationServiceListComponent', () => {
  let component: OperationsRegistrationServiceListComponent;
  let fixture: ComponentFixture<OperationsRegistrationServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsRegistrationServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsRegistrationServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsRegistrationServiceDetailsComponent } from './operations-registration-service-details.component';

describe('OperationsRegistrationServiceDetailsComponent', () => {
  let component: OperationsRegistrationServiceDetailsComponent;
  let fixture: ComponentFixture<OperationsRegistrationServiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsRegistrationServiceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsRegistrationServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsAccreditationServiceDetailsComponent } from './operations-accreditation-service-details.component';

describe('OperationsAccreditationServiceDetailsComponent', () => {
  let component: OperationsAccreditationServiceDetailsComponent;
  let fixture: ComponentFixture<OperationsAccreditationServiceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsAccreditationServiceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsAccreditationServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

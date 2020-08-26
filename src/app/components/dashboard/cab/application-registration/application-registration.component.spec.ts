import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRegistrationComponent } from './application-registration.component';

describe('ApplicationRegistrationComponent', () => {
  let component: ApplicationRegistrationComponent;
  let fixture: ComponentFixture<ApplicationRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

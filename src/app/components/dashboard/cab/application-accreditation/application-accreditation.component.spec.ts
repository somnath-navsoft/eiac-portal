import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAccreditationComponent } from './application-accreditation.component';

describe('ApplicationAccreditationComponent', () => {
  let component: ApplicationAccreditationComponent;
  let fixture: ComponentFixture<ApplicationAccreditationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAccreditationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAccreditationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

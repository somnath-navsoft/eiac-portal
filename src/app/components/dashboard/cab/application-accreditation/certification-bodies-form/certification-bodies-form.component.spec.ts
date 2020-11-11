import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationBodiesFormComponent } from './certification-bodies-form.component';

describe('CertificationBodiesFormComponent', () => {
  let component: CertificationBodiesFormComponent;
  let fixture: ComponentFixture<CertificationBodiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationBodiesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationBodiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationRecordsComponent } from './certification-records.component';

describe('CertificationRecordsComponent', () => {
  let component: CertificationRecordsComponent;
  let fixture: ComponentFixture<CertificationRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

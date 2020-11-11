import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificatiosComponent } from './qualificatios.component';

describe('QualificatiosComponent', () => {
  let component: QualificatiosComponent;
  let fixture: ComponentFixture<QualificatiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualificatiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtProvidersFormComponent } from './pt-providers-form.component';

describe('PtProvidersFormComponent', () => {
  let component: PtProvidersFormComponent;
  let fixture: ComponentFixture<PtProvidersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtProvidersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtProvidersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

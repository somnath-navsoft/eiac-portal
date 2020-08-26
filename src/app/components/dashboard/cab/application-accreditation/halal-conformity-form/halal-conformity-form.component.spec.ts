import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HalalConformityFormComponent } from './halal-conformity-form.component';

describe('HalalConformityFormComponent', () => {
  let component: HalalConformityFormComponent;
  let fixture: ComponentFixture<HalalConformityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HalalConformityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HalalConformityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPermitFormComponent } from './work-permit-form.component';

describe('WorkPermitFormComponent', () => {
  let component: WorkPermitFormComponent;
  let fixture: ComponentFixture<WorkPermitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkPermitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkPermitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

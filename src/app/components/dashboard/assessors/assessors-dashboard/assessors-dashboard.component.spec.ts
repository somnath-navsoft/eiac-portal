import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessorsDashboardComponent } from './assessors-dashboard.component';

describe('AssessorsDashboardComponent', () => {
  let component: AssessorsDashboardComponent;
  let fixture: ComponentFixture<AssessorsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessorsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessorsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

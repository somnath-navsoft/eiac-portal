import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabDashboardComponent } from './cab-dashboard.component';

describe('CabDashboardComponent', () => {
  let component: CabDashboardComponent;
  let fixture: ComponentFixture<CabDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

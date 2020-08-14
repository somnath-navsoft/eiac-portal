import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainerServiceListComponent } from './cab-trainer-service-list.component';

describe('CabTrainerServiceListComponent', () => {
  let component: CabTrainerServiceListComponent;
  let fixture: ComponentFixture<CabTrainerServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainerServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainerServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

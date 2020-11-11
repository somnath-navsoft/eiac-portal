import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainerServiceComponent } from './cab-trainer-service.component';

describe('CabTrainerServiceComponent', () => {
  let component: CabTrainerServiceComponent;
  let fixture: ComponentFixture<CabTrainerServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainerServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

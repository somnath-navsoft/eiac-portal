import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingApplicationComponent } from './cab-training-application.component';

describe('CabTrainingApplicationComponent', () => {
  let component: CabTrainingApplicationComponent;
  let fixture: ComponentFixture<CabTrainingApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

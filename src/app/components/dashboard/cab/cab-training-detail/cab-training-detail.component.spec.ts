import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrainingDetailComponent } from './cab-training-detail.component';

describe('CabTrainingDetailComponent', () => {
  let component: CabTrainingDetailComponent;
  let fixture: ComponentFixture<CabTrainingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrainingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrainingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

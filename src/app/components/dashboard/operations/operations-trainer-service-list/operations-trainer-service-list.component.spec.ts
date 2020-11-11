import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsTrainerServiceListComponent } from './operations-trainer-service-list.component';

describe('OperationsTrainerServiceListComponent', () => {
  let component: OperationsTrainerServiceListComponent;
  let fixture: ComponentFixture<OperationsTrainerServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsTrainerServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsTrainerServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRecordsComponent } from './operation-records.component';

describe('OperationRecordsComponent', () => {
  let component: OperationRecordsComponent;
  let fixture: ComponentFixture<OperationRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

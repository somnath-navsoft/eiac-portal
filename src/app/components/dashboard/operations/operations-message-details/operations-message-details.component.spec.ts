import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsMessageDetailsComponent } from './operations-message-details.component';

describe('OperationsMessageDetailsComponent', () => {
  let component: OperationsMessageDetailsComponent;
  let fixture: ComponentFixture<OperationsMessageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsMessageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsMessageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

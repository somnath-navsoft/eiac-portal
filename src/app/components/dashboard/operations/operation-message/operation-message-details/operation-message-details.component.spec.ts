import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationMessageDetailsComponent } from './operation-message-details.component';

describe('OperationMessageDetailsComponent', () => {
  let component: OperationMessageDetailsComponent;
  let fixture: ComponentFixture<OperationMessageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationMessageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationMessageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalOperationsProfileComponent } from './internal-operations-profile.component';

describe('InternalOperationsProfileComponent', () => {
  let component: InternalOperationsProfileComponent;
  let fixture: ComponentFixture<InternalOperationsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalOperationsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalOperationsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

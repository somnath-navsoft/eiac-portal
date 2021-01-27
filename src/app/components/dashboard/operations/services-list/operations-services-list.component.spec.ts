import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesListOperationsComponent } from './operations-services-list.component';

describe('ServicesListOperationsComponent', () => {
  let component: ServicesListOperationsComponent;
  let fixture: ComponentFixture<ServicesListOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesListOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesListOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

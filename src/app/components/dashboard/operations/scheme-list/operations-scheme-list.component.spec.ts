import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeListOperationsComponent } from './operations-scheme-list.component';

describe('SchemeListOperationsComponent', () => {
  let component: SchemeListOperationsComponent;
  let fixture: ComponentFixture<SchemeListOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeListOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeListOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

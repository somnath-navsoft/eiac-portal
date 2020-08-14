import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessorsComponent } from './assessors.component';

describe('AssessorsComponent', () => {
  let component: AssessorsComponent;
  let fixture: ComponentFixture<AssessorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

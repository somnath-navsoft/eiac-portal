import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessorsProfileComponent } from './assessors-profile.component';

describe('AssessorsProfileComponent', () => {
  let component: AssessorsProfileComponent;
  let fixture: ComponentFixture<AssessorsProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessorsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessorsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

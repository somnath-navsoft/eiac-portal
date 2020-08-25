import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoObjectionFormComponent } from './no-objection-form.component';

describe('NoObjectionFormComponent', () => {
  let component: NoObjectionFormComponent;
  let fixture: ComponentFixture<NoObjectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoObjectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoObjectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

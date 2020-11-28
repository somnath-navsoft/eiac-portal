import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabMessage } from './cab-message.component';

describe('MessageDetailsComponent', () => {
  let component: CabMessage;
  let fixture: ComponentFixture<CabMessage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabMessage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

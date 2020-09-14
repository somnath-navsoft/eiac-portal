import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabMessageDetailsComponent } from './cab-message-details.component';

describe('CabMessageDetailsComponent', () => {
  let component: CabMessageDetailsComponent;
  let fixture: ComponentFixture<CabMessageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabMessageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabMessageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

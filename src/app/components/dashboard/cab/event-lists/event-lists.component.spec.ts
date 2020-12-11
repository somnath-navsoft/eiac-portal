import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListsComponent } from './event-lists.component';

describe('EventListsComponent', () => {
  let component: EventListsComponent;
  let fixture: ComponentFixture<EventListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

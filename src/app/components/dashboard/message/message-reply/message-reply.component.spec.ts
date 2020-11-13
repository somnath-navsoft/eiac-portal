import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageReplyComponent } from './message-reply.component';

describe('MessageDetailComponent', () => {
  let component: MessageReplyComponent;
  let fixture: ComponentFixture<MessageReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

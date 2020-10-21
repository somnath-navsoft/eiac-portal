import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUploadComponent } from './account-upload.component';

describe('AccountUploadComponent', () => {
  let component: AccountUploadComponent;
  let fixture: ComponentFixture<AccountUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

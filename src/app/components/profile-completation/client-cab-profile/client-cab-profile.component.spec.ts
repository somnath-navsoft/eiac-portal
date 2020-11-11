import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCabProfileComponent } from './client-cab-profile.component';

describe('ClientCabProfileComponent', () => {
  let component: ClientCabProfileComponent;
  let fixture: ComponentFixture<ClientCabProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCabProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCabProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

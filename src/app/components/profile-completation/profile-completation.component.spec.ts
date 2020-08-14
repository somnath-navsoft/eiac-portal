import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCompletationComponent } from './profile-completation.component';

describe('ProfileCompletationComponent', () => {
  let component: ProfileCompletationComponent;
  let fixture: ComponentFixture<ProfileCompletationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCompletationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCompletationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

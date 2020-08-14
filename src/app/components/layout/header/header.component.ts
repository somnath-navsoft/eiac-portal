import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectAuthState } from '../../../store/app.states';
import { LogOut, LogInSuccess } from '../../../store/actions/auth.actions';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user = null;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }
  logOut(): void {
    this.store.dispatch(new LogOut(this.user));
  }
}

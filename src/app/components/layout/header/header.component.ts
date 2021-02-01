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
  firstName:any;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    var first_name = localStorage.getItem('first_name');
    if(first_name && first_name != '') {
      var firstNameval = first_name.split(' ');
      this.firstName = firstNameval[1] && firstNameval[1] != '' ? firstNameval[1] : first_name;
    }else{
      this.firstName = '';
    }
  }
  logOut(): void {
    this.store.dispatch(new LogOut(this.user));
  }
}

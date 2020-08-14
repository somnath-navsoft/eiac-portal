import { Component, OnInit, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, selectAuthState } from '../../store/app.states';
import { LogOut, LogInSuccess } from '../../store/actions/auth.actions';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'portal-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  getState: Observable<any>; 
  isAuthenticated: false;
  user = null;
  errorMessage = null;


  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
  }

  constructor(private store: Store<AppState>, private _service: AppService) { 
    // let getToken = sessionStorage.getItem('token');
    // let getEmail = sessionStorage.getItem('email');
    // if(getToken != '' && getToken != 'null'){
    //   this.store.dispatch(new LogInSuccess({token: getToken}));
    // }
    this._service.updateStoreAuthenticated();
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    ////console.log('portal dashboard...', this.getState, " -- ");
    this.getState.subscribe((state) => {
      ////console.log(">>>State subscribed: ", state);
      this.isAuthenticated = state.isAuthenticated;
      this.user = state.user;
      this.errorMessage = state.errorMessage;
    });
  }

  logOut(): void {
    this.user = null;
    this.store.dispatch(new LogOut(this.user));
  }

}

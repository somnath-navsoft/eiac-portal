import { Component, OnInit } from '@angular/core';
import { AppState, selectAuthState } from '../../store/app.states';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router'
import { LogOut, LogInSuccess, LogInState } from '../../store/actions/auth.actions';
import { filter} from 'rxjs/operators';

import { AppService } from '../../services/app.service'; 

@Component({
  selector: 'portal-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  getState: Observable<any>; 
  isAuthenticated: boolean = false;
  user = null;
  errorMessage = null;
  currentState: string;
  resetPassword: string;
  verifyAccount:any;
  isCompleteness:any;
  pageId:any;
  verifyId:any;

  constructor(private store: Store<AppState>, private router: Router,
    public route: ActivatedRoute, private _service: AppService) { 
    let getToken = sessionStorage.getItem('token');
    if(getToken != '' && getToken != 'null'){
      // //console.log('>>> layout state status calling....');
      this.store.dispatch(new LogInState({token: getToken}));
    }
    //this._service.updateStoreAuthenticated();
    // let getToken = this._service.getToken();
    // if(getToken != '' && getToken != 'null'){
    //   //console.log('store layout update....');
    //   this.store.dispatch(new LogInSuccess({token: getToken}));
    // }
        
    // this.verifyAccount = this.route.snapshot.paramMap.get('verify-id');
    // this.resetPassword = this.route.snapshot.paramMap.get('reset-id');

    // //console.log(this.verifyAccount);
    // //console.log(this.resetPassword);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
        let data: any = event;
        //console.log('>>> router...', event);

        var wholeUrl = data.urlAfterRedirects;
        
        var splitUrl = wholeUrl.split('/');
        var splitForverifyAccount = wholeUrl.split('?');

        if(splitUrl[1] == 'reset-password')
        {
          this.currentState = 'reset-password';
          this.pageId = splitUrl[2];
        }else if(splitForverifyAccount[0] == '/verify-account')
        {
          this.currentState = 'verify-account';
          this.verifyId = splitForverifyAccount[1];
          // console.log(this.verifyId,'verifyId');
        }else if(splitUrl[1] == 'verify-account')
        {
          this.currentState = 'verify-account';
        }
        else if(splitUrl[1] == 'profile-completation')
        {
          this.currentState = 'profile-completation';
        }else{
          this.currentState = data.urlAfterRedirects;
        }
        //console.log('>>> router...', this.currentState);
        // console.log('>>> router...', splitForverifyAccount);
      }); 

      // this.router.params.switchMap(params => { 
      // })
  }

  ngOnInit() {
    setTimeout(()=>{
      this.getState = this.store.select(selectAuthState);
      this.getState.subscribe((state) => {
        // console.log(">>>layout State subscribed: ", state);

        console.log("@@@Auth status: ", state);
        if(state.user != null && state.user.token != undefined && state.user.token != null) {
          
          let authUserData = this._service.decodeJWT(state.user.token);
          /*
          else if(state.user.token !=null &&  authUserData.isCompleteness == '0'){
            console.log('@Enter....1.0: ');
            this.isAuthenticated = state.isAuthenticated;
            this.isCompleteness = '1';
          }
          */
          if(state.user.token !=null && authUserData.isVerified == '0')
          {
            console.log('@Enter....1: ');
            this.isAuthenticated = false;
          }else if(state.user.token !=null){
            console.log('@Enter....1.1: ');
            this.isAuthenticated = state.isAuthenticated;
            this.isCompleteness = '1';
          }
        }
        else{
          //console.log('@Enter....2');
          this.isAuthenticated = state.isAuthenticated;
        }
        
        // console.log(">>>layout State subscribed: ", state);
        //this.isAuthenticated = state.isAuthenticated;
        // this.isCompleteness = '1';
        // this.user = state.user;
        // this.errorMessage = state.errorMessage;
      });
    },0)
    
  }

}

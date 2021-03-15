import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, from } from 'rxjs';
// import 'rxjs/add/observable/of';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/catch'; 
import {catchError} from 'rxjs/operators';
import { tap,mergeMap, switchMap, map  } from 'rxjs/operators';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Constants} from  '../../services/constant.service';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../../store/app.states';
import {
    AuthActionTypes,
    LogIn, LogInSuccess, LogInFailure, LogOut, All
  } from '../actions/auth.actions';
  import {SnackbarService} from 'ngx-snackbar';

@Injectable()
export class AuthEffects {
  getState: any; 
  appState: Store<AppState>;
  constructor(
    private store: Store,
    private snackbarService: SnackbarService,
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
    private _appServ: AppService,
    private _constants:  Constants,
    private toastr:  ToastrService,
  ) {}



  // effects go here
  @Effect({ dispatch: false})
  AddGlobalError : Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.ADD_GLOBAL_ERROR),
    tap((error) => {
      this.authService.appErrorStack.next(error);     
    }));

    @Effect({ dispatch: false})
    LogInFailure : Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE),
    tap((error) => {
      this.authService.appErrorStack.next(error);  
    }));

  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.LOGIN_SUCCESS),
  tap((user) => {
    var authUserData = this._appServ.decodeJWT(user.payload.token);
    console.log(">>>Effects LAnd URL:",authUserData );
    // if(authUserData.user_type === 'candidate'){
    //   authUserData.isCompleteness = 1;
    //   authUserData.isVerified = 1;
    // }
    if(authUserData.isVerified == '0' && authUserData.profileComplete != '2')
    {
      // localStorage.setItem('token', user.payload.token);
      // this._appServ.getUserType();
      // localStorage.setItem('type', this._constants.logType);
      // console.log(authUserData,'authUserData');
      this.router.navigateByUrl('/sign-in');
      localStorage.setItem('token', '');
      // this.toastr.error('Please complete your verification before Sign in','Validation Error', {timeOut: 30000});
      // this.authService.appErrorStack.next('Please complete your verification before Sign in');
    }else if(authUserData.isCompleteness == '0')
    {
      console.log(authUserData,'@@@@authUserData');
      localStorage.setItem('token', user.payload.token);
      localStorage.setItem('email', authUserData.email);
      localStorage.setItem('first_name', authUserData.first_name);
      localStorage.setItem('isVerified', authUserData.isVerified);
      localStorage.setItem('profileComplete', authUserData.isCompleteness);
      localStorage.setItem('userId', authUserData.user_id);
      this._appServ.getUserType();
      localStorage.setItem('type', this._constants.logType);
      this.router.navigateByUrl('/profile-completion');

      // let landURL = '/dashboard/' + this._constants.logType + '/home';
      // this.router.navigateByUrl(landURL);

    }else if(authUserData.isCompleteness == '2')
    {
      // localStorage.setItem('token', user.payload.token);
      // this._appServ.getUserType();
      // localStorage.setItem('type', this._constants.logType);
      console.log('####authEffects');
      localStorage.setItem('token', '');
      localStorage.setItem('email', '');
      localStorage.setItem('first_name', '');
      localStorage.setItem('isVerified', '');
      localStorage.setItem('profileComplete', '');
      localStorage.setItem('userId', '');
      localStorage.setItem('type', '');
      this.toastr.error('Hi Your profile is rejected by Admin','Validation Error', {timeOut: 30000});
      this.router.navigateByUrl('/sign-in');
      // localStorage.setItem('token', '');
      
      // this.authService.appErrorStack.next('Please complete your verification before Sign in');
    }else{
      localStorage.setItem('token', user.payload.token);
      localStorage.setItem('email', authUserData.email);
      localStorage.setItem('first_name', authUserData.first_name);
      localStorage.setItem('isCompleteness', authUserData.isVerified);
      localStorage.setItem('profileComplete', authUserData.isCompleteness);
      localStorage.setItem('userId', authUserData.user_id);
      this._appServ.getUserType();
      localStorage.setItem('type', this._constants.logType);
      //this._appServ.updateStoreAuthenticated();
      // console.log(">>>Effects: Usertype parse: ",this._constants.logType );

      // if(localStorage.getItem("redirectURL") != '' && localStorage.getItem("redirectURL") != null && 
      //       localStorage.getItem("redirectURL") != undefined){
      //       let urlRedirect: string = localStorage.getItem("redirectURL");
      //       //localStorage.setItem("redirectURL",'');
      //       console.log(">>>LOG In redirecting....", urlRedirect);
      //       this.router.navigateByUrl(urlRedirect);
      // }      
      let landURL = '/dashboard/' + this._constants.logType + '/home';
      // console.log(">>>Effects LAnd URL:",landURL );
      this.router.navigateByUrl(landURL);
      //top.location.href = landURL;
      // console.log(authUserData,'authUserData');
    }
    
  }));

  @Effect({ dispatch: false })
  LogInState: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.LOGIN_STATE),
  tap((user) => {
    //console.log(">>> Effects STATE: ", user, " -- ", user.payload.token);
      if(user.payload.token != '' && user.payload.token != null){
        //console.log("#Enter effects...1");
        return user;
      }
      // else{
      //   //console.log("#Enter effects...2");
      //   this.router.navigateByUrl('/sign-in');
      // }
  }));

  @Effect({ dispatch: false })
  LogOut: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.LOGOUT),
  tap((user) => {
    localStorage.setItem('token', '');
    this.router.navigateByUrl('/sign-in');
  }));

  @Effect({ dispatch: false })
  LogIn: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN),
      map((action: LogIn) => action.payload),
      switchMap(payload => {
        return this.authService.logIn(payload.email, payload.password).pipe(
          map(data => {
             console.log("Login Data: ", data);
             if( data != undefined && data.access != ''){
              this.store.dispatch(new LogInSuccess({token: data.access}));
             }
             if( data != undefined && data.status === 'error'){
              return new LogInFailure({ error: data.message });
            }
          }          
          )
                    
        )        
      })

            // this.authService.logIn(payload.email, payload.password) => {
            //   .map((user) => {
            //     ////console.log(user);
            //     return new LogInSuccess({token: user.token, email: payload.email});
            //   })
            //   .catch((error) => {
            //     ////console.log(error);
            //     return Observable.of(new LogInFailure({ error: error }));
            //   });
            //}
      //.switchMap(payload => {
      // return this.authService.logIn(payload.email, payload.password)
      //   .map((user) => {
      //     ////console.log(user);
      //     return new LogInSuccess({token: user.token, email: payload.email});
      //   })
      //   .catch((error) => {
      //     ////console.log(error);
      //     //return Observable.of(new LogInFailure({ error: error }));
      //   });
    //});
  )

  /*
  @Effect()
  LogIn: Observable<Action> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN),
    tap( user => {
      ////console.log('Login effects....', user);
      return this.authService.logIn(user)
        .pipe(
          mergeMap((user: any) => [
            new LogInSuccess({token: user.token, email: user.email}),
           //new LoginComplete(user),
           //new GetComplete(user.locations),
          ]        
        ),
          //catchError(errorHandler(LoginError))
        );
      }),
   );*/
  /*@Effect()
  LogIn: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.LOGIN),
      tap(payload => {
          ////console.log('Login effects....', payload);
        // return this.authService.logIn(payload.email, payload.password)
        //   .map((user) => {
        //     ////console.log(user);
        //     return new LogInSuccess({token: user.token, email: payload.email});
        //   })
        //   .catch((error) => {
        //     ////console.log(error);
        //     //return Observable.of(new LogInFailure({ error: error }));
        //   });
      })
  )*/
}

// @Effect()
// LogIn: Observable<any> = this.actions.pipe(
//   .ofType(AuthActionTypes.LOGIN)
//   .map((action: LogIn) => action.payload)
//   .switchMap(payload => {
//     return this.authService.logIn(payload.email, payload.password)
//       .map((user) => {
//         ////console.log(user);
//         return new LogInSuccess({token: user.token, email: payload.email});
//       })
//       .catch((error) => {
//         ////console.log(error);
//         return Observable.of(new LogInFailure({ error: error }));
//       });
//   });

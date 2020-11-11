import { Action } from '@ngrx/store';
import { User } from '../../models/user';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_STATE = '[Auth] Login State',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  ADD_GLOBAL_ERROR = '[Auth] Error'
}

export class AddGlobalError implements Action {
  readonly type = AuthActionTypes.ADD_GLOBAL_ERROR;
  constructor(public payload: any) {}
}

export class LogIn implements Action {  
    readonly type = AuthActionTypes.LOGIN;
    constructor(public payload: any) {
      //////console.log('enter ACTION LOGIN>>>', payload);
    }
}
export class LogInSuccess implements Action {
    readonly type = AuthActionTypes.LOGIN_SUCCESS;
    constructor(public payload: any) {
      //////console.log('enter ACTION LOGIN SUCCESS>>>', payload);
    }
}
export class LogInState implements Action {
  readonly type = AuthActionTypes.LOGIN_STATE;
  constructor(public payload: any) {
    //////console.log('enter ACTION LOGIN sTATE>>>', payload);
  }
}
export class LogInFailure implements Action {
    readonly type = AuthActionTypes.LOGIN_FAILURE;
    constructor(public payload: any) {
      //////console.log('enter ACTION LOGIN Error FAILURE>>>', payload);
    }
}
export class LogOut implements Action {
    readonly type = AuthActionTypes.LOGOUT;
    constructor(public payload: any) {
      //////console.log('enter ACTION LOGOUT>>>', payload);
    }
  }
  
  export type All =
    | LogIn 
    | LogInSuccess
    | LogInState
    | LogInFailure
    | AddGlobalError
    | LogOut;
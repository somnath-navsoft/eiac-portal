import { User } from '../../models/user';
import { AuthActionTypes, All } from '../actions/auth.actions';
import { AppService } from '../../services/app.service';

export interface State {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, there should be a user object
  user: User | null;
  // error message
  errorMessage: string | null;
  successMessage: string | null;
}
export const initialState: State = {
    isAuthenticated: false,
    user: null,
    errorMessage: null,
    successMessage: null
}; 

export function reducer(state = initialState, action: All): State {
    switch (action.type) {

      case AuthActionTypes.ADD_GLOBAL_ERROR: {
        return action.payload;
      }
      case AuthActionTypes.LOGIN_FAILURE: {
        //console.log('enter reducer LOGIN error>>>', action);
        return {
          ...state         
        };
      }
      
      case AuthActionTypes.LOGIN: {
        //////console.log('enter reducer LOGIN>>>');
        return {
          ...state,
          errorMessage: null,
        };
      }
      case AuthActionTypes.LOGIN_SUCCESS: {
        //////console.log('enter reducer LOGIN SUCCESS>>>', action);
        //email: action.payload.email
        return {
          ...state,
          isAuthenticated: true,
          user: {
            token: action.payload.token            
          },
          errorMessage: null
        };
      }
      case AuthActionTypes.LOGIN_STATE: {
        //console.log('enter reducer LOGIN STATTE>>>', action);
        //email: action.payload.email
        return {
          ...state,
          isAuthenticated: (action.payload.token != null && action.payload.token != '') ? true : false,
          user: {
            token: action.payload.token
          },
          errorMessage: null
        };
      }
      case AuthActionTypes.LOGOUT: {
        //////console.log('enter reducer LOGOUT>>>');       
        return initialState;
      }
      default: {
        return state;
      }
    }
  }

export const getLoggedIn = (state: State) => state.isAuthenticated;
export const selectUser = (state: State) => state.user;
export const errorMessage = (state: State) => state.errorMessage;
export const hasError = (state: State) => state.errorMessage;

import { AppInitialState } from './../AppInitialState';
import { recoverPassword, recoverPasswordSucces, recoverPasswordFail, login, loginSuccess, loginFail } from './login.actions';
import { createReducer,on } from '@ngrx/store';
import { LoginState } from "./LoginState";

const initialState: LoginState = AppInitialState.login;

const reducer = createReducer(
  initialState,
  on( recoverPassword, currentState =>{
    return {
      ...currentState,
      error: null,
      isRecoveringPassword: true,
      isRecoveredPassword: false,
    };
  }),
  on( recoverPasswordSucces, currentState =>{
    return {
      ...currentState,
      error: null,
      isRecoveringPassword: false,
      isRecoveredPassword: true,
    };
  }),
  on( recoverPasswordFail, (currentState, action) =>{
    return {
      ...currentState,
      error: action.error,
      isRecoveringPassword: false,
      isRecoveredPassword: false,
    };
  }),
  on( login ,currentState => {
    return {
      ...currentState,
      error: null,
      isLoggedIn: false,
      isLoggingIn: true
    }
  }),
  on( loginSuccess ,currentState => {
    return {
      ...currentState,
      isLoggedIn: true,
      isLoggingIn: false
    }
  }),
  on( loginFail , (currentState, action) => {
    return {
      ...currentState,
      error:action.error,
      isLoggedIn: false,
      isLoggingIn: false
    }
  }),
)


export function loginReducer(state: LoginState, action){
  return reducer(state, action);
}

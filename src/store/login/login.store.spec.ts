import { User } from './../../app/model/user/User';
import { AppInitialState } from './../AppInitialState';
import { recoverPassword, recoverPasswordSucces, recoverPasswordFail, login, loginSuccess, loginFail } from './login.actions';
import { loginReducer } from './login.reducers';
import { LoginState } from './LoginState';
describe("Login Store", () => {

  it('recoverPassword', () => {
    const initialState: LoginState = AppInitialState.login;

    const newState = loginReducer(initialState,recoverPassword());
    expect(newState).toEqual({
      ...initialState,
      error: null,
      isRecoveringPassword: true,
      isRecoveredPassword: false,
    });
  });


  it('recoverPasswordSucces', () => {
    const initialState: LoginState = AppInitialState.login;
    const newState = loginReducer(initialState,recoverPasswordSucces());
    expect(newState).toEqual({
      ...initialState,
      error: null,
      isRecoveringPassword: false,
      isRecoveredPassword: true,
    });
  });

  it('recoverPasswordFail', () => {
    const initialState: LoginState = AppInitialState.login;
    const error= {error: 'error'};
    const newState = loginReducer(initialState,recoverPasswordFail({error}));
    expect(newState).toEqual({
      ...initialState,
      error,
      isRecoveringPassword: false,
      isRecoveredPassword: false,
    });
  });

  it('login', () => {
    const initialState : LoginState = AppInitialState.login;
    const newState = loginReducer(initialState,login());
    expect(newState).toEqual({
      ...initialState,
      error: null,
      isLoggedIn: false,
      isLoggingIn: true
    });
  });

  it('loginSuccess', () => {
    const initialState : LoginState = {
      ...AppInitialState.login,
      isLoggingIn: true
    }
    const user = new User();
    user.id = "anyId";
    const newState = loginReducer(initialState,loginSuccess({user}));
    expect(newState).toEqual({
      ...initialState,
      isLoggedIn: true,
      isLoggingIn: false
    });
  });

  it('loginFail', () => {
    const initialState : LoginState = {
      ...AppInitialState.login,
      isLoggingIn: true
    }
    const error = {error: 'error'};
    const newState = loginReducer(initialState,loginFail({error}));
    expect(newState).toEqual({
      ...initialState,
      error,
      isLoggedIn: false,
      isLoggingIn: false
    });
  });
});

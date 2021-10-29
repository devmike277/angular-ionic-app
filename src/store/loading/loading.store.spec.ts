import { login } from './../login/login.actions';
import { AppInitialState } from './../AppInitialState';
import { LoginState } from './../login/LoginState';
import { createAction } from '@ngrx/store';
import { LoadingState } from './LoadingState';
import { loadingReducer } from "./loading.reducers";
import { show,hide } from './loading.actions';
import { loginReducer } from '../login/login.reducers';

describe('Loading Store', () => {

  it('show', () => {
    const initialState: LoadingState = {show:false};
    const newState = loadingReducer(initialState, show());
    expect(newState).toEqual({show: true});
  });

  it('hide', () => {
    const initialState: LoadingState = {show:true};
    const newState = loadingReducer(initialState, hide());
    expect(newState).toEqual({show: false});
  });

  it('should keep state if action is unknown', () => {
    const initialState: LoadingState = {show:true};
    const action = createAction("UNKOWN");
    const newState = loadingReducer(initialState,action);
    expect(newState).toEqual({show: true});
  });

});

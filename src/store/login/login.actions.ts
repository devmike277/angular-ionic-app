import { User } from './../../app/model/user/User';
import { createAction,props } from '@ngrx/store';

export const recoverPassword = createAction("[Recover Password]", props<{email: string}>());
export const recoverPasswordSucces = createAction("[Recover Password] success");
export const recoverPasswordFail = createAction("[Recover Password] fail",props<{error: any}>());

export const login = createAction("[Login]", props<{email: string, password: string}>());
export const loginSuccess = createAction("[Login] success", props<{user:User}>());
export const loginFail = createAction("[Login] fail", props<{error: any}>());

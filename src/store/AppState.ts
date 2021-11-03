import { RegisterState } from './register/RegisterState';
import { LoadingState } from './loading/LoadingState';
import { LoginState } from './login/LoginState';

export interface AppState {
  loading: LoadingState;
  login: LoginState;
  register: RegisterState;
}

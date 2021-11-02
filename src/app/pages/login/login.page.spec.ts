import { AngularFireModule } from '@angular/fire/compat';
import { User } from './../../model/user/User';
//import { AuthService } from './../../services/auth/auth.service'; //ngrx refactor
import { show } from './../../../store/loading/loading.actions';
import { recoverPassword, recoverPasswordSucces, recoverPasswordFail, login, loginFail, loginSuccess } from './../../../store/login/login.actions';
import { loadingReducer } from 'src/store/loading/loading.reducers';
import { Store, StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './../../app-routing.module';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { loginReducer } from 'src/store/login/login.reducers';
import { StoreDevtools } from '@ngrx/store-devtools';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let page;
  let store;
  let toastController: ToastController;
  //let authService: AuthService; //ngrx refactor

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [
                IonicModule.forRoot(),
                AppRoutingModule,
                ReactiveFormsModule,
                StoreModule.forRoot([]),
                StoreModule.forFeature("loading", loadingReducer),
                StoreModule.forFeature("login",loginReducer),
                AngularFireModule.initializeApp(environment.firebaseConfig)
              ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    toastController = TestBed.get(ToastController);
    //authService = TestBed.get(AuthService); //ngrx refactor
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  }));

  it('should create form on init', () => {
    component.ngOnInit();
    expect(component.form).not.toBeUndefined();
  });
  //not necessary
  // it('should go to home on login page', () => {
  //   spyOn(router,'navigate');
  //   component.login();
  //   expect(router.navigate).toHaveBeenCalledWith(['home']);
  // });

  it('should go to register page on register', () => {
    spyOn(router,'navigate');
    component.register();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  it("should recover email/password on forgot email/password", () => {
    //ngrx refactor
    //spyOn(authService,'recoverEmailPassword').and.returnValue(new Observable(()=>{}));
    fixture.detectChanges();
    component.form.get('email').setValue("valid@email.com");
    page.querySelector("#recoverPasswordButton").click();
    store.select('login').subscribe(loginState => {
      expect(loginState.isRecoveringPassword).toBeTruthy();
    });
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    });
  });

  it('given user is recovering password, when success, then hide loading and show success message', () => {
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: ()=>{}}));
    fixture.detectChanges();
    store.dispatch(recoverPassword({email: 'any@email.com'}));
    store.dispatch(recoverPasswordSucces());
    store.select('loading').subscribe( loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

  it('given user is recovering password, when fail, then hide loading and show error message', () =>{
    //spyOn(toastController,'create');
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: () =>{}}));
    fixture.detectChanges();
    store.dispatch(recoverPassword({email: 'any@email.com'}));
    store.dispatch(recoverPasswordFail({error:"message"}));
    store.select('loading').subscribe( loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1);
  });

  it('should show loading and start login when loggin in', () => {
    //ngrx refactor
    //spyOn(authService,'login').and.returnValue(new Observable(()=>{}));
    fixture.detectChanges();
    component.form.get('email').setValue('valid@email.com');
    component.form.get('password').setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    });
    store.select('login').subscribe(loginState  => {
      expect(loginState.isLoggingIn).toBeTruthy();
    });
  });

  it('given user is logging in, when success, the hide loading and send user to home page', () => {
    spyOn(router,'navigate');
    //ngrx refactor
    //spyOn(authService,'login').and.returnValue(of(new User()));
    fixture.detectChanges();
    //ngrx refactor
    // component.form.get('email').setValue('valid@email.com');
    // component.form.get('password').setValue('anyPassword');
    // page.querySelector('#loginButton').click();
    store.dispatch(login({email:'valid@email.com', password: "anyPassword"} ));
    store.dispatch(loginSuccess({user: new User()}));
    //
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    store.select('login').subscribe(loginState  => {
      expect(loginState.isLoggedIn).toBeTruthy();
    });
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('given user is logging in, when fail, the hide loading and show error message', ()=>{
    //ngrx refactor
    //spyOn(authService,'login').and.returnValue(throwError({message:'error'}));
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: () =>{}}));
    fixture.detectChanges();
    //ngrx refactor
    // component.form.get('email').setValue('error@email.com');
    // component.form.get('password').setValue('anyPassword');
    // page.querySelector('#loginButton').click();
    store.dispatch(login({email:'valid@email.com', password: "anyPassword"}));
    store.dispatch(loginFail({error: {message: 'error message'}}));
    //
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1);
  });
});

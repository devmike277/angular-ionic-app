import { User } from './../../model/user/User';
import { AuthService } from './../../services/auth/auth.service';
import { show } from './../../../store/loading/loading.actions';
import { recoverPassword, recoverPasswordSucces, recoverPasswordFail } from './../../../store/login/login.actions';
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
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let page;
  let store;
  let toastController: ToastController;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [
                IonicModule.forRoot(),
                AppRoutingModule,
                ReactiveFormsModule,
                StoreModule.forRoot([]),
                StoreModule.forFeature("loading", loadingReducer),
                StoreModule.forFeature("login",loginReducer)
              ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    toastController = TestBed.get(ToastController);
    authService = TestBed.get(AuthService);
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
    fixture.detectChanges();
    component.form.get('email').setValue("valid@email.com");
    page.querySelector("#recoverPasswordButton").click();
    store.select('login').subscribe(loginState => {
      expect(loginState.isRecoveringPassword).toBeTruthy();
    });
  });

  it('should show the login when its recovering password', () => {
    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    });
  });

  it('should hide loading and show success message when has recovered password', () => {
    spyOn(toastController,'create');
    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.dispatch(recoverPasswordSucces());
    store.select('loading').subscribe( loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

  it('should hide loading and show error message when error on recover password', () =>{
    //spyOn(toastController,'create');
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: () =>{}}));
    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.dispatch(recoverPasswordFail({error:"message"}));
    store.select('loading').subscribe( loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1);
  });

  it('should show loading and start login when loggin in', () => {
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

  it('should hide loading and send user to home page when user has logged in', () => {
    spyOn(router,'navigate');
    spyOn(authService,'login').and.returnValue(of(new User()));
    fixture.detectChanges();
    component.form.get('email').setValue('valid@email.com');
    component.form.get('password').setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    store.select('login').subscribe(loginState  => {
      expect(loginState.isLoggedIn).toBeTruthy();
    });
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should hide loading and show error when user couldnt login', ()=>{
    spyOn(authService,'login').and.returnValue(throwError({message:'error'}));
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: () =>{}}));
    fixture.detectChanges();
    component.form.get('email').setValue('error@email.com');
    component.form.get('password').setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1);
  });
});

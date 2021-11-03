import { show } from './../../../store/loading/loading.actions';
import { AppRoutingModule } from './../../app-routing.module';
import { loadingReducer } from 'src/store/loading/loading.reducers';
import { AppState } from 'src/store/AppState';
import { Store, StoreModule } from '@ngrx/store';
import { RegisterPageModule } from './register.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { registerReducer } from 'src/store/register/register.reducers';
import { register, registerFail, registerSuccess } from 'src/store/register/register.actions';
import { UserRegister } from 'src/app/model/user/UserRegister';
import { loginReducer } from 'src/store/login/login.reducers';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let router: Router;
  let page;
  let store: Store<AppState>;
  let toasController: ToastController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        RegisterPageModule,
        AppRoutingModule,
        StoreModule.forRoot([]),
        StoreModule.forFeature("loading", loadingReducer),
        StoreModule.forFeature("login", loginReducer),
        StoreModule.forFeature("register", registerReducer)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    toasController = TestBed.get(ToastController);
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  }));

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('should create register form on page init', ()=>{
    fixture.detectChanges();
    expect(component.registerForm).not.toBeUndefined();
  });

  it('should not to be allowed to register with form invalid', () => {
    fixture.detectChanges();
    //spyOn(router, 'navigate');
    clickOnRegisterButton();
    store.select("register").subscribe( state => {
      expect(state.isRegistering).toBeFalsy();
    });
  });

  it('given form is valid, when user clicks on register, then register', () => {
    fixture.detectChanges();
    fillForm();
    clickOnRegisterButton();
    store.select("register").subscribe( state => {
      expect(state.isRegistering).toBeTruthy();
    });
  });

  it('given form is valid, when user clicks on register, then show loading', () => {
    fixture.detectChanges();
    fillForm();
    clickOnRegisterButton();
    store.select("loading").subscribe( state => {
      expect(state.show).toBeTruthy();
    });
  });

  it('should hide loading component when registration successful', () => {

    fixture.detectChanges();
    store.dispatch(register({userRegister: new UserRegister()}));
    store.dispatch(registerSuccess());
    store.select("loading").subscribe( state => {
      expect(state.show).toBeFalsy();
    });
  });

  it('should login when registration successful', () => {
    fixture.detectChanges();
    //spyOn(router,'navigate');
    store.dispatch(register({userRegister: new UserRegister()}));
    store.dispatch(registerSuccess());
    store.select('login').subscribe( state => {
      expect(state.isLoggingIn).toBeTruthy();
    });
  });

  it('should hide loading component when registration fail', () => {

    fixture.detectChanges();
    store.dispatch(register({userRegister: new UserRegister()}));
    store.dispatch(registerFail({error: {message: "Error message"}}));
    store.select("loading").subscribe( state => {
      expect(state.show).toBeFalsy();
    });
  });

  it('should show error on registration fail', () => {

    fixture.detectChanges();
    spyOn(toasController,'create').and.returnValue(<any> Promise.resolve({present: () => {}}));
    store.dispatch(register({userRegister: new UserRegister()}));
    store.dispatch(registerFail({error: {message: "Error message"}}));
    expect(toasController.create).toHaveBeenCalled();

  });


  function clickOnRegisterButton(){
    page.querySelector('ion-button').click();
  }

  function fillForm(){
    component.registerForm.getForm().get('name').setValue('anyName');
    component.registerForm.getForm().get('email').setValue('any@email.com');
    component.registerForm.getForm().get('password').setValue('anyPassword');
    component.registerForm.getForm().get('repeatPassword').setValue('anyPassword');
    component.registerForm.getForm().get('phone').setValue('anyPhone');
    component.registerForm.getForm().get('address').get('street').setValue('any street');
    component.registerForm.getForm().get('address').get('number').setValue('any number');
    component.registerForm.getForm().get('address').get('complement').setValue('any complement');
    component.registerForm.getForm().get('address').get('neighbourhood').setValue('any neighbourhood');
    component.registerForm.getForm().get('address').get('zipCode').setValue('any zip code');
    component.registerForm.getForm().get('address').get('city').setValue('any city');
    component.registerForm.getForm().get('address').get('state').setValue('any state');
  }
});

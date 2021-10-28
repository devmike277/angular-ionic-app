import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorMessageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should show error message on fiel touch and error present',() => {
    component.field = new FormGroup({anyField: new FormControl()});
    component.field.markAllAsTouched();
    component.field.setErrors({anyError: true});
    component.error = "anyError";
    expect(component.shouldShowComponent()).toBeTruthy();
  });

  it('should hide error message on field not touched', () => {
    component.field = new FormGroup({anyField: new FormControl()});
    component.field.setErrors({anyError: true});
    component.error = "anyError";
    expect(component.shouldShowComponent()).toBeFalsy();
  });

  it('should hide error message on field touched, but no errors', () => {
    component.field = new FormGroup({anyField: new FormControl()});
    component.field.markAllAsTouched();
    component.error = "anyError";
    expect(component.shouldShowComponent()).toBeFalsy();
  });

  it('should hide error message on field touched and has error, but it is a different error', () => {
    component.field = new FormGroup({anyField: new FormControl()});
    component.field.markAllAsTouched();
    component.field.setErrors({anyError: true});
    component.error = "anotherError";
    expect(component.shouldShowComponent()).toBeFalsy();
  });
});
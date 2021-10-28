import { AbstractControl, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent implements OnInit {

  @Input() message: string;
  @Input() field: AbstractControl;
  @Input() error: string;

  constructor() { }

  ngOnInit() {}

  shouldShowComponent(){
    //.touched && form.get('email').errors?.email
    if(this.field !== undefined && this.field.touched && this.field.errors?.[this.error]){
      return true;
    }
    return false;
  }

}

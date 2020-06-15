import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[password-comp]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordValidatorDirective,
    multi: true
  }]
})
export class PasswordValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      if (!control.value.match(/\d+/g)) {
        return { 'integer': true };
      }
      if (String(control.value).toLowerCase() == control.value) {
        return { 'upper': true };
      }
      if (control.value.length < 8) {
        return { 'length': true }; // return object if the validation is not passed.
      }
      return null; // return null if validation is passed.
    }
  }
}

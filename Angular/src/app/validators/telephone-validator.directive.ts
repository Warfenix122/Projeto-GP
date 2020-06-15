import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[phone]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: TelephoneValidatorDirective,
    multi: true
  }]
})
export class TelephoneValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      console.log('control.value :>> ', control.value);

      if (!Number.isInteger(parseInt(control.value, 10))) {
        return { 'integer': true };
      }
      if (control.value.length != 9) {
        return { 'length': true }; // return object if the validation is not passed.
      }
      return null; // return null if validation is passed.
    }
  }
}
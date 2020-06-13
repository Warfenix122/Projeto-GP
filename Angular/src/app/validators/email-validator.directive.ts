import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[email-comp]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: EmailValidatorDirective,
    multi: true
  }]
})
export class EmailValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      if (!String(control.value).includes('@')) {
        return { 'domain': true };
      }
      if (!String(control.value).includes('.com') && (!String(control.value).includes('.pt'))) {
        return { 'end': true };
      }
      return null; // return null if validation is passed.
    }
  }
}

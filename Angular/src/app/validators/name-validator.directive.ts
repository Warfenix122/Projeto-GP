import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[nome-comp]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: NameValidatorDirective,
    multi: true
  }]
})
export class NameValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      if (!String(control.value).includes(' ')) {
        return { 'space': true };
      }
      const name = String(control.value).split(' ')
      if (name.length < 2 && name[0] && name[1]) {
        return { 'space': true };
      }
      if (control.value.length < 3) {
        return { 'length': true }; // return object if the validation is not passed.
      }
      return null; // return null if validation is passed.
    }
  }
}

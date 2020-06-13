import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { isDate } from 'util';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Directive({
  selector: '[date-comp]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DateValidatorDirective,
    multi: true
  }]
})
export class DateValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const brithDate = new Date(control.value);
      const nowDate = new Date(Date.now());
      if ((nowDate.getFullYear() - 18) < brithDate.getFullYear()) {
        return { 'year': true };
      }
      return null; // return null if validation is passed.
    }
  }
}

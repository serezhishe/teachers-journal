import { AbstractControl, ValidatorFn } from '@angular/forms';

import { dateInputFormat } from '../constants';

export function duplicateDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let forbidden = [];
      if (control.parent) {
        forbidden = control.parent.value
          .map((elem) => elem.format(dateInputFormat))
          .filter((_el, _i, dateArray) => {
            const lastIndex = dateArray.lastIndexOf(control.value.format(dateInputFormat));

            return (control.parent.controls as any).indexOf(control) !== lastIndex && lastIndex !== -1;
          });
      }

      return forbidden.length ? { duplicateDate: { value: control.value } } : null;
    };
  }

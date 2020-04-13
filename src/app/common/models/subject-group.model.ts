import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface ISubjectFormGroup {
  dates: FormArray;
  marks: FormGroup;
  teacher: FormControl;
}

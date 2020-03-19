import { ValidatorFn } from '@angular/forms';

export interface IFormConfig {
    type: string;
    label: string;
    required: boolean;
    validators: ValidatorFn[];
}

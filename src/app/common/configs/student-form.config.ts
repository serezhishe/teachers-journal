import { Validators } from '@angular/forms';

export const studentConfig = [
    {
      type: 'text',
      label: 'name',
      required: true,
      validators: [Validators.pattern(/^[A-Za-zА-яа-я]+$/), Validators.required],
    }, {
      type: 'text',
      label: 'lastName',
      required: true,
      validators: [Validators.pattern(/^[A-Za-zА-яа-я]+$/), Validators.required],
    }, {
      type: 'textarea',
      label: 'address',
      required: false,
      validators: [],
    }, {
      type: 'textarea',
      label: 'description',
      required: false,
      validators: [],
    }
  ];

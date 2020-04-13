import { Validators } from '@angular/forms';

export const subjectConfig = [
    {
      type: 'text',
      label: 'subjectName',
      required: true,
      validators: [Validators.pattern(/^[A-Za-zА-яа-я\s]+$/), Validators.required],
    }, {
      type: 'text',
      label: 'teacher',
      required: true,
      validators: [Validators.pattern(/^[A-Za-zА-яа-я\s]+$/), Validators.required],
    }, {
      type: 'number',
      label: 'cabinet',
      required: false,
      validators: [Validators.min(0)],
    }, {
      type: 'textarea',
      label: 'description',
      required: false,
      validators: [],
    },
  ];

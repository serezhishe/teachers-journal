import { Component, OnInit } from '@angular/core';
import { IFormConfig } from 'src/app/shared/models/form-config.model';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent implements OnInit {
  public formConfigs: IFormConfig[];
  constructor() {
    this.formConfigs = [
      {
        type: 'text',
        label: 'subject',
        required: true,
      }, {
        type: 'text',
        label: 'teacher',
        required: true,
      }, {
        type: 'number',
        label: 'cabinet',
        required: false,
      }, {
        type: 'textarea',
        label: 'description',
        required: false,
      }
    ];
  }
  public ngOnInit(): void {
  }

}

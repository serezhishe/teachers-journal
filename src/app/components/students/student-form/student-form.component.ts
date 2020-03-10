import { Component, OnInit } from '@angular/core';
import { IFormConfig } from 'src/app/shared/models/form-config.model';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  public formConfigs: IFormConfig[];
  constructor() {
    this.formConfigs = [
      {
        type: 'text',
        label: 'name',
        required: true,
      }, {
        type: 'text',
        label: 'last name',
        required: true,
      }, {
        type: 'text',
        label: 'address',
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

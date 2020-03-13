import { Component, OnInit } from '@angular/core';
import { IFormConfig } from 'src/app/shared/models/form-config.model';

import { StudentsService } from './../../../common/services/students.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  public formConfigs: IFormConfig[];
  constructor(private readonly studentsService: StudentsService) {}

  public ngOnInit(): void {
    this.formConfigs = [
      {
        type: 'text',
        label: 'name',
        required: true,
      }, {
        type: 'text',
        label: 'lastName',
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
  public onAdd(event): void {
    this.studentsService.addStudent(event);
  }
}

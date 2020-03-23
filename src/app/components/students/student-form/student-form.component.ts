import { Component, OnInit } from '@angular/core';
import { IStudent } from 'src/app/common/models/student.model';

import { studentConfig } from '../../../common/configs/student-form.config';
import { IFormConfig } from '../../../common/models/form-config.model';

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
    this.formConfigs = studentConfig;
  }
  public onAdd(student: IStudent): void {
    this.studentsService.addStudent(student);
  }
}

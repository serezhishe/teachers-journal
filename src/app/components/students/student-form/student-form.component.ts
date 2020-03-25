import { Component, OnInit } from '@angular/core';

import { studentConfig } from '../../../common/configs';
import { IFormConfig, IStudent } from '../../../common/models';
import { StudentsService } from '../../../common/services/students.service';
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

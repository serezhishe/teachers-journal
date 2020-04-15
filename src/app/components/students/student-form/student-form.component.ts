import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { studentConfig } from '../../../common/constants';
import { IFormConfig, IStudent } from '../../../common/models';
import { StudentsService } from '../../../common/services/students.service';
import { FormComponent } from '../../../shared/components/form/form.component';
@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  @ViewChild(FormComponent) public form: { canDeactivate(): Observable<boolean> | Promise<boolean> | boolean };
  public formConfigs: IFormConfig[];
  constructor(private readonly studentsService: StudentsService) {}

  public ngOnInit(): void {
    this.formConfigs = studentConfig;
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.form.canDeactivate();
  }

  public onAdd(student: IStudent): void {
    this.studentsService.addStudent(student);
  }
}

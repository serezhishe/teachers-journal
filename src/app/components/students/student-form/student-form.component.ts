import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild(FormComponent)
  public form: { canDeactivate(): Observable<boolean> | boolean };
  public formConfigs: IFormConfig[];
  constructor(private readonly studentsService: StudentsService, private readonly router: Router, private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.formConfigs = studentConfig;
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.form.canDeactivate();
  }

  public onAdd(student: IStudent): void {
    this.studentsService.addStudent(student);
    this.router.navigate(['../'], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }
}

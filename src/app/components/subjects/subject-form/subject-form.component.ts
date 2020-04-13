import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { subjectConfig } from '../../../common/configs';
import { IFormConfig, ISubjectInfo } from '../../../common/models';
import { SubjectsService } from '../../../common/services/subjects.service';
import { FormComponent } from '../../../shared/components/form/form.component';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent implements OnInit {
  @ViewChild(FormComponent) public form: { canDeactivate(): Observable<boolean> | Promise<boolean> | boolean};
  public formConfigs: IFormConfig[];
  constructor(private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
    this.formConfigs = subjectConfig;
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.form.canDeactivate();
  }

  public onAdd(subject: ISubjectInfo): void {
    this.subjectsService.addSubject(subject);
  }
}

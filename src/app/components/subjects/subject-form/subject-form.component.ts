import { Component, OnInit } from '@angular/core';

import { subjectConfig } from '../../../common/configs';
import { IFormConfig, ISubjectInfo } from '../../../common/models';
import { SubjectsService } from '../../../common/services/subjects.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent implements OnInit {
  public formConfigs: IFormConfig[];
  constructor(private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
    this.formConfigs = subjectConfig;
  }

  public onAdd(subject: ISubjectInfo): void {
    this.subjectsService.addSubject(subject);
  }
}

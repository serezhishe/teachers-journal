import { Component, OnInit } from '@angular/core';
import { IFormConfig } from 'src/app/shared/models/form-config.model';

import { SubjectsService } from './../../../common/services/subjects.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent implements OnInit {
  public formConfigs: IFormConfig[];
  constructor(private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
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

  public onAdd(event): void {
    this.subjectsService.addSubject(event.subject, event.teacher);
  }
}

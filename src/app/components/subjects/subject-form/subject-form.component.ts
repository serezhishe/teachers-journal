import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

import { subjectConfig } from '../../../common/constants';
import { IFormConfig, ISubjectInfo } from '../../../common/models';
import { SubjectsService } from '../../../common/services/subjects.service';
import { FormComponent } from '../../../shared/components/form/form.component';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss'],
})
export class SubjectFormComponent implements OnInit {
  @ViewChild(FormComponent)
  public form: { canDeactivate(): Observable<boolean> | boolean };
  public formConfigs: IFormConfig[];
  constructor(private readonly subjectsService: SubjectsService, private readonly router: Router, private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.formConfigs = subjectConfig;
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.form.canDeactivate();
  }

  public onAdd(subject: ISubjectInfo): void {
    this.subjectsService.addSubject(subject);
    this.subjectsService
      .getSubjectList()
      .pipe(skip(1))
      .subscribe(_ =>
        this.router.navigate([`../subject/${subject.subjectName}`], { relativeTo: this.route, queryParamsHandling: 'preserve' }),
      );
  }
}

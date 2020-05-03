import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { dateInputFormat, subjectTableColumns } from '../../../common/constants';
import { TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { duplicateDateValidator } from '../../../common/helpers/validators';
import { IStudentMarks, ISubjectFormGroup, ISubjectPage } from '../../../common/models';
import { PopUpService } from '../../../common/services/pop-up.service';
import { SubjectsService } from '../../../common/services/subjects.service';

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.scss'],
})
export class SubjectTableComponent implements OnInit {
  public error$: Observable<string>;
  public displayedColumns: string[];
  public subjectName: string;
  public tableData$: Observable<IStudentMarks[]>;
  public datesHeaders: string[];
  public teacher: string;
  public form: any; // not FormGroup because of *ngIf="form.controls.dates.controls[i].errors" which gives error at compilation phase

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly subjectsService: SubjectsService,
    private readonly translate: TranslateService,
    private readonly popUpService: PopUpService,
  ) {}

  private createFormGroup(subjectPage: ISubjectPage, studentMarks: IStudentMarks[]): FormGroup {
    const subjectFormGroup: ISubjectFormGroup = {
      marks: undefined,
      dates: undefined,
      teacher: undefined,
    };
    subjectFormGroup.teacher = new FormControl(this.teacher, [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-я\s]+$/)]);
    subjectFormGroup.dates = this.formBuilder.array(
      subjectPage.dates.map(elem => new FormControl(moment(elem), [duplicateDateValidator()])),
    );
    const markGroup = {};
    studentMarks.forEach(element => {
      markGroup[element.student._id] = this.formBuilder.array(this.datesHeaders.map((_, i) => new FormControl(element.marks[i])));
    });
    subjectFormGroup.marks = this.formBuilder.group(markGroup);

    return this.formBuilder.group(subjectFormGroup);
  }

  public ngOnInit(): void {
    this.error$ = this.subjectsService.error$;
    this.subjectName = this.route.snapshot.params.subject;
    this.tableData$ = this.subjectsService.getSubject(this.subjectName).pipe(
      map((subjectPage: ISubjectPage & { error: string }) => {
        this.teacher = subjectPage.teacher;
        this.datesHeaders = subjectPage.dates.map(date => moment(date).format(dateInputFormat));
        this.displayedColumns = [subjectTableColumns.name, subjectTableColumns.lastName, subjectTableColumns.averageMark];
        const sortedDateHeaders = subjectPage.dates.sort().map(date => moment(date).format(dateInputFormat));
        this.displayedColumns.push(...sortedDateHeaders);
        const dataSource = this.subjectsService.getDataSource();
        this.form = this.createFormGroup(subjectPage, dataSource);

        return dataSource;
      }),
    );
  }

  public sortData(sort: Sort, tableData: IStudentMarks[]): void {
    if (this.datesHeaders.includes(sort.active)) {
      sort.active = `marks.${this.datesHeaders.indexOf(sort.active)}`;
    } else {
      sort.active = sort.active === 'averageMark' ? sort.active : `student.${sort.active}`;
    }
    this.tableData$ = merge(this.tableData$, of(TableSortHelper.sortData(sort, tableData)));
  }

  public onSubmit(newData: Partial<ISubjectPage>): void {
    if (this.form.invalid) {
      this.translate.get('app.subjects.tableError').subscribe(translation => {
        this.popUpService.errorMessage(translation);
      });

      return;
    }
    this.subjectsService.updateCurrentSubject(newData);
  }

  public deleteDate(dateIndex: number): void {
    this.subjectsService.deleteDate(dateIndex);
  }

  public addDate(): void {
    this.subjectsService.createDate();
  }

  public cancelEvent(event: MouseEvent): void {
    event.stopImmediatePropagation();
  }

  public deleteStudent(studentId: string): void {
    this.subjectsService.removeStudentFromSubject(studentId);
  }

  public cancelChanges(): void {
    this.subjectsService.loadSubject(this.subjectName);
  }
}

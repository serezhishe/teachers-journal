import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { dateInputFormat, subjectTableColumns } from '../../../common/constants';
import { TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { duplicateDateValidator } from '../../../common/helpers/validators';
import { IStudentMarks, ISubjectInfo, ISubjectPage } from '../../../common/models';
import { SubjectsService } from '../../../common/services/subjects.service';

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.scss'],
})
export class SubjectTableComponent implements OnInit, OnDestroy {
  public displayedColumns: string[];
  public subjectName: string;
  public subjectID: string;
  public tableData: IStudentMarks[];
  public datesHeaders: string[];
  public teacher: string;
  public subjectGroup: { dates: FormArray; marks: FormGroup; teacher: FormControl };
  public form: any;
  public loaded: boolean;
  public subscription: Subscription;
  public subs: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly subjectsService: SubjectsService
  ) {}

  private createFormGroup(subjectPage: ISubjectPage & ISubjectInfo): FormGroup {
    this.subjectGroup = {
      marks: undefined,
      dates: undefined,
      teacher: undefined,
    };
    this.subjectGroup.teacher = new FormControl(this.teacher, [Validators.required, Validators.pattern(/^[A-Za-zА-яа-я\s]+$/)]);
    this.subjectGroup.dates = this.formBuilder.array(
      subjectPage.dates.map(elem => new FormControl(moment(elem), [duplicateDateValidator()]))
    );
    const tmp = {};
    this.tableData.forEach(element => {
      tmp[element.student._id] = this.formBuilder.array(this.datesHeaders.map((_, i) => new FormControl(element.marks[i])));
    });
    this.subjectGroup.marks = this.formBuilder.group(tmp);

    return this.formBuilder.group(this.subjectGroup);
  }

  public ngOnInit(): void {
    this.subjectName = this.route.snapshot.params.subject;
    this.loaded = false;
    this.subscription = this.subjectsService.getSubject(this.subjectName).subscribe(subjectPage => {
      this.teacher = subjectPage.teacher;

      this.datesHeaders = subjectPage.dates.map(date => moment(date).format(dateInputFormat));
      this.displayedColumns = subjectTableColumns.concat(this.datesHeaders);
      this.tableData = this.subjectsService.getDataSource();
      this.form = this.createFormGroup(subjectPage);
      this.loaded = true;
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public sortData(sort: Sort): void {
    sort.active = sort.active === 'averageMark' ? sort.active : `student.${sort.active}`;
    this.tableData = TableSortHelper.sortData(sort, this.tableData);
  }

  public onSubmit(newData: Partial<ISubjectInfo & ISubjectPage>): void {
    if (this.form.invalid) {
      alert('There are some mistakes. Check again, please.');

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

  public deleteStudent(studentID: string): void {
    this.subjectsService.removeStudentFromSubject(studentID);
  }
}

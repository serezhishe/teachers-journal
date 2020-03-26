import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';

import { dateInputFormat, subjectTableColumns } from '../../../common/constants';
import { TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { duplicateDateValidator } from '../../../common/helpers/validators';
import { IStudentMarks } from '../../../common/models';
import { SubjectsService } from '../../../common/services/subjects.service';

const MAX_MARK = 10;

@Component({
  selector: 'app-subjects-table',
  templateUrl: './subjects-table.component.html',
  styleUrls: ['./subjects-table.component.scss'],
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public displayedColumns: string[];
  public subjectName: string;
  public subjectID: string;
  public tableData: IStudentMarks[];
  public datesHeaders: string[];
  public teacher: string;
  public marksGroup: { dates: FormArray; marks: FormGroup; teacher: FormControl };
  public form: any;
  public loaded: boolean;
  public subscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly subjectsService: SubjectsService
  ) {
  }

  public ngOnInit(): void {
    this.subjectID = this.route.snapshot.params.subject;
    this.loaded = false;
    this.subscription = this.subjectsService.getSubjectInfo(this.subjectID).subscribe((subjectInfo) => {
      this.subjectName = subjectInfo.name;
      this.teacher = subjectInfo.teacher;
      this.displayedColumns = subjectTableColumns.concat();
      this.datesHeaders = this.subjectsService.getDateHeaders().map((elem) => {
        this.displayedColumns.push(elem.format(dateInputFormat));

        return elem.format(dateInputFormat);
      });
      const dataSourceSubscription = this.subjectsService.getDataSource().subscribe((data) => {
        this.tableData = data;
        this.marksGroup = {
        dates: this.formBuilder.array(
          this.subjectsService.getDateHeaders().map((elem) => new FormControl(elem, [duplicateDateValidator()]))
        ),
        marks: undefined,
        teacher: new FormControl(this.teacher, [Validators.required, Validators.pattern(/^[A-Za-zА-яа-я\s]+$/)]),
        };
        const tmp = {};
        this.tableData.forEach((element) => {
          tmp[element.student._id] = this.formBuilder.array(
            this.datesHeaders.map((_, i) => new FormControl(element.marks[i], [
              Validators.pattern(/^[0-9]/), Validators.min(0), Validators.max(MAX_MARK),
            ])));
        });
        this.marksGroup.marks = this.formBuilder.group(tmp);
        this.loaded = true;
        this.form = this.formBuilder.group(this.marksGroup);
        dataSourceSubscription.unsubscribe();
      });
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public sortData(sort: Sort): void {
    sort.active = sort.active === 'averageMark' ? sort.active : `student.${sort.active}`;
    this.tableData = TableSortHelper.sortData(sort, this.tableData);
  }

  public onSubmit(newData: { teacher: string; dates: moment.Moment[]; marks: Map<string, number[]> }): void {
    if (this.form.invalid) {
      alert('There are some mistakes. Check again, please.');

      return;
    }
    this.subjectsService.updateSubject(this.subjectID, newData);
  }

  public deleteDate(dateIndex: number) {
    this.subjectsService.deleteDate(dateIndex);
  }

  public addDate(): void {
    const date = this.subjectsService.addDate();
    this.datesHeaders.push(date.format(dateInputFormat));
    this.displayedColumns.push(date.format(dateInputFormat));
    this.marksGroup.dates.push(new FormControl(date));
    // (this.form as FormGroup).
    (this.form as FormGroup).removeControl('dates');
    (this.form as FormGroup).registerControl('dates', this.marksGroup.dates);
    const tmp = {};
    this.tableData.forEach((element) => {
          tmp[element.student._id] = this.formBuilder.array(
            this.datesHeaders.map((_, i) => new FormControl(element.marks[i], [
              Validators.pattern(/^[0-9/-]/), Validators.min(0), Validators.max(MAX_MARK),
            ])));
        });
    (this.form as FormGroup).removeControl('marks');
    (this.form as FormGroup).registerControl('marks', this.formBuilder.group(tmp));
    this.marksGroup.marks = this.formBuilder.group(tmp);
    console.log(this.form);
    // this.form = this.formBuilder.group(this.marksGroup);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { dateInputFormat } from '../../../common/constants';
import { TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { duplicateDateValidator } from '../../../common/helpers/validators';
import { IStudentMarks } from '../../../common/models/subject-marks.model';
import { SubjectsService } from '../../../common/services/subjects.service';

const MAX_MARK = 10;
const baseDisplayedColumns = ['name', 'lastName', 'averageMark'];

@Component({
  selector: 'app-subjects-table',
  templateUrl: './subjects-table.component.html',
  styleUrls: ['./subjects-table.component.scss'],
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public displayedColumns: string[];
  public subject: string;
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
  ) {}

  public ngOnInit(): void {
    this.subject = this.route.snapshot.params.subject;
    this.loaded = false;
    this.subscription = this.subjectsService.getSubjectInfo(this.subject).subscribe((subjectInfo) => {
      this.teacher = subjectInfo.teacher;
      this.displayedColumns = baseDisplayedColumns.concat();
      this.datesHeaders = this.subjectsService.getDataHeaders().map((elem) => {
        this.displayedColumns.push(elem.format(dateInputFormat));

        return elem.format(dateInputFormat);
      });
      const subscription = this.subjectsService.getDataSource().subscribe((data) => {
        this.tableData = data;
        this.marksGroup = {
        dates: this.formBuilder.array(
          this.subjectsService.getDataHeaders().map((elem) => new FormControl(elem, [duplicateDateValidator()]))
        ),
        marks: undefined,
        teacher: new FormControl(this.teacher, [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
        };
        const tmp = {};
        this.tableData.forEach((element) => {
          tmp[element.student._id] = this.formBuilder.array(
            this.datesHeaders.map((_, i) => new FormControl(element.marks[i], [
              Validators.pattern(/^[0-9/-]/), Validators.min(0), Validators.max(MAX_MARK),
            ])));
        });
        this.marksGroup.marks = this.formBuilder.group(tmp);
        this.form = this.formBuilder.group(this.marksGroup);
        this.loaded = true;
        subscription.unsubscribe();
      });
  });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public sortData(sort: Sort): void {
    sort.active = sort.active === 'averageMark' ? sort.active : `student.${sort.active}`;
    const sortedData = TableSortHelper.sortData(sort, this.tableData);
    this.tableData = sortedData;
  }

  public onSubmit(newData: { teacher: string; dates: moment.Moment[]; marks: any }): void {
    if (this.form.invalid) {
      alert('There are some mistakes. Check again, please.');

      return;
    }
    this.subjectsService.updateSubject(this.subject, newData);
  }

  public addDate(): void {
    const date = this.subjectsService.addDate();
    this.datesHeaders.push(date.format(dateInputFormat));
    this.displayedColumns.push(date.format(dateInputFormat));
    this.marksGroup.dates.push(new FormControl(date));
    const tmp = {};
    this.tableData.forEach((element) => {
          tmp[element.student._id] = this.formBuilder.array(
            this.datesHeaders.map((_, i) => new FormControl(element.marks[i], [
              Validators.pattern(/^[0-9/-]/), Validators.min(0), Validators.max(MAX_MARK),
            ])));
        });
    this.marksGroup.marks = this.formBuilder.group(tmp);
    this.form = this.formBuilder.group(this.marksGroup);
  }
}

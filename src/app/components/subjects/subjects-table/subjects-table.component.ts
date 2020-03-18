import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { DATE_FORMATS } from '../../../common/constants';
import { isStudentsArray, TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { IStudentMarks } from '../../../common/models/subject-marks.model';
import { SubjectsService } from '../../../common/services/subjects.service';

const MAX_MARK = 10;

@Component({
  selector: 'app-subjects-table',
  templateUrl: './subjects-table.component.html',
  styleUrls: ['./subjects-table.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
    },
    MatDatepicker,
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
  ],
})
export class SubjectsTableComponent implements OnInit {
  public displayedColumns: string[];
  public subject: string;
  public tableData: IStudentMarks[];
  public datesHeaders: string[];
  public teacher: string;
  public dateGroup: {dates: FormArray; marks: FormArray; teacher: FormControl};
  public form: FormGroup;

  constructor(
      private readonly route: ActivatedRoute, private readonly formBuilder: FormBuilder,
      private readonly subjectsService: SubjectsService,
    ) {}

  public ngOnInit(): void {
    this.subject = this.route.snapshot.params.subject;
    this.subjectsService.setCurrentSubject(this.subject);
    this.teacher = this.subjectsService.getTeacher();
    this.tableData = this.subjectsService.getDataSource();

    this.displayedColumns = ['name', 'lastName', 'averageMark'];
    this.datesHeaders = this.subjectsService.getDataHeaders().map((elem) => {
      this.displayedColumns.push(elem.format(DATE_FORMATS.parse.dateInput));

      return elem.format(DATE_FORMATS.parse.dateInput);
    });
    this.dateGroup = {
      dates: this.formBuilder.array(this.subjectsService.getDataHeaders().map((elem) => elem)),
      marks: this.formBuilder.array(this.tableData.map((element) =>
        this.formBuilder.array(this.datesHeaders.map((_, i) => element.marks[i]))
      ),                            [Validators.min(0), Validators.max(MAX_MARK)]),
      teacher: new FormControl(this.teacher, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]),
    };
    this.form = this.formBuilder.group(this.dateGroup);
  }

  public sortData(sort: Sort): void {
    const sortedData = TableSortHelper.sortData(sort, this.tableData);
    if (!isStudentsArray(sortedData)) {
      this.tableData = sortedData;
    }
  }

  public onSubmit(event: {teacher: string; dates: moment.Moment[]; marks: number[][]}): void {
    if (this.form.invalid) {
      return;
    }
    this.subjectsService.updateMarks(event.marks);
    this.subjectsService.updateTeacher(event.teacher);
    this.subjectsService.updateDates(event.dates);
    this.tableData = this.subjectsService.getDataSource();
  }

  public addDate(): void {
    const date = this.subjectsService.addDate();
    this.datesHeaders.push(date.format(DATE_FORMATS.parse.dateInput));
    this.displayedColumns.push(date.format(DATE_FORMATS.parse.dateInput));
    this.dateGroup.dates.push(new FormControl(date));
    this.dateGroup.marks = this.formBuilder.array(this.tableData.map((elem) =>
      this.formBuilder.array(this.datesHeaders.map((_, i) => elem.marks[i]))
    ));
    this.form = this.formBuilder.group(this.dateGroup);
  }

}

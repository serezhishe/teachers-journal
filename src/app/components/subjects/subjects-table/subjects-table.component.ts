import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { DATE_FORMATS } from '../../../common/constants';
import { SubjectsService } from '../../../common/services/subjects.service';
import { TableSortService } from '../../../common/services/table-sort.service';
import { IStudent } from '../../../shared/models/student.model';

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
  public tableData: Array<{marks: number[]; averageMark: number; student: IStudent}>;
  public datesHeaders: string[];
  public teacher: string;
  public dateGroup: {dates: FormArray; marks: FormArray; teacher: string};
  public form: FormGroup;

  constructor(private readonly route: ActivatedRoute, private readonly tableSortService: TableSortService,
              private readonly formBuilder: FormBuilder, private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
    this.subject = this.route.snapshot.params.subject;
    this.teacher = this.subjectsService.getTeacher(this.subject);
    this.tableData = this.subjectsService.getDataSource(this.subject);

    this.displayedColumns = ['name', 'lastName', 'averageMark'];
    this.datesHeaders = this.subjectsService.getDataHeaders(this.subject).map((elem) => {
      this.displayedColumns.push(elem.format(DATE_FORMATS.parse.dateInput));

      return elem.format(DATE_FORMATS.parse.dateInput);
    });
    this.dateGroup = {
      dates: this.formBuilder.array(this.subjectsService.getDataHeaders(this.subject).map((elem) => elem)),
      marks: this.formBuilder.array(this.tableData.map((elem) =>
        this.formBuilder.array(this.datesHeaders.map((element, i) => elem.marks[i]))
      )),
      teacher: this.teacher,
    };
    this.form = this.formBuilder.group(this.dateGroup);
  }

  public sortData(sort: Sort): void {
    this.tableData = this.tableSortService.sortData(sort, this.tableData);
  }

  public onSubmit(event: {teacher: string; dates: moment.Moment[]; marks: number[][]}): void {
    this.subjectsService.updateMarks(this.subject, event.marks);
    this.subjectsService.updateTeacher(this.subject, event.teacher);
    this.subjectsService.updateDates(this.subject, event.dates);
    this.tableData = this.subjectsService.getDataSource(this.subject);
  }

  public addDate(): void {
    const date = this.subjectsService.addDate(this.subject);
    this.datesHeaders.push(date.format(DATE_FORMATS.parse.dateInput));
    this.displayedColumns.push(date.format(DATE_FORMATS.parse.dateInput));
    this.dateGroup.dates.push(new FormControl(date));
    this.dateGroup.marks = this.formBuilder.array(this.tableData.map((elem) =>
      this.formBuilder.array(this.datesHeaders.map((_, i) => elem.marks[i]))
    ));
    this.form = this.formBuilder.group(this.dateGroup);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { DATE_FORMATS, marksList, students, subjectsEnum } from './../../../common/constants/';
import { TableSortService } from './../../../common/services/table-sort.service';
import { IStudent } from './../../../shared/models/student.model';

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
  public dataSource: Array<{marks: number[]; averageMark: number; student: IStudent}>;
  public datesHeaders: Array<{column: string; control: FormControl}>;
  public title: string;
  public teacher: string;
  public dateGroup = {};
  public form;

  constructor(private readonly route: ActivatedRoute, private readonly tableSortService: TableSortService,
              private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    const subject = this.route.snapshot.params.subject;
    this.title = subject;
    const subjectIndex = subjectsEnum[subject];
    this.teacher = marksList[subjectIndex].teacher;
    this.dataSource = marksList[subjectIndex].marks.map((elem, i) => {
        let tmp = elem.filter((value) => value !== undefined);
        if (tmp.length === 0) {
          tmp = [0];
        }

        return {
          marks: elem,
          averageMark: +(tmp.reduce((prev: number, curr: number) => prev + curr, 0) / tmp.length).toFixed(1),
          student: students[i],
        };
      });
    this.displayedColumns = ['name', 'lastName', 'averageMark'];
    this.datesHeaders = marksList[subjectsEnum[subject]].dates.map((elem) => {
        this.displayedColumns.push((new Date(elem)).toDateString());

        return {
          column: (new Date(elem)).toDateString(),
          control: new FormControl(moment(elem))
        };
      });
    this.datesHeaders.forEach((elem, i) => {
        this.dateGroup[`date${i}`] = elem.control;
      });
    // tslint:disable-next-line: no-string-literal
    this.dateGroup['teacher'] = this.teacher;
    this.form = this.formBuilder.group(this.dateGroup);
  }

  public sortData(sort: Sort): void {
    this.dataSource = this.tableSortService.sortData(sort, this.dataSource);
  }

  public onSubmit(event): void {
    const tmp = [];
    for (const key in event) {
      if (event.hasOwnProperty(key) && key !== 'teacher') {
        tmp.push(event[key]);
      }
    }
    console.log(tmp.map((el) => Date.parse(el)).sort((a, b) => a - b));
  }

  public log(e): void {
    console.log(new Date(e.target.value));
  }
}

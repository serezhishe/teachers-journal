import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { students, subjectsEnum } from './../../../common/constants/';
import { marks } from './../../../common/constants/marks';
import { TableSortService } from './../../../common/services/table-sort.service';
import { IStudent } from './../../../shared/models/student.model';

const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YY',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MMM YYYY',
  },
};

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
export class SubjectsTableComponent implements OnInit, OnDestroy {
  private subjectSubscription: Subscription;
  private subject$: Observable<string>;
  public displayedColumns: string[];
  public dataSource: Array<{marks; averageMark: number; student: IStudent}>;
  public datesHeaders;
  public title: string;
  public teacher: string;

  constructor(private readonly route: ActivatedRoute, private readonly tableSortService: TableSortService) {}

  public ngOnInit(): void {
    this.subject$ =  this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('subject')
    ));
    this.subjectSubscription = this.subject$.subscribe((subject) => {
      this.title = subject;
      const subjectIndex = subjectsEnum[subject];
      this.teacher = marks[subjectIndex].teacher;
      this.dataSource = marks[subjectIndex].marks.map((elem, i) => {
        let tmp = elem.filter((value) => value !== undefined);
        if (tmp.length === 0) {
          tmp = [0];
        }

        return {
          marks: elem,
          averageMark: +(tmp.reduce((prev, curr) => prev + curr, 0) / tmp.length).toFixed(1),
          student: students[i],
        };
      });
      this.displayedColumns = ['name', 'lastName', 'averageMark'];
      this.datesHeaders = marks[subjectsEnum[subject]].dates.map((elem) => {
        this.displayedColumns.push((new Date(elem)).toDateString());

        return {
          column: (new Date(elem)).toDateString(),
          control: new FormControl(moment(elem))
        };
      });
    });
  }

  public sortData(sort: Sort): void {
    this.dataSource = this.tableSortService.sortData(sort, this.dataSource);
  }

  public ngOnDestroy(): void {
    this.subjectSubscription.unsubscribe();
  }

  public onClick(event: Event): void {
    console.log(event);
  }

  public log(e): void {
    console.log(e.target.value.get('month'));
    console.log(e.target.value.get('date'));
    console.log(e);
  }
}

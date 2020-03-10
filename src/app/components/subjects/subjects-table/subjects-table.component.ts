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

constructor(private readonly route: ActivatedRoute) {}

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public ngOnInit(): void {
    this.subject$ =  this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('subject')
    ));
    this.subjectSubscription = this.subject$.subscribe((subject) => {
      this.title = subject;
      const subjectIndex = subjectsEnum[subject];
      this.teacher = marks[subjectIndex].teacher;
      this.dataSource = marks[subjectIndex].marks.map((elem, i) => {
        const tmp = elem.filter((value) => value !== undefined);

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
    const data = this.dataSource.slice();
    if (sort.active === undefined || sort.direction === '') {
      this.dataSource = data;

      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.student.name, b.student.name, isAsc);
        case 'lastName': return this.compare(a.student.lastName, b.student.lastName, isAsc);
        case 'averageMark': return this.compare(a.averageMark, b.averageMark, isAsc);
        default: return 0;
      }
    });
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

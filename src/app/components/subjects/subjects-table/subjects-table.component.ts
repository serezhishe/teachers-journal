import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { DATE_FORMATS } from './../../../common/constants/';
import { SubjectsService } from './../../../common/services/subjects.service';
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
  public subject: string;
  public dataSource: Array<{marks: number[]; averageMark: number; student: IStudent}>;
  public datesHeaders: string[];
  public teacher: string;
  public dateGroup;
  public marksGroup;
  public form: FormGroup;
  public marksForm: FormGroup;

  constructor(private readonly route: ActivatedRoute, private readonly tableSortService: TableSortService,
              private readonly formBuilder: FormBuilder, private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
    this.dateGroup = {};
    this.subject = this.route.snapshot.params.subject;
    this.teacher = this.subjectsService.getTeacher(this.subject);
    this.dataSource = this.subjectsService.getDataSource(this.subject);

    this.displayedColumns = ['name', 'lastName', 'averageMark'];
    this.datesHeaders = this.subjectsService.getDataHeaders(this.subject).map((elem) => {
      this.displayedColumns.push((new Date(elem)).toDateString());

      return (new Date(elem)).toDateString();
    });
    this.dateGroup.dates = this.formBuilder.array(this.subjectsService.getDataHeaders(this.subject).map((elem, i) =>
      this.formBuilder.group({
        [(new Date(elem)).toDateString()]: moment(elem)
      })));
    this.dateGroup.marks = this.formBuilder.array(this.dataSource.map((elem) => {
        const tmp = {};
        this.datesHeaders.forEach((element, i) => {
          tmp[element] = elem.marks[i];
        });

        return this.formBuilder.group(tmp);
      }
    ));
    this.dateGroup.teacher = this.teacher;
    this.form = this.formBuilder.group(this.dateGroup);
  }

  public sortData(sort: Sort): void {
    this.dataSource = this.tableSortService.sortData(sort, this.dataSource);
  }

  public onSubmit(event): void {
    this.subjectsService.updateTeacher(this.subject, event.teacher);
    this.subjectsService.updateDates(this.subject, event);
    console.log(event);
  }

  public log(e): void {
    console.log(new Date(e.target.value));
  }
}

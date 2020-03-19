import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { dateInputFormat } from '../../../common/constants';
import { isStudentsArray, TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { duplicateDateValidator } from '../../../common/helpers/validators';
import { IStudentMarks } from '../../../common/models/subject-marks.model';
import { SubjectsService } from '../../../common/services/subjects.service';

const MAX_MARK = 10;
const baseDisplayed = ['name', 'lastName', 'averageMark'];

@Component({
  selector: 'app-subjects-table',
  templateUrl: './subjects-table.component.html',
  styleUrls: ['./subjects-table.component.scss'],
})
export class SubjectsTableComponent implements OnInit {
  public displayedColumns: string[];
  public subject: string;
  public tableData: IStudentMarks[];
  public datesHeaders: string[];
  public teacher: string;
  public marksGroup: { dates: FormArray; marks: FormArray; teacher: FormControl };
  public form: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly subjectsService: SubjectsService
  ) {}

  public ngOnInit(): void {
    this.subject = this.route.snapshot.params.subject;
    this.subjectsService.setCurrentSubject(this.subject);
    this.teacher = this.subjectsService.getTeacher();
    this.tableData = this.subjectsService.getDataSource();

    this.displayedColumns = baseDisplayed;
    this.datesHeaders = this.subjectsService.getDataHeaders().map((elem) => {
      this.displayedColumns.push(elem.format(dateInputFormat));

      return elem.format(dateInputFormat);
    });
    this.marksGroup = {
      dates: this.formBuilder.array(this.subjectsService.getDataHeaders().map((elem) => new FormControl(elem, [duplicateDateValidator()]))),
      marks: this.formBuilder.array(
        this.tableData.map((element) =>
          this.formBuilder.array(
            this.datesHeaders.map((_, i) => new FormControl(element.marks[i], [Validators.min(0), Validators.max(MAX_MARK)]))
          )
        )
      ),
      teacher: new FormControl(this.teacher, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]),
    };
    this.form = this.formBuilder.group(this.marksGroup);
  }

  public sortData(sort: Sort): void {
    const sortedData = TableSortHelper.sortData(sort, this.tableData);
    if (!isStudentsArray(sortedData)) {
      this.tableData = sortedData;
    }
  }

  public onSubmit(newData: { teacher: string; dates: moment.Moment[]; marks: number[][] }): void {
    if (this.form.invalid) {
      return;
    }
    this.subjectsService.updateMarks(newData.marks);
    this.subjectsService.updateTeacher(newData.teacher);
    this.subjectsService.updateDates(newData.dates);
    this.tableData = this.subjectsService.getDataSource();
  }

  public addDate(): void {
    const date = this.subjectsService.addDate();
    this.datesHeaders.push(date.format(dateInputFormat));
    this.displayedColumns.push(date.format(dateInputFormat));
    this.marksGroup.dates.push(new FormControl(date));
    this.marksGroup.marks = this.formBuilder.array(
      this.tableData.map((elem) =>
        this.formBuilder.array(
          this.datesHeaders.map((_, i) => elem.marks[i]),
          [Validators.min(0), Validators.max(MAX_MARK)]
        )
      )
    );
    this.form = this.formBuilder.group(this.marksGroup);
  }
}

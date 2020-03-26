import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { combineLatest, Subscription } from 'rxjs';

import { studentTableColumns } from '../../../common/constants';
import { TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { IStudent } from '../../../common/models';
import { StudentsService } from '../../../common/services/students.service';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
})
export class StudentsTableComponent implements OnInit, OnDestroy {

  public displayedColumns: string[];
  public tableData: IStudent[];
  public loaded: boolean;
  public searchName: FormControl;
  public searchLastName: FormControl;
  public studentSubscription: Subscription;
  constructor(private readonly studentsService: StudentsService) {}

  public ngOnInit(): void {
    this.loaded = false;
    this.searchName = new FormControl();
    this.searchLastName = new FormControl();
    this.studentSubscription = combineLatest([
      this.studentsService.getStudents(),
      this.searchName.valueChanges,
      this.searchLastName.valueChanges,
    ]).pipe(
      distinctUntilChanged(),
      map(([students, name, lastname]) => students.filter((student) =>
        student.name.toLowerCase().includes(name) && student.lastName.toLowerCase().includes(lastname)))
    ).subscribe((students) => {
      this.tableData = students;
      this.loaded = true;
    });
    this.searchName.setValue('');
    this.searchLastName.setValue('');
    this.displayedColumns = studentTableColumns;
  }

  public sortData(sort: Sort): void {
    this.tableData = TableSortHelper.sortData(sort, this.tableData);
  }

  public ngOnDestroy(): void {
    this.studentSubscription.unsubscribe();
  }

  public delete(student: IStudent): void {
    this.studentsService.deleteStudent(student);
  }
}

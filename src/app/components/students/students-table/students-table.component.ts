import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { studentTableColumns } from '../../../common/constants/';
import { isStudentsArray, TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { IStudent } from '../../../common/models/student.model';
import { StudentsService } from '../../../common/services/students.service';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
})
export class StudentsTableComponent implements OnInit, OnDestroy {

  public displayedColumns: string[];
  public tableData: IStudent[];
  public loaded: boolean;
  public studentSubscription: Subscription;
  constructor(private readonly studentsService: StudentsService) {}

  public ngOnInit(): void {
    this.loaded = false;
    this.studentSubscription =  this.studentsService.getStudents().subscribe((students) => {
      this.tableData = students;
      this.loaded = true;
    });
    this.displayedColumns = studentTableColumns;
  }

  public sortData(sort: Sort): void {
    const sortedData = TableSortHelper.sortData(sort, this.tableData);
    if (isStudentsArray(sortedData)) {
      this.tableData = sortedData;
    }
  }

  public ngOnDestroy(): void {
    this.studentSubscription.unsubscribe();
  }
}

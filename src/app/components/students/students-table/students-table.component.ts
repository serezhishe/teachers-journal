import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';

import { studentTableColumns } from './../../../common/constants/';
import { StudentsService } from './../../../common/services/students.service';
import { TableSortService } from './../../../common/services/table-sort.service';
import { IStudent } from './../../../shared/models/student.model';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
})
export class StudentsTableComponent implements OnInit {

  public displayedColumns: string[];
  public dataSource: IStudent[];
  constructor(private readonly tableSortService: TableSortService, private readonly studentsService: StudentsService) {}

  public ngOnInit(): void {
    this.dataSource  = this.studentsService.getStudents();
    this.displayedColumns = studentTableColumns;
  }

  public sortData(sort: Sort): void {
    this.dataSource = this.tableSortService.sortData(sort, this.dataSource);
  }

}

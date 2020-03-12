import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';

import { students, studentTableColumns } from './../../../common/constants/';
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
  constructor(private readonly tableSortService: TableSortService) {}

  public ngOnInit(): void {
    this.dataSource  = students;
    this.displayedColumns = studentTableColumns;
  }

  public sortData(sort: Sort): void {
    this.dataSource = this.tableSortService.sortData(sort, this.dataSource);
  }

}

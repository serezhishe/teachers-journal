import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';

import { studentTableColumns } from '../../../common/constants/';
import { isStudentsArray, TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { IStudent } from '../../../common/models/student.model';
import { StudentsService } from '../../../common/services/students.service';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
})
export class StudentsTableComponent implements OnInit {

  public displayedColumns: string[];
  public tableData: IStudent[];
  constructor(private readonly studentsService: StudentsService) {}

  public ngOnInit(): void {
    this.tableData  = this.studentsService.getStudents();
    this.displayedColumns = studentTableColumns;
  }

  public sortData(sort: Sort): void {
    const sortedData = TableSortHelper.sortData(sort, this.tableData);
    if (isStudentsArray(sortedData)) {
      this.tableData = sortedData;
    }
  }

}

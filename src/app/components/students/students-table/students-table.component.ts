import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';

import { students, studentTableColumns } from './../../../common/constants/';
import { IStudent } from './../../../shared/models/student.model';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss']
})
export class StudentsTableComponent implements OnInit {

  public displayedColumns: string[];
  public dataSource: IStudent[];

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public ngOnInit(): void {
    this.dataSource  = students;
    this.displayedColumns = studentTableColumns;
  }

  public sortData(sort: Sort): void {
    const data = this.dataSource.slice();
    if (sort.active === undefined || sort.direction === '') {
      this.dataSource = data;

      return;
    }

    this.dataSource = data.sort((a: IStudent, b: IStudent) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'index': return this.compare(a.index, b.index, isAsc);
        case 'lastName': return this.compare(a.lastName, b.lastName, isAsc);
        case 'address': return this.compare(a.address, b.address, isAsc);
        default: return 0;
      }
    });
  }

}

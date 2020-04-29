import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { studentTableColumns } from '../../../common/constants';
import { TableSortHelper } from '../../../common/helpers/table-sort.helper';
import { IStudent } from '../../../common/models';
import { StudentsService } from '../../../common/services/students.service';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.scss'],
})
export class StudentsTableComponent implements OnInit {
  public displayedColumns: string[];
  public tableData$: Observable<IStudent[]>;
  public searchName: FormControl;
  public searchLastName: FormControl;
  constructor(private readonly studentsService: StudentsService) {}

  public ngOnInit(): void {
    this.searchName = new FormControl();
    this.searchLastName = new FormControl();
    this.tableData$ = combineLatest([
      this.searchName.valueChanges.pipe(startWith('')),
      this.searchLastName.valueChanges.pipe(startWith('')),
    ]).pipe(
      switchMap(([name, lastName]) =>
        this.studentsService
          .getStudents()
          .pipe(
            map(students =>
              students.filter(student => student.name.toLowerCase().includes(name) && student.lastName.toLowerCase().includes(lastName)),
            ),
          ),
      ),
    );

    this.displayedColumns = [
      studentTableColumns.delete,
      studentTableColumns.index,
      studentTableColumns.name,
      studentTableColumns.lastName,
      studentTableColumns.address,
      studentTableColumns.description,
    ];
  }

  public sortData(sort: Sort, tableData: IStudent[]): void {
    this.tableData$ = merge(this.tableData$, of(TableSortHelper.sortData(sort, tableData)));
  }

  public cancelEvent(event: MouseEvent): void {
    event.stopImmediatePropagation();
  }

  public delete(student: IStudent): void {
    this.studentsService.deleteStudent(student);
  }
}

import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { IStudent } from 'src/app/shared/models/student.model';

@Injectable({
  providedIn: 'root',
})
export class TableSortService {
  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private flat(a) {
    if (a.student !== undefined) {
      return {...a.student, averageMark: a.averageMark};
    }

    return a;
  }

  private sort(a, b, params: {direction: string; active: string}): number {
    const isAsc = params.direction === 'asc';
    switch (params.active) {
      case 'name': return this.compare(a.name, b.name, isAsc);
      case 'index': return this.compare(a.index, b.index, isAsc);
      case 'lastName': return this.compare(a.lastName, b.lastName, isAsc);
      case 'address': return this.compare(a.address, b.address, isAsc);
      case 'averageMark': return this.compare(a.averageMark, b.averageMark, isAsc);
      default: return 0;
    }
  }

  public sortData(sort: Sort, dataSource) {
    const data = dataSource.slice();
    if (sort.active === undefined || sort.direction === '') {
      return data;
    }

    return data.sort((a, b) =>
      this.sort(this.flat(a), this.flat(b), sort));
  }
}

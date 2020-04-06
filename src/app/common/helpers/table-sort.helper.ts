import { Sort } from '@angular/material/sort';

type NumberOrString = number | string;

export class TableSortHelper {
  private static compare(a: NumberOrString, b: NumberOrString, isAsc: boolean): number {
    if (a === undefined || a === null) {
      return 1;
    }
    if (b === undefined || b === null) {
      return -1;
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * (isAsc ? 1 : -1);
    }
    if (typeof a === 'string' && typeof b === 'string') {
      return (a.toLowerCase() < b.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  private static sort<T>(a: T, b: T, params: { direction: string; active: string }): number {
    const isAsc = params.direction === 'asc';
    const aPropToCompare = params.active.split('.').reduce((prev, curr) => prev[curr], a);
    const bPropToCompare = params.active.split('.').reduce((prev, curr) => prev[curr], b);

    return TableSortHelper.compare(aPropToCompare, bPropToCompare, isAsc);
  }

  public static sortData<T>(sort: Sort, dataSource: T[]): T[] {
    const data = dataSource.slice();
    if (sort.active === undefined || sort.direction === '') {
      return data;
    }

    return data.sort((a: T, b: T) => TableSortHelper.sort(a, b, sort));
  }
}

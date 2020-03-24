import { Sort } from '@angular/material/sort';

import { IStudent } from '../models/student.model';
import { IStudentMarks } from '../models/subject-marks.model';

type NumberOrString = number | string;
type DataToSort = IStudentMarks | IStudent;

export function isStudentInterface(data: DataToSort): data is IStudent {
  return (data as IStudent).name !== undefined;
}

export function isStudentsArray(array: IStudentMarks[] | IStudent[]): array is IStudent[] {
  return (array as IStudent[])[0].name !== undefined;
}

export class TableSortHelper {
  private static compare(a: NumberOrString, b: NumberOrString, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private static sort(a: DataToSort, b: DataToSort, params: { direction: string; active: string }): number {
    const isAsc = params.direction === 'asc';
    const aPropToCompare = params.active.split('.').reduce((prev, curr) => prev[curr], a);
    const bPropToCompare = params.active.split('.').reduce((prev, curr) => prev[curr], b);

    return TableSortHelper.compare(aPropToCompare, bPropToCompare, isAsc);
  }

  public static sortData(sort: Sort, dataSource: IStudentMarks[] | IStudent[]): IStudentMarks[] | IStudent[] {
    const data = dataSource.slice();
    if (sort.active === undefined || sort.direction === '') {
      return data;
    }

    return data.sort((a: DataToSort, b: DataToSort) => TableSortHelper.sort(a, b, sort));
  }
}

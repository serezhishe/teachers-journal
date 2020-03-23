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

  private static sort(a: DataToSort, b: DataToSort, params: {direction: string; active: string}): number {
    const isAsc = params.direction === 'asc';
    if (isStudentInterface(a) && isStudentInterface(b)) {
      switch (params.active) {
        case 'name': return TableSortHelper.compare(a.name, b.name, isAsc);
        case 'index': return TableSortHelper.compare(a.index, b.index, isAsc);
        case 'lastName': return TableSortHelper.compare(a.lastName, b.lastName, isAsc);
        case 'address': return TableSortHelper.compare(a.address, b.address, isAsc);
        default: return 0;
      }
    }
    if (!isStudentInterface(a) && !isStudentInterface(b)) {
      switch (params.active) {
      case 'name': return TableSortHelper.compare(a.student.name, b.student.name, isAsc);
      case 'index': return TableSortHelper.compare(a.student.index, b.student.index, isAsc);
      case 'lastName': return TableSortHelper.compare(a.student.lastName, b.student.lastName, isAsc);
      case 'address': return TableSortHelper.compare(a.student.address, b.student.address, isAsc);
      case 'averageMark': return TableSortHelper.compare(a.averageMark, b.averageMark, isAsc);
      default: return 0;
    }
    }

  }

  public static sortData(sort: Sort, dataSource: IStudentMarks[] | IStudent[]): IStudentMarks[] | IStudent[] {
    const data = dataSource.slice();
    if (sort.active === undefined || sort.direction === '') {
      return data;
    }

    return data.sort((a: DataToSort, b: DataToSort) =>
      TableSortHelper.sort(a, b, sort));

  }
}

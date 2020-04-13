import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { BASE_URL } from '../constants/base-url';
import { IStudent } from '../models';

import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private readonly students$: BehaviorSubject<IStudent[]>;

  constructor(private readonly http: HttpClient, private readonly sessionStorageService: SessionStorageService) {
    this.students$ = new BehaviorSubject(undefined);
  }

  public getStudents(): Observable<IStudent[]> {
    this.http
      .get<IStudent[]>(`${BASE_URL}/students`)
      .pipe(take(1))
      .subscribe(students =>
        this.students$.next(
          students.map((student, index) => ({
            ...student,
            index,
          }))
        )
      );

    return this.students$.pipe(filter(students => students !== undefined));
  }

  public getCurrentStudents(): IStudent[] {
    return this.students$.value;
  }

  public addStudent(newStudent: IStudent): void {
    this.http
      .post<IStudent>(`${BASE_URL}/students`, newStudent)
      .pipe(take(1))
      .subscribe(response => {
        this.students$.next([
          ...this.students$.value,
          {
            ...response,
            index: this.students$.value.length,
          },
        ]);
      });
  }

  public deleteStudent(studentToDelete: IStudent): void {
    this.http
      .delete(`${BASE_URL}/students/${studentToDelete._id}`)
      .pipe(take(1))
      .subscribe(_ => {
        this.students$.next(this.sessionStorageService.getItem<IStudent[]>('students').map((elem, index) => ({ ...elem, index })));
      });
  }
}

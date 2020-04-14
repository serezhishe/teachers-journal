import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { BASE_URL } from '../constants/base-url';
import { IStudent } from '../models';

import { PopUpService } from './pop-up.service';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private readonly students$: BehaviorSubject<IStudent[]>;

  constructor(private readonly http: HttpClient, private readonly popUpService: PopUpService) {
    this.students$ = new BehaviorSubject(null);
  }

  public loadStudents(): void {
    this.http
      .get<IStudent[]>(`${BASE_URL}/students`)
      .pipe(take(1))
      .subscribe((students: IStudent[]) =>
        this.students$.next(
          students.map((student, index) => ({
            ...student,
            index,
          })),
        ),
      );
  }

  public getStudents(): Observable<IStudent[]> {
    if (!this.students$.value) {
      this.loadStudents();
    }

    return this.students$.pipe(filter((students: IStudent[]) => students !== undefined && students !== null));
  }

  public getCurrentStudents(): IStudent[] {
    return this.students$.value;
  }

  public addStudent(newStudent: IStudent): void {
    const tempId = `${Date.now()}`;
    this.students$.next([
      ...this.students$.value,
      {
        ...newStudent,
        _id: tempId,
        index: this.students$.value.length,
      },
    ]);
    this.http
      .post<IStudent>(`${BASE_URL}/students`, newStudent)
      .pipe(take(1))
      .subscribe((response: IStudent) => {
        this.popUpService.successMessage(`Student ${response.name} ${response.lastName} added to journal`);
        this.students$.next([
          ...this.students$.value.filter(student => student._id !== tempId),
          {
            ...response,
            index: this.students$.value.length - 1,
          },
        ]);
      });
  }

  public deleteStudent(studentToDelete: IStudent): void {
    this.students$.next([...this.students$.value.filter(student => student._id !== studentToDelete._id)]);
    this.http
      .delete(`${BASE_URL}/students/${studentToDelete._id}`)
      .pipe(take(1))
      .subscribe(_ => {
        this.popUpService.successMessage(`Student ${studentToDelete.name} ${studentToDelete.lastName} deleted from journal`);
      });
  }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, take } from 'rxjs/operators';

import { BASE_URL } from '../constants/base-url';
import { IStudent } from '../models';

import { PopUpService } from './pop-up.service';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private readonly students$: BehaviorSubject<IStudent[]>;
  public error$: BehaviorSubject<string>;

  constructor(
    private readonly http: HttpClient,
    private readonly popUpService: PopUpService,
    private readonly translate: TranslateService,
  ) {
    this.students$ = new BehaviorSubject(null);
    this.error$ = new BehaviorSubject(null);
  }

  public loadStudents(): void {
    this.error$.next(null);
    this.http
      .get<IStudent[]>(`${BASE_URL}/students`)
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          this.error$.next(error.statusText);

          return of(null);
        }),
      )
      .subscribe((students: IStudent[]) => {
        if (!students) {
          this.students$.next([]);

          return;
        }
        this.students$.next(
          students.map((student, index) => ({
            ...student,
            index,
          })),
        );
      });
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
        this.translate.get('app.students.studentAdded', response).subscribe(translation => {
          this.popUpService.successMessage(translation);
        });
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
        this.translate.get('app.students.studentDeleted', studentToDelete).subscribe(translation => {
          this.popUpService.successMessage(translation);
        });
      });
  }
}

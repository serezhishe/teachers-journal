import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, take } from 'rxjs/operators';

import { BASE_URL } from '../constants';
import { IStudent, IStudentMarks, ISubjectInfo, ISubjectPage } from '../models';

import { PopUpService } from './pop-up.service';
import { StudentsService } from './students.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private readonly currentSubject$: BehaviorSubject<ISubjectPage>;
  private readonly subjectsList$: BehaviorSubject<ISubjectInfo[]>;
  private readonly subjectIdList: Map<string, string>;
  public error$: BehaviorSubject<string>;

  constructor(
    private readonly studentsService: StudentsService,
    private readonly http: HttpClient,
    private readonly popUpService: PopUpService,
    private readonly translate: TranslateService,
  ) {
    this.currentSubject$ = new BehaviorSubject({} as ISubjectPage);
    this.subjectsList$ = new BehaviorSubject(null);
    this.subjectIdList = new Map();
    this.error$ = new BehaviorSubject(null);
  }

  private getAverageMark(marks: number[]): number {
    let definedMarks = marks.filter(value => value || value === 0);
    if (definedMarks.length === 0) {
      definedMarks = [0];
    }
    const result = +(definedMarks.reduce((sum, mark) => sum + mark, 0) / definedMarks.length).toFixed(1);

    return result;
  }

  private addSubjectToList(newSubject: ISubjectInfo): void {
    this.subjectIdList.set(newSubject.subjectName, newSubject._id);
    this.subjectsList$.next([...this.subjectsList$.value, newSubject]);
  }

  public loadSubject(subjectName: string): void {
    this.error$.next(null);
    const id = this.subjectIdList.get(subjectName);
    this.http
      .get<ISubjectPage>(`${BASE_URL}/subjects/${id}`)
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          this.error$.next(error.statusText);

          return of(error);
        }),
      )
      .subscribe((response: ISubjectPage) => {
        this.currentSubject$.next(response);
      });
  }

  public getSubject(subjectName: string): Observable<ISubjectPage> {
    this.loadSubject(subjectName);

    return this.currentSubject$.pipe(filter((subject: ISubjectPage) => subject?.subjectName === subjectName));
  }

  public updateCurrentSubject(newData: Partial<ISubjectPage>): void {
    const id = this.currentSubject$.value.subjectId;
    newData.marks = new Map(Object.entries(newData.marks));

    this.http
      .patch<ISubjectPage>(`${BASE_URL}/subjects/${id}`, { ...this.currentSubject$.value, ...newData }, { observe: 'response' })
      .pipe(take(1))
      .subscribe((response: HttpResponse<ISubjectPage>) => {
        this.currentSubject$.next(response.body);
      });
  }

  public createDate(): moment.Moment {
    const dates = this.currentSubject$.value.dates.concat();
    dates.sort();
    const date = moment(dates[dates.length - 1]).add(1, 'days');
    this.currentSubject$.value.dates.push(date.toISOString());
    this.currentSubject$.next(this.currentSubject$.value);

    return date;
  }

  public deleteDate(index: number): void {
    const dates = this.currentSubject$.value.dates;
    dates.splice(index, 1);
    this.currentSubject$.value.marks.forEach((marks, id) => {
      this.currentSubject$.value.marks.set(
        id,
        marks.filter((_, i) => i !== index),
      );
    });
    this.currentSubject$.next({
      ...this.currentSubject$.value,
      dates,
    });
  }

  public getDataSource(): IStudentMarks[] {
    const currentSubject = this.currentSubject$.value;
    const students = this.studentsService.getCurrentStudents();

    return students
      .filter((student: IStudent) => currentSubject.students.includes(student._id))
      .map((student: IStudent) => ({
        marks: currentSubject.marks.get(student._id),
        averageMark: this.getAverageMark(currentSubject.marks.get(student._id)),
        student,
      }));
  }

  public getSubjectList(): Observable<ISubjectInfo[]> {
    this.http
      .get<ISubjectInfo[]>(`${BASE_URL}/subjects`)
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          this.error$.next(error.statusText);

          return of(null);
        }),
      )
      .subscribe((response: ISubjectInfo[]) => {
        if (!response) {
          this.subjectsList$.next([]);

          return;
        }
        response.forEach((subjectInfo: ISubjectInfo) => this.subjectIdList.set(subjectInfo.subjectName, subjectInfo._id));
        this.subjectsList$.next(response);
      });

    return this.subjectsList$.pipe(filter((list: ISubjectInfo[]) => list !== undefined && list !== null));
  }

  public addSubject({ subjectName, teacher, cabinet, description }: ISubjectInfo): void {
    if (this.subjectsList$.value.map((subject: ISubjectInfo) => subject.subjectName.toLowerCase()).includes(subjectName.toLowerCase())) {
      this.translate.get('app.subjects.duplicateSubjects', { subjectName }).subscribe(translation => {
        this.popUpService.errorMessage(translation);
      });

      return;
    }
    const newSubject: ISubjectPage = {
      subjectName,
      dates: [moment().toISOString()],
      teacher,
      marks: new Map<string, number[]>(),
      cabinet,
      description,
      students: [],
    };
    this.studentsService.getCurrentStudents().map((student: IStudent) => {
      newSubject.marks.set(student._id, [null]);
      newSubject.students.push(student._id);
    });
    this.http
      .post<ISubjectInfo>(`${BASE_URL}/subjects`, newSubject)
      .pipe(take(1))
      .subscribe((response: ISubjectInfo) => {
        this.translate.get('app.subjects.subjectCreated', { subjectName: newSubject.subjectName }).subscribe(translation => {
          this.popUpService.successMessage(translation);
        });
        this.addSubjectToList(response);
      });
  }

  public deleteSubject(subjectId: string): void {
    this.http
      .delete(`${BASE_URL}/subjects/${subjectId}`)
      .pipe(take(1))
      .subscribe(() => {
        let subjectName: string;
        for (const [name, id] of this.subjectIdList) {
          if (id === subjectId) {
            subjectName = name;
          }
        }
        this.translate.get('app.subjects.subjectDeleted', { subjectName }).subscribe(translation => {
          this.popUpService.successMessage(translation);
        });
        this.subjectIdList.delete(this.subjectsList$.value.find((subject: ISubjectPage) => subject._id === subjectId).subjectName);
        this.subjectsList$.next([...this.subjectsList$.value.filter((subject: ISubjectPage) => subject._id !== subjectId)]);
      });
  }

  public removeStudentFromSubject(id: string): void {
    this.currentSubject$.next({
      ...this.currentSubject$.value,
      students: this.currentSubject$.value.students.filter((studentId: string) => studentId !== id),
    });
  }

  public updateSubjectNameRecord(subjectId: string, oldName: string, newName: string): void {
    this.subjectIdList.set(newName, subjectId);
    this.subjectIdList.delete(oldName);
  }

  public changeSubjectName(subjectId: string, newName: string): void {
    this.http
      .patch<ISubjectPage>(`${BASE_URL}/subjects/${subjectId}`, { subjectName: newName }, { observe: 'response' })
      .pipe(take(1))
      .subscribe();
  }
}

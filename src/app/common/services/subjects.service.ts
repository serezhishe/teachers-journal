import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { BASE_URL } from '../constants';
import { IStudentMarks, ISubjectInfo, ISubjectPage } from '../models';

import { StudentsService } from './students.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private readonly currentSubject$: BehaviorSubject<ISubjectPage & ISubjectInfo>;
  private readonly subjectsList$: BehaviorSubject<ISubjectInfo[]>;
  private subjectSubscription: Subscription;

  constructor(private readonly studentsService: StudentsService, private readonly http: HttpClient) {
    this.currentSubject$ = new BehaviorSubject(undefined);
    this.subjectsList$ = new BehaviorSubject(undefined);
    this.http
      .get<ISubjectInfo[]>(`${BASE_URL}/subjects`)
      .pipe(take(1))
      .subscribe(response => this.subjectsList$.next(response));
  }

  private getAverageMark(marks: number[]): number {
    let tmp = marks.filter(value => value || value === 0);
    if (tmp.length === 0) {
      tmp = [0];
    }

    return +(tmp.reduce((prev, curr) => prev + curr, 0) / tmp.length).toFixed(1);
  }

  private addSubjectToList(newSubject: ISubjectInfo): void {
    this.subjectsList$.next([...this.subjectsList$.value, newSubject]);
  }

  public getSubject(subjectName: string): Observable<ISubjectPage & ISubjectInfo> {
    this.subjectSubscription = this.getSubjects().subscribe(subjectList => {
      const subjectInfo = subjectList.find(subject => subject.name === subjectName);
      this.http
        .get<ISubjectPage>(`${BASE_URL}/subjects/${subjectInfo._id}`)
        .pipe(take(1))
        .subscribe(response => {
          this.currentSubject$.next({
            ...response,
            ...subjectInfo,
          });
        });
    });

    return this.currentSubject$.pipe(filter(subject => subject?.name === subjectName));
  }

  public updateCurrentSubject(newData: Partial<ISubjectPage | ISubjectInfo>): void {
    const id = this.currentSubject$.value.subjectID;

    if (
      JSON.stringify({
        ...this.currentSubject$.value,
        ...newData,
      }) === JSON.stringify(this.currentSubject$.value)
    ) {
      return;
    }
    this.http
      .patch<ISubjectPage | ISubjectInfo>(
        `${BASE_URL}/subjects/${id}`,
        { ...this.currentSubject$.value, ...newData },
        { observe: 'response' }
      )
      .pipe(take(1))
      .subscribe((response: HttpResponse<ISubjectPage | ISubjectInfo>) => {
        this.currentSubject$.next({
          ...this.currentSubject$.value,
          ...response.body,
        });
      });
  }

  public createDate(): moment.Moment {
    const dates = this.currentSubject$.value.dates;
    const date = moment(dates[dates.length - 1]).add(1, 'days');
    dates.push(date.toISOString());
    this.currentSubject$.next({
      ...this.currentSubject$.value,
      dates,
    });

    return date;
  }

  public clearSubject(): void {
    this.subjectSubscription.unsubscribe();
  }

  public deleteDate(index: number): void {
    const dates = this.currentSubject$.value.dates;
    dates.splice(index, 1);
    this.currentSubject$.next({
      ...this.currentSubject$.value,
      dates,
    });
  }

  public getDataSource(): IStudentMarks[] {
    const currentSubject = this.currentSubject$.value;
    const students = this.studentsService.getCurrentStudents();

    return students
      .filter(student => currentSubject.students.includes(student._id))
      .map(student => ({
        marks: currentSubject.marks[student._id],
        averageMark: this.getAverageMark(currentSubject.marks[student._id]),
        student,
      }));
  }

  public getSubjects(): Observable<ISubjectInfo[]> {
    return this.subjectsList$.pipe(filter(list => list !== undefined));
  }

  public addSubject({ name, teacher, cabinet, description }: ISubjectInfo): void {
    if (this.subjectsList$.value.map(subject => subject.name.toLowerCase()).includes(name.toLowerCase())) {
      alert('duplicate subject');

      return;
    }
    const tmp = {
      name,
      dates: [moment()],
      teacher,
      marks: new Map<string, number[]>(),
      cabinet,
      description,
      students: [],
    };
    this.studentsService.getCurrentStudents().map(student => {
      tmp.marks[student._id] = [];
      tmp.students.push(student._id);
    });
    this.http
      .post<ISubjectInfo>(`${BASE_URL}/subjects`, tmp)
      .pipe(take(1))
      .subscribe(response => {
        this.addSubjectToList(response);
      });
  }

  public deleteSubject(subjectID: string): void {
    this.http
      .delete(`${BASE_URL}/subjects/${subjectID}`)
      .pipe(take(1))
      .subscribe(() => {
        this.subjectsList$.next([...this.subjectsList$.value.filter(subject => subject._id !== subjectID)]);
      });
  }

  public removeStudentFromSubject(id: string): void {
    this.currentSubject$.next({
      ...this.currentSubject$.value,
      students: this.currentSubject$.value.students.filter(studentID => studentID !== id),
    });
  }
}

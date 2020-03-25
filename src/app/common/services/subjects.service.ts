import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IStudent } from '../models/student.model';
import { ISubjectInfo } from '../models/subject-info.model';
import { IStudentMarks } from '../models/subject-marks.model';

import { SessionStorageService } from './session-storage.service';
import { StudentsService } from './students.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private currentSubject: ISubjectInfo;

  constructor(
      private readonly studentsService: StudentsService, private readonly sessionStorageService: SessionStorageService,
    ) {}

  private getAverageMark(marks: number[]): number {
    let tmp = marks.filter((value) => value || value ===  0);
    if (tmp.length === 0) {
      tmp = [0];
    }

    return +(tmp.reduce((prev, curr) => prev + curr, 0) / tmp.length).toFixed(1);
  }

  public getSubjectInfo(subject: string): Observable<ISubjectInfo> {
    return this.sessionStorageService.getItem(`subjects/${subject}`).pipe(
      tap((subjectInfo: ISubjectInfo) => {
        this.currentSubject = subjectInfo;
      })
    );
  }

  public updateSubject(subject: string, newData: any): void {
    this.sessionStorageService.updateItem(`subjects/${subject}`, newData);
  }

  public addDate(): moment.Moment {
    const dates = this.currentSubject.dates;
    const date = moment(dates[dates.length - 1]).add(1, 'days');
    dates.push(date);
    this.sessionStorageService.updateItem(`subjects/${this.currentSubject.name}`, {dates});

    return date;
  }

  public getDataSource(): Observable<IStudentMarks[]> {
    const marksArray = this.currentSubject.marks;

    return this.studentsService.getStudents().pipe(
      map((students) => students.map((student) => {
        marksArray[student._id] = marksArray[student._id] ? marksArray[student._id] : [];

        return {
          marks: marksArray[student._id],
          averageMark: this.getAverageMark(marksArray[student._id]),
          student,
        };
      })));
  }

  public getDateHeaders(): moment.Moment[] {
    return this.currentSubject.dates.map((elem) => moment(elem));
  }

  public getSubjects(): Observable<string[]> {
    return this.sessionStorageService.getItem('subjects').pipe(
        map((subjects: ISubjectInfo[]) =>
          subjects.map((elem) => elem.name))
      );
  }

  public addSubject({name, teacher, cabinet, description}: ISubjectInfo): void {
    const tmp = {
      name,
      dates: [moment()],
      teacher,
      marks: new Map<string, number[]>(),
      cabinet,
      description,
    };
    const subscription = this.studentsService.getStudents().subscribe((students: IStudent[]) => {
      students.forEach((student) => tmp.marks[student._id] = [undefined]);
      this.sessionStorageService.pushItem('subjects', tmp);
      subscription.unsubscribe();
    });
  }

  public deleteSubject(subject: string): void {
    this.sessionStorageService.deleteItem('subjects', subject);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

import { dateInputFormat } from '../constants';
import { ISubjectInfo } from '../models/subject-info.model';
import { IStudentMarks } from '../models/subject-marks.model';

import { SessionStorageService } from './session-storage.service';
import { StudentsService } from './students.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private currentSubject: ISubjectInfo;
  public subjects: string[];

  constructor(
      private readonly studentsService: StudentsService, private readonly sessionStorageService: SessionStorageService,
      private readonly http: HttpClient,
    ) {}

  private getAverageMark(marks: number[]): number {
    return +(marks.reduce((prev: number, curr: number) => prev + curr, 0) / marks.length).toFixed(1);
  }

  public getSubjectInfo(subject: string): Observable<any> {
    return this.sessionStorageService.getItem(`subjects/${subject}`).pipe(
      tap((subjectInfo) => {
        this.currentSubject = subjectInfo;
      })
    );
  }

  // public setCurrentSubject(subject: string): void {
  //   this.findSubjectInfo(subject).subscribe((subjectInfo) => {
  //     this.currentSubject = subjectInfo as ISubjectInfo;
  //   });
  // }

  public getTeacher(): string {
    return this.currentSubject.teacher;
  }

  public updateSubject(subject: string, newData: any): void {
    this.sessionStorageService.updateItem(`subjects/${subject}`, newData);
  }

  public updateTeacher(newValue: string): void {
    this.currentSubject.teacher = newValue;
  }

  public updateMarks(marks: Map<string, number[]>): void {
    this.currentSubject.marks = marks;
    this.sessionStorageService.setItem(this.currentSubject.name, JSON.stringify(this.currentSubject));
  }

  public updateDates(newDates: moment.Moment[]): void {
    let i = 0;
    const prevDates = this.currentSubject.dates;
    while (newDates[i] !== undefined) {
      prevDates[i] = newDates[i];
      i++;
    }
    this.sessionStorageService.setItem(this.currentSubject.name, JSON.stringify(this.currentSubject));
  }

  public addDate(): moment.Moment {
    const dates = this.currentSubject.dates;
    const date = moment(dates[dates.length - 1]).add(1, 'days');
    dates.push(date);
    // this.sessionStorageService.updateItem(`subjects/${this.currentSubject.name}`, {dates});

    return date;
  }

  public getDataSource(): Observable<IStudentMarks[]> {
    const marksArray = this.currentSubject.marks;

    return this.studentsService.getStudents().pipe(
      map((students) => students.map((student) => {
        marksArray[student._id] = marksArray[student._id] ? marksArray[student._id] : [];
        let tmp = marksArray[student._id].filter((value) => value || value ===  0);
        if (tmp.length === 0) {
          tmp = [0];
        }

        return {
          marks: marksArray[student._id],
          averageMark: this.getAverageMark(tmp),
          student,
        };
      })));
  }

  public getDataHeaders(): moment.Moment[] {
    return this.currentSubject.dates.map((elem) => moment(elem));
  }

  public getSubjects(): Observable <any> {
    return this.sessionStorageService.getItem('subjects').pipe(
        map((subjects) =>
          subjects.map((elem) => elem.name))
      );
  }

  public addSubject(subject: ISubjectInfo): void {
    const tmp = {
      name: subject.name,
      dates: [moment()],
      teacher: subject.teacher,
      marks: new Map<string, number[]>(),
    };
    const subscription = this.studentsService.getStudents().subscribe((students) => {
      students.forEach((student) => tmp.marks[student._id] = [undefined]);
      this.sessionStorageService.pushItem('subjects', tmp);
      subscription.unsubscribe();
    });
  }
}

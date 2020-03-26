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

  public getSubjectInfo(subjectID: string): Observable<ISubjectInfo> {
    return this.sessionStorageService.getItem(`subjects/${subjectID}`).pipe(
      tap((subjectInfo: ISubjectInfo) => {
        this.currentSubject = subjectInfo;
      })
    );
  }

  public updateSubject(subjectID: string, newData: Partial<ISubjectInfo>): void {
    this.sessionStorageService.updateItem(`subjects/${subjectID}`, newData);
  }

  public addDate(): moment.Moment {
    const dates = this.currentSubject.dates;
    const date = moment(dates[dates.length - 1]).add(1, 'days');
    dates.push(date);
    this.sessionStorageService.updateItem(`subjects/${this.currentSubject._id}`, {dates});

    return date;
  }

  public deleteDate(index: number): void {
    const dates = this.currentSubject.dates;
    dates.splice(index, 1);
    this.sessionStorageService.updateItem(`subjects/${this.currentSubject._id}`, {dates});
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

  public getSubjects(): Observable<Partial<ISubjectInfo>> {
    return this.sessionStorageService.getItem('subjects');
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

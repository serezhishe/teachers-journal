import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { IStudent } from './../../shared/models/student.model';
import { marksList } from './../constants/';
import { DATE_FORMATS } from './../constants/date-format';
import { StudentsService } from './students.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private readonly marksList: Array<{ subject: string; dates:  moment.Moment[]; teacher: string; marks: number[][] }>;
  constructor(private readonly studentsService: StudentsService) {
    this.marksList = marksList;
  }

  private getAverageMark(marks: number[]): number {
    return +(marks.reduce((prev: number, curr: number) => prev + curr, 0) / marks.length).toFixed(1);
  }

  private findSubjectInfo(subject: string): { subject: string; dates: moment.Moment[]; teacher: string; marks: number[][] } {
    return this.marksList.find((elem) => elem.subject === subject);
  }

  public getTeacher(subject: string): string {
    return this.findSubjectInfo(subject).teacher;
  }

  public updateTeacher(subject: string, newValue: string): void {
    this.findSubjectInfo(subject).teacher = newValue;
  }

  public updateMarks(subject: string, marks: number[][]): void {
    this.findSubjectInfo(subject).marks = marks;
  }

  public updateDates(subject: string, newDates: moment.Moment[]): void {
    let i = 0;
    const prevDates = this.findSubjectInfo(subject).dates;
    while (newDates[i] !== undefined) {
      prevDates[i] = newDates[i];
      i++;
    }
  }

  public addDate(subject: string): moment.Moment {
    const dates = this.findSubjectInfo(subject).dates;
    const date = moment(dates[dates.length - 1]).add(1, 'days');
    dates.push(date);

    return date;
  }

  public getDataSource(subject: string): Array<{marks: number[]; averageMark: number; student: IStudent}> {
    const marksArray = this.findSubjectInfo(subject).marks;

    return this.studentsService.getStudents().map((student, i) => {
      marksArray[i] = marksArray[i] ? marksArray[i] : [];
      let tmp = marksArray[i].filter((value) => value || value ===  0);
      if (tmp.length === 0) {
        tmp = [0];
      }

      return {
        marks: marksArray[i],
        averageMark: this.getAverageMark(tmp),
        student,
      };
    });
  }

  public getDataHeaders(subject: string): moment.Moment[] {
    return this.findSubjectInfo(subject).dates;
  }

  public getSubjects(): string[] {
    return this.marksList.map((elem) => elem.subject);
  }

  public addSubject(subject: string, teacher: string): void {
    this.marksList.push({
      subject,
      dates: [],
      teacher,
      marks: [],
    });
  }
}

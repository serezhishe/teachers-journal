import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import { marksList, students } from './../constants/';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private readonly marksList: Array<{ subject: string; dates: number[]; teacher: string; marks: number[][] }>;
  constructor() {
    this.marksList = marksList;
  }

  private findSubjectInfo(subject: string): { subject: string; dates: number[]; teacher: string; marks: number[][] } {
    return this.marksList.find((elem) => elem.subject === subject);
  }

  public getTeacher(subject: string): string {
    return this.findSubjectInfo(subject).teacher;
  }

  public updateTeacher(subject: string, newValue: string): void {
    this.findSubjectInfo(subject).teacher = newValue;
  }

  public updateDates(subject: string, newValues: number[]): void {
    let i = 0;
    while (newValues[i] !== undefined) {
      this.findSubjectInfo(subject).dates[i] = newValues[i];
      i++;
    }
  }

  public getDataSource(subject: string): any[] {
    return this.findSubjectInfo(subject).marks.map((elem, i) => {
      let tmp = elem.filter((value) => value !== undefined);
      if (tmp.length === 0) {
        tmp = [0];
      }

      return {
        marks: elem,
        averageMark: +(tmp.reduce((prev: number, curr: number) => prev + curr, 0) / tmp.length).toFixed(1),
        student: students[i],
      };
    });
  }

  public getDataHeaders(subject: string): Array<{column: string; control: FormControl}> {
    return this.findSubjectInfo(subject).dates.map((elem) =>
      ({
        column: (new Date(elem)).toDateString(),
        control: new FormControl(moment(elem))
      }));
  }

  public getSubjects(): string[] {
    return this.marksList.map((elem) => elem.subject);
  }

  public addSubject(subject: string, teacher: string): void {
    console.log(subject, teacher);
    this.marksList.push({
      subject,
      dates: [],
      teacher,
      marks: [],
    });
  }
}

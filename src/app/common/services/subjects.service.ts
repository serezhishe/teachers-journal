import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import { IStudent } from './../../shared/models/student.model';
import { marksList } from './../constants/';
import { StudentsService } from './students.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private readonly marksList: Array<{ subject: string; dates: number[]; teacher: string; marks: number[][] }>;
  constructor(private readonly studentsService: StudentsService) {
    this.marksList = marksList;
  }

  private getAverageMark(marks: number[]): number {
    return +(marks.reduce((prev: number, curr: number) => prev + curr, 0) / marks.length).toFixed(1);
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

  public getDataSource(subject: string): Array<{marks: number[]; averageMark: number; student: IStudent}> {
    const marksArray = this.findSubjectInfo(subject).marks;

    return this.studentsService.getStudents().map((student, i) => {
      marksArray[i] = marksArray[i] ? marksArray[i] : [];
      let tmp = marksArray[i].filter((value) => value !== undefined);
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

  public getDataHeaders(subject: string): Array<{column: string; control: FormControl}> {
    return this.findSubjectInfo(subject).dates.map((elem) => ({
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

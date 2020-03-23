import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { subjectsList } from '../constants';
import { marksList } from '../constants/';
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
    ) {
    this.subjects = JSON.parse(this.sessionStorageService.getItem('subjectsList'));
  }

  private getAverageMark(marks: number[]): number {
    return +(marks.reduce((prev: number, curr: number) => prev + curr, 0) / marks.length).toFixed(1);
  }

  private findSubjectInfo(subject: string): ISubjectInfo {
    return JSON.parse(this.sessionStorageService.getItem(subject));
  }

  public setCurrentSubject(subject: string): void {
    this.currentSubject = this.findSubjectInfo(subject);
  }

  public getTeacher(): string {
    return this.currentSubject.teacher;
  }

  public updateTeacher(newValue: string): void {
    this.currentSubject.teacher = newValue;
  }

  public updateMarks(marks: number[][]): void {
    this.currentSubject.marks = marks;
    this.sessionStorageService.setItem(this.currentSubject.subject, JSON.stringify(this.currentSubject));
  }

  public updateDates(newDates: moment.Moment[]): void {
    let i = 0;
    const prevDates = this.currentSubject.dates;
    while (newDates[i] !== undefined) {
      prevDates[i] = newDates[i];
      i++;
    }
    this.sessionStorageService.setItem(this.currentSubject.subject, JSON.stringify(this.currentSubject));
  }

  public addDate(): moment.Moment {
    const dates = this.currentSubject.dates;
    const date = moment(dates[dates.length - 1]).add(1, 'days');
    dates.push(date);
    this.sessionStorageService.setItem(this.currentSubject.subject, JSON.stringify(this.currentSubject));

    return date;
  }

  public getDataSource(): IStudentMarks[] {
    const marksArray = this.currentSubject.marks;

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

  public getDataHeaders(): moment.Moment[] {
    return this.currentSubject.dates.map((elem) => moment(elem));
  }

  public getSubjects(): string[] {
    this.subjects = JSON.parse(this.sessionStorageService.getItem('subjectsList'));

    return this.subjects;
  }

  public addSubject(subject: {subjectName: string; teacher: string; description?: string; cabinet?: number}): void {
    this.subjects.push(subject.subjectName);
    this.sessionStorageService.setItem(subject.subjectName, JSON.stringify({
      subject: subject.subjectName,
      dates: [],
      teacher: subject.teacher,
      marks: [],
    }));
    this.sessionStorageService.setItem('subjectsList', JSON.stringify(this.subjects));
  }
}

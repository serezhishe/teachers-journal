import { Injectable } from '@angular/core';

import { students } from '../constants';

import { IStudent } from './../../shared/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private readonly students: IStudent[];

  constructor() {
    this.students = students;
  }

  public getStudents(): IStudent[] {
    return this.students;
  }

  public addStudent(newStudent: {name: string; lastName: string; address?: string; description?: string}): void {
    this.students.push({...newStudent, index: this.students.length + 1});
  }
}

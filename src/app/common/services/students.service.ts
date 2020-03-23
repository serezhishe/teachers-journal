import { Injectable } from '@angular/core';

import { students } from '../constants';
import { IStudent } from '../models/student.model';

import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private readonly students: IStudent[];

  constructor(private readonly sessionStorageService: SessionStorageService) {
    this.students = JSON.parse(this.sessionStorageService.getItem('students'));
  }

  public getStudents(): IStudent[] {
    return this.students;
  }

  public addStudent(newStudent: {name: string; lastName: string; address?: string; description?: string}): void {
    this.students.push({...newStudent, index: this.students.length});
    this.sessionStorageService.setItem('students', JSON.stringify(this.students));
  }
}

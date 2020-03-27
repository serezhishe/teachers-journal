import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IStudent } from '../models';

import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private readonly sessionStorageService: SessionStorageService) {
  }

  public getStudents(): Observable<IStudent[]> {
    return this.sessionStorageService.getItem('students').pipe(
      map((students: IStudent[]) => students.map((student, index) => ({
        ...student,
        index,
      })))
    );
  }

  public addStudent(newStudent: IStudent): void {
    this.sessionStorageService.pushItem('students', newStudent);
  }

  public deleteStudent(studentToDelete: IStudent): void {
    this.sessionStorageService.deleteItem('students', studentToDelete._id);
  }
}

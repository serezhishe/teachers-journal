import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IStudent } from '../models/student.model';

import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private readonly sessionStorageService: SessionStorageService) {
  }

  public getStudents(): Observable<IStudent[]> {
    return this.sessionStorageService.getItem('students');
  }

  public addStudent(newStudent: IStudent): void {
    this.sessionStorageService.pushItem('students', newStudent);
  }

  public deleteStudent(studentToDelete: IStudent): void {
    this.sessionStorageService.deleteItem('students', studentToDelete._id);
  }
}

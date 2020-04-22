import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { BASE_URL } from '../constants';
import { IStudent } from '../models/student.model';

import { StudentsService } from './students.service';

fdescribe('StudentsService', () => {
  let service: StudentsService;
  const mockStudents: IStudent[] = [
    {
      description: 'good guy',
      address: 'Mira, 21',
      _id: '5e7ddaa1c8605615bcd8fccb',
      name: 'Evgeniy',
      lastName: 'Pashko',
    },
    {
      description: 'bad guy',
      address: 'Kolasa, 5',
      _id: '5e7ddb2dc8605615bcd8fccd',
      name: 'Alexandro',
      lastName: 'Smith',
    },
  ];
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TranslateService', ['get']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TranslateService, useValue: spy },
      ],
    });
    service = TestBed.inject(StudentsService);
    translateSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    translateSpy.get.and.returnValue(of('Mock string'));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getStudents should get data from backend, return observable', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const students$ = service.getStudents();
      expect(students$).toBeInstanceOf(Observable);
      students$.subscribe(students => {
        expect(students).toBeTruthy();
        expect(students.length).toEqual(2);
        expect(students.find(student => mockStudents[0]._id === student._id)).toBeTruthy();
        expect(students.find(student => mockStudents[1]._id === student._id)).toBeTruthy();
      });

      const request = httpMock.expectOne(`${BASE_URL}/students`);
      request.flush(mockStudents);
      httpMock.verify();
    }),
  ));

  it('getCurrentStudents should return last value of students', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const students$ = service.getStudents();
      students$.subscribe(students => {
        const currentStudents = service.getCurrentStudents();
        expect(JSON.stringify(currentStudents) === JSON.stringify(students)).toBeTrue();
      });

      const request = httpMock.expectOne(`${BASE_URL}/students`);
      request.flush(mockStudents);
      httpMock.verify();
    }),
  ));

  it('addStudent should add new student', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const students$ = service.getStudents();
      students$.subscribe();
      const req = httpMock.expectOne(`${BASE_URL}/students`);
      req.flush([]);

      service.addStudent(mockStudents[0]);
      const request = httpMock.expectOne(`${BASE_URL}/students`);
      expect(request.request.method).toEqual('POST');
      for (const key in request.request.body) {
        expect(request.request.body[key]).toEqual(mockStudents[0][key]);
      }
      request.flush(mockStudents[0]);
      httpMock.verify();
      students$.subscribe(students => {
        expect(students.length).toEqual(1);
        for (const key in students[0]) {
          if (key === 'index') {
            expect(students[0][key]).toEqual(0);
            continue;
          }
          expect(students[0][key]).toEqual(mockStudents[0][key]);
        }
      });
    }),
  ));

  it('deleteStudent should delete student', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const students$ = service.getStudents();
      students$.subscribe();
      const req = httpMock.expectOne(`${BASE_URL}/students`);
      req.flush(mockStudents);

      service.deleteStudent(mockStudents[0]);
      const request = httpMock.expectOne(`${BASE_URL}/students/${mockStudents[0]._id}`);
      expect(request.request.method).toEqual('DELETE');
      request.flush({});

      httpMock.verify();
      students$.subscribe(students => {
        expect(students.length).toEqual(1);
      });
    }),
  ));
});

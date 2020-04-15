import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { BASE_URL } from '../constants';
import { ISubjectInfo } from '../models/subject-info.model';
import { ISubjectPage } from '../models/subject-page.model';

import { SubjectsService } from './subjects.service';

fdescribe('SubjectsService', () => {
  let service: SubjectsService;
  const mockSubjects: ISubjectInfo[] = [
    {
      cabinet: 0,
      description: '',
      _id: '5e8b42164c0bbc3cd407f60b',
      subjectName: 'Some Subject',
      teacher: 'Elena',
    },
    {
      cabinet: 0,
      description: '',
      _id: '5e8c39db6b9406114097ac22',
      subjectName: 'Other Subject',
      teacher: 'Anna',
    },
  ];
  const oneMockSubject: ISubjectPage = {
    dates: ['2020-04-08T21:00:00.000Z', '2020-04-14T21:00:00.000Z', '2020-04-15T21:00:00.000Z', '2020-04-18T21:00:00.000Z'],
    students: ['5e956a5ad7cb440fb8490ce1', '5e957ed1d7cb440fb8490ce4', '5e9580f9d7cb440fb8490ce8', '5e958393d7cb440fb8490cef'],
    _id: '5e8b42164c0bbc3cd407f60b',
    marks: new Map(),
    subjectId: '5e8b42164c0bbc3cd407f60b',
    cabinet: 0,
    description: '',
    subjectName: 'Some Subject',
    teacher: 'Elena',
  };
  const mockSubjToAdd: ISubjectInfo = {
    cabinet: 123,
    description: '',
    _id: '5e8c830b6b9406114097ac2c',
    subjectName: 'Subject',
    teacher: 'Teacher',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSubjectList should get data from backend, return observable', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const subjects$ = service.getSubjectList();
      expect(subjects$).toBeInstanceOf(Observable);
      subjects$.subscribe(subjects => {
        expect(subjects.length).toEqual(2);
        for (const key in subjects[0]) {
          expect(subjects[0][key]).toEqual(mockSubjects[0][key]);
        }
      });

      const request = httpMock.expectOne(`${BASE_URL}/subjects`);
      request.flush(mockSubjects);
      httpMock.verify();
    }),
  ));

  it('addSubjectToList should immediately work for view', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const subjects$ = service.getSubjectList();
      subjects$.subscribe();
      const req = httpMock.expectOne(`${BASE_URL}/subjects`);
      req.flush(mockSubjects);

      // tslint:disable-next-line: no-string-literal
      service['addSubjectToList'](mockSubjToAdd);
      subjects$.subscribe(subjects => {
        expect(subjects.length).toEqual(3);
        for (const key in subjects[2]) {
          expect(subjects[2][key]).toEqual(mockSubjToAdd[key]);
        }
      });

      httpMock.expectNone(`${BASE_URL}/subjects`);
      httpMock.verify();
    }),
  ));

  it('getAverageMark calculate average of array', () => {
    // tslint:disable-next-line: no-string-literal
    expect(service['getAverageMark']([6, 4, 5, null, 5, null])).toEqual(5);
    // tslint:disable-next-line: no-string-literal
    expect(service['getAverageMark']([2, 3, 3])).toEqual(2.7);
    // tslint:disable-next-line: no-string-literal
    expect(service['getAverageMark']([null])).toEqual(0);
  });

  it('getSubject via input name get subject by id from server', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const subjects$ = service.getSubjectList();
      subjects$.subscribe();
      const req = httpMock.expectOne(`${BASE_URL}/subjects`);
      req.flush(mockSubjects);

      service.getSubject(mockSubjects[0].subjectName).subscribe(subject => {
        for (const key in subject) {
          expect(subject[key]).toEqual(mockSubjects[0][key]);
        }
      });

      const request = httpMock.expectOne(`${BASE_URL}/subjects/${mockSubjects[0]._id}`);
      request.flush(mockSubjects[0]);
      httpMock.verify();
    }),
  ));

  it('createDate add new date a day later after last existing on current subject', fakeAsync(
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      service.getSubjectList().subscribe();
      const req = httpMock.expectOne(`${BASE_URL}/subjects`);
      req.flush(mockSubjects);

      service.getSubject(oneMockSubject.subjectName).subscribe();

      const request = httpMock.expectOne(`${BASE_URL}/subjects/${oneMockSubject._id}`);
      request.flush(oneMockSubject);

      const lastDate = oneMockSubject.dates.concat().sort().pop();
      const newDate = service.createDate();
      expect(newDate).toBeInstanceOf(moment);
      expect(newDate.diff(moment(lastDate), 'days')).toEqual(1);
    }),
  ));
});

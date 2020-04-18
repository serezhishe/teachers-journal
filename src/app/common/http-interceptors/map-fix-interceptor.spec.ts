import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';

import { BASE_URL } from '../constants/base-url';

import { MapFixInterceptor } from './map-fix-interceptor';

const marksArray: Array<[string, number[]]> = [
  ['id1', [1, 2, 3]],
  ['id2', [2, 3, 4]],
  ['id3', [3, 4, 5]],
  ['id4', [4, 5, 6]],
];
const marksMap = new Map(marksArray);
const serverResponse = marksArray.reduce((prev, curr) => {
  prev[curr[0]] = curr[1];

  return prev;
}, {});

fdescribe('MapFixInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MapFixInterceptor,
          multi: true,
        },
      ],
    });
  });

  it('should parse es6 Map into array [[id: [mark, mark]], [id: [mark, mark]], ...]', fakeAsync(
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      http
        .post(`${BASE_URL}/subjects/`, {
          marks: new Map(marksArray),
        })
        .subscribe(res => expect(res).toBeTruthy());

      const request = httpMock.expectOne(req => JSON.stringify(req.body.marks) === JSON.stringify(marksArray));
      request.flush({ marks: marksArray });
      httpMock.verify();
    }),
  ));

  it('should parse array [[id: [mark, mark]], [id: [mark, mark]], ...] into es6 Map', fakeAsync(
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      http.get(`${BASE_URL}/subjects/id123`).subscribe((res: { marks: Map<string, number[]> }) => {
        let hasMistakes = false;
        res.marks.forEach((marks, id) => {
          if (JSON.stringify(marksMap.get(id)) !== JSON.stringify(marks)) {
            hasMistakes = true;
          }
        });
        expect(hasMistakes).toBeFalse();
      });

      const request = httpMock.expectOne(`${BASE_URL}/subjects/id123`);
      request.flush({ marks: serverResponse });
      httpMock.verify();
    }),
  ));
});

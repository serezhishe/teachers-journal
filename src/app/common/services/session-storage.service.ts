import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay, filter, pluck, tap } from 'rxjs/operators';

import { BASE_URL } from '../constants/base-url';

const DELAY_TO_SHOW_HTTP = 1000;
@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private readonly storage: Storage;
  private readonly storage$: Subject<any>;

  constructor(private readonly http: HttpClient) {
    this.storage = window.sessionStorage;
    this.storage$ = new Subject();
  }

  get length(): number {
    return this.storage.length;
  }

  public clear(): void {
    this.storage.clear();
  }

  public getItem(key: string): Observable<any> {
    if (this.storage.getItem(key) === null) {
      this.http
        .get(`${BASE_URL}/${key}`)
        .pipe(
          tap((response) => {
            console.log(response);
            this.storage.setItem(key, JSON.stringify(response));
          }),
          delay(DELAY_TO_SHOW_HTTP)
        )
        .subscribe((value) => {
          this.storage$.next({ [key]: value });
        });
    } else {
      of({ [key]: JSON.parse(this.storage.getItem(key)) })
        .pipe(delay(1))
        .subscribe((some) => {
          this.storage$.next(some);
        });
    }

    return this.storage$.pipe(
      filter((value) => value[key] !== undefined),
      tap((value) => {
        console.log(value);
      }),
      pluck(key)
    );
  }

  public key(index: number): string | null {
    return this.storage.key(index);
  }

  public deleteItem(path: string, key: string): void {
    this.http.delete(`${BASE_URL}/${path}/${key}`, { observe: 'response' }).subscribe((deleteResponse: HttpResponse<any>) => {
      if (deleteResponse.ok) {
        this.http
          .get(`${BASE_URL}/${path}`)
          .pipe(
            tap((response) => {
              console.log(response);
              this.storage.setItem(path, JSON.stringify(response));
            })
          )
          .subscribe((value) => {
            this.storage$.next({ [path]: value });
          });
      } else {
        console.log(deleteResponse);
      }
    });
  }

  public pushItem(key: string, value: any): void {
    this.http.post(`${BASE_URL}/${key}`, value, { observe: 'response' }).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.storage.setItem(key, JSON.stringify([...JSON.parse(this.storage.getItem(key)), response.body]));
        this.storage$.next({ [key]: JSON.parse(this.storage.getItem(key)) });
      } else {
        console.log(response);
      }
    });
  }

  public updateItem(key: string, value: any): void {
    const prevValue = JSON.parse(this.storage.getItem(key));
    console.log(this.storage);
    const updateValue = Object.keys(value).reduce((result, prop) => {
      if (value[prop] !== undefined && JSON.stringify(value[prop]) !== JSON.stringify(prevValue[prop])) {
        result[prop] = value[prop];
      }

      return result;
    }, {});

    this.http.patch(`${BASE_URL}/${key}`, updateValue, { observe: 'response' }).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.storage.setItem(key, JSON.stringify(response.body));
        this.storage$.next({ [key]: response.body });
      } else {
        console.log(response);
      }
    });
  }

  public setItem(key: string, value: any): void {
    this.http.post(`${BASE_URL}/${key}`, value, { observe: 'response' }).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.storage.setItem(key, JSON.stringify(response.body));
        this.storage$.next({ [key]: JSON.parse(this.storage.getItem(key)) });
      } else {
        console.log(response);
      }
    });
  }
}

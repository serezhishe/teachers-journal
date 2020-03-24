import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay, filter, pluck, tap } from 'rxjs/operators';

import { BASE_URL } from '../constants/base-url';

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
            this.storage.setItem(key, JSON.stringify(response));
          }),
          delay(1000)
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
      // tap((value) => {
      //     console.log(value);
      //   }),
      pluck(key)
    );
  }

  public key(index: number): string | null {
    return this.storage.key(index);
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
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
    const updateValue = Object.keys(value).reduce((result, prop) => {
      if (value[prop] !== undefined && JSON.stringify(value[prop]) !== JSON.stringify(prevValue[prop])) {
        result[prop] = value[prop];
      }

      return result;
    }, {});
    console.log(updateValue);
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

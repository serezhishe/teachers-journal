import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { parseURL } from '../helpers/http.helper';
import { SessionStorageService } from '../services/session-storage.service';

const subjectPageKeys = ['subjectId', 'dates', 'marks', 'students'];

@Injectable()
export class StorageInterceptorService implements HttpInterceptor {
  constructor(private readonly sessionStorageService: SessionStorageService) {}

  private handlePatchRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path, id }: { path: string; id: string } = parseURL(request.url);

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.ok) {
          this.sessionStorageService.setItem(`${path}/${id}`, event.body);
        }
      }),
    );
  }

  private handleGetRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path, id }: { path: string; id: string } = parseURL(request.url);
    if (id === undefined || id === null) {
      if (this.sessionStorageService.getItem(path)) {
        return of(new HttpResponse({ status: 200, body: this.sessionStorageService.getItem(path) }));
      }

      return next.handle(request).pipe(
        tap(event => {
          if (event instanceof HttpResponse && event.ok) {
            this.sessionStorageService.setItem(path, event.body);
          }
        }),
      );
    }

    if (this.sessionStorageService.getItem(`${path}/${id}`)) {
      return of(new HttpResponse({ status: 200, body: this.sessionStorageService.getItem(`${path}/${id}`) }));
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.ok) {
          this.sessionStorageService.setItem(`${path}/${id}`, event.body);
        }
      }),
    );
  }

  private handlePostRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path }: { path: string } = parseURL(request.url);

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.ok) {
          if (event.body.subjectId) {
            const subjectInfo = Object.keys(event.body).reduce((result, key) => {
              if (!subjectPageKeys.includes(key)) {
                result[key] = event.body[key];
              }

              return result;
            }, {});
            this.sessionStorageService.setItem(`${path}/${event.body.subjectId}`, event.body);
            this.sessionStorageService.setItem(path, [...this.sessionStorageService.getItem<any[]>(path), subjectInfo]);
          } else {
            this.sessionStorageService.setItem(path, [...this.sessionStorageService.getItem<any[]>(path), event.body]);
          }
        }
      }),
    );
  }

  private handleDeleteRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path, id }: { path: string; id: string } = parseURL(request.url);

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.ok) {
          this.sessionStorageService.deleteItem(path, id);
        }
      }),
    );
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    switch (req.method) {
      case 'PATCH':
        return this.handlePatchRequest(req, next);
      case 'GET':
        return this.handleGetRequest(req, next);
      case 'POST':
        return this.handlePostRequest(req, next);
      case 'DELETE':
        return this.handleDeleteRequest(req, next);
      default:
        return next.handle(req);
    }
  }
}

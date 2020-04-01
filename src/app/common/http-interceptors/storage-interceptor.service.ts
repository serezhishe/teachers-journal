import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { parseURL } from '../helpers/http.helper';
import { SessionStorageService } from '../services/session-storage.service';

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
      })
    );
  }

  private handleGetRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path, id }: { path: string; id: string } = parseURL(request.url);
    if (id === undefined) {
      if (this.sessionStorageService.getItem(path)) {
        return of(new HttpResponse({ status: 200, body: this.sessionStorageService.getItem(path) }));
      }

      return next.handle(request).pipe(
        tap(event => {
          if (event instanceof HttpResponse && event.ok) {
            this.sessionStorageService.setItem(path, event.body);
          }
        })
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
      })
    );
  }

  private handlePostRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path }: { path: string } = parseURL(request.url);

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.ok) {
          // this.sessionStorageService.setItem(`${path}/${event.body._id}`, event.body);
          this.sessionStorageService.setItem(path, [
            ...this.sessionStorageService.getItem<any>(path),
            event.body
          ]);
        }
      })
    );
  }

  private handleDeleteRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path, id }: { path: string; id: string } = parseURL(request.url);

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.ok) {
          this.sessionStorageService.deleteItem(path, id);
        }
      })
    );
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'PATCH') {
      return this.handlePatchRequest(req, next);
    }
    if (req.method === 'GET') {
      return this.handleGetRequest(req, next);
    }
    if (req.method === 'POST') {
      return this.handlePostRequest(req, next);
    }
    if (req.method === 'DELETE') {
      return this.handleDeleteRequest(req, next);
    }
  }
}

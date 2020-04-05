import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { parseURL } from '../helpers/http.helper';

@Injectable()
export class MapFixInterceptorService implements HttpInterceptor { // REVIEW: what is going on here?
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path, id }: { path: string; id: string } = parseURL(request.url);

    if ((request.method === 'POST' || request.method === 'PATCH') && path === 'subjects') {
      const fixedRequest = request.clone({
        body: {
          ...request.body,
          marks: Array.from(request.body.marks.entries()),
        },
      });

      return next.handle(fixedRequest).pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            const fixedResponse = event.clone({
              body: {
                ...event.body,
                marks: new Map(Object.entries(event.body.marks)),
              },
            });

            return fixedResponse;
          }

          return event;
        })
      );
    }
    if (request.method === 'GET' && path === 'subjects' && id !== undefined) {
      return next.handle(request).pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            const fixedResponse = event.clone({
              body: {
                ...event.body,
                marks: new Map(Object.entries(event.body.marks)),
              },
            });

            return fixedResponse;
          }

          return event;
        })
      );
    }

    return next.handle(request);
  }
}

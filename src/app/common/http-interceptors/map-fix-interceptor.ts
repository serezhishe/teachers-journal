import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { parseURL } from '../helpers/http.helper';
import { ISubjectPage } from '../models/subject-page.model';

@Injectable()
export class MapFixInterceptor implements HttpInterceptor {
  private fixResponse(response: HttpResponse<ISubjectPage>): HttpResponse<ISubjectPage> {
    const fixedResponse = response.clone({
      body: {
        ...response.body,
        marks: new Map(Object.entries(response.body.marks)),
      },
    });

    return fixedResponse;
  }

  private fixRequest(request: HttpRequest<any>): HttpRequest<any> {
    const fixedRequest = request.clone({
      body: {
        ...request.body,
        marks: Array.from(request.body.marks.entries()),
      },
    });

    return fixedRequest;
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { path, id }: { path: string; id: string } = parseURL(request.url);

    if (request.method === 'DELETE' || path !== 'subjects') {
      return next.handle(request);
    }

    if (request.method === 'POST' || request.method === 'PATCH') {
      return next.handle(this.fixRequest(request)).pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            return this.fixResponse(event);
          }

          return event;
        }),
      );
    }

    if (request.method === 'GET' && id) {
      return next.handle(request).pipe(
        map(event => {
          if (event instanceof HttpResponse) {
            return this.fixResponse(event);
          }

          return event;
        }),
      );
    }

    return next.handle(request);
  }
}

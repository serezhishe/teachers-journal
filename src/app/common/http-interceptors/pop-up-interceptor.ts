import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { PopUpService } from '../services/pop-up.service';
const RETRY_ATTEMPTS = 2;

@Injectable()
export class PopUpInterceptor implements HttpInterceptor {
  constructor(private readonly popUpService: PopUpService) {}
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req instanceof HttpRequest
      ? next.handle(req).pipe(
          retry(RETRY_ATTEMPTS),
          catchError((error: HttpErrorResponse) => {
            this.popUpService.errorMessage(error.message);

            return throwError(error);
          }),
        )
      : next.handle(req);
  }
}

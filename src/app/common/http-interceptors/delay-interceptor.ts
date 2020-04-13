import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';

import { PopUpService } from '../services/pop-up.service';

const HTTP_DELAY = 1000;

@Injectable()
export class DelayInterceptor implements HttpInterceptor {
  constructor(private readonly popUpService: PopUpService) {}
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req instanceof HttpRequest) {
      console.log(`DELAYING......${req.url}`);
    }

    return req instanceof HttpRequest
      ? next.handle(req).pipe(
          delay(HTTP_DELAY),
          retry(2),
          catchError((error: HttpErrorResponse) => {
            this.popUpService.errorMessage(error.message);

            return throwError(error);
          }),
        )
      : next.handle(req);
  }
}

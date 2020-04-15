import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

const HTTP_DELAY = 1000;

@Injectable()
export class DelayInterceptorService implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req instanceof HttpRequest) {
      console.log(`DELAYING......${req.url}`);
    }

    return req instanceof HttpRequest ? next.handle(req).pipe(delay(HTTP_DELAY)) : next.handle(req);
  }
}

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DelayInterceptorService } from './delay-interceptor.service';
import { MapFixInterceptorService } from './map-fix-interceptor.service';
import { StorageInterceptorService } from './storage-interceptor.service';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: MapFixInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: StorageInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DelayInterceptorService, multi: true },
];

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DelayInterceptor } from './delay-interceptor';
import { MapFixInterceptor } from './map-fix-interceptor';
import { StorageInterceptor } from './storage-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: MapFixInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: StorageInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DelayInterceptor, multi: true },
];

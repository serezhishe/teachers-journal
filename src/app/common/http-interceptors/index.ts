import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MapFixInterceptor } from './map-fix-interceptor';
import { PopUpInterceptor } from './pop-up-interceptor';
import { StorageInterceptor } from './storage-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: MapFixInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: StorageInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: PopUpInterceptor, multi: true },
];

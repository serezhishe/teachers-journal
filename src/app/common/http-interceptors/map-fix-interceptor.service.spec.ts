import { TestBed } from '@angular/core/testing';

import { MapFixInterceptorService } from './map-fix-interceptor.service';

describe('MapFixInterceptorService', () => {
  let service: MapFixInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapFixInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

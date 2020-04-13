import { TestBed } from '@angular/core/testing';

import { StorageInterceptorService } from './storage-interceptor.service';

describe('StorageInterceptorService', () => {
  let service: StorageInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

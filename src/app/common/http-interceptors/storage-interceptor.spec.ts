import { TestBed } from '@angular/core/testing';

import { StorageInterceptor } from './storage-interceptor';

describe('StorageInterceptor', () => {
  let service: StorageInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

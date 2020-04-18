import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { PopUpService } from './pop-up.service';

fdescribe('PopUpService', () => {
  let service: PopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('errors pushed to stream via errorMessage method, getErrorsStream give stream of errors', fakeAsync(() => {
    const errorSpy = jasmine.createSpy('errorSpy');
    const observable = service.getErrorsStream();
    expect(observable).toBeInstanceOf(Observable);
    observable.subscribe(error => errorSpy(error));
    expect(errorSpy).not.toHaveBeenCalled();

    service.errorMessage('Test error 1');
    tick();
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Test error 1');

    service.errorMessage('Test error 2');
    tick();
    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledWith('Test error 2');
  }));

  it('actions pushed to stream via successMessage method, getSuccessActionsStream give stream of actions', fakeAsync(() => {
    const successSpy = jasmine.createSpy('successSpy');
    const observable = service.getSuccessActionsStream();
    expect(observable).toBeInstanceOf(Observable);
    observable.subscribe(error => successSpy(error));
    expect(successSpy).not.toHaveBeenCalled();

    service.successMessage('Test success 1');
    tick();
    expect(successSpy).toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith('Test success 1');

    service.successMessage('Test success 2');
    tick();
    expect(successSpy).toHaveBeenCalledTimes(2);
    expect(successSpy).toHaveBeenCalledWith('Test success 2');
  }));
});

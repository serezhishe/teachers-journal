import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';

import { popUpTypes } from '../constants';

interface IAction {
  type: popUpTypes;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  private readonly events$: BehaviorSubject<IAction>;
  public confirmation$: Subject<boolean>;

  constructor() {
    this.events$ = new BehaviorSubject(null);
    this.confirmation$ = new Subject();
  }

  public getErrorsStream(): Observable<string> {
    return this.events$.pipe(
      filter(event => event?.type === popUpTypes.error),
      pluck('message'),
    );
  }

  public getSuccessActionsStream(): Observable<string> {
    return this.events$.pipe(
      filter(event => event?.type === popUpTypes.success),
      pluck('message'),
    );
  }

  public getConfirmActionsStream(): Observable<string> {
    return this.events$.pipe(
      filter(event => event?.type === popUpTypes.confirm),
      pluck('message'),
    );
  }

  public errorMessage(errorMessage: string): void {
    this.events$.next({
      type: popUpTypes.error,
      message: errorMessage,
    });
  }

  public successMessage(actionMessage: string): void {
    this.events$.next({
      type: popUpTypes.success,
      message: actionMessage,
    });
  }

  public confirmMessage(confirmMessage: string): void {
    this.events$.next({
      type: popUpTypes.confirm,
      message: confirmMessage,
    });
  }
}

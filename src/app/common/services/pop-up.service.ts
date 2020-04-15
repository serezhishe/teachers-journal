import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';

enum eventTypes {
  success = 'success',
  error = 'error',
}

interface IAction {
  type: eventTypes;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  private readonly events$: BehaviorSubject<IAction>;

  constructor() {
    this.events$ = new BehaviorSubject(null);
  }

  public getErrorsStream(): Observable<string> {
    return this.events$.pipe(
      filter(event => event?.type === eventTypes.error),
      pluck('message'),
    );
  }

  public getSuccessActionsStream(): Observable<string> {
    return this.events$.pipe(
      filter(event => event?.type === eventTypes.success),
      pluck('message'),
    );
  }

  public errorMessage(errorMessage: string): void {
    this.events$.next({
      type: eventTypes.error,
      message: errorMessage,
    });
  }

  public successMessage(actionMessage: string): void {
    this.events$.next({
      type: eventTypes.success,
      message: actionMessage,
    });
  }
}

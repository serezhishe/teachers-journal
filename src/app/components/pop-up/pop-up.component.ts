import { Component, EventEmitter, Output } from '@angular/core';

import { popUpTypes } from '../../common/constants';
import { PopUpService } from '../../common/services/pop-up.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent {
  public type: popUpTypes;
  public message: string;
  @Output()
  public closeEvent: EventEmitter<void> = new EventEmitter();

  constructor(private readonly popUpService: PopUpService) {}

  public close(): void {
    this.closeEvent.emit();
  }

  public confirm(): void {
    this.popUpService.confirmation$.next(true);
    this.close();
  }

  public discard(): void {
    this.popUpService.confirmation$.next(false);
    this.close();
  }
}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent {
  public success: string;
  @Output()
  public closeEvent: EventEmitter<void> = new EventEmitter();

  public onClick(): void {
    this.closeEvent.emit();
  }
}

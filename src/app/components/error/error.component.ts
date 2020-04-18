import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent  {
  public error: string;
  @Output()
  public closeEvent: EventEmitter<void> = new EventEmitter();

  public onClick(): void {
    this.closeEvent.emit();
  }
}

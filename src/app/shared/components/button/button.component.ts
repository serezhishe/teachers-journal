import { Component, Input } from '@angular/core';

const enum types {
  delete = 'delete',
  add = 'add',
  goBack = 'goBack',
  cancel = 'cancel',
  save  = 'save',
  addDate = 'addDate',
  close = 'close',
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  public type: types;
}

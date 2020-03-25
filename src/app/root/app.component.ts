import { Component, HostListener } from '@angular/core';

import { SessionStorageService } from '../common/services/session-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string;
  constructor(private readonly sessionStorageService: SessionStorageService) {
    this.title = 'Teacher\'s Journal';
  }
  @HostListener('window:beforeunload', ['$event']) public unloadHandler(event: Event) {
    this.sessionStorageService.clear();
    event.preventDefault();
  }
}

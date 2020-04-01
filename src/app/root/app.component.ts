import { Component, HostListener } from '@angular/core';

import { SessionStorageService } from '../common/services/session-storage.service';

import { StudentsService } from './../common/services/students.service';
import { SubjectsService } from './../common/services/subjects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title: string;
  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    ) {
    this.title = "Teacher's Journal";
  }
  @HostListener('window:beforeunload', ['$event'])
  public unloadHandler(event: Event): void {
    this.sessionStorageService.clear();
    event.preventDefault();
  }
}

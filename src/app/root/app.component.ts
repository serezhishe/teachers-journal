import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

import { SessionStorageService } from '../common/services/session-storage.service';
import { StudentsService } from '../common/services/students.service';
import { SubjectsService } from '../common/services/subjects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public loaded: boolean;
  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    private readonly translate: TranslateService,
  ) {
    this.translate.addLangs(['en', 'ru']);
    this.translate.reloadLang('ru');
    this.translate.reloadLang('en');
    this.translate.setDefaultLang(this.translate.getBrowserLang());
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadHandler(event: Event): void {
    this.sessionStorageService.clear();
    event.preventDefault();
  }

  public ngOnInit(): void {
    combineLatest([this.subjectsService.getSubjectList(), this.studentsService.getStudents()])
      .pipe(first())
      .subscribe(_ => (this.loaded = true));
  }
}

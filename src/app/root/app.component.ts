import { Component, ComponentFactoryResolver, ComponentRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, timer } from 'rxjs';
import { filter, first, map, pluck } from 'rxjs/operators';

import { PopUpService } from '../common/services/pop-up.service';
import { SessionStorageService } from '../common/services/session-storage.service';
import { StudentsService } from '../common/services/students.service';
import { SubjectsService } from '../common/services/subjects.service';
import { ErrorComponent } from '../components/error/error.component';
import { SuccessComponent } from '../components/success/success.component';

enum Timers {
  successTimer = 10000,
  errorTimer = 10000,
}

enum supportedLangs {
  en = 'en',
  ru = 'ru',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly langs: string[];
  public isLoading: boolean;

  @ViewChild('errorContainer', { read: ViewContainerRef })
  public errorEntry: ViewContainerRef;

  @ViewChild('successContainer', { read: ViewContainerRef })
  public successEntry: ViewContainerRef;

  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    private readonly translate: TranslateService,
    private readonly resolver: ComponentFactoryResolver,
    private readonly popUpService: PopUpService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.langs = [supportedLangs.ru, supportedLangs.en];
    this.translate.addLangs(this.langs);
    const defaultLang = this.translate.getBrowserLang();
    if (this.langs.includes(defaultLang)) {
      this.translate.setDefaultLang(defaultLang);
    } else {
      this.translate.setDefaultLang(supportedLangs.en);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadHandler(event: Event): void {
    this.sessionStorageService.clear();
    event.preventDefault();
  }

  public createErrorComponent(errorMessage: string): ComponentRef<ErrorComponent> {
    const factory = this.resolver.resolveComponentFactory(ErrorComponent);
    const errorComponentRef = this.errorEntry.createComponent(factory);
    errorComponentRef.instance.error = errorMessage;
    errorComponentRef.instance.closeEvent.subscribe(() => {
      this.errorEntry.clear();
    });

    return errorComponentRef;
  }

  public createSuccessComponent(successMessage: string): ComponentRef<SuccessComponent> {
    const factory = this.resolver.resolveComponentFactory(SuccessComponent);
    const successComponentRef = this.successEntry.createComponent(factory);
    successComponentRef.instance.success = successMessage;
    successComponentRef.instance.closeEvent.subscribe(() => {
      this.successEntry.clear();
    });

    return successComponentRef;
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParams
      .pipe(
        pluck('lang'),
        filter(lang => lang),
        map((lang: string) => {
          if (this.langs.includes(lang)) {
            return lang;
          }
          this.translate.get('app.languages.notSupported', { lang }).subscribe(translation => {
            this.popUpService.errorMessage(translation);
          });
          const redirectedLang = this.translate.defaultLang;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { lang: redirectedLang },
            queryParamsHandling: 'merge',
          });

          return redirectedLang;
        }),
      )
      .subscribe((lang: string) => this.translate.setDefaultLang(lang));
    combineLatest([this.subjectsService.getSubjectList(), this.studentsService.getStudents()])
      .pipe(first())
      .subscribe(() => (this.isLoading = false));

    this.popUpService.getErrorsStream().subscribe((message: string) => {
      const errorRef = this.createErrorComponent(message);
      timer(Timers.errorTimer).subscribe(() => errorRef.destroy());
    });

    this.popUpService.getSuccessActionsStream().subscribe((message: string) => {
      const successRef = this.createSuccessComponent(message);
      timer(Timers.successTimer).subscribe(() => successRef.destroy());
    });
  }
}

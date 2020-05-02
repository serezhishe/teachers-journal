import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  HostListener,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { filter, first, map, pluck } from 'rxjs/operators';

import { popUpTypes } from '../common/constants/pop-up-types';
import { PopUpService } from '../common/services/pop-up.service';
import { SessionStorageService } from '../common/services/session-storage.service';
import { StudentsService } from '../common/services/students.service';
import { SubjectsService } from '../common/services/subjects.service';
import { PopUpComponent } from '../components/pop-up/pop-up.component';

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
  private langs: string[];
  private readonly popUpFactory: ComponentFactory<PopUpComponent>;
  public isLoading: boolean;

  @ViewChild('popUpContainer', { read: ViewContainerRef })
  public popUpEntry: ViewContainerRef;

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
    this.popUpFactory = this.resolver.resolveComponentFactory(PopUpComponent);
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadHandler(event: Event): void {
    this.sessionStorageService.clear();
    event.preventDefault();
  }

  public createErrorComponent(errorMessage: string): void {
    const errorComponentRef = this.popUpEntry.createComponent(this.popUpFactory);
    errorComponentRef.instance.type = popUpTypes.error;
    errorComponentRef.instance.message = errorMessage;
    errorComponentRef.instance.closeEvent.subscribe(() => {
      this.popUpEntry.clear();
    });
  }

  public createSuccessComponent(successMessage: string): void {
    const successComponentRef = this.popUpEntry.createComponent(this.popUpFactory);
    successComponentRef.instance.type = popUpTypes.success;
    successComponentRef.instance.message = successMessage;
    successComponentRef.instance.closeEvent.subscribe(() => {
      this.popUpEntry.clear();
    });
  }

  public createConfirmComponent(confirmMessage: string): void {
    const successComponentRef = this.popUpEntry.createComponent(this.popUpFactory);
    successComponentRef.instance.type = popUpTypes.confirm;
    successComponentRef.instance.message = confirmMessage;
    successComponentRef.instance.closeEvent.subscribe(() => {
      this.popUpEntry.clear();
    });
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.langs = [supportedLangs.ru, supportedLangs.en];
    this.translate.addLangs(this.langs);
    const defaultLang = this.translate.getBrowserLang();
    if (this.langs.includes(defaultLang)) {
      this.translate.setDefaultLang(defaultLang);
    } else {
      this.translate.setDefaultLang(supportedLangs.en);
    }
    this.route.queryParams
      .pipe(
        pluck('lang'),
        filter(lang => lang),
        map((lang: string) => {
          if (this.langs.includes(lang)) {
            return lang;
          }
          this.translate.get('app.languages.notSupported', { lang }).subscribe((translation: string) => {
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
      .subscribe((lang: supportedLangs) => this.translate.setDefaultLang(lang));
    combineLatest([this.subjectsService.getSubjectList(), this.studentsService.getStudents()])
      .pipe(first())
      .subscribe(() => (this.isLoading = false));

    this.popUpService.getErrorsStream().subscribe((message: string) => {
      this.createErrorComponent(message);
    });

    this.popUpService.getSuccessActionsStream().subscribe((message: string) => {
      this.createSuccessComponent(message);
    });

    this.popUpService.getConfirmActionsStream().subscribe((message: string) => {
      this.createConfirmComponent(message);
    });
  }
}

import { Component, ComponentFactoryResolver, ComponentRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { PopUpService } from '../common/services/pop-up.service';
import { SessionStorageService } from '../common/services/session-storage.service';
import { StudentsService } from '../common/services/students.service';
import { SubjectsService } from '../common/services/subjects.service';
import { ErrorComponent } from '../components/error/error.component';
import { SuccessComponent } from '../components/success/success.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public errorComponentRef: ComponentRef<ErrorComponent>;
  public successComponentRef: ComponentRef<SuccessComponent>;
  public isLoading: boolean;
  public popupSubscription: Subscription;

  @ViewChild('popupcontainer', { read: ViewContainerRef })
  public entry: ViewContainerRef;

  constructor(
    private readonly sessionStorageService: SessionStorageService,
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    private readonly translate: TranslateService,
    private readonly resolver: ComponentFactoryResolver,
    private readonly popUpService: PopUpService,
  ) {
    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang(this.translate.getBrowserLang());
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadHandler(event: Event): void {
    this.sessionStorageService.clear();
    event.preventDefault();
  }

  public createErrorComponent(errorMessage: string): void {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(ErrorComponent);
    this.errorComponentRef = this.entry.createComponent(factory);
    this.errorComponentRef.instance.error = errorMessage;
  }

  public createSuccessComponent(successMessage: string): void {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(SuccessComponent);
    this.successComponentRef = this.entry.createComponent(factory);
    this.successComponentRef.instance.success = successMessage;
  }

  public destroyErrorComponent(): void {
    this.errorComponentRef.destroy();
  }

  public destroySuccessComponent(): void {
    this.successComponentRef.destroy();
  }

  public ngOnInit(): void {
    this.isLoading = true;
    combineLatest([this.subjectsService.getSubjectList(), this.studentsService.getStudents()])
      .pipe(first())
      .subscribe(_ => (this.isLoading = false));

    this.popUpService
      .getErrorsStream()
      .subscribe(message => {
        this.createErrorComponent(message);
        setTimeout(() => {
          this.destroyErrorComponent();
        }, 3000);
      });

    this.popUpService
      .getSuccessActionsStream()
      .subscribe(message => {
        this.createSuccessComponent(message);
        setTimeout(() => {
          this.destroySuccessComponent();
        }, 3000);
      });
  }
}

import { Component, ComponentFactoryResolver, ComponentRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, timer } from 'rxjs';
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
  ) {
    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang(this.translate.getBrowserLang());
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadHandler(event: Event): void {
    this.sessionStorageService.clear();
    event.preventDefault();
  }

  public createErrorComponent(errorMessage: string): ComponentRef<ErrorComponent> {
    // this.errorEntry.clear();
    const factory = this.resolver.resolveComponentFactory(ErrorComponent);
    const errorComponentRef = this.errorEntry.createComponent(factory);
    errorComponentRef.instance.error = errorMessage;

    return errorComponentRef;
  }

  public createSuccessComponent(successMessage: string): ComponentRef<SuccessComponent> {
    // this.successEntry.clear();
    const factory = this.resolver.resolveComponentFactory(SuccessComponent);
    const successComponentRef = this.successEntry.createComponent(factory);
    successComponentRef.instance.success = successMessage;

    return successComponentRef;
  }

  public ngOnInit(): void {
    this.isLoading = true;
    combineLatest([this.subjectsService.getSubjectList(), this.studentsService.getStudents()])
      .pipe(first())
      .subscribe(_ => (this.isLoading = false));

    this.popUpService.getErrorsStream().subscribe((message: string) => {
      const errorRef = this.createErrorComponent(message);
      timer(10000).subscribe(_ => errorRef.destroy());
    });

    this.popUpService.getSuccessActionsStream().subscribe((message: string) => {
      const successRef = this.createSuccessComponent(message);
      timer(3000).subscribe(_ => successRef.destroy());
    });
  }
}

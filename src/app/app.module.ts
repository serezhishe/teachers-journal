import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { httpInterceptorProviders } from './common/http-interceptors';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ErrorComponent } from './components/error/error.component';
import { PanelComponent } from './components/panel/panel.component';
import { StudentsModule } from './components/students/students.module';
import { SubjectsModule } from './components/subjects/subjects.module';
import { SuccessComponent } from './components/success/success.component';
import { AppComponent } from './root/app.component';
import { SharedModule } from './shared/shared.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, PanelComponent, BreadcrumbsComponent, ErrorComponent, SuccessComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    SharedModule,
    MatTabsModule,
    StudentsModule,
    SubjectsModule,
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatButtonToggleModule,
    AppRoutingModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ButtonComponent } from './components/button/button.component';
import { FormComponent } from './components/form/form.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HoverDirective } from './directives/hover.directive';
import { SeparateWordsPipe } from './pipes/separate-words.pipe';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    PageNotFoundComponent,
    FormComponent,
    SeparateWordsPipe,
    HoverDirective,
    ButtonComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    ButtonComponent,
    FormComponent,
    LoadingComponent,
    PageNotFoundComponent,
    HoverDirective,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatTooltipModule,
  ],
})
export class SharedModule {}

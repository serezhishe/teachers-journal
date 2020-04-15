import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ButtonComponent } from './components/button/button.component';
import { FormComponent } from './components/form/form.component';
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
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  exports: [
    PageNotFoundComponent,
    MatButtonModule,
    MatIconModule,
    FormComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    HoverDirective,
    TranslateModule,
    ButtonComponent,
  ],
})
export class SharedModule {}

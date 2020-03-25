import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

import { RemoveDirective } from '../common/directives/remove.directive';

import { AddButtonComponent } from './components/add-button/add-button.component';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';
import { FormComponent } from './components/form/form.component';
import { GoBackButtonComponent } from './components/go-back-button/go-back-button.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SeparateWordsPipe } from './pipes/separate-words.pipe';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    AddButtonComponent,
    FormComponent,
    GoBackButtonComponent,
    SeparateWordsPipe,
    DeleteButtonComponent,
    RemoveDirective,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  exports: [
    PageNotFoundComponent,
    GoBackButtonComponent,
    AddButtonComponent,
    MatButtonModule,
    MatIconModule,
    FormComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    DeleteButtonComponent,
    RemoveDirective,
  ]
})
export class SharedModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

import { AddButtonComponent } from './components/add-button/add-button.component';
import { FormComponent } from './components/form/form.component';
import { GoBackButtonComponent } from './components/go-back-button/go-back-button.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    AddButtonComponent,
    FormComponent,
    GoBackButtonComponent,
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
    MatFormFieldModule
  ]
})
export class SharedModule { }

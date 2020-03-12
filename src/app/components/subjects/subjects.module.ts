import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { HighlightDirective } from './../../common/helpers/highlight.directive';
import { SharedModule } from './../../shared/shared.module';
import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectsPageComponent } from './subjects-page/subjects-page.component';
import { SubjectsRootComponent } from './subjects-root/subjects-root.component';
import { SubjectsRoutingModule } from './subjects-routing.module';
import { SubjectsTableComponent } from './subjects-table/subjects-table.component';

@NgModule({
  declarations: [
    SubjectFormComponent,
    SubjectsTableComponent,
    SubjectsPageComponent,
    SubjectsRootComponent,
    HighlightDirective,
  ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    MatToolbarModule,
    CommonModule,
    MatSortModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    SubjectsRoutingModule,
  ],
  providers: [
    MatDatepickerModule,
  ],
  exports: [
    HighlightDirective
  ]
})
export class SubjectsModule { }

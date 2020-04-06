import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { DATE_FORMATS } from '../../common/constants';
import { HighlightDirective } from '../../common/directives/highlight.directive';
import { SharedModule } from '../../shared/shared.module';

import { MarkInputComponent } from './mark-input/mark-input.component';
import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectRootComponent } from './subject-root/subject-root.component';
import { SubjectTableComponent } from './subject-table/subject-table.component';
import { SubjectsPageComponent } from './subjects-page/subjects-page.component';
import { SubjectsRoutingModule } from './subjects-routing.module';

@NgModule({
  declarations: [
    SubjectFormComponent,
    SubjectTableComponent,
    SubjectsPageComponent,
    HighlightDirective,
    SubjectRootComponent,
    MarkInputComponent,
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
    MatProgressSpinnerModule,
    FormsModule,
    SubjectsRoutingModule,
  ],
  providers: [
    MatDatepickerModule,
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
  exports: [
    HighlightDirective,
  ],
})
export class SubjectsModule { }

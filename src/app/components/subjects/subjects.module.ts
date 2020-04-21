import { NgModule } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    SharedModule,
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

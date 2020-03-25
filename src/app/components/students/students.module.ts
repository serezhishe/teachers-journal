import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { RemoveDirective } from '../../common/directives/remove.directive';

import { SharedModule } from './../../shared/shared.module';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsTableComponent } from './students-table/students-table.component';

@NgModule({
  declarations: [
    StudentFormComponent,
    StudentsTableComponent,
    RemoveDirective,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    SharedModule,
    StudentsRoutingModule,
  ],
})
export class StudentsModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { SharedModule } from './../../shared/shared.module';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsTableComponent } from './students-table/students-table.component';
import { StudentsRootComponent } from './students-root/students-root.component';

@NgModule({
  declarations: [
    StudentFormComponent,
    StudentsTableComponent,
    StudentsRootComponent,
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

import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentsRootComponent } from './students-root/students-root.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsTableComponent } from './students-table/students-table.component';

@NgModule({
  declarations: [
    StudentFormComponent,
    StudentsTableComponent,
    StudentsRootComponent,
  ],
  imports: [
    SharedModule,
    StudentsRoutingModule,
  ],
})
export class StudentsModule {}

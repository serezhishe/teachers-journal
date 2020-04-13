
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from '../../common/guards/can-deactivate.guard';

import { StudentFormComponent } from './student-form/student-form.component';
import { StudentsRootComponent } from './students-root/students-root.component';
import { StudentsTableComponent } from './students-table/students-table.component';

const routes: Routes = [
  {path: 'students', component: StudentsRootComponent, data: {breadcrumb: 'students'},
    children: [
      {path: '', component: StudentsTableComponent },
      {path: 'form', component: StudentFormComponent, canDeactivate: [CanDeactivateGuard], data: {breadcrumb: 'form'}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }

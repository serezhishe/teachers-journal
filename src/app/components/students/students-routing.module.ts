import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentFormComponent } from './student-form/student-form.component';
import { StudentPageComponent } from './student-page/student-page.component';

const routes: Routes = [
  {path: 'students', component: StudentPageComponent},
  {path: 'students/form', component: StudentFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }

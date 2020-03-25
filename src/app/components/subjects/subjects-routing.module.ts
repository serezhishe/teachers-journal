import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/common/guards/can-deactivate.guard';

import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectsPageComponent } from './subjects-page/subjects-page.component';
import { SubjectsTableComponent } from './subjects-table/subjects-table.component';

const routes: Routes = [
  {path: 'subjects', component: SubjectsPageComponent},
  {path: 'subjects/form', component: SubjectFormComponent, canDeactivate: [CanDeactivateGuard]},
  {path: 'subjects/:subject', component: SubjectsTableComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectsRoutingModule { }

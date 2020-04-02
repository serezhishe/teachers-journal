import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/common/guards/can-deactivate.guard';

import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectRootComponent } from './subject-root/subject-root.component';
import { SubjectsPageComponent } from './subjects-page/subjects-page.component';
import { SubjectsTableComponent } from './subjects-table/subjects-table.component';

const routes: Routes = [
  {path: 'subjects', component: SubjectRootComponent, data: {breadcrumb: 'subjects'},
    children: [
      {path: '', component: SubjectsPageComponent },
      {path: 'form', component: SubjectFormComponent, canDeactivate: [CanDeactivateGuard], data: {breadcrumb: 'form'}},
      {path: 'subject/:subject', component: SubjectsTableComponent, data: {breadcrumb: ''}},
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectsRoutingModule { }

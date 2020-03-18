import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsTableComponent } from './components/students/students-table/students-table.component';
import { SubjectsPageComponent } from './components/subjects/subjects-page/subjects-page.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'students', component: StudentsTableComponent },
  { path: 'subjects', component: SubjectsPageComponent },
  { path: '', redirectTo: 'students', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

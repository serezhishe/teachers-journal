import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsRootComponent } from './components/students/students-root/students-root.component';
import { SubjectsRootComponent } from './components/subjects/subjects-root/subjects-root.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'students', component: StudentsRootComponent },
  { path: 'subjects', component: SubjectsRootComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { BuildDetailComponent }  from './build-detail/build-detail.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'build/android/:id', component: BuildDetailComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {enableTracing: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KeepPage } from './keep.page';

const routes: Routes = [
  {
    path: '',
    component: KeepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeepPageRoutingModule {}

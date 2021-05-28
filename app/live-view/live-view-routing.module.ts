import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveViewPage } from './live-view.page';

const routes: Routes = [
  {
    path: '',
    component: LiveViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveViewPageRoutingModule {}

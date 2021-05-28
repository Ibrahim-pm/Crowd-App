import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeeplinkPage } from './deeplink.page';

const routes: Routes = [
  {
    path: '',
    component: DeeplinkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeeplinkPageRoutingModule {}

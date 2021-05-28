import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivevideoPage } from './livevideo.page';

const routes: Routes = [
  {
    path: '',
    component: LivevideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LivevideoPageRoutingModule {}

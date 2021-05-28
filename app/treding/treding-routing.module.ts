import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TredingPage } from './treding.page';

const routes: Routes = [
  {
    path: '',
    component: TredingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TredingPageRoutingModule {}

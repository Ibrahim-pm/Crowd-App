import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HashtredingPage } from './hashtreding.page';

const routes: Routes = [
  {
    path: '',
    component: HashtredingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HashtredingPageRoutingModule {}

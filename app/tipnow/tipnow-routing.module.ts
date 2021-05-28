import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipnowPage } from './tipnow.page';

const routes: Routes = [
  {
    path: '',
    component: TipnowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipnowPageRoutingModule {}

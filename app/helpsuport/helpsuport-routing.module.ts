import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpsuportPage } from './helpsuport.page';

const routes: Routes = [
  {
    path: '',
    component: HelpsuportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpsuportPageRoutingModule {}

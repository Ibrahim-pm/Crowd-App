import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankformPage } from './bankform.page';

const routes: Routes = [
  {
    path: '',
    component: BankformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankformPageRoutingModule {}

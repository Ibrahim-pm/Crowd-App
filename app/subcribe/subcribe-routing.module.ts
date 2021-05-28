import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubcribePage } from './subcribe.page';

const routes: Routes = [
  {
    path: '',
    component: SubcribePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubcribePageRoutingModule {}

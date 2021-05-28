import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileviewerPage } from './profileviewer.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileviewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileviewerPageRoutingModule {}

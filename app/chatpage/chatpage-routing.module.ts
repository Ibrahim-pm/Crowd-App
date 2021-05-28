import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatpagePage } from './chatpage.page';

const routes: Routes = [
  {
    path: '',
    component: ChatpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatpagePageRoutingModule {}

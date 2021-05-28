import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveViewPageRoutingModule } from './live-view-routing.module';

import { LiveViewPage } from './live-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveViewPageRoutingModule
  ],
  declarations: [LiveViewPage]
})
export class LiveViewPageModule {}

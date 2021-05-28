import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeeplinkPageRoutingModule } from './deeplink-routing.module';

import { DeeplinkPage } from './deeplink.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeeplinkPageRoutingModule
  ],
  declarations: [DeeplinkPage]
})
export class DeeplinkPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LivevideoPageRoutingModule } from './livevideo-routing.module';

import { LivevideoPage } from './livevideo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LivevideoPageRoutingModule
  ],
  declarations: [LivevideoPage]
})
export class LivevideoPageModule {}

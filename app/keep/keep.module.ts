import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KeepPageRoutingModule } from './keep-routing.module';

import { KeepPage } from './keep.page';
import {NgxIonicImageViewerModule} from 'ngx-ionic-image-viewer';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        KeepPageRoutingModule,
        NgxIonicImageViewerModule
    ],
  declarations: [KeepPage]
})
export class KeepPageModule {}

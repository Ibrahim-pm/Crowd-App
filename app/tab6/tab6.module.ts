import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab6PageRoutingModule } from './tab6-routing.module';

import { Tab6Page } from './tab6.page';
import {NgxIonicImageViewerModule} from 'ngx-ionic-image-viewer';
import {LongPressModule} from 'ionic-long-press';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        Tab6PageRoutingModule,
        NgxIonicImageViewerModule,
        LongPressModule
    ],
  declarations: [Tab6Page]
})
export class Tab6PageModule {}

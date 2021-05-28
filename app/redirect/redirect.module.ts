import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RedirectPageRoutingModule } from './redirect-routing.module';

import { RedirectPage } from './redirect.page';
import {NgxIonicImageViewerModule} from 'ngx-ionic-image-viewer';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RedirectPageRoutingModule,
        NgxIonicImageViewerModule
    ],
  declarations: [RedirectPage]
})
export class RedirectPageModule {}

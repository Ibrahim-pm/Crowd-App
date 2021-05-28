import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchtredingPageRoutingModule } from './searchtreding-routing.module';

import { SearchtredingPage } from './searchtreding.page';
import {NgxIonicImageViewerModule} from 'ngx-ionic-image-viewer';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchtredingPageRoutingModule,
        NgxIonicImageViewerModule
    ],
  declarations: [SearchtredingPage]
})
export class SearchtredingPageModule {}

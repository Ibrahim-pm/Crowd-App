import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileviewerPageRoutingModule } from './profileviewer-routing.module';

import { ProfileviewerPage } from './profileviewer.page';
import {NgxIonicImageViewerModule} from 'ngx-ionic-image-viewer';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfileviewerPageRoutingModule,
        NgxIonicImageViewerModule
    ],
  declarations: [ProfileviewerPage]
})
export class ProfileviewerPageModule {}

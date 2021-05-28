import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipnowPageRoutingModule } from './tipnow-routing.module';

import { TipnowPage } from './tipnow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipnowPageRoutingModule
  ],
  declarations: [TipnowPage]
})
export class TipnowPageModule {}

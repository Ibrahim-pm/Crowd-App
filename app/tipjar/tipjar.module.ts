import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipjarPageRoutingModule } from './tipjar-routing.module';

import { TipjarPage } from './tipjar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipjarPageRoutingModule
  ],
  declarations: [TipjarPage]
})
export class TipjarPageModule {}

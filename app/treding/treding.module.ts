import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TredingPageRoutingModule } from './treding-routing.module';

import { TredingPage } from './treding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TredingPageRoutingModule
  ],
  declarations: [TredingPage]
})
export class TredingPageModule {}

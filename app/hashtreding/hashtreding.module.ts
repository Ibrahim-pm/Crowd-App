import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HashtredingPageRoutingModule } from './hashtreding-routing.module';

import { HashtredingPage } from './hashtreding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HashtredingPageRoutingModule
  ],
  declarations: [HashtredingPage]
})
export class HashtredingPageModule {}

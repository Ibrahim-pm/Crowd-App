import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcribePageRoutingModule } from './subcribe-routing.module';

import { SubcribePage } from './subcribe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubcribePageRoutingModule
  ],
  declarations: [SubcribePage]
})
export class SubcribePageModule {}

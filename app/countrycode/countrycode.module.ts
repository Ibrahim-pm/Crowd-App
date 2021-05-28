import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountrycodePageRoutingModule } from './countrycode-routing.module';

import { CountrycodePage } from './countrycode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountrycodePageRoutingModule
  ],
  declarations: [CountrycodePage]
})
export class CountrycodePageModule {}

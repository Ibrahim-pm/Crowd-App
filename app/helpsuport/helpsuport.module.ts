import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpsuportPageRoutingModule } from './helpsuport-routing.module';

import { HelpsuportPage } from './helpsuport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpsuportPageRoutingModule
  ],
  declarations: [HelpsuportPage]
})
export class HelpsuportPageModule {}

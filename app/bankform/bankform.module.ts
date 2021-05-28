import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankformPageRoutingModule } from './bankform-routing.module';

import { BankformPage } from './bankform.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BankformPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [BankformPage]
})
export class BankformPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BraintreePageRoutingModule } from './braintree-routing.module';

import { BraintreePage } from './braintree.page';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BraintreePageRoutingModule,
    ],
  declarations: [BraintreePage]
})
export class BraintreePageModule {}

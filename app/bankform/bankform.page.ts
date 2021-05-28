import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Stripe } from '@ionic-native/stripe/ngx';
import {AuthService} from '../services/auth.service';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bankform',
  templateUrl: './bankform.page.html',
  styleUrls: ['./bankform.page.scss'],
})
export class BankformPage implements OnInit {
  numbers;
  name;
  Expiration;
  Cvv;
  Amount;
  cardholdersName: string;
  Userdata;
  Expirationyear: any;
  ionicForm: FormGroup;
  isSubmitted = false;
  ischeck = false;
  constructor(public modalController: ModalController ,
              public authservice: AuthService ,
              private location: Location ,
              private stripe: Stripe,
              public formBuilder: FormBuilder) {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^\\d*[a-zA-Z][a-zA-Z0-9 ]*$')]],
      numbers: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      Expiration: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^(0?[1-9]|1[012])$')]],
      Expirationyear: ['', [Validators.required, Validators.minLength(2), Validators.pattern('([0-9]).{1,1}$')]],
      Cvv: ['', [Validators.required, Validators.minLength(3), Validators.pattern('([0-9]).{3,3}$')]],
      Amount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }
  ngOnInit() {
    const success = 'success';
    this.authservice.GetData().then( data => {
      if (data){
       this.Userdata = data[success];
      }
    });

  }

  goBack() {
    this.location.back();
  }
  dismiss(){
    this.modalController.dismiss('true');
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  PaypalIntegration(){
    const success = 'success';
    this.isSubmitted = true;
    console.log(this.ischeck);
    if (!this.ionicForm.valid ) {
      //this.authservice.presentAlert( 'Please provide a valid information!');
      return false;
    } else {
      this.stripe.setPublishableKey('pk_live_51IIYSdEkv1MNoM6JGcww2I03YKiMbUmoP52fPZuBhsZ0WpPMUA0hBNxcvnYFUYuaUUf26Xc11SXYmqxOxYoOBGr400Zsvg3VPu');
      const card = {
        number: this.numbers,
        expMonth: this.Expiration,
        expYear: this.Expirationyear,
        cvc: this.Cvv,
      };
      this.authservice.presentLoading();
      this.stripe.createCardToken(card).then(token => {
        this.authservice.mywallet(this.Userdata.id , this.Amount , token.id ).subscribe(data => {
          if (data){
            this.authservice.DismissLoading();
            this.authservice.presentAlert(data[success]);
            this.modalController.dismiss(this.Amount);
          }
        }, err => {
          this.authservice.DismissLoading();
          // this.authservice.presentAlert(JSON.stringify(err));
          this.authservice.presentAlert(JSON.stringify(err.error.message));
        });
      }, err => {
        this.authservice.DismissLoading();
        // this.authservice.presentAlert(JSON.stringify(err));
        this.authservice.presentAlert(JSON.stringify(err.error.message));
      });
    }

  }
}

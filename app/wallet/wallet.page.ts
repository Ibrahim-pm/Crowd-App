import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import { BankformPage } from '../bankform/bankform.page';
import { Location } from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';

import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';

import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  Userdata;
  amount;
  userinfo:any;
  history_data:any;
  news: Observable<any[]>;
  userimage;
  amount_credit:any;
  constructor(public authservice: AuthService ,
              public actionSheetController: ActionSheetController ,
              private iab: InAppBrowser ,
              public modalController: ModalController,
              private location: Location,
              private storage: Storage,
              public db: AngularFirestore,
              public rout: Router,
              private afAuth: AngularFireAuth,public alertController: AlertController) {
     this.storage.get('userdata').then((val) => {
      this.userinfo = val;
      console.log(this.userinfo);
       if ( this.userinfo['success']['urimagel']){
         this.userimage = this.userinfo['success']['urimagel'];
       }else{
         this.userimage = '../assets/imgs/profile.svg';
       }
      this.getAllPosts().subscribe((data)=>{
          this.history_data = data;
          console.log(data);
      });
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

  getAllPosts (): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email +'/purchaselist/purchase').valueChanges ();
  }

  async presentActionSheet() {
   const modal = await this.modalController.create({
     component: BankformPage,
     cssClass: 'my-custom-class'
   });
   modal.onDidDismiss()
      .then((data) => {
        this.call_wallet();
    });
   return await modal.present();
  }


  async sendmoney() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Payment Methods',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Stripe (worldwide except Pakistan)',
        role: 'destructive',
        icon: 'cash-outline',
        handler: () => {
          this.presentActionSheet();
        }
      }, {
        text: 'Braintree (worldwide)',
        icon: 'card-outline',
        handler: () => {
         // this.rout.navigate(['/braintree']);
          this.iab.create(`https://braintreecrowd.tutourist.com/public_html`, `_blank`);
        }
      },
        {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  ionViewWillEnter(){
    this.call_wallet();
  } 

  call_wallet(){
     const message = 'message';
    const success = 'success';
    this.authservice.presentLoading();
    this.authservice.GetData().then( data => {
      if (data){
        this.Userdata = data[success];
        this.authservice.usercredit(this.Userdata.id).subscribe(datas => {
          if (datas){
            console.log(datas);
            this.authservice.DismissLoading();
            this.amount = datas[success].amount;
            this.amount_credit = datas[success].cradit;
          }
        }, err => {
          if (err){
            this.authservice.DismissLoading();
            this.authservice.presentAlert(JSON.stringify(err.error.message));
          }
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }
  Tip(){
    // const success = 'success';
    // this.authservice.presentLoading();
    // this.authservice.Transfercreadit(this.Userdata.id,reciver,credit).subscribe(datas => {
    //       if (datas){
    //         if (datas[success]){
    //           this.authservice.presentAlert( datas[success]);
    //         }
    //       }
    //       this.authservice.DismissLoading();
    //     }, err => {
    //       if (err){
    //         this.authservice.presentAlert( JSON.stringify(err.error.error));
    //         this.authservice.DismissLoading();
    //       }
    //     });
  }

  async GetCridits(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Payment Methods',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Stripe (worldwide except Pakistan)',
        role: 'destructive',
        icon: 'cash-outline',
        handler: () => {
          this.TransferToAccount();
        }
      }, {
        text: 'Braintree (worldwide)',
        icon: 'card-outline',
        handler: () => {
          //this.iab.create(`https://braintree.crowd.tutourist.com/public_html`, `_blank`);
        }
      },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }

  TransferToAccount(){
    this.authservice.GetMony(this.userinfo.success.id).subscribe(data => {
      if (data){
        console.log(data['onboarding']);
        if (data['onboarding']){
          this.iab.create(data['onboarding'], `_blank`);
        }else if (data['success']){
          this.authservice.presentAlert(data['success']);
        }
      }
    }, err => {
      this.presentAlert();
    });
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'You can only create new accounts if you\'ve signed up for Connect, which you can learn how to do at'+
          '<br>' + '<a href="https://stripe.com/docs/connect">https://stripe.com/docs/connect</a>',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  Pruchase(){
    this.rout.navigate(['//purchase']);
  }
}

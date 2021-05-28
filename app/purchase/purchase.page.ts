import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {AuthService} from '../services/auth.service';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
})
export class PurchasePage implements OnInit {
  Userdata;
  userinfo:any;
  constructor(public authservice: AuthService , private location: Location,private storage: Storage,public db: AngularFirestore,private afAuth: AngularFireAuth) {
    this.storage.get('userdata').then((val) => {
      this.userinfo = val;
      console.log(this.userinfo.success.email);
    });
  }

  ngOnInit() {
    const success = 'success';
    this.authservice.GetData().then( data => {
      if (data){
        this.Userdata = data;
      }
    });
  }

  goBack() {
    this.location.back();
  }
  MyCridets(ev){
    const success = 'success';
    const id = 'id';
    const message = 'message';
    this.authservice.presentLoading();
    this.authservice.myCredit(this.Userdata[success][id] , ev ).subscribe(data => {
          if (data){
            if (data[message]){
              this.authservice.presentAlert( data[message]);
            }
            if (data[success]){
              this.authservice.presentAlert( data[success]);
              this.call_purchasehistory(ev);
            }
          }
          this.authservice.DismissLoading();
        }, err => {
          this.authservice.DismissLoading();
          this.authservice.presentAlert("Please recharge your balance to purchase credits.");
        });
  }

  call_purchasehistory(ev){
    console.log(ev)
    console.log("working");
    this.db.collection(this.userinfo.success.email).doc('purchaselist')
                            .collection('purchase').add({
          email: this.userinfo.success.email,
          amount: ev,
      })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }
}

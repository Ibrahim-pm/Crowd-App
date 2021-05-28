import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams,AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tipnow',
  templateUrl: './tipnow.page.html',
  styleUrls: ['./tipnow.page.scss'],
})
export class TipnowPage implements OnInit {
  data:any=[];	
  userinfo:any;
  credit:any;
  data_tip:any;
  data_lenght:any;
  total_amount = 0;
  credit_amount = 0;
  news: Observable<any[]>;
  total_amount_ = "true";
  total_credit = 0;
  live_user_id:any;
  full_length:any = 'false';
  userinfo_email:any;
  constructor(public toastController: ToastController,
              public alertController: AlertController,
              public modalController: ModalController,
              private storage: Storage,
              public authservice: AuthService,
              public navParams: NavParams,
              public db: AngularFirestore,
              private afAuth: AngularFireAuth) {
      this.live_user_id = this.navParams.get('live_user_id');
      if(this.live_user_id){
         // alert("working_obj");
        var obj = {};
        obj["userid"] = this.live_user_id;
        obj["id"] = '10';
        this.data.push(obj);
      }else{
        // alert("working");
        this.data = this.navParams.get('data');
        console.log(this.data);
        this.total_amount = this.data.tipcount;
        console.log(this.total_amount);
      }
      this.storage.get('userdata').then((val) => {
          this.userinfo = val;
          this.userinfo_email = val.success.email;
          console.log(this.userinfo.success.email);
      });
  }

  ngOnInit() {
      console.log(this.total_amount_);
      this.getAllFriends().subscribe((data)=>{
          console.log(data);
          this.data_tip = data;
          this.data_lenght = data.length;
    });
  }
  getAllFriends (): Observable<any> {
      return this.db.collection<any>('feed/'+this.data.id+'/tip').valueChanges();
  }

  dismiss() {
      this.modalController.dismiss();
  }
  async presentAlertPrompt(){
      const alert = await this.alertController.create({
          cssClass: 'basic-alert',
          header: 'Enter your tipping credits',
          inputs: [
              {
                  name: 'Credit',
                  type: 'number',
                  placeholder: '1'
              },
          ],
          buttons: [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                      console.log('Confirm Cancel');
                  }
                  }, {
              text: 'Ok',
                  handler: (data: any) => {
                  if(data.Credit > 0){
                      console.log('Confirm Ok');
                      this.tip(data);
                      console.log(data);
                  }else{
                      this.presentToast();
                  }
              }
          }
          ]
      });
      await alert.present();
  }
  async presentToast() {
      const toast = await this.toastController.create({
          message: 'Please enter the credit points.',
          duration: 2000
      });
      toast.present();
  }
  tip(data){
    console.log(this.data);
      console.log(data);
      const success = 'success';
      this.authservice.presentLoading();
      this.authservice.Transfercreadit(this.userinfo.success.id,this.data.userid,data.Credit).subscribe((datas : any) => {
          console.log(datas.message);
          console.log(datas);
          if (datas){
              if (datas[success]){
                  console.log(datas);
                  console.log("working");
                  this.authservice.presentAlert( datas[success]);
                  this.total_credit = parseInt(data.Credit);
                  console.log(this.total_credit);
                  this.total_amount = this.total_amount + this.total_credit;
                  console.log(this.total_amount);
                  this.add_tip(data);
                  this.add_tipinfeed();
                  this.authservice.DismissLoading();
              }else{
                  this.authservice.DismissLoading();
                  this.authservice.presentAlert(datas.message);
              }
          }
          }, err => {
          if (err){
              this.authservice.presentAlert( JSON.stringify(err.error.error));
              this.authservice.DismissLoading();
          }
        });
  }

  add_tip(data){
      this.credit_amount = data.Credit;
      this.db.collection('feed').doc(this.data.id).collection('tip').add({
          from: this.userinfo.success.email,
          username: this.userinfo.success.username,
          credit: data.Credit,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
          console.log('fcm');
          this.data = this.userinfo.success.email
          this.authservice.setupFCM(this.userinfo.success.username, 'Crowd' , this.userinfo.success.username+ ' sent you a tip',this.data);
          this.send_tip();
      })
      .catch(function(error) {
          console.error('Error writing document: ', error);
      });
  }

  send_tip(){
     this.db.collection(this.data.from).doc('tipresiver')
                            .collection('tips').add({
          from: this.userinfo.success.email,
          username: this.userinfo.success.username,
          credit: this.credit_amount,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
          console.log("Document successfully written!");
          this.tip_history();
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }

  tip_history(){
    this.db.collection(this.userinfo.success.email).doc('tipsender')
                            .collection('tips').add({
          to: this.data.from,
          username: this.data.username,
          credit: this.credit_amount,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
          console.log("Document successfully written!");

      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }

  // this.total_amount

  add_tipinfeed(){
    console.log(this.data.id);
    console.log(this.total_amount);
    this.db.collection('feed').doc(this.data.id).update({
              tipcount: this.total_amount
            });
  }

  see_all(){
    this.full_length = "true";
  } 

}

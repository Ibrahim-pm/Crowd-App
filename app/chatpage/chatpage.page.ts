import { Component, OnInit,ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController,NavParams,ModalController,IonContent } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
import {AuthService} from '../services/auth.service';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.page.html',
  styleUrls: ['./chatpage.page.scss'],
})
export class ChatpagePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  data_mein:any;
  userinfo:any;
  field:any;
  data:any;
  userimage;
  chat_length:any;
  friend_length:any;
  data_number:any=12;
  event_refresher:any;
  chat_sms_list:any=[];
  constructor(private location: Location,public navParams: NavParams,public modalController: ModalController,public authservice: AuthService,
    private storage: Storage,public alertController: AlertController,public loadingController: LoadingController,
    public db: AngularFirestore,private afAuth: AngularFireAuth) {
    this.data_mein = this.navParams.get('data');
     console.log(this.data_mein.username);
      // if (this.data_mein.username) {
      //     this.db.doc(this.data_mein.username).get().subscribe(doc => {
      //         this.data_mein.username = doc.data();
      //     });
      // }
     this.storage.get('userdata').then((val) => {
      this.userinfo = val;
         if ( this.userinfo.urimagel){
             this.userimage = this.userinfo.urimagel;
         }else{
             this.userimage = '../assets/imgs/profile.svg';
         }
    });
    this.storage.get('chat_sms_list').then((val) => {
      if(val){
        this.chat_sms_list = val;
      }
    });
  }

  updateScroll() {
    console.log('should scroll here');
    this.content.scrollToBottom(300);
  }

  doRefresh(event) {
    this.event_refresher = event;
    this.data_number = this.data_number + 12;  
    this.call_onrefresh();
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    this.getAllPosts().subscribe((data)=>{
        this.data = data;
        loading.dismiss();
        if(this.data_number > 12){
          this.event_refresher.target.complete();
        }
        // this.chat_length = data.length;
        this.get_length_only();
        console.log(data.length);
        if(this.data_number < 13){
          setTimeout( () => {
             this.updateScroll(); 
          }, 50);
        }
        
    });
    this.getAllfriend().subscribe((data)=>{
        console.log(data.length);
        this.friend_length = data.length;
    });
  }

  call_onrefresh(){
     this.getAllPosts().subscribe((data)=>{
        this.data = data;
        this.event_refresher.target.complete();
    });
  }


  get_length_only(){
    this.getAllPosts_length().subscribe((data)=>{
        this.chat_length = data.length;
        console.log(data.length);
    });
  }

  getAllPosts (): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email+'/chatbox/'+this.data_mein.friend,ref => ref.limit(this.data_number)).valueChanges ();
    // return this.db.collection<any>(this.userinfo.success.email).doc('keep').collection<any>(this.userinfo.success.email+'keep').valueChanges ();
  }

  getAllPosts_length (): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email+'/chatbox/'+this.data_mein.friend).valueChanges ();
    // return this.db.collection<any>(this.userinfo.success.email).doc('keep').collection<any>(this.userinfo.success.email+'keep').valueChanges ();
  }

  getAllfriend (): Observable<any> {
    return this.db.collection<any>(this.data_mein.friend+'/chatbox/'+this.userinfo.success.email).valueChanges ();
    // return this.db.collection<any>(this.userinfo.success.email).doc('keep').collection<any>(this.userinfo.success.email+'keep').valueChanges ();
  }

  goBack() {
	 this.modalController.dismiss({
    'dismissed': 'true'
   });
  }

  send_mgs(){
    this.chat_sms_list.push(this.field);
    this.storage.set('chat_sms_list',this.chat_sms_list);
     this.db.collection(this.userinfo.success.email).doc('chatbox')
                            .collection(this.data_mein.friend).doc(JSON.stringify('x'+this.chat_length)).set({
          email: this.data_mein.friend,
          username: this.data_mein.username,
          message: this.field,
          sender: 'me',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
          console.log("Document successfully written!");
          this.updateScroll();
          this.db.collection(this.data_mein.friend).doc('chatbox')
                            .collection(this.userinfo.success.email).doc(JSON.stringify('x'+this.friend_length)).set({
            email: this.userinfo.success.email,
            username: this.userinfo.success.username,
            message: this.field,
            sender: 'other',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          this.authservice.sendNotification(this.data_mein.data.username.username,'Crowd',this.userinfo.success.username+' has messaged you','sms');
            this.field = "";
            this.db.collection(this.data_mein.friend).doc('notificationlist')
                              .collection('notification').add({
                  notification: this.userinfo.success.username + ' has messaged you',
              });
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }

}

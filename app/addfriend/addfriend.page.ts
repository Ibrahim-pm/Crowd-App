import { Component, OnInit } from '@angular/core';
import { MenuController,NavParams,ModalController,ToastController  } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
import { RedirectPage } from '../redirect/redirect.page';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.page.html',
  styleUrls: ['./addfriend.page.scss'],
})
export class AddfriendPage implements OnInit {
  segmentModel:any; 
  data_length:any;
  data:any;
  userinfo:any;
  img_:any;
  friend_length:any;
  data_mein:any;
  friend_list_array:any =[];
  img_data_show:any=[];
  img_data_show_id:any=[];
  friend_list_array_request:any=[];
  date_current;
  requested_data:any = [];
  user_email:any;
  constructor(public toastController: ToastController,public navParams: NavParams,public modalController: ModalController,public authservice: AuthService,private storage: Storage,public alertController: AlertController,public loadingController: LoadingController,public db: AngularFirestore,private afAuth: AngularFireAuth) {
      this.data_mein = this.navParams.get('data');
      console.log(this.data_mein); 
      console.log(this.data_mein[2]); 
      this.img_ = this.data_mein[0];
      this.storage.get('userdata').then((val) => {
        this.userinfo = val;
        console.log(this.userinfo.success.email);
        this.user_email = this.userinfo.success.email;
      });
      this.storage.get('friends_request').then((val) => {
        if(val){
          this.friend_list_array_request = val;
        }
        console.log(this.friend_list_array_request);
        // console.log(this.userinfo.success.email);
      });
       const date = new Date();
        this.date_current = new Date();
        console.log(this.date_current);
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Follow request sent successfully',
      duration: 2000
    });
    toast.present();
  }

  async ngOnInit() {
      const createdAt = 'createdAt';
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    this.getAllPosts().subscribe((data)=>{
        this.data = data;
        console.log(this.data);
        loading.dismiss();
        this.segmentModel = "fri";
        this.data_length = data.length;
        for(let i=0; i< data.length; i++){
          if(data[i].img){
            this.img_data_show.push(data[i].img);
            this.img_data_show_id.push(data[i]);
          }
            if(this.data[i].createdAt){
                const t0 = new Date(this.data[i].createdAt.seconds * 1000).toISOString();
                const t1 = new Date().toISOString();
                // @ts-ignore
                const d = (new Date(t1)) - (new Date(t0));
                const weekdays     = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
                const days         = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
                const hours        = Math.floor(d / 1000 / 60 / 60    - weekdays * 7 * 24            - days * 24);
                const minutes      = Math.floor(d / 1000 / 60       - weekdays * 7 * 24 * 60         - days * 24 * 60         - hours*60);
                const seconds      = Math.floor(d / 1000          - weekdays * 7 * 24 * 60 * 60      - days * 24 * 60 * 60      - hours*60*60      - minutes*60);
                const t = {};
                ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
                if (t['seconds'] <= 60){
                    this.data[i].createdAt = t['seconds'] + 's';
                }
                if (t['minutes'] >= 1){
                    this.data[i].createdAt = t['minutes'] + 'm';
                }
                if (t['hours'] >= 1){
                    this.data[i].createdAt = t['hours'] + 'h';
                }
                if (t['days'] >=1){
                    this.data[i].createdAt = t['days'] + 'd';
                }
            }else{
                this.data[i].createdAt = '1s';
            }
        }
    }); 

    this.getAllFriends().subscribe((data)=>{  
        this.friend_length = data.length;
    }); 
    
    this.getAllmyFriends().subscribe((data)=>{
        for(let i=0; i<data.length; i++){
          this.friend_list_array.push(data[i].friend);
        }
    });

    this.getrequest().subscribe((data)=>{
      this.requested_data = [];
        console.log(data); 
        for(let i=0;i<data.length;i++){
         this.requested_data.push(data[i].friendrequest); 
        } 
        console.log(this.requested_data);
    });

  }

  getrequest (): Observable<any> {
    console.log(this.data_mein[2]);
    return this.db.collection<any>(this.data_mein[2]+'/friendrequest/list/').valueChanges ();
  }

  getAllPosts (): Observable<any> {
    return this.db.collection<any>(this.data_mein[2]).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        if(data.username){
            if(data.username.path){
                this.db.doc(data.username).get().subscribe(doc => {
                    data.username = doc.data();
                    console.log(data.username)
                });
            }
          }
        const id = a.payload.doc.id;
        return { id, data ,...data };
      }))
    );
  }

  getAllFriends (): Observable<any> {
    // console.log(this.data_mein[2]);
    return this.db.collection<any>(this.data_mein[2]+'/friend/friend/').valueChanges ();
  }


  getAllmyFriends (): Observable<any> {
    // console.log(this.data_mein[2]);
    return this.db.collection<any>(this.userinfo.success.email+'/friend/friend/').valueChanges ();
  }


  segmentChanged(event){
    console.log(this.segmentModel);
  }

  goBack() {
    this.modalController.dismiss();
  }

  send_request(){
   this.db.collection(this.data_mein[2]).doc('friendrequest')
                            .collection('list').doc(this.userinfo.success.email).set({
          friendrequest: this.userinfo.success.email,
          username: this.db.doc(this.userinfo.success.email+'/profile').ref,
          profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
          profile_status: 'request'
      })
      .then(() => {
          console.log("Document successfully written!");
          this.presentToast();
          this.friend_list_array_request.push(this.data_mein[2]);  
          this.storage.set('friends_request',this.friend_list_array_request);
          // this.modalController.dismiss();
          this.authservice.setupFCM(this.data_mein[2],'Crowd',this.userinfo.success.username+' Send you friend request','request');
            // this.db.collection(this.data_mein[2]).doc('notificationlist')
            //                   .collection('notification').add({
            //       notification: this.userinfo.success.username + ' Send you friend request',
            //       email :this.userinfo.success.email,
            //   });  
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }

  async open_post(data,id) {
   const modal = await this.modalController.create({
   component: RedirectPage,
   componentProps: {
      data: data,
      mein_id: id, 
   },
   cssClass: 'my-custom-class'
   });
   return await modal.present();
  }
}


import { Component, OnInit } from '@angular/core';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import {AuthService} from '../services/auth.service';
import { Platform,NavController,ModalController } from '@ionic/angular';
import { SubcribePage } from '../subcribe/subcribe.page';
// import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
// import { ModalController } from '@ionic/angular';
import { LivevideoPage } from '../livevideo/livevideo.page';
// import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-live-view',
  templateUrl: './live-view.page.html',
  styleUrls: ['./live-view.page.scss'],
})
export class LiveViewPage implements OnInit {
  userinfo:any;
  userimage:any;
  data:any;
  subscribe_token:any="asd";
  token:any="asd";
  sessionId:any="asd";
  data_length:any;
  constructor(private location: Location,public modalController: ModalController,private firebaseDynamicLinks: FirebaseDynamicLinks,private afAuth: AngularFireAuth,
              private storage: Storage,public db: AngularFirestore,public authservice: AuthService) {
            	this.storage.get('userdata').then((val) => {
                    if (val){
                        this.userinfo = val;
                        if (this.userinfo.urimagel){
                            this.userimage = this.userinfo.urimagel;
                        }else{
                            this.userimage = '../assets/imgs/profile.svg';
                        }
                        this.getAlldata().subscribe((data) => {
                                  console.log(data);
                                  this.data = data;
                                  this.data_length = data.length;
                                  console.log(this.data_length);
                        }); 
         }
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  getAlldata(): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email +'/friend_live/friend_live').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async get_profile_sub(data) {
    console.log(data);
      const modal = await this.modalController.create({
          component: SubcribePage,
          componentProps: {
              da: "friend_list",
              daa: data.sessionId,
              daaa: data.token,
              from: data.from,
              user_email:this.userinfo.success.email,
          },
       cssClass: 'my-custom-class'
      });
      return await modal.present();
  }

  async livevideopage() {
     const modal = await this.modalController.create({
     component: LivevideoPage,
     componentProps: {
        data: 'data',
     },
     cssClass: 'my-custom-class'
     });
     return await modal.present();
  }

}

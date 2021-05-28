import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
import { RedirectPage } from '../redirect/redirect.page';
import { ModalController } from '@ionic/angular';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {HashtredingPage} from '../hashtreding/hashtreding.page';
import {FollowingPage} from '../following/following.page';
import {Router} from '@angular/router';
import {EventService} from '../services/event.service';
@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
})
export class Tab6Page implements OnInit {
  segmentModel = "fri";
  data_length:any;
  data:any;
  userinfo:any;
  img_:any;
  friend_length:any;
  img_data_show:any=[];
  date_current: any;
  img_data_show_id:any=[];
  emai_check:any;
  post_length:any=[];
  constructor(private event: EventService,public rout: Router,public modalController: ModalController,private menu: MenuController,public authservice: AuthService,private storage: Storage,public alertController: AlertController,public loadingController: LoadingController,public db: AngularFirestore,private afAuth: AngularFireAuth) {
    const date = new Date();
        this.date_current = new Date();
  }


    ionViewWillEnter(){
        const createdAt = 'createdAt'
        this.event.subscribe('userdata', (val) => {
            if (val){
                this.userinfo = val;
                if (val.urimagel){
                    this.img_ = this.userinfo.urimagel;
                }

            }
            console.log(this.userinfo);
        });
        this.storage.get('userdata').then((val) => {
            this.userinfo = val;
            console.log(this.userinfo);
            this.img_ = this.userinfo.urimagel;
            if(this.img_){
                this.img_ = this.userinfo.urimagel;
            }
            this.emai_check = this.userinfo.success.email;
            this.getAllPosts(this.userinfo.success.email).subscribe((data) => {
            this.post_length = [];  
            this.data = data;
            console.log(this.data);
            this.data_length = data.length;
            for(let i=0; i< data.length;i++){
              if(data[i].from){
                this.post_length.push(data[i]);
              }
            }
            for (let i = 0; i < data.length; i++){
              if (data[i].img){
                  this.img_data_show.push(data[i].img);
                  this.img_data_show_id.push(data[i]);
          }
              if (data[i][createdAt]){
                    const t0 = new Date(data[i][createdAt].seconds * 1000).toISOString();
                    const t1 = new Date().toISOString();
                    // @ts-ignore
                    const d = (new Date(t1)) - (new Date(t0));
                    const weekdays     = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
                    const days         = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
                    const hours        = Math.floor(d / 1000 / 60 / 60    - weekdays * 7 * 24            - days * 24);
                  // tslint:disable-next-line:max-line-length
                    const minutes      = Math.floor(d / 1000 / 60       - weekdays * 7 * 24 * 60         - days * 24 * 60         - hours*60);
                  // tslint:disable-next-line:max-line-length
                    const seconds      = Math.floor(d / 1000          - weekdays * 7 * 24 * 60 * 60      - days * 24 * 60 * 60      - hours*60*60      - minutes*60);
                    const t = {};
                    ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
                    if (t['seconds'] <= 60){
                        data[i][createdAt] = t['seconds'] + 's';
                    }
                    if (t['minutes'] >= 1){
                        data[i][createdAt] = t['minutes'] + 'm';
                    }
                    if (t['hours'] >= 1){
                        data[i][createdAt] = t['hours'] + 'h';
                    }
                    if (t['days'] >=1){
                        data[i][createdAt] = t['days'] + 'd';
                    }
                }else{
                    data[i][createdAt] = '1s';
                }
        }
    });
            this.getAllFriends(this.userinfo.success.email).subscribe((data) => {
                this.friend_length = data.length;
            });
        });
    }





  async ngOnInit() {
  }

  getAllPosts(email): Observable<any> {
    return this.db.collection<any>(email).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        if (data.profile && data.from) {
                    this.db.doc(data.profile).get().subscribe(doc => {
                        data.profile = doc.data();
                    });
                    // console
                }

        return { id,data,...data };
      }))
    );

  }

  getAllFriends(email): Observable<any> {
    return this.db.collection<any>(email + '/friend/friend/').valueChanges ();
  }

  async openMenu() {
    this.menu.enable(true, 'adminMenu');
    this.menu.open('adminMenu');
  }

  segmentChanged(event){
    console.log(this.segmentModel);
  }

  async open_post(data , id) {
   console.log(data);
   console.log(id);
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
    async get_post_detail(data) {
        const modal = await this.modalController.create({
            component: HashtredingPage,
            componentProps: {
                hash: data,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }
    async Follwing(data){
        console.log(data);
         const modal = await this.modalController.create({
            component: FollowingPage,
            componentProps: {
                data: data,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }
    active(da, id){
        this.presentAlertConfirm(da,id);
    }



    async presentAlertConfirm(da, id) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm!',
            message: 'Message <strong>text</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.db.collection('feed').doc(id).delete();
                        this.db.collection(this.userinfo.success.email).doc(id).delete();
                    }
                }
            ]
        });

        await alert.present();
    }
}

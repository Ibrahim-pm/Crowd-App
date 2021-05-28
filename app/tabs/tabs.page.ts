import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { ModalPage } from '../modal/modal.page';
import { Tab5Page } from '../tab5/tab5.page';
import {AuthService} from '../services/auth.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import {EventService} from '../services/event.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import firebase from 'firebase/app';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { Storage } from '@ionic/storage';

import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
    count = 0;
    userinfo:any;
  constructor(private keyboard: Keyboard,
              public modalController: ModalController,
              public authservice: AuthService , private event: EventService,
              private firebaseDynamicLinks: FirebaseDynamicLinks,
              private storage: Storage,
              public db: AngularFirestore,
              private afAuth: AngularFireAuth,
              public toastController: ToastController) {}

  ngOnInit() {}
  async openModal() {
      const modal = await this.modalController.create({
          component: Tab5Page,
          cssClass: 'my-custom-class'
      });
      return await modal.present();
  }
    ionViewWillEnter(){
       this.storage.get('userdata').then((val) => {
            if (val){
              this.userinfo = val;
              this.totalnoti();
              this.totalnoti_fication();
            }
        });
    }
    totalnoti(){
        this.event.subscribe('notificationCount', (val) => {
            if (val){
                // this.count = val;
            }
        });
        this.authservice.notificationGet().then(data =>{
            // this.count = data;
            // this.call_function();
            console.log(this.count);
        });
    }
    // GotoTab(){
    //     console.log('inside');
    //     this.count = 0;
    //     this.authservice.notificationClear(this.count);
    // }

    totalnoti_fication(){
       this.get_noti().subscribe((data) => {
            console.log(data);
            this.count = data.length;
            
        });
    }

    get_noti(): Observable<any> {
      return this.db.collection<any>(this.userinfo.success.email + '/notificationlist/notification').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
        }))
      );
    }


    // get_noti(): Observable<any> {
    //   return this.db.collection<any>(this.userinfo.success.email + '/notificationlist/notification').snapshotChanges().pipe(
    //         map(actions => actions.map(a => {
    //             const data = a.payload.doc.data();
    //             const id = a.payload.doc.id;
    //             return { id, ...data };
    //     }))
    //   );
    // }

    async call_function(){
      const toast = await this.toastController.create({
        message: 'You have new notification',
        duration: 1000
      });
      toast.present();
    }

}

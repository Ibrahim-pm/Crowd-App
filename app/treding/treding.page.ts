import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ModalController,NavParams } from '@ionic/angular';
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
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-treding',
  templateUrl: './treding.page.html',
  styleUrls: ['./treding.page.scss'],
})
export class TredingPage implements OnInit {
  data:any;
  hash:any;
  data_number:any=20;
  event_refresher:any;
  button_media:any = "true";
  constructor(private location: Location,public modalController: ModalController,public navParams: NavParams,private storage: Storage,public loadingController: LoadingController,private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.hash = this.navParams.get('hash');
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
    });
  }

  getAllPosts (): Observable<any> {
    return this.afs.collection<any>('feed').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
          if (data.username) {
              this.afs.doc(data.username).get().subscribe(doc => {
                  data.username = doc.data();
              });
          }
        const id = a.payload.doc.id;
        return { id, data , ...data };
      }))
    );
  }

  goBack() {
    // this.location.back();
    this.modalController.dismiss();
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

  segmentChanged(da){
    this.button_media = da;
  }
}

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
    selector: 'app-hashtreding',
    templateUrl: './hashtreding.page.html',
    styleUrls: ['./hashtreding.page.scss'],
})
export class HashtredingPage implements OnInit {
    data:any;
    hash:any;
    data_number:any=20;
    event_refresher:any;
    button_media:any = "true";
    button_post:any;
    constructor(private location: Location,public modalController: ModalController,public navParams: NavParams,private storage: Storage,public loadingController: LoadingController,private afAuth: AngularFireAuth, private afs: AngularFirestore) {
        // this.data = this.navParams.get('data');
        // console.log(this.data);
        this.hash = this.navParams.get('hash');
        console.log(this.hash);
    }

    loadData_all(event) {
        // this.event_refresher = event;
        //   this.data_number = this.data_number + 20;
        //   this.ngOnInit();
    }

    async ngOnInit() {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
        });
        await loading.present();
        this.getAllPosts().subscribe((data)=>{
            this.data = data;
            console.log(data);
            loading.dismiss();
            // if(this.data_number > 20){
            //   this.event_refresher.target.complete();
            // }
        });
    }

    getAllPosts (): Observable<any> {
        // return this.db.collection<any>(this.userinfo.success.email).doc('keep').collection<any>(this.userinfo.success.email+'keep').valueChanges ();
        return this.afs.collection<any>('feed').snapshotChanges().pipe(
            // map(actions => actions.map(a => {
            //     const data = a.payload.doc.data();
            //     const id = a.payload.doc.id;
            //     return { id, ...data };
            // }))
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                if (data.profile) {
                    // this.db.doc(data.profile).get().subscribe(doc => {
                    //     data.profile = doc.data();
                    // });
                }
                const id = a.payload.doc.id;
                return {id , data , ...data};
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
        console.log(data);
        console.log(id);
    }

    segmentChanged(da){
        this.button_media = da;
    }

}

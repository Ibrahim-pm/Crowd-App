import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MenuController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { LoadingController } from '@ionic/angular';
import { RedirectPage } from '../redirect/redirect.page';

@Component({
  selector: 'app-keep',
  templateUrl: './keep.page.html',
  styleUrls: ['./keep.page.scss'],
})
export class KeepPage implements OnInit {
  userinfo:any;	
  data:any;
  data_length:any;
  news: Observable<any[]>;
  userimage;
  data_number:any=20;
  date_current: any;
  event_refresher:any;
  media_show:any ="true";
    @ViewChildren('player')videoPlayers: QueryList<any>;
  constructor(public modalController: ModalController,private location: Location,private storage: Storage,public loadingController: LoadingController,private afAuth: AngularFireAuth, private afs: AngularFirestore) { 
  	this.storage.get('userdata').then((val) => {
      this.userinfo = val;
        if ( this.userinfo['success']['urimagel']){
            this.userimage = this.userinfo['success']['urimagel'];
        }else{
            this.userimage = '../assets/imgs/profile.svg';
        }
    });
    const date = new Date();
        this.date_current = new Date();
        console.log(this.date_current);
  }

  loadData_all(event) {
    this.event_refresher = event;
    
    this.data_number = this.data_number + 20;  
    this.ngOnInit();
  }

  async ngOnInit() {
  	const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
      this.storage.get('userdata').then((val) => {
          this.userinfo = val;
          this.getAllPosts(this.userinfo.success.email).subscribe((data)=>{
              this.data = data;
              console.log(data.length);
              console.log(this.data);
              loading.dismiss();
              // if(this.data_number > 20){
              //   this.event_refresher.target.complete();
              // }
              this.data_length = data.length;
          });
      });

  }

  getAllPosts (email): Observable<any> {
    // return this.db.collection<any>(this.userinfo.success.email).valueChanges ();

    return this.afs.collection<any>(email).doc('keep').collection<any>(email+'keep').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any
          console.log(data.data.username)
          if (data.data.post_email) {
              this.afs.doc(data.data.post_email +'/profile').get().subscribe(doc => {
                  data.data.username = doc.data();
              });
          }
          const id = a.payload.doc.id;
        return { id,data, ...data };
      }))
    );
  }

  goBack() {
	this.location.back();
  }

   async open_post(data, id) {
      const modal = await this.modalController.create({
          component: RedirectPage,
          backdropDismiss : true,
          componentProps: {
              data: data,
              mein_id: id,
          },
          cssClass: 'my-custom-class'
      });
      this.videoPlayers.forEach(player => {
           const nativeElement = player.nativeElement;
           nativeElement.pause();
       });
      return await modal.present();
  }
    ionViewWillLeave() {
        this.videoPlayers.forEach(player => {
            const nativeElement = player.nativeElement;
            nativeElement.pause();
        });
    }

    segmentChanged(da){
      this.media_show = da;
    }
}

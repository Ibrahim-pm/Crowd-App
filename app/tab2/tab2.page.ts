import {Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TredingPage } from '../treding/treding.page';
import { SearchtredingPage } from '../searchtreding/searchtreding.page';

import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
import { RedirectPage } from '../redirect/redirect.page';
import { HashtredingPage } from '../hashtreding/hashtreding.page';
import { ProfileviewerPage } from '../profileviewer/profileviewer.page';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  segmentModel = "all";	
  userinfo:any;
  data:any;
  data_length:any;
  hash_value:any;
  news: Observable<any[]>;
  userimage;
  hashtag_tag:any;  
  data_number:any=8;
  event_refresher:any;
  image_data_only:any=[];
  loader:any = "present";
  img_data_show:any=[];
  img_data_show_id:any=[];
  buttonDisabled:any;
  data_shw:any = 'false';
    @ViewChildren('player')videoPlayers: QueryList<any>;
  constructor(public db: AngularFirestore,public modalController: ModalController,public authservice: AuthService,private storage: Storage,public loadingController: LoadingController,private afAuth: AngularFireAuth, private afs: AngularFirestore) {
  this.buttonDisabled = true;
    this.storage.get('userdata').then((val) => {
      this.userinfo = val;
      this.call_functions();
    });
  }

    ionViewWillLeave() {
        this.videoPlayers.forEach(player => {
            const nativeElement = player.nativeElement;
            nativeElement.pause();
        });
    }

    ionViewDidLeave(){
        this.videoPlayers.forEach(player => {
            const nativeElement = player.nativeElement;
            nativeElement.pause();
        });
    }

    loadData_all(event) {
    this.event_refresher = event;
    if(this.segmentModel != "all"){
      this.data_number = this.data_number + 20;
      this.ngOnInit();
    }else{
      this.data_number = this.data_number + 8;
      this.ngOnInit();
    }
  }

  async call_functions(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    this.getAllPosts().subscribe((data)=>{
        this.data = data;
        setTimeout(() => {
            this.data_shw = 'true';
        }, 4000);
        loading.dismiss();
        if(this.data_number > 8 && this.segmentModel == 'all' || this.data_number > 20 && this.segmentModel != 'all'){
          this.event_refresher.target.complete();
        }
        this.call_hash();
        this.data_length = data.length;
        for(let i=0; i< data.length; i++){
          if(data[i].img){
            this.img_data_show.push(data[i].img);
            this.img_data_show_id.push(data[i]);
          }
        }

    });

    this.getAllHash().subscribe((dat)=>{
        this.hash_value = dat;
    });
  }

  async ngOnInit() {
  }


  call_hash(){
    this.authservice.getheshtag().subscribe((data :any) => {
          if (data){
             this.hashtag_tag = data.hashtag;
             this.loader = "dismiss";
          }
        }, err => {
          if (err.error.error){
              this.authservice.presentAlert( err.error.error);
          }else{
              this.authservice.presentAlert( JSON.stringify(err.error.error));
          }
    });
  }

  getAllPosts (): Observable<any> {
    // return this.afs.collection<any>('feed',ref => ref.limit(this.data_number)).valueChanges ();
    // return this.afs.collection<any>('feed').snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data();
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
    let datas = [];
        return this.db.collection<any>('feed').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id as any;
                if (data.from) {
                    this.db.doc(data.from +'/profile').get().subscribe(doc => {
                        data.username = doc.data();
                    });
                }
                // if (data.username) {
                //     this.db.doc(data.username).get().subscribe(doc => {
                //         data.username = doc.data();
                //     });
                // }
                return {id , data, ...data};
                //return  { id, ...data };
            }))
        )
    // return this.db.collection<any>(this.userinfo.success.email).doc('keep').collection<any>(this.userinfo.success.email+'keep').valueChanges ();
  }


  getAllHash (): Observable<any> {
    return this.afs.collection<any>('hash').valueChanges ();
    // return this.db.collection<any>(this.userinfo.success.email).doc('keep').collection<any>(this.userinfo.success.email+'keep').valueChanges ();
  }

  segmentChanged($data){
    this.segmentModel = $data;
    if(this.segmentModel == "photos"){
      this.data_number = 20;
      this.ngOnInit();
    }else if(this.segmentModel == "videos"){
      this.data_number = 20;
      this.ngOnInit();
    }else if(this.segmentModel == "posts"){
       this.data_number = 20;
      this.ngOnInit();
    }else{
      this.data_number = 8;
      this.ngOnInit();
    }
  }

  async openModal(data) {
   const modal = await this.modalController.create({
   component: TredingPage,
   componentProps: {
      data: this.data, 
      hash: data
   }
   // cssClass: 'my-custom-class'
   });
   return await modal.present();
  }

  async openModal_2() {
   const modal = await this.modalController.create({
   component: SearchtredingPage,
   // cssClass: 'my-custom-class'
   });
   return await modal.present();
  }


  async open_post(data, id) {
      const modal = await this.modalController.create({
          component: RedirectPage,
          backdropDismiss: true,
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

   async get_profile(da) {
   const modal = await this.modalController.create({
   component: ProfileviewerPage,
   componentProps: {
      data: da, 
   },
   cssClass: 'my-custom-class'
   });
   return await modal.present();
  }


}

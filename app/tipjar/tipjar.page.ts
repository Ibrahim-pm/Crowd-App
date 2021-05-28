import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MenuController,ModalController } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
@Component({
  selector: 'app-tipjar',
  templateUrl: './tipjar.page.html',
  styleUrls: ['./tipjar.page.scss'],
})
export class TipjarPage implements OnInit {
  userinfo:any;
  data:any;
  segmentModel:any;
  data_second:any;
  tip_recived:any = 'true';
  tip_sent:any = 'false';
  event_refresher:any;
  data_number:any = 20;
  date_current: any;
  data_length_1:any = 0;
  data_length:any = 0;
  totat_1:any = 0;
  totat_2:any = 0;
  constructor(private location: Location,public modalController: ModalController,public authservice: AuthService,private storage: Storage,public alertController: AlertController,public loadingController: LoadingController,public db: AngularFirestore,private afAuth: AngularFireAuth) {

     this.storage.get('userdata').then((val) => {
      this.userinfo = val;
      console.log(this.userinfo.success.email);
    });
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
      duration: 2000
    });
    await loading.present();
    this.getAllPosts().subscribe((data)=>{
        this.totat_1 = 0;
        this.data = data;
        this.data_length = data.length;
        for(let i = 0; i< data.length; i++){
          this.totat_1 = this.totat_1 + JSON.parse(data[i].credit);
        }

        loading.dismiss();
        if(this.data_number > 20){
          this.event_refresher.target.complete();
        }
        this.segmentModel = "fri";
    }); 
    this.getAllreciver().subscribe((data)=>{
        this.totat_2 = 0;
        this.data_second = data;
        console.log(data.length);
        this.data_length_1 = data.length;
        for(let i = 0; i< data.length; i++){
          this.totat_2 = this.totat_2 + JSON.parse(data[i].credit);
          console.log(this.totat_2);
        }
        console.log(data);
    }); 
  }

  tip_recived_(){
  	this.tip_recived = 'true';
  	this.tip_sent = 'false';
    this.data_number = 20;
    this.ngOnInit();
  }

  tip_sent_(){
  	this.tip_sent = 'true';
  	this.tip_recived = 'false';
    this.data_number = 20;
    this.ngOnInit();
  }

  goBack() {
	  this.location.back();
  }

  getAllPosts (): Observable<any> {
    // console.log(this.data_mein[2]);
    //return this.db.collection<any>(this.userinfo.success.email+'/tipresiver/tips',ref => ref.limit(this.data_number)).valueChanges ();


      return this.db.collection<any>(this.userinfo.success.email+'/tipresiver/tips',ref => ref.limit(this.data_number)).snapshotChanges().pipe(
          map(actions => actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              if (data.from) {
                  this.db.doc(data.from + '/profile').get().subscribe(doc => {
                      data.username = doc.data();
                  });
              }
              return {id ,data,...data};
          }))
      )

  }

  getAllreciver (): Observable<any> {
    // console.log(this.data_mein[2]);
   // return this.db.collection<any>(this.userinfo.success.email+'/tipsender/tips',ref => ref.limit(this.data_number)).valueChanges ();



      return this.db.collection<any>(this.userinfo.success.email+'/tipsender/tips',ref => ref.limit(this.data_number)).snapshotChanges().pipe(
          map(actions => actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              if (data.username) {
                  this.db.doc(data.username).get().subscribe(doc => {
                      data.username = doc.data();
                      //console.log(data.username)
                  });
              }
              return {id ,data,...data};
          }))
      )



  }

}

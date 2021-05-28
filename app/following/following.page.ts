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
import { ActionSheetController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {ProfileviewerPage} from '../profileviewer/profileviewer.page';

import { NavParams } from '@ionic/angular';
@Component({
  selector: 'app-following',
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
})
export class FollowingPage implements OnInit {
  userinfo:any;	
  friend_data:any;
  tip_recived:any = "true";
  tip_sent:any;
  data_number:any;
  friend_data_length:any;
  data:any;
  user_name:any;
  block_list:any=[];
  constructor(public actionSheetController: ActionSheetController,public navParams: NavParams,private location: Location,public modalController: ModalController,public authservice: AuthService,private storage: Storage,public alertController: AlertController,public loadingController: LoadingController,public db: AngularFirestore,private afAuth: AngularFireAuth) { 
  	this.data = this.navParams.get('data');
    console.log(this.data);
    this.storage.get('userdata').then((val:any) => {
      this.userinfo = val;
      console.log(val);
      this.user_name = this.userinfo.success.username;
      console.log(this.userinfo.success.email);
    });
  }

  ngOnInit() {
      this.storage.get('userdata').then((val:any) => {
          this.userinfo = val;
          this.getAllFriends(this.userinfo.success.email).subscribe((data)=>{
              this.friend_data = data;
              console.log(this.friend_data);
              this.friend_data_length = data.length;
          });
      });

  }

  getAllFriends (email): Observable<any> {
    // return this.db.collection<any>(this.userinfo.success.email+'/friend/friend/').valueChanges ();
     return this.db.collection<any>(email+'/friend/friend/').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id
                console.log(data.friend);
                if(data.username){
                    this.db.doc(data.friend + '/profile').get().subscribe(doc => {
                        data.username = doc.data();
                        console.log(data.username)
                    });
                }else{


                }
                return { id , data , ...data  };
            }))
        );
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
	  this.modalController.dismiss();
  }

  async get_profile(da) {
        const modal = await this.modalController.create({
            component: ProfileviewerPage,
            componentProps: {
                data: da,
                from:'chat_page'
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
  }


  async presentAlertConfirm(da) {
   const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Block',
        role: 'destructive',
        icon: 'ban',
        handler: () => {
          console.log('Delete clicked');
          this.delete_option_blck(da);
        }
      }, {
        text: 'Unfollow',
        icon: 'alert-circle',
        handler: () => {
          console.log('Share clicked');
          this.delete_option(da);
        }
      }]
    });
     await actionSheet.present();
  }

  delete_option_blck(da){
    this.db.collection(this.userinfo.success.email).doc('friend')
              .collection('friend').doc(da.friend).delete();
    this.db.collection(da.friend).doc('friend')
              .collection('friend').doc(this.userinfo.success.email).delete();
              // this.storage.set('block_list',this.block_list.push(da));
  }


  delete_option(da){
    this.db.collection(this.userinfo.success.email).doc('friend')
              .collection('friend').doc(da.friend).delete();
    this.db.collection(da.friend).doc('friend')
              .collection('friend').doc(this.userinfo.success.email).delete();
  }
    
    
}

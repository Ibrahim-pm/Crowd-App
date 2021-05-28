import { Component, OnInit } from '@angular/core';
import {  NavController, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { RedirectPage } from '../redirect/redirect.page';
import {  map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import { ProfileviewerPage } from '../profileviewer/profileviewer.page';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  segmentModel: any;
  data_length: any;
  data: any;
  userinfo: any;
  img_:any;
  friend_length: any;
  data_mein: any;
  notification_data: any;
  friend_list_length: any;
  notification_list_length: any;
  event_refresher: any;
  data_number: any = 15;
  fallow: any = 'true';
  date_current: any;
  request_list: any = [];
  block_list:any = [];
  constructor(private navCtrl: NavController,
              public modalController: ModalController,
              public authservice: AuthService,
              private storage: Storage,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public db: AngularFirestore,
              private afAuth: AngularFireAuth) {
      this.storage.get('userdata').then((val) => {
          this.userinfo = val;
          this.segmentModel = 'active';
          console.log(this.userinfo.success.email);
      });
      this.storage.get('friend_acept').then((val) => {
          if (val){
              this.request_list = val;
          }
      });
      this.storage.get('block_list').then((val) => {
          if (val){
            this.block_list = val;
            console.log(this.block_list);
          }
      });
      let date = new Date();
      this.date_current = new Date();
  }
  loadData_all(event) {
      this.event_refresher = event;
      this.data_number = this.data_number + 15;
      this.ngOnInit();
  }

  add_sell_all(){
    this.friend_list_length = 200;
  }

  async ngOnInit() {
      const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
      });
      await loading.present();
      this.storage.get('userdata').then((val) => {
          this.userinfo = val;
          this.getAllPosts(this.userinfo.success.email).subscribe((data) => {
              this.data = data.slice().reverse();
          console.log(this.data);
          loading.dismiss();
          if (this.data_number > 15){
              this.event_refresher.target.complete();
          }
          this.friend_list_length = data.length;
      });
          this.getAllNotification(this.userinfo.success.email).subscribe((data) => {
          this.notification_data = data.slice().reverse();
          this.notification_list_length = data.length;
      });
      });
  }
  getAllPosts(email): Observable<any> {
      return this.db.collection<any>(email + '/friendrequest/list', ref => ref.limit(this.data_number)).snapshotChanges().pipe(
           map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id as any;
                if (data.profile) {
                    this.db.doc(data.profile).get().subscribe(doc => {
                        data.profile = doc.data()
                    });
                }
                return {id , data, ...data}
            }))
      );
   }
   getAllNotification(email): Observable<any> {
      return this.db.collection<any>(email + '/notificationlist/notification', ref => ref.limit(this.data_number)).snapshotChanges().pipe(
          map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                console.log(data.data.username)
                if (data.data.username) {
                    this.db.doc(data.data.username +'/profile').get().subscribe(doc => {
                        data.data.profile = doc.data();
                    });
                }
                const id = a.payload.doc.id as any;
                return {id, data , ...data}
            }))
    );
   }
   segmentChanged(event){
      console.log(this.segmentModel);
   }
  followback(da){
      if (da.username) {
          this.db.doc(da.username).get().subscribe(doc => {
              da.username = doc.data();
          });
      }
      console.log(da + "...................>>>>>>>");
      console.log(da);
      this.db.collection(da.friendrequest).doc('friend').collection('friend').doc(this.userinfo.success.email).set({
              friend: this.userinfo.success.email,
              username: this.userinfo.success.username
          }).then(() => {
              console.log('Document successfully written!');
          }).catch((error) => {
              console.error('Error writing document: ', error);
          });
       this.authservice.setupFCM(da.data.profile.username, 'Crowd', this.userinfo.success.username + ' follow you','');
      this.remove_add(da.id);
  }
  accept_request(data){
    console.log(data + "...................>>>>>>>");
      this.db.collection(this.userinfo.success.email).doc('friend').collection('friend').doc(data.friendrequest).set({
          friend: data.friendrequest,
          username: data.username
      }).then(() => {
          console.log('Document successfully written!');
          
      }).catch((error) => {
          console.error('Error writing document: ', error);
      });
  }
  remove_add(da){
    this.db.collection(this.userinfo.success.email).doc('friendrequest').collection('list').doc(da).delete();
  }
  async open_post(data, id) {
    console.log(data);
    console.log(id);
     setTimeout(() => {
        this.db.collection(this.userinfo.success.email).doc('notificationlist')
              .collection('notification').doc(id).delete();
    }, 1000);
    if (data){
        const modal = await this.modalController.create({
            component: RedirectPage,
            componentProps: {
                data: data,
                mein_id: id,
       },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }else{
        this.navCtrl.navigateRoot('/tabs/tabs/tab3');
    }
  }
  fallowing(da){
      console.log(da);
      this.fallow = da.id;
      this.request_list.push(da.id);
      this.storage.set('friend_acept',this.request_list);
       this.accept_request(da);
  }

  async get_profile(da) {
     const modal = await this.modalController.create({
     component: ProfileviewerPage,
     componentProps: {
        data: da,
        friend_request:"friend_request"
     },
     cssClass: 'my-custom-class'
     });
     return await modal.present();
     console.log(da);
  } 

}

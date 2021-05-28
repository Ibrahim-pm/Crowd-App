import { Component, OnInit } from '@angular/core';
import { MenuController, NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { TipnowPage } from '../tipnow/tipnow.page';
import { SharePage } from '../share/share.page';
import { ComentPage } from '../coment/coment.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
// import { TipnowPage } from '../tipnow/tipnow.page';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-deeplink',
  templateUrl: './deeplink.page.html',
  styleUrls: ['./deeplink.page.scss'],
})
export class DeeplinkPage implements OnInit {
	data: any;
  data_length: any;
  userinfo: any;
  base64Image: any;
  news: Observable<any[]>;
  friends_list: any = [];
  post_length: any;
  my_data: any;
  my_data_length: any;
  data_fav: any;
  data_fav_length: any;
  data_fav_list: any = [];
  feed_data: any;
  feed_data_list: any = [];
  userimage: any;
  event_refresher: any;
  data_number: any = 8;
  loader: any = 'present';
  keep_remove: any;
  data_get: any;
  commentdata: any;
  mein_id: any;
  data_get_data: any;
  field: any;
  deeplink: any;
  login_value: any = 'false';
  constructor(private firebaseDynamicLinks: FirebaseDynamicLinks,
              private socialSharing: SocialSharing,
              public navParams: NavParams,
              public authservice: AuthService,
              private storage: Storage,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public db: AngularFirestore,
              public platform: Platform,
              private menu: MenuController,
              public modalController: ModalController,
              private camera: Camera,
              private afAuth: AngularFireAuth) {
      this.storage.get('userdata').then((val) => {
          if (val){
              this.userinfo = val;
              this.login_value = 'true';
              this.get_all_values();
              if ( this.userinfo.urimagel){
                  this.userimage = this.userinfo.urimagel;
              }else{
                  this.userimage = '../assets/imgs/profile.svg';
              }
          }else{
              this.login_value = 'false';
         }
    });
  }

  create_link(data){
    this.firebaseDynamicLinks.createShortDynamicLink({
        link: 'https://' + data.id
    }).then((url) => {
        this.share_post(url, data);
    });
  }

  ngOnInit() {
      this.deeplink = this.navParams.get('data');
      let ret = this.deeplink.slice(8);
      this.data_get_data = ret;
      this.getpost_data().subscribe((data) => {
        this.data_get = data;
     });
  }

  get_all_values(){
      this.getAllPosts().subscribe((data) => {
          this.commentdata = data.reverse();
      });
      this.getAllFriends().subscribe((data) => {
          for (let i = 0; i < data.length; i++){
              this.friends_list.push(data[i].friend);
          }
      });
      this.getmydata().subscribe((data) => {
          this.my_data = data;
          this.my_data_length = data.length;
      });
      this.getAllfav().subscribe((data) => {
        this.data_fav = data;
        this.data_fav_length = data.length;
        for (let i = 0; i < data.length; i++){
          this.data_fav_list.push(data[i].post_id);
        }
    });
      this.getfeed().subscribe((data) => {
          this.feed_data = data;
          for (let i = 0; i < data.length; i++){
              this.feed_data_list.push(data[i].data.post_id);
          }
    });
  }




  getpost_data(): Observable<any> {
    return this.db.collection<any>('feed').doc(this.data_get_data).valueChanges();
  }

  getAllPosts(): Observable<any> {
    return this.db.collection<any>('feed/' + this.data_get_data + '/comment').valueChanges();
  }

  getfeed(): Observable<any> {
      return this.db.collection<any>(this.userinfo.success.email + '/keep/' + this.userinfo.success.email + 'keep/', ref => ref.limit(this.data_number)).valueChanges();
  }
  getAllfav(): Observable<any> {
      return this.db.collection<any>('feedfav/feedfav/' + this.userinfo.success.email, ref => ref.orderBy('createdAt').limitToLast(this.data_number)).snapshotChanges().pipe(
          map(actions => actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
          }))
    );
  }

  getAllFriends(): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email + '/friend/friend').valueChanges ();
  }
  getmydata(): Observable<any> {
      return this.db.collection<any>(this.userinfo.success.email).valueChanges ();
  }
  goBack() {
   this.modalController.dismiss();
  }
  async Tipopen(data) {
      if (this.login_value == 'true'){
          const modal = await this.modalController.create({
              component: TipnowPage,
              componentProps: {
                  data,
              },
              cssClass: 'my-custom-class'
          });
          return await modal.present();
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }
  async share_pop() {
      if (this.login_value == 'true'){
          const modal = await this.modalController.create({
              component: SharePage,
              cssClass: 'my-custom-class'
          });
          return await modal.present();
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }
  async coment_pop(data) {
      if (this.login_value = 'true'){
          const modal = await this.modalController.create({
              component: ComentPage,
              componentProps: {
                  data,
              },
              cssClass: 'my-custom-class'
          });
          return await modal.present();
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }

  async camera_capture(){
      const options: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          sourceType: this.camera.PictureSourceType.CAMERA
      };
      this.camera.getPicture(options).then((imageData) => {
          this.base64Image = 'data:image/jpeg;base64,' + imageData;
          this.presentAlert();
          }, (err) => {
      });
  }

  async presentAlert() {
      const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Post',
          inputs: [
              {
                  name: 'msg',
                  type: 'text',
                  placeholder: 'Message'
              },
              {
                  name: 'hash',
                  type: 'text',
                  placeholder: 'HasTech'
              }
              ], buttons: [
                  {
                      text: 'Cancel',
                      role: 'cancel',
                      cssClass: 'secondary',
                      handler: () => {
                          console.log('cancel');
                      }
                      }, {
              text: 'Send',
                  handler: (data: any)  => {
                  console.log(data);
                  this.upload_img(data);
              }
          }
          ]
      });
      await alert.present();
  }
  async upload_img(data){
      const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
      });
      await loading.present();
      this.authservice.ImageUpload(this.base64Image).subscribe((data: any) => {
          if (data){
              loading.dismiss();
              this.base64Image = data.message;
              this.addpost(data);
          }
          }, err => {
          loading.dismiss();
          if (err.error.error){
              this.authservice.presentAlert(err.error.error);
          }else{
              this.authservice.presentAlert(JSON.stringify(err));
          }
        });
  }
  addpost(data) {
      return this.db.collection(this.userinfo.success.email).add({
          msg: data.msg,
          hash: data.hash,
          img: this.base64Image,
          vid: '',
          fav: '',
          post_id: this.post_length,
          from: this.userinfo.success.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log(data.msg);
  }

  addkeep(data, da){
      if (this.login_value == 'true'){
          this.db.collection('keep').doc('keeplist').collection(this.userinfo.success.email).add({
              keep: da,
          }).then(function() {
              console.log('Document successfully written!');
          }).catch(function(error) {
              console.error('Error writing document: ', error);
          });
          if (da == 'true'){
              this.db.collection(this.userinfo.success.email).doc('keep').collection(this.userinfo.success.email + 'keep').doc(this.data_get_data).set({
                  data,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              }).then(function() {
                  console.log('Document successfully written!');
              }).catch(function(error) {
                  console.error('Error writing document: ', error);
              });
              this.db.collection('feed').doc(this.data_get_data).update({
                  keep_count: data.keep_count + 1
              });
          }else{
              this.db.collection(this.userinfo.success.email).doc('keep').collection(this.userinfo.success.email + 'keep').doc(this.data_get_data).delete();
              this.db.collection('feed').doc(this.data_get_data).update({
                  keep_count: data.keep_count - 1
              });
              this.keep_remove = 'remove';
          }
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }


  share_post(da, daa){
      if (this.login_value == 'true'){
          this.socialSharing.share(da).then(() => {
              this.db.collection('feed').doc(daa.id).update({
                  shar_count: daa.shar_count + 1
              });
          }).catch(() => {
      });
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }

  heart_fav(data, da){
      if (this.login_value == 'true'){
          this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).add({
              data,
              post_id: da.post_id,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          }).then(() => {
              console.log(da.fav_count + 1);
              if (data == 'true'){
                  this.db.collection('feed').doc(this.data_get_data).update({
                      fav_count: da.fav_count + 1
                  });
                  this.authservice.setupFCM(da.from, 'Crowd', this.userinfo.success.username + ' like your comment', da);
                  this.db.collection(this.userinfo.success.email).doc('notificationlist').collection('notification').add({
                      notification: this.userinfo.success.username + ' like your comment',
                      data: da,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      profile: this.userinfo.urimagel,
                  });
              }else{
                  console.log('working heart');
              }
          }).catch(function(error) {
              console.error('Error writing document: ', error);
          });
      }else{
          this.authservice.presentAlert( 'Please login first');
      }
  }

  heart_fav_update(data, da, daa){
      if (this.login_value == 'true'){
          console.log(daa);
          this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).doc(this.data_get_data).set({
              data,
              post_id: da.post_id,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          }).then(() => {
              console.log('Document successfully written!');
              if (data == 'true'){
                  console.log(daa.fav_count);
                  console.log(daa.fav_count + 1);
                  this.db.collection('feed').doc(this.data_get_data).update({
                      fav_count: daa.fav_count + 1
                  });
                  this.authservice.setupFCM(da.from, 'Crowd', this.userinfo.success.username + ' like your comment', da);
                  this.db.collection(this.userinfo.success.email).doc('notificationlist').collection('notification').add({
                      notification: this.userinfo.success.username + ' like your comment',
                      data: daa,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      profile: this.userinfo.urimagel,
                  });
              }else{
                  console.log('working heart');
                  this.db.collection('feed').doc(this.data_get_data).update({
                      fav_count: daa.fav_count - 1
                  });
              }
          }).catch(function(error) {
              console.error('Error writing document: ', error);
          });
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }
  add_fav(data, da){
      if (this.login_value == 'true'){
          this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).add({
              data,
              post_id: da.post_id,
          }).then(() => {
              console.log('Document successfully written!');
              if (data == 'true'){
                  this.authservice.setupFCM(da.from, 'Crowd', this.userinfo.success.username + ' like your comment', da);
                  this.db.collection(this.userinfo.success.email).doc('notificationlist').collection('notification').add({
                      notification: this.userinfo.success.username + ' like your comment',
                      data: da,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      profile: this.userinfo.urimagel,
                  });
              }else{
                  console.log('working heart');
              }
          }).catch(function(error) {
              console.error('Error writing document: ', error);
          });
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }

  call_notification(da){
    this.authservice.setupFCM(da.from, 'Crowd', this.userinfo.success.username + ' like your comment', da);
    this.db.collection(this.userinfo.success.email).doc('notificationlist').collection('notification').add({
                  notification: this.userinfo.success.username + ' like your comment',
    });
  }
  comment_post(){
      if (this.login_value == 'true'){
          this.db.collection('feed').doc(this.data_get_data).collection('comment').add({
              comment: this.field,
              username: this.userinfo.success.username,
          }).then(() => {
              console.log('Document successfully written!');
              this.db.collection('feed').doc(this.data_get_data).update({
                  com_count: this.data_get.com_count + 1
              });
              this.field = '';
          }).catch(function(error) {
          console.error('Error writing document: ', error);
          });
      }else{
          this.authservice.presentAlert('Please login first');
      }
  }


}

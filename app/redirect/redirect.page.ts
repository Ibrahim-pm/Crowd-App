import {Component, OnInit, ElementRef, ViewChildren, QueryList, Renderer2,ViewChild} from '@angular/core';
import { MenuController,NavParams } from '@ionic/angular';
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
import { HashtredingPage } from '../hashtreding/hashtreding.page';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ProfileviewerPage } from '../profileviewer/profileviewer.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {AddfriendPage} from "../addfriend/addfriend.page";

import {Router} from '@angular/router';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})
export class RedirectPage implements OnInit {
  data: any;
  data_length:any;
  userinfo:any;
  base64Image:any;
  news: Observable<any[]>;
  friends_list:any=[];
  post_length:any;
  my_data:any;
  my_data_length:any;
  data_fav:any;
  data_fav_length:any;
  data_fav_list:any=[];
  feed_data:any;
  feed_data_list:any=[];
  userimage:any;
  event_refresher:any;
  data_number:any = 8;
  loader:any = "present";         
  keep_remove:any; 
  data_get:any;  	
  commentdata:any;
  mein_id:any;
  data_get_data:any;
  isItemAvailable: any;
  field:any;
  user_data: any;
  items_search:any;  
  notification_value: any;
  name:any;
  safe_data:any;
    SpeakerVideo = false;
    Playing = false;
    removeEventListener;
     attherate:any;
     field_:any;
     written_val:any;
    @ViewChild('player') player: ElementRef;
  constructor(private photoViewer: PhotoViewer,
              private firebaseDynamicLinks: FirebaseDynamicLinks,
              private socialSharing: SocialSharing,
              public navParams: NavParams,
              public authservice: AuthService,
              private storage: Storage,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public db: AngularFirestore,
              public platform:Platform,
              private menu: MenuController,
              public modalController: ModalController,
              private camera: Camera,
              private afAuth: AngularFireAuth,
              private renderer: Renderer2,
              private el: ElementRef,public rout: Router) {
  	this.storage.get('userdata').then((val) => {
         if(val){
             this.userinfo = val;
             this.get_all_values();
             if ( this.userinfo.urimagel){
                 this.userimage = this.userinfo.urimagel;
             }else{
                 this.userimage = '../assets/imgs/profile.svg';
             }
         }
    });
    this.data_get_data = this.navParams.get('data'); 
    // alert(JSON.stringify(this.data_get_data));
    this.call_users_data();
    // this.data_get = this.navParams.get('data'); 
    console.log(this.data_get_data);
      this.removeEventListener = this.renderer.listen(this.el.nativeElement, 'click', (event) => {
          if (event.target instanceof HTMLAnchorElement) {
              // Your custom anchor click event handler
              this.someFunction(event);
          }
      });
  }
    someFunction(evt){
        var name = evt.target || evt.srcElement;
        name = name.innerHTML.replace("@","");
        console.log(name)
        if (this.userinfo.success.username == name){
            this.modalController.dismiss();
            this.rout.navigate(['/tabs/tabs/tab6']);
        }else{
            this.authservice.presentLoading();
            this.authservice.GetUsers().subscribe((data: any) => {
                for(var i=0; i< data.image.length; i++){
                    if(data.image[i][1] == name){
                        this.openModal_2(data.image[i]);
                        break;
                    }
                }
                this.authservice.DismissLoading();
            }, err => {
                if (err.error.error) {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(err.error.error);
                } else {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(JSON.stringify(err.error.error));
                }
            });
        }
    }
    async GotoProfile(da) {
        if (this.userinfo.success.username == da){
            this.modalController.dismiss();
            this.rout.navigate(['/tabs/tabs/tab6']);
        }else{
            this.authservice.presentLoading();
            this.authservice.GetUsers().subscribe((data: any) => {
                for (let i = 0; i < data.image.length; i++){
                    if (data.image[i][1] == da){
                        this.openModal_2(data.image[i]);
                        break;
                    }
                }
                this.authservice.DismissLoading();
            }, err => {
                if (err.error.error) {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(err.error.error);
                } else {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(JSON.stringify(err.error.error));
                }
            });
        }
    }
    async openModal_2(data) {
    if(this.player){
    this.player.nativeElement.pause();
    this.Playing = false;
    }
    
        const modal = await this.modalController.create({
            component: AddfriendPage,
            componentProps: {
                data: data
            }
        });
        return await modal.present();

    }  create_link(data){
    // this.firebaseDynamicLinks.createDynamicLink({
    //     link: data
    // }).then((url) =>{
    //     alert(url);
    //     

    // });
    // console.log(data);
    this.firebaseDynamicLinks.createShortDynamicLink({
        link: "https://"+data.id
    }).then((url)=>{
        // alert("Dynamic link was created:"+url);
        this.share_post(url,data);
    });
  }

   async ngOnInit() {
   }

  get_all_values(){

    this.getpost_data().subscribe((data)=>{
        // this.data_get = data;
        console.log(data);
        for(let i=0; i< data.length; i++){
          // console.log(data[i].id);
          // console.log(this.data_get_data.id);
          if(data[i].id == this.data_get_data.id){
            this.data_get = data[i];
          }
        }
        console.log(data.length);
        console.log(this.data_get);
        if(data.createdAt){
                const t0 = new Date(data.createdAt.seconds * 1000).toISOString();
                const t1 = new Date().toISOString();
                // @ts-ignore
                const d = (new Date(t1)) - (new Date(t0));
                const weekdays     = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
                const days         = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
                const hours        = Math.floor(d / 1000 / 60 / 60    - weekdays * 7 * 24            - days * 24);
                const minutes      = Math.floor(d / 1000 / 60       - weekdays * 7 * 24 * 60         - days * 24 * 60         - hours*60);
                const seconds      = Math.floor(d / 1000          - weekdays * 7 * 24 * 60 * 60      - days * 24 * 60 * 60      - hours*60*60      - minutes*60);
                const t = {};
                ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
                if (t['seconds'] <= 60){
                    this.data_get.createdAt = t['seconds'] + 's';
                }
                 if (t['minutes'] >= 1){
                    this.data_get.createdAt = t['minutes'] + 'm';
                }
                if (t['hours'] >= 1){
                   this.data_get.createdAt = t['hours'] + 'h';
                }
                 if (t['days'] >=1){
                    this.data_get.createdAt = t['days'] + 'd';
                }
            }else{
                this.data_get.createdAt = '1s';
            }
            console.log(this.data_get.createdAt)
      });

    this.getAllPosts().subscribe((data)=>{
        this.commentdata = data.reverse();
        console.log(this.commentdata);
        for(let i=0;i<this.commentdata.length;i++){
            if(this.commentdata[i].createdAt){
                const t0 = new Date(this.commentdata[i].createdAt.seconds * 1000).toISOString();
                const t1 = new Date().toISOString();
                // @ts-ignore
                const d = (new Date(t1)) - (new Date(t0));
                const weekdays     = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
                const days         = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
                const hours        = Math.floor(d / 1000 / 60 / 60    - weekdays * 7 * 24            - days * 24);
                const minutes      = Math.floor(d / 1000 / 60       - weekdays * 7 * 24 * 60         - days * 24 * 60         - hours*60);
                const seconds      = Math.floor(d / 1000          - weekdays * 7 * 24 * 60 * 60      - days * 24 * 60 * 60      - hours*60*60      - minutes*60);
                const t = {};
                ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
                if (t['seconds'] <= 60){
                    this.commentdata[i].createdAt = t['seconds'] + 's';
                }
                 if (t['minutes'] >= 1){
                    this.commentdata[i].createdAt = t['minutes'] + 'm';
                }
                 if (t['hours'] >= 1){
                    this.commentdata[i].createdAt = t['hours'] + 'h';
                }
                 if (t['days'] >=1){
                    this.commentdata[i].createdAt = t['days'] + 'd';
                }
            }else{
                this.commentdata[i].createdAt = '1s';
            }
            console.log(this.commentdata[i].createdAt);
        }
        console.log(data.length);
        console.log(data);
    });  

    this.getAllFriends().subscribe((data)=>{
        console.log(data);
        for(let i=0;i<data.length;i++){
          this.friends_list.push(data[i].friend);
        }
        console.log(this.friends_list);
    });

    this.getmydata().subscribe((data)=>{
        console.log(data);
        this.my_data = data;
        this.my_data_length = data.length;
    });
    this.getAllfav().subscribe((data)=>{
        console.log(data);
        this.data_fav = data;
        console.log(this.data_fav);
        this.data_fav_length = data.length;
        for(let i=0;i<data.length;i++){
          this.data_fav_list.push(data[i].post_id);
        }
        console.log(this.data_fav_list);
    });

    this.getfeed().subscribe((data)=>{
        console.log(data);
        this.feed_data = data;
        for(let i=0;i<data.length;i++){
          this.feed_data_list.push(data[i].data.post_id);
          console.log(data[i].data.post_id);
        }
        console.log(this.userinfo.success.email +'/keep/'+this.userinfo.success+'keep/');
    });
  } 




 onSearchChange(searchValue: string ) {
    const firstchar = searchValue;
    console.log(firstchar.match(/@[a-z]+/gi));
    if (firstchar.match(/@[a-z]+/gi)) {
        console.log('search people');
        var get_length = firstchar.match(/@[a-z]+/gi);
        this.attherate =  firstchar.match(/@[a-z]+/gi)[get_length.length - 1];
        const value = firstchar.match(/@[a-z]+/gi);
        const val = value[(value.length) - 1];
        this.getItems(val);
      }
      else if (firstchar === '#') {
      } else {
    }
    if (firstchar.slice(-1) == '@'){
      this.name = 'search people';
      this.items_search = this.user_data.image;
      this.getItems('');
    }else if (firstchar.slice(-1) == ' '){
      this.name = null;
    }
  }
  call_users_data(){
    this.authservice.GetUsers().subscribe((data: any) => {
        this.user_data = data;
        this.safe_data = data.image;
    }, err => {
        if (err.error.error){
            this.authservice.presentAlert( err.error.error);
        }else{
            this.authservice.presentAlert( JSON.stringify(err));
        }
    });
  }
  getItems(ev) {
      this.items_search = this.user_data.image;
      const val = ev.replace('@', '');
      if (val && val.trim() !== '') {
          this.isItemAvailable = true;
          this.items_search = this.items_search.filter((item: any) => {
              return (item[1].toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
      } else {
          this.isItemAvailable = false;
      }
  }
  send_notification(da){
    //   this.notification_value = da[1];
    // this.name = null;
    // if (this.field.match(/@[a-z]+/gi)){
    //   this.field = this.field.replace((this.field.match(/@[a-z]+/gi))[(this.field.match(/@[a-z]+/gi)).length - 1], '@' + da[1]);
    // }else{
    //   this.field = this.field.replace(this.field.slice(-1), '@' + da[1]);
    // }
    // this.items_search = this.user_data.image;
    // this.items_search = null;
    this.notification_value = da[1];
    this.name = null;
    this.field_ = this.field;
    if(this.field.match(/@[a-z]+/gi)){
      var value_get = this.field.replace(this.field.slice(-1));
    }else{
      this.field = this.field + da[1];
    }

    if(this.field.replace(this.field.slice(-1)) == 'undefined'){
      if(this.attherate){
        this.field = this.field + da[1];

      }else{
        this.field = this.field + da[1];

      }
    }else if((value_get.match(/undefined/gi)[value_get.match(/undefined/gi).length - 1]) == 'undefined'){
      if(this.attherate){
        this.field = this.field.replace(this.written_val,'');
        this.field = this.field + da[1];

      }else{
        this.field = this.field + da[1];
      }
    }


    this.items_search = this.user_data.image;
    this.items_search = null;

  }
  call_notification(){
      this.data.username = this.userinfo.success.email
    this.authservice.setupFCM(this.notification_value, 'Crowd', this.userinfo.success.username + 'Tag you on post', this.data);
  }
  


   comment_post(){
    var p = this.field;
      var checkp = p.replace(/@/g, " @");

      if(checkp){
          p= checkp;
      }else{
          p=p;
      }
      console.log(p);
      var array=p.split(' ');

      var array2=[];
      for(var i=0;i<array.length;i++){
          if(array[i].includes('@')){
              array2.push(array[i]);
          }
          else{}
      }

      var array3=[];
      for(var j=0;j<array2.length;j++){
          var temp=array2[j];
          array3.push(temp.replace('@','<a>@')+"</a>");
      }
      var rp=p;
      for(var k=0;k<array3.length;k++){
          rp=rp.replace(' ' +array2[k], array3[k]);
      }
      this.field = rp;
    this.db.collection('feed').doc(this.data.id).collection('comment').add({
          comment: this.field,
          username: this.userinfo.success.username,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
      }).then(() => {
          this.db.collection('feed').doc(this.data.id).update({
            com_count: this.data_get.com_count + 1
          });
          this.field = '';
        if(this.data.from != this.userinfo.success.email) {
          this.data.username = this.userinfo.success.email;
            this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' commented on your Post', this.data);
            this.db.collection(this.data.from).doc('notificationlist')
                .collection('notification').add({
                notification: this.userinfo.success.username + ' comment on your Post',
                data: this.data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
            });
        }
        this.call_notification();
      })
      .catch((error) => {
          console.error('Error writing document: ', error);
      });
  }

  getpost_data (): Observable<any> {
    // alert(this.data_get_data.id);
    // return this.db.collection<any>('feed').doc(this.data_get_data.id).valueChanges();
    console.log(this.data_get_data.id);
     let datas = [];
        return this.db.collection<any>('feed').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id as any;
                // if (data.profile) {
                //     this.db.doc(data.profile).get().subscribe(doc => {
                //         data.profile = doc.data();
                //     });
                // }
                if (data.username) {
                    this.db.doc(data.username).get().subscribe(doc => {
                        data.username = doc.data();
                    });
                }
                return {id,data, ...data};
                //return  { id, ...data };
            }))
        )
  }

  getAllPosts (): Observable<any> {
    // console.log(this.data_mein[2]);
    // return this.db.collection<any>('feed/'+ this.data_get_data.id +'/comment').valueChanges();
    let datas = [];
        return this.db.collection<any>('feed/'+ this.data_get_data.id +'/comment',ref => ref.orderBy('createdAt')).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id as any;
                // if (data.profile) {
                //     this.db.doc(data.profile).get().subscribe(doc => {
                //         data.profile = doc.data();
                //     });
                // }
                if (data.profile) {
                    this.db.doc(data.profile).get().subscribe(doc => {
                        data.profile = doc.data();
                    });
                }
                return {id,data, ...data};
                // return  { id, ...data };
            }))
        )

  }

  getfeed (): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email +'/keep/'+this.userinfo.success.email+'keep/',ref => ref.limit(this.data_number)).valueChanges();
  }

// getAllPosts

  getAllfav (): Observable<any> {
    // return this.db.collection<any>('feedfav/feedfav/'+this.userinfo.success.email).valueChanges ();
    return this.db.collection<any>('feedfav/feedfav/'+this.userinfo.success.email,ref => ref.orderBy('createdAt').limitToLast(this.data_number)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getAllFriends (): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email +'/friend/friend').valueChanges ();
  }

  getmydata (): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email).valueChanges ();
  }


  goBack() {
   this.modalController.dismiss();
  }

  async Tipopen(data) {
   const modal = await this.modalController.create({
   component: TipnowPage,
   componentProps: {
      data: data, 
   },
   cssClass: 'my-custom-class'
   });
   return await modal.present();
  }

  async share_pop() {
   const modal = await this.modalController.create({
   component: SharePage,
   cssClass: 'my-custom-class'
   });
   return await modal.present();
  }

  async coment_pop(data) {
   const modal = await this.modalController.create({
   component: ComentPage,
   componentProps: {
      data: data, 
   },
   cssClass: 'my-custom-class'
   });
   return await modal.present();
  }

  async camera_capture(){
    const options: CameraOptions = {
     quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.CAMERA
    }

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
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("cancel");
          }
        }, {
          text: 'Send',
          handler:(data: any)  => {
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
        this.authservice.ImageUpload(this.base64Image).subscribe((data :any) => {
                if (data){
                   console.log(data); 
                   loading.dismiss();
                   this.base64Image = data.message;
                   this.addpost(data);
                }
            }, err => {
              loading.dismiss();
                if (err.error.error){
                    this.authservice.presentAlert( err.error.error); 
                }else{
                    this.authservice.presentAlert( JSON.stringify(err));
                }
        });
  }

  addpost(data) {
    return this.db.collection(this.userinfo.success.email).add({
      msg: data.msg,
      hash: data.hash,
      img: this.base64Image,
      vid: "",
      fav: "",
      post_id:this.post_length,
      from: this.userinfo.success.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log(data.msg);
  }

  addkeep(data,da){
    console.log(data);
    console.log(da);
    this.db.collection('keep').doc('keeplist').collection(this.userinfo.success.email).add({
          keep: da,
      })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
    });
    if(da == 'true'){
      console.log(data);
      this.db.collection(this.userinfo.success.email).doc('keep')
                              .collection(this.userinfo.success.email+'keep').doc(this.data_get_data.id).set({
            data: data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),

        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        this.db.collection('feed').doc(this.data_get_data.id).update({
              keep_count: data.keep_count + 1
            });
    }else{
      this.db.collection(this.userinfo.success.email).doc('keep')
                              .collection(this.userinfo.success.email+'keep').doc(this.data_get_data.id).delete();
            this.db.collection('feed').doc(this.data_get_data.id).update({
              keep_count: data.keep_count - 1
            });
            this.keep_remove = 'remove';
    }
  }

 share_post(da,daa){
    this.socialSharing.share(da).then(() => {
      this.db.collection('feed').doc(daa.id).update({
              shar_count: daa.shar_count + 1
      });
    }).catch(() => {
      // Sharing via email is not possible
    });
  }
  heart_fav(data,da){ 
    this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).add({
          data: data,
          post_id: da.post_id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),

      })
      .then(() => {
          console.log("Document successfully written!");
          console.log(da.fav_count);
          console.log(da.fav_count+1);
          if(data == 'true'){
            this.db.collection('feed').doc(this.data_get_data.id).update({
              fav_count: da.fav_count + 1
            });
            console.log(da.from);
              if(da.from != this.userinfo.success.email) {
                da.username = this.userinfo.success.email
                  this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' liked your post', da);
                  this.db.collection(this.userinfo.success.email).doc('notificationlist')
                      .collection('notification').add({
                      notification: this.userinfo.success.username + ' liked your post',
                      data: da,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
                  });
              }
          }else{
            console.log("working heart");
          }
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }

  heart_fav_update(data,da,daa){
    console.log(daa);
    this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).doc(this.data_get_data.id).set({
          data: data,
          post_id: da.post_id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),

      })
      .then(() => {
          console.log("Document successfully written!");
          if(data == 'true'){
            console.log(daa.fav_count);
            console.log(daa.fav_count+1);
            this.db.collection('feed').doc(this.data_get_data.id).update({
              fav_count: daa.fav_count + 1
            });
              console.log(daa.from);
              if(daa.from != this.userinfo.success.email) {
                daa.username = this.userinfo.success.email
                  this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' liked your post', daa);
                  this.db.collection(this.userinfo.success.email).doc('notificationlist')
                      .collection('notification').add({
                      notification: this.userinfo.success.username + ' liked your post',
                      data: daa,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      profile: this.db.doc(this.userinfo.success.email+'/profile').ref,

                  });
              }
          }else{
            console.log("working heart");
            this.db.collection('feed').doc(this.data_get_data.id).update({
              fav_count: daa.fav_count - 1
            });
          }
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }
  add_fav(data,da){
    this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).add({
          data: data,
          post_id: da.post_id,
      })
      .then(() => {
          console.log("Document successfully written!");
          if(data == 'true'){
              if(da.from != this.userinfo.success.email) {
                da.username = this.userinfo.success.email
                  this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' liked your post', da);
                  this.db.collection(this.userinfo.success.email).doc('notificationlist')
                      .collection('notification').add({
                      notification: this.userinfo.success.username + ' liked your post',
                      data: da,
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
                  });
              }
          }else{
            console.log("working heart");
          }
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }

  // call_notification(da){
  //   this.authservice.setupFCM(da.from,'Crowd',this.userinfo.success.username+' like your comment',da);
  //           this.db.collection(this.userinfo.success.email).doc('notificationlist')
  //                             .collection('notification').add({
  //                 notification: this.userinfo.success.username + ' like your comment',
  //             });  
  // }

  // comment_post(){
  //   this.db.collection('feed').doc(this.data_get_data.id)
  //                           .collection('comment').add({
  //         comment: this.field,
  //         username: this.userinfo.success.username,
  //     })
  //     .then(() => {
  //         console.log("Document successfully written!");
  //         this.db.collection('feed').doc(this.data_get_data.id).update({
  //           com_count: this.data_get.com_count + 1
  //         });
  //         this.field = "";
  //     })
  //     .catch(function(error) {
  //         console.error("Error writing document: ", error);
  //     });
  // }


    async get_profile(da) {
      if (this.player){
            this.player.nativeElement.pause();
            this.Playing = false;
      }
     const modal = await this.modalController.create({
     component: ProfileviewerPage,
     componentProps: {
        data: da, 
     },
     cssClass: 'my-custom-class'
     });
     return await modal.present();
    } 

    async get_post_detail(data) {
       if (this.player){
            this.player.nativeElement.pause();
            this.Playing = false;
      }
     const modal = await this.modalController.create({
     component: HashtredingPage,
     componentProps: {
        hash: data, 
     },
     cssClass: 'my-custom-class'
     });
     return await modal.present();
    } 

    async ShowImage(ShowImage){
            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                // header: 'Confirm!',
                message: 'Viewer discretion is advised, would you like to proceed?',
                buttons: [
                     {
                        text: 'Yes',
                        handler: () => {
                            this.photoViewer.show(ShowImage);
                        }
                    },
                ]
            });
            await alert.present();
    }
    playOrPause(player){
        if (this.Playing){
            this.player.nativeElement.pause();
            this.Playing = false;
        }else{
            this.player.nativeElement.play();
            this.Playing = true;
        }
        console.log(this.Playing)
    }
    Mutebutton(player){
        if (this.SpeakerVideo){
            this.player.nativeElement.muted = false;
            this.SpeakerVideo = false;
        }else{
            this.player.nativeElement.muted = true;
            this.SpeakerVideo = true;
        }
    }
}

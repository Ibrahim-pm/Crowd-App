import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
// import { VideoCapturePlus, VideoCapturePlusOptions, MediaFile } from '@ionic-native/video-capture-plus/ngx';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import { MediaCapture, CaptureVideoOptions, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LoadingController } from '@ionic/angular';
import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { HttpHeaders } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import { Crop } from '@ionic-native/crop/ngx';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})

export class Tab5Page implements OnInit {
  isItemAvailable = false;
  userinfo: any;
  whats_mind: any = '';
  base64Image: any = '';
  base64Imageshow: any = '';
  testing: any;
  hash: any = '';
  video64: any = '';
  capturedFile: any;
  items: any;
  viedosss: any;
  filenamessss: any;
  video644: any;
  hash_values: any = [];
  privacy: any;
  post_length: any = 0;
  file: any;
  filenamesss: any;
  post_type: any;
  fav_count: any = 0;
  com_count: any = 0;
  keep_count: any = 0;
  shar_count: any = 0;
  video_type: any;
  image_type: any;
  tipcount: any = 0;
  atthe_values: any = [];
  items_search: any;
  name: any;
  user_data: any;
  value_once: any = 'true';
  notification_value: any;
   showtrue = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    secondurl: any = '';
    hash_second: any = [];
    safe_data: any;
    attherate:any;
    written_val:any;
    whats_mind_: any = '';
  constructor(public alertController: AlertController, private filep: File, private imageResizer: ImageResizer, private crop: Crop, private http: HttpClient, private fcm: FCM, public loadingController: LoadingController, private androidPermissions: AndroidPermissions, private platform: Platform, private transfer: FileTransfer, private media: Media, private mediaCapture: MediaCapture, public authservice: AuthService, private storage: Storage, public modalController: ModalController, private camera: Camera, private photoLibrary: PhotoLibrary, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
  	  this.storage.get('userdata').then((val) => {
  	    this.userinfo = val;
  	  });
     this.call_users_data();
     storage.get('privacy').then((val) => {
        if (val){
          this.privacy = val;
        }else{
          this.privacy = false;
        }
      });
  }

  onSearchChange(searchValue: string ) {
    const firstchar = searchValue;
    if(firstchar.match(/@[a-z]+/gi)){
      var get_length = firstchar.match(/@[a-z]+/gi);
      this.attherate =  firstchar.match(/@[a-z]+/gi)[get_length.length - 1];
    }
    if (firstchar.match(/@[a-z]+/gi)) {
        console.log('search people');
        const value = firstchar.match(/@[a-z]+/gi);
        const val = value[(value.length) - 1];
        console.log(firstchar);
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
            this.authservice.presentAlert( JSON.stringify(err.error.error));
        }
    });
  }

  getItems(ev) {
      // this.written_val = ev;
      this.items_search = this.user_data.image;
      const val = ev.replace('@', '');
      this.written_val = val;
      if (val && val.trim() !== '') {
          this.isItemAvailable = true;
          this.items_search = this.items_search.filter((item: any) => {
              return (item[1].toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
          console.log(this.items_search);
      } else {
          this.isItemAvailable = false;
      }
  }

  send_notification(da){
      this.notification_value = da[1];
    this.name = null;
    this.whats_mind_ = this.whats_mind;
    if(this.whats_mind.match(/@[a-z]+/gi)){
      var value_get = this.whats_mind.replace(this.whats_mind.slice(-1));
    }else{
      this.whats_mind = this.whats_mind + da[1];
    }

    if(this.whats_mind.replace(this.whats_mind.slice(-1)) == 'undefined'){
      if(this.attherate){
        this.whats_mind = this.whats_mind + da[1];

      }else{
        this.whats_mind = this.whats_mind + da[1];

      }
    }else if((value_get.match(/undefined/gi)[value_get.match(/undefined/gi).length - 1]) == 'undefined'){
      if(this.attherate){
        this.whats_mind = this.whats_mind.replace(this.written_val,'');
        this.whats_mind = this.whats_mind + da[1];

      }else{
        this.whats_mind = this.whats_mind + da[1];
      }
    }


    this.items_search = this.user_data.image;
    this.items_search = null;


  }

  ngOnInit() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
            }
          });
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    );
    this.getAllPosts().subscribe((data) => {
        this.post_length = data.length;
    });
  }

  getAllPosts(): Observable<any> {
    return this.afs.collection<any>('feed').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  dismiss() {
	   this.modalController.dismiss();
  }

  capturessVideo(){
            const options: CaptureVideoOptions = {limit: 1};
            this.mediaCapture.captureVideo(options)
                .then((videodata: MediaFile[]) => {
                    this.viedosss = videodata;
                    this.video64 = videodata;
                    this.base64Image = '';
                    this.filenamesss = this.viedosss[0].name;
                });
  }

  getAllHash(): Observable<any> {
    return this.afs.collection<any>('hash').valueChanges ();
  }

  async uplodeVideo(videodata){
        const datetime: any = new Date();
        this.items = JSON.stringify(videodata);
        this.items.substring(2);
        this.items.substring(0, this.items - 2);
        const x = this.items.split(',');
        let sec = x[1].slice(12);
        sec = sec.slice(0, -1);
        const y = x[x.length - 1];
        const z = y.split('.');
        let a = z[1];
        a = a.slice(0, -3);
        const filename = 'name' + '.' + a;
        const fileTransfer: FileTransferObject = this.transfer.create();
        const options1: FileUploadOptions = {
            fileName: filename,
            fileKey: 'video',
            mimeType: 'video/mp4',
            params: {app_key: 'Testappkey'},
            chunkedMode: false
        };
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        const rootURl3 = 'https://crowd.tutourist.com/api/uservideo';
        fileTransfer.upload(sec, rootURl3, options1)
            .then((data: any) => {
              loading.dismiss();
              this.video644 = JSON.parse(data.response);
              this.video64 = this.video644.success;
              this.addChatMessage();
            }, (err) => {
                console.log(err);
                loading.dismiss();
                alert('err' + JSON.stringify(err.error.error));
            });
  }

  send_sms_check(){
    this.hash_values = this.whats_mind.match(/#[a-z]+/gi);
    if (this.hash_values != null){
      this.hash_second = this.hash_values;
      const length_val = (this.whats_mind.match(/#[a-z]+/gi)).length;
      for (let i = 0; i < length_val ; i++){
        this.whats_mind = this.whats_mind.replace(this.hash_second[i], '');
      }
      this.hash = this.hash_values.join(' ');
    }
    this.atthe_values = this.whats_mind.match(/@[a-z]+/gi);
    if (this.video64 != ''){
      this.post_type = 'video';
      if (this.video_type != 'gallery'){
        this.uplodeVideo(this.viedosss);
      }else{
        this.addChatMessage();
      }
    }
    if (this.base64Image != ''){
      this.post_type = 'image';
      if (this.image_type != 'gallery'){
        this.upload_img();
      }else{
        this.addChatMessage();
      }
    }
    if (this.video64 == '' && this.base64Image == ''){
      this.post_type = 'post';
      this.addChatMessage();
    }

    this.call_notification();
  }
  call_notification(){
    this.authservice.setupFCM(this.notification_value, 'Crowd', this.userinfo.success.username + 'Tag you on post' , this.userinfo.success.email);
  }
  removeDuplicates(data){
      return data.filter((value,index)=>data.indexOf(value)===index);
  }
  addChatMessage() {
      var p = this.whats_mind;
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
      this.whats_mind = rp;
    const output = this.afs.collection('feed').doc(JSON.stringify('x' + this.post_length)).set({
        msg: rp,
        userid: this.userinfo.success.id,
        hash: this.hash_second,
        img: this.base64Image,
        vid: this.video64,
        from: this.userinfo.success.email,
        privacy: this.privacy,
        fav: 'false',
        keep: 'false',
        post_type: this.post_type,
        username: this.afs.doc(this.userinfo.success.email+'/profile').ref,
        post_id: JSON.stringify('x' + this.post_length),
        profile: this.afs.doc(this.userinfo.success.email+'/profile').ref,
        fav_count: this.fav_count,
        com_count: this.com_count,
        keep_count: this.keep_count,
        shar_count: this.shar_count,
        post_email: this.userinfo.success.email,
        tipcount: this.tipcount,
        secure: this.secondurl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(value => {
        this.add_feed(rp);
      });
  }
  add_feed(rp){
     return this.afs.collection(this.userinfo.success.email).doc(JSON.stringify('x' + (this.post_length - 1))).set({
        msg: rp,
        userid: this.userinfo.success.id,
        hash: this.hash_second,
        img: this.base64Image,
        vid: this.video64,
        from: this.userinfo.success.email,
        fav: 'false',
        keep: 'false',
        privacy: this.privacy,
        post_type: this.post_type,
        post_id: JSON.stringify('x' + (this.post_length - 1)),
        username: this.afs.doc(this.userinfo.success.email+'/profile').ref,
        profile: this.afs.doc(this.userinfo.success.email+'/profile').ref,
        // profile: this.userinfo.urimagel,
        fav_count: this.fav_count,
        com_count: this.com_count,
        keep_count: this.keep_count,
        shar_count: this.shar_count,
        tipcount: this.tipcount,
        secure: this.secondurl,
        post_email: this.userinfo.success.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(value => {
        this.call_hash(this.hash);
        this.modalController.dismiss();
      });
  }
  call_hash(da){
        this.authservice.heshtag(da).subscribe((data: any) => {
                if (data){
                }
            }, err => {
                if (err.error.error){
                    this.authservice.presentAlert( err.error.error);
                }else{
                    this.authservice.presentAlert( JSON.stringify(err.error.error));
                }
            });
  }
  async camera_capture(){
      const options: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          sourceType: this.camera.PictureSourceType.CAMERA,
      };
      this.camera.getPicture(options).then((imageData) => {
          this.video64 = '';
          this.cropImage(imageData);
          }, (err) => {
      });
  }
  cropImage(fileUrl) {
      this.crop.crop(fileUrl, { quality: 50 })
          .then(
              newPath => {
                  this.showCroppedImage(newPath.split('?')[0]);
              },
              error => {
                  alert('Error cropping image' + error);
              });
    }
   async gallery_capture(){
      const options: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      };
      this.camera.getPicture(options).then((imageData) => {
          this.video64 = '';
          this.cropImage(imageData);
          }, (err) => {
      });
  }
  showCroppedImage(ImagePath) {
        const copyPath = ImagePath;
        const splitPath = copyPath.split('/');
        const imageName = splitPath[splitPath.length - 1];
        const filePath = ImagePath.split(imageName)[0];
        this.filep.readAsDataURL(filePath, imageName).then(base64 => {
            this.base64Image = base64;
        }, error => {
            alert('Error in showing image' + error);
        });
    }
  async upload_img(){
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        this.authservice.ImageUpload(this.base64Image).subscribe((data: any) => {
                if (data){
                    loading.dismiss();
                    if (data.response == 'good' ){
                        this.base64Image = data.secondurl;
                        this.addChatMessage();
                    }
                    if (data.response == 'adult' ){
                        this.presentAlert(data.response, 'violation of user agreement');
                        this.base64Image = '';
                    }
                    if (data.response == 'medical' || data.response == 'violence' || data.response == 'racy' ){
                        this.base64Image = data.success;
                        this.secondurl = data.secondurl;
                        this.addChatMessage();
                    }
                }
                loading.dismiss();
            }, err => {
              loading.dismiss();
              if (err.error.error){
                    this.authservice.presentAlert( err.error.error);
                }else{
                    this.authservice.presentAlert( JSON.stringify(err.error.error));
                }
            });
  }
    async presentAlert(response, messages) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            subHeader: response,
            message: messages,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.addChatMessage();
                    }
                }
            ]
        });
        await alert.present();
    }
    changeListener(evt) {
        this.file = evt.target.files[0];
        this.filenamessss = this.file.name;
        if (this.file.type == 'image/png' || this.file.type == 'image/jpeg' || this.file.type == 'image/JPEG'){
               this.showtrue = true;
               this.imageChangedEvent = evt;
           }else{
               this.addbrows();
           }
    }
   addbrows(){
        if (this.file.type == 'video/mp4' || this.file.type == 'video/quicktime' )
        {
            this.authservice.UplodeVieo(this.file).subscribe((data: any) => {
                this.video64 = data.success;
                this.video_type = 'gallery';
            }, err => {
                console.log(err);
            });
        }
        else if (this.file.type == 'image/png' || this.file.type == 'image/jpeg' || this.file.type == 'image/JPEG'){
        }else{
            this.authservice.presentAlert( 'Upload only image and video');
        }
    }

    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
    }
    Done(){
        this.base64Image = this.croppedImage;
        this.croppedImage = '';
        this.imageChangedEvent = '';
        this.showtrue = false;
    }


    call_notification_all(){}

}

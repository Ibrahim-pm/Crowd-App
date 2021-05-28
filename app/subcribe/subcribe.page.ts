import { NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { TipnowPage } from '../tipnow/tipnow.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { ActivatedRoute } from '@angular/router';
import { MediaCapture, CaptureVideoOptions, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer/ngx';
// import {Observable} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
declare var OT: any;
@Component({
  selector: 'app-subcribe',
  templateUrl: './subcribe.page.html',
  styleUrls: ['./subcribe.page.scss'],
})
export class SubcribePage implements OnInit {
  session: any;
  publisher: any;
  apiKey: any;
  sessionId: string;
  token: string;
  userinfo: any;
  userimage: any;
  subscribe_token: any;
  page_detail: any;
  page_sessionId: any;
  page_token: any;
  session_value: any;
  publisher_value: any;


  smallPreview: boolean;
  IMAGE_PATH: any;
  colorEffect = 'none';
  setZoom = 1;
  flashMode = 'off';
  isToBack = false;
  live_video_live: any = 'false';
  items: any;
  camera_off: any = 'false';
  Live_stop: any = 'false';
  button_css: any = 'live';
  second_time: any = 'no';
  user_id_live:any;
  da_data:any;
  da_dat:any;
  da_da:any;
  da_d:any;
  from_check:any;
  data_from_check:any;
  live_is_live:any;
  user_email:any;
  data_create: any = '{com_count: 1,createdAt: t {seconds: 1614230032, nanoseconds: 71000000},fav: "false",fav_count: 2,from: "shazzy@gmail.com",hash: "",id: ""x17"",img: "",keep: "false",keep_count: 0,msg: "world ",post_email: "tkamrant@gmail.com",post_id: 131,post_type: "post",privacy: false,profile: "",shar_count: 0,tipcount: 0,userid: 63,username: "kamran tariq",vid: ""}';
  constructor(private transfer: FileTransfer,
              private mediaCapture: MediaCapture,
              public activatedRoute: ActivatedRoute,
              public navParams: NavParams,
              private firebaseDynamicLinks: FirebaseDynamicLinks,
              private androidPermissions: AndroidPermissions,
              private socialSharing: SocialSharing,
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
    this.page_detail = this.navParams.get('data');

    this.da_data = this.navParams.get('da');
    this.da_dat = this.navParams.get('daa');
    this.da_da = this.navParams.get('daaa');
    this.from_check = this.navParams.get('from');
    this.user_email = this.navParams.get('user_email');
    console.log(this.from_check);
    // alert(JSON.stringify(this.page_detail.data));
    // alert(JSON.parse(this.page_detail.data).success);
    // alert(JSON.parse(this.page_detail.data).success.id);
    console.log(this.page_detail);
    if(this.page_detail){
      this.user_id_live = JSON.parse(this.page_detail.data).success.id;
    }

    // alert(JSON.stringify(this.user_id_live));
    this.apiKey = '47118074';
    // if(this.page_detail != undefined){
    //   if (this.page_detail == 'data'){
    //     console.log('working');
    //   }else{
    //     console.log(this.page_detail);
    //     this.session_value = 'true';
    //     this.sessionId = this.page_detail.sessionId;
    //     this.token = this.page_detail.token;
    //     this.apiKey = '47118074';
    //     this.startCall();
    //   }
    // }


    

    if(this.page_detail != undefined){
      if (this.page_detail == 'data'){
        console.log('working');
      }else{
        console.log(this.page_detail);
        this.session_value = 'true';
        // alert(JSON.stringify(this.page_detail));
        // this.subscribe_token = this.page_detail.token;
        this.sessionId = this.page_detail.sessionId;
        this.token = this.page_detail.token;
        this.apiKey = '47118074';
        this.startCall();
      }
    }else{
      // alert("working");
    }

    if(this.da_data == "friend_list"){
      // alert("working");
      console.log(this.page_detail);
      this.session_value = 'true';
      // alert(JSON.stringify(this.page_detail));
      // this.subscribe_token = this.page_detail.token;
      this.sessionId = this.da_dat;
      // alert(this.sessionId);
      // alert(this.sessionId);
      this.token = this.da_da;
      // alert(this.token);
      // alert(this.token);
      this.apiKey = '47118074';
      this.startCall();
    }

    this.storage.get('userdata').then((val) => {
      if (val){
        this.userinfo = val;

        if ( this.userinfo.urimagel){
          this.userimage = this.userinfo.urimagel;
        }else{
          this.userimage = '../assets/imgs/profile.svg';
        }
        // console.log(this.userinfo.success.email+'/friend_live/'+this.from_check);
        
      }
    });
  }

   getAlldata(): Observable<any> {
    return this.db.collection<any>(this.user_email+'/friend_live/friend_live/').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


  goBack() {
    this.session.off();
    this.session.disconnect();
    // this.modalController.dismiss(); 
    // this.call_allfriends_delete();
    this.modalController.dismiss();
    // this.cameraPreview.stopCamera();
  }
  async get_live_(){
    if (this.second_time == 'no'){
      this.button_css = 'live';
      this.Live_stop = 'true';
      this.stopCamera();
      this.live_video_live = 'true';
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      });
      await loading.present();
      this.authservice.get_livetoken().subscribe((data: any) => {
        if (data){
          this.sessionId = data.sessionId;
          this.token = data.token;
          this.subscribe_token = data.subscribe_token;
          this.publisher_value = 'true';
          setTimeout(() => {
            this.startCall();
            loading.dismiss();
          }, 1000);
          this.call_allfriends();
        }
      }, err => {
        loading.dismiss();
        if (err.error.error){
          this.authservice.presentAlert( err.error.error);
        }else{
          this.authservice.presentAlert( JSON.stringify(err.error.error));
        }
      });
    }else{
      this.authservice.presentAlert('Please, Come live after few minutes');
      this.goBack();
    }
  }
  ngOnInit() {
    this.getAlldata().subscribe((data) => {
              console.log(data);
              this.live_is_live =data;
              for(let i=0; i<data.length;i++){
                if(this.from_check == data[i].from){
                  this.live_is_live = data[i].from;
                    if(!this.live_is_live){
                      this.goBack();
                    }
                  console.log(this.live_is_live);
                }
              }
              if(data.length < 1){
                this.goBack();
              }
        }); 
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.RECORD_VIDEO, this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION ]);
    setTimeout(() => {
    }, 1000);
  }
  call_allfriends(){
    this.getAllFriends().subscribe((data) => {
      for (let i = 0; i < data.length; i++){
        this.authservice.setupFCM_call(data[i].friend, 'Crowd', this.userinfo.success.username + ' is live', this.subscribe_token, this.userinfo, this.token, this.sessionId);
      }
    });
  }
  getAllFriends(): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email + '/friend/friend').valueChanges ();
  }
  // startCall() {
  //   this.session = OT.initSession(this.apiKey, this.sessionId);
  //   const pubOptions = {publishVideo: false, style: {buttonDisplayMode: 'off'}};
  //   this.publisher = OT.initPublisher();
  //   this.session.on({
  //     streamCreated: (event: any) => {
  //       this.session.subscribe(event.stream, 'subscriber');
  //       OT.updateViews();
  //     },
  //     streamDestroyed: (event: any) => {
  //       alert('Stream ended');
  //       OT.updateViews();
  //     },
  //     sessionConnected: (event: any) => {
  //       this.session.publish(this.publisher);
  //     }
  //   });
  //   this.session.connect(this.token, (error: any) => {
  //     if (error) {
  //       alert('There was an error connecting to the live');
  //     }
  //   });
  // }


  startCall(){
    this.initializeOTSession();
  }


  initializeOTSession() {
    this.session = OT.initSession(this.apiKey, this.sessionId);
    this.startSession(this.session);

  }
  async startSession(session: any) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present(); 
    session.connect(this.token, (error: any) => {

      if (error) {
        if (error.name === "OT_NOT_CONNECTED") {
          alert("You are not connected to the internet. Check your network connection.");
        }
        alert("Server error please try again after few minutes");
      }
      else {
        // this.initializePublisher(session);
      }
    });
    session.on('streamCreated', function (event) {
      var subscriberProperties = { insertMode: "append",
      width: "100%", 
      height: "80%", 
      style: {
            buttonDisplayMode: "on",
            audioLevelDisplayMode: "on"
      }};
      var subscriber = session.subscribe(event.stream,
        'subscriberContainer',
        subscriberProperties,
        function (error) {
          if (error) {
            loading.dismiss();
            alert(error);
          } else {
            loading.dismiss();
            // alert('Please wait...');
          }
        });
    });

  }


  changeCamera(){
    this.publisher.cycleVideo().then();
  }
  stopCamera() {
    this.camera_off = 'true';
  }
  capturessVideo(){
    this.button_css = 'story';
    const options: CaptureVideoOptions = {limit: 1};
    this.mediaCapture.captureVideo(options).then((videodata: MediaFile[]) => {
      this.uplodeVideo(videodata);
    });
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
      params: {app_key: 'Testappkey', user_id: this.userinfo.success.id , name : this.userinfo.success.username },
      chunkedMode: false
    };
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    const rootURl3 = 'https://crowd.tutourist.com/api/mystory';
    fileTransfer.upload(sec, rootURl3, options1)
        .then((data: any) => {
          loading.dismiss();
          alert('Upload successfully!');
        }, (err) => {
          loading.dismiss();
        });
  }
  start_live_(){
    this.button_css = 'live';
  }
  stop_live_function(){
    this.publisher_value = 'false';
    this.session_value = 'false';
    this.second_time = 'start';
    console.log(this.session);
    setTimeout(() => {
      this.call_close_1();
    }, 1000);
    this.Live_stop = 'false';
  }
  call_close_1(){
    setTimeout(() => {
      this.call_close_2();
    }, 1000);
    if (this.session){
      this.session.off();
      this.session.disconnect();
      this.session.unpublish(this.publisher);
      this.publisher.destroy();

    }
  }
  call_close_2(){
    if (this.publisher){
      this.session.off();
      this.session.disconnect();
      this.session.unpublish(this.publisher);
      this.publisher.destroy();

    }
  }
  async Tipopen() {
    this.session.off();
    this.session.disconnect();
    // this.stopCamera();
    const modal = await this.modalController.create({
      component: TipnowPage,
      componentProps: {
        data: "live",
        live_user_id: this.user_id_live,
      },
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss()
      .then((data) => {
      this.startCall();  
    });
    return await modal.present();
  }

  ionViewWillLeave(){
    this.session.off();
    this.session.disconnect();
    // this.session.unpublish(this.publisher);
    // this.publisher.destroy();
  }

}

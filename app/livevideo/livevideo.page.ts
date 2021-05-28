import { NavParams } from '@ionic/angular';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuController,ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { TipnowPage } from '../tipnow/tipnow.page';
import { SharePage } from '../share/share.page';
import { ComentPage } from '../coment/coment.page';
import { HashtredingPage } from '../hashtreding/hashtreding.page';
import { ProfileviewerPage } from '../profileviewer/profileviewer.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DeeplinkPage } from '../deeplink/deeplink.page';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MediaCapture, CaptureVideoOptions, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer/ngx';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';

declare var OT: any;

@Component({
  selector: 'app-livevideo',
  templateUrl: './livevideo.page.html',
  styleUrls: ['./livevideo.page.scss'],
})
export class LivevideoPage implements OnInit {
  session: any;
  publisher: any;
  apiKey: any;
  sessionId: any="";
  token: any="";
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
  data_create: any = '{com_count: 1,createdAt: t {seconds: 1614230032, nanoseconds: 71000000},fav: "false",fav_count: 2,from: "tkamrant@gmail.com",hash: "",id: ""x17"",img: "",keep: "false",keep_count: 0,msg: "world ",post_email: "tkamrant@gmail.com",post_id: 17,post_type: "post",privacy: false,profile: "",shar_count: 0,tipcount: 0,userid: 63,username: "kamran tariq",vid: ""}';
  elapsed: any = {
        h: "00",
        m: "00",
        s: "00",
    };
    progress: any = 0;
    overallProgress: any = 0;
    percent: number = 0;
    radius: number = 100;
    minutes: number = 1;
    seconds: any = 10;
    timer: any = false;
    overallTimer: any = false;
    fullTime: any = "00:01:30";

    countDownTimer: any = false;
    timeLeft: any = {
        m: "00",
        s: "00",
    };
    remainingTime = `${this.timeLeft.m}:${this.timeLeft.s}`;
    da_data:any;
    da_dat:any;
    da_da:any;
    da_d:any;
  constructor(public toastController: ToastController,private transfer: FileTransfer , private mediaCapture: MediaCapture, private cameraPreview: CameraPreview, public activatedRoute: ActivatedRoute, public navParams: NavParams, private firebaseDynamicLinks: FirebaseDynamicLinks, private androidPermissions: AndroidPermissions, private socialSharing: SocialSharing, public authservice: AuthService, private storage: Storage, public alertController: AlertController, public loadingController: LoadingController, public db: AngularFirestore, public platform: Platform, private menu: MenuController, public modalController: ModalController, private camera: Camera, private afAuth: AngularFireAuth) {
    // this.page_detail = JSON.parse(params.special);
    // this.cameraPreview.startCamera({ x: 80, y: 450, width: 250, height: 300, toBack: false, previewDrag: true, tapPhoto: true });
    //this.cameraPreview.startCamera({ x: 0, y: 70, width: window.screen.width, height: window.screen.height - 300, camera: 'back', tapPhoto: true, previewDrag: false, toBack: true });
    this.page_detail = this.navParams.get('data');
    console.log(this.page_detail);
    this.apiKey = '47118074';
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
      alert("working");
    }

    if(this.da_data == "friend_list"){
      console.log(this.page_detail);
      this.session_value = 'true';
      // alert(JSON.stringify(this.page_detail));
      // this.subscribe_token = this.page_detail.token;
      this.sessionId = this.da_dat;
      // alert(this.sessionId);
      this.token = this.da_da;
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
         }
    })

    // this.sessionId = '2_MX40NzExODA3NH5-MTYxMzAzMTYzMjQ1Mn5kdFp3dzQyTmhpZGorbGt5WUVFRnpFZG9-fg';
    // this.token = 'T1==cGFydG5lcl9pZD00NzExODA3NCZzaWc9OTdjYWE3N2VlNDkzOTdkMTQ4ZmY3ZGQ2YWJiZDI0YWJlN2Q4MjU2MjpzZXNzaW9uX2lkPTJfTVg0ME56RXhPREEzTkg1LU1UWXhNekF6TVRZek1qUTFNbjVrZEZwM2R6UXlUbWhwWkdvcmJHdDVXVVZGUm5wRlpHOS1mZyZjcmVhdGVfdGltZT0xNjEzMDMxNjUzJm5vbmNlPTAuMzIxMDczNzI2MzE1MDczOCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjEzMDM1MjgxJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
    // this.subscribe_token = 'T1==cGFydG5lcl9pZD00NzExODA3NCZzaWc9YzA5YzI1OGJhZjMwNmE5Y2U2YTIxZDgwNDBmNzU5ZjA3OTg2MmVjODpzZXNzaW9uX2lkPTJfTVg0ME56RXhPREEzTkg1LU1UWXhNekF6TVRZek1qUTFNbjVrZEZwM2R6UXlUbWhwWkdvcmJHdDVXVVZGUm5wRlpHOS1mZyZjcmVhdGVfdGltZT0xNjEzMDMxNjc1Jm5vbmNlPTAuODkxMTU3NzgzMTAxNjAxNSZyb2xlPXN1YnNjcmliZXImZXhwaXJlX3RpbWU9MTYxMzAzNTMwMyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';
  }

  call_allfriends(){
    // alert("");
     this.getAllFriends().subscribe((data) => {
        console.log(data);
          // this.authservice.setupFCM_call(this.userinfo.success.email, 'Crowd', this.userinfo.success.username + ' is live', this.subscribe_token, this.userinfo, this.token, this.sessionId);
        for (let i = 0; i < data.length; i++){
            console.log(data[i].username);
           this.authservice.setupFCM_call(data[i].username, 'Crowd', this.userinfo.success.username + ' is live', this.subscribe_token, this.userinfo, this.token, this.sessionId);
              this.db.collection(data[i].friend).doc('friend_live').collection('friend_live').doc(this.userinfo.success.email).set({
                userid: this.userinfo.success.id,
                img: this.userimage,
                from: this.userinfo.success.email,
                username: this.userinfo.success.username,
                // createdAt: function() {}firebase.firestore.FieldValue.serverTimestamp(),
                sessionId: this.sessionId,
                token: this.token,
              })
              .then((val) => {
                console.log(val)
              })
              .catch((error) => {
                  console.error('Error writing document: ', error);
              });
        }
    });
  }


   getAllFriends(): Observable<any> {
              return this.db.collection<any>(this.userinfo.success.email + '/friend/friend').valueChanges ();
  }

  goBack() {
    this.call_allfriends_delete();
	  this.modalController.dismiss();
    this.cameraPreview.stopCamera();
  }

  async get_live_(){
    if (this.second_time == 'no'){
    this.button_css = 'live';
    this.Live_stop = 'true';
    await this.cameraPreview.stopCamera();
    this.presentToast();
    this.live_video_live = 'true';
    const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
    await loading.present();
    this.authservice.get_livetoken().subscribe((data: any) => {
                if (data){
                   console.log(data);
                   // alert("");
                   this.call_allfriends();
                   this.sessionId = data.sessionId;
                   // alert(this.sessionId);
                   console.log(this.sessionId);
                   this.token = data.token;
                   this.subscribe_token = data.subscribe_token;
                   // alert(this.token);
                   this.publisher_value = 'true';
                   // alert(this.token);
                   // alert(this.subscribe_token);
                   // alert(this.publisher_value);
                   setTimeout(() => {
                      this.startCall();
                      loading.dismiss();
                    }, 1000);
                   // this.token = data.token;
                   // this.token = data.subscribe_token;
                   // alert(this.token);
                }else{
                  loading.dismiss();
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
        this.authservice.presentAlert('Please wait a few minutes before you try again');
        this.goBack();
      }
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You are now live',
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.RECORD_VIDEO, this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION ]);
    setTimeout(() => {
      this.startCameraAbove();
    }, 1000);
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.EndLive();
        this.goBack();
      });
    });  
  }

  // call_function(){


  //   this.db.collection('user@gmail.com').doc('friend_live').collection('friend_live').doc('user@gmail.com').set({
  //               userid: this.userinfo.success.id,
  //               img: this.userimage,
  //               from: this.userinfo.success.email,
  //               username: this.userinfo.success.username,
  //               createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //               sessionId: this.sessionId,
  //               token: this.token,
  //             })
  //             .then(() => {
  //             })
  //             .catch((error) => {
  //                 console.error('Error writing document: ', error);
  //             });
  // }

  

  // publishCall(){
  //   // this.subscribe_token = this.page_detail.token;
  //   this.sessionId = '1_MX40NzExODA3NH5-MTYxMzE0Mzk4MTY4MH40MHlNeVU0bU9LQ0JQbit3bW9KalF1VWV-fg';
  //   this.token = 'T1==cGFydG5lcl9pZD00NzExODA3NCZzaWc9MmQxYWU4M2E5MjgwYmFhMzMwODA4ZDI4ZWQ1ODczZjQ2YzQwYWQxYzpzZXNzaW9uX2lkPTFfTVg0ME56RXhPREEzTkg1LU1UWXhNekUwTXprNE1UWTRNSDQwTUhsTmVWVTBiVTlMUTBKUWJpdDNiVzlLYWxGMVZXVi1mZyZjcmVhdGVfdGltZT0xNjEzMTQzOTkyJm5vbmNlPTAuNzg4MDMzMTA5OTUzODExOCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjE1NzMyNDIwJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
  //   this.publisher = OT.initPublisher('publisher');
  //   console.log(this.publisher);
  // }

  startCall() {

    this.session = OT.initSession(this.apiKey, this.sessionId);
    this.publisher = OT.initPublisher('publisher');
    this.session.on({
      streamCreated: (event: any) => {
        this.session.subscribe(event.stream, 'subscriber');
        OT.updateViews();
      },
      streamDestroyed: (event: any) => {
        alert('Stream ended');
        OT.updateViews();
        this.stopTimer();
      },
      sessionConnected: (event: any) => {
        this.session.publish(this.publisher);
        this.startTimer();
      }
    });
    this.session.connect(this.token, (error: any) => {
      if (error) {
        alert('There was an error connecting to the live');
      }
    });
  }


   changeCamera(){
        this.publisher.cycleVideo().then();
    }

    async startCameraAbove() {
      this.cameraPreview.stopCamera();
      this.button_css = 'live';
      this.isToBack = true;
      const res = await  this.cameraPreview.startCamera({
          x: 0,
          y: 70,
          width: window.screen.width,
          height: window.screen.height - 300,
          camera: 'rear',
          toBack: false,
          previewDrag: false,
          tapPhoto: false,
          alpha: 1
      })
      console.log(res, 'live');
  }
  stopCameras() {
    this.camera_off = 'true';
    this.cameraPreview.stopCamera();
  }

  takePicture() {
    this.cameraPreview.takePicture({
      width: 1280,
      height: 1280,
      quality: 85
    }).then((imageData) => {
      this.IMAGE_PATH = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      this.IMAGE_PATH = 'assets/img/test.jpg';
    });
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  show() {
    this.cameraPreview.show();
  }

  hide() {
    this.cameraPreview.hide();
  }
   call_allfriends_delete(){
      // alert("");
     this.getAlldelete().subscribe((data) => {
        console.log(data);
          // this.authservice.setupFCM_call(this.userinfo.success.email, 'Crowd', this.userinfo.success.username + ' is live', this.subscribe_token, this.userinfo, this.token, this.sessionId);
        for (let i = 0; i < data.length; i++){
           this.db.collection(data[i].friend).doc('friend_live')
              .collection('friend_live').doc(this.userinfo.success.email).delete();
        }

    });
  }

  getAlldelete(): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email + '/friend/friend').valueChanges ();
  }

    start_live_(){
      this.button_css = 'live';
    }

    stop_live_function(){
      // alert("");
      this.call_allfriends_delete();
      this.publisher_value = 'false';
      this.session_value = 'false';
      this.second_time = 'start';
      setTimeout(() => {
        this.call_close_1();
        this.modalController.dismiss();
      }, 1000);
      this.Live_stop = 'false';
      //this.startCameraAbove();
    }






    call_close_1(){
      setTimeout(() => {
        this.call_close_2();
      }, 1000);
      if (this.session){
            // this.publisher.disconnect();
            // this.session.disconnect();
            this.session.off();
            this.session.disconnect();
            this.session.unpublish(this.publisher);
            this.publisher.destroy();

        }
      // alert(this.session);
    }

    call_close_2(){
        if (this.publisher){
            this.session.off();
            this.session.disconnect();
            this.session.unpublish(this.publisher);
            this.publisher.destroy();
        }
        //this.startCameraAbove();
    }

    async Tipopen() {
     const modal = await this.modalController.create({
     component: TipnowPage,
     componentProps: {
        data: this.data_create,
     },
     cssClass: 'my-custom-class'
     });
     return await modal.present();
    }

    ionViewWillLeave(){
        this.EndLive();
    }

    ionViewDidLeave() {
        this.EndLive();
    }
    EndLive(){
        this.cameraPreview.stopCamera()
        this.session.off();
        this.session.disconnect();
        this.session.unpublish(this.publisher);
        this.publisher.destroy();
    }


     touchMe() {
        console.log('touched');
    }
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            clearInterval(this.countDownTimer);
        }
        if (!this.overallTimer) {
            this.progressTimer();
            //this.insomnia.keepAwake();
        }
        this.timer = false;
        this.percent = 0;
        this.progress = 0;
        let timeSplit = this.fullTime.split(":");
        this.minutes = timeSplit[1];
        this.seconds = timeSplit[2];
        let totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);
        let secondsLeft = totalSeconds;
        let forwardsTimer = () => {
            if (this.percent == this.radius) clearInterval(this.timer);
            this.percent = Math.floor((this.progress / totalSeconds) * 100);
            ++this.progress;
        };

        let backwardsTimer = () => {
            if (secondsLeft >= 0) {
                this.timeLeft.m = Math.floor(secondsLeft / 60);
                this.timeLeft.s = secondsLeft - 60 * this.timeLeft.m;
                this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(
                    this.timeLeft.s,
                    2
                )}`;
                secondsLeft--;
            }
        };

        // run once when clicked
        forwardsTimer();
        backwardsTimer();

        // timers start 1 second later
        this.countDownTimer = setInterval(backwardsTimer, 1000);
        this.timer = setInterval(forwardsTimer, 1000);
    }

    stopTimer() {
        clearInterval(this.countDownTimer);
        clearInterval(this.timer);
        clearInterval(this.overallTimer);
        this.countDownTimer = false;
        this.overallTimer = false;
        this.timer = false;
        this.percent = 0;
        this.progress = 0;
        this.elapsed = {
            h: "00",
            m: "00",
            s: "00",
        };
        this.timeLeft = {
            m: "00",
            s: "00",
        };
        this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(
            this.timeLeft.s,
            2
        )}`;
        //this.insomnia.allowSleepAgain();
    }

    progressTimer() {
        let countDownDate = new Date();

        this.overallTimer = setInterval(() => {
            let now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = now - countDownDate.getTime();

            // Time calculations for hours, minutes and seconds

            this.elapsed.h = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            this.elapsed.s = Math.floor((distance % (1000 * 60)) / 1000);

            this.elapsed.h = this.pad(this.elapsed.h, 2);
            this.elapsed.m = this.pad(this.elapsed.m, 2);
            this.elapsed.s = this.pad(this.elapsed.s, 2);
        }, 1000);
    }

    pad(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    updateMyDate($event) {
        console.log($event.split(":"));
    }



}

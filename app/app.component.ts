import { Component, OnInit } from '@angular/core';
import { Platform,NavController,ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage';
import {EventService} from './services/event.service';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { DeeplinkPage } from './deeplink/deeplink.page';
import { SubcribePage } from './subcribe/subcribe.page';
import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';
import { LivevideoPage } from './livevideo/livevideo.page';
import { ActivatedRoute,Router,NavigationExtras } from '@angular/router';
import { RedirectPage } from './redirect/redirect.page';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import {INotificationPayload} from 'cordova-plugin-fcm-with-dependecy-updated';
import {Facebook} from '@ionic-native/facebook/ngx';
import { ToastController } from '@ionic/angular';

import { Network } from '@ionic-native/network/ngx';
import {AuthService} from './services/auth.service';
import {LiveViewPage} from "./live-view/live-view.page";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {
  public selectedIndex = 0;
    public hasPermission: boolean;
    public token: string;
    public pushPayload: INotificationPayload;
  public appPages = [
    {
      title: 'Inbox',
      url: '/login/Inbox',
      icon: 'mail'
    },
    {
      title: 'Outbox',
      url: '/login/Outbox',
      icon: 'paper-plane'
    },
    {
      title: 'Favorites',
      url: '/login/Favorites',
      icon: 'heart'
    },
    {
      title: 'Archived',
      url: '/login/Archived',
      icon: 'archive'
    },
    {
      title: 'Trash',
      url: '/login/Trash',
      icon: 'trash'
    },
    {
      title: 'Spam',
      url: '/login/Spam',
      icon: 'warning'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  val:any;
  userimage;
    notificationCount = 0;
    user_name_logout:any;
  constructor(
    private platform: Platform,
    private firebaseDynamicLinks: FirebaseDynamicLinks,
    public modalController: ModalController,
    private splashScreen: SplashScreen,
    private navCtrl: NavController,
    private storage: Storage, public rout: Router,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private event: EventService,
    private fcm: FCM ,
    private localNotifications: LocalNotifications,
    private fb: Facebook,
    public toastController: ToastController,
    private network: Network,
    public authservice: AuthService) {
    this.initializeApp();
    const urimagel = 'urimagel';
     this.storage.get('userdata').then((val) => {
      if (val){
         this.val = val.success;
         if (val.urimagel){
           this.userimage = val.urimagel;
           console.log(this.userimage);
         }else{
           this.userimage = 'assets/imgs/profile2.svg';
         }
       }
      });
  }

  call_network(){
    // alert("working");
    this.navCtrl.navigateRoot('/network');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();
      this.setupFCM();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
            result => console.log('Has permission?', result.hasPermission),
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
      );
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            result => console.log('Has permission?', result.hasPermission),
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
            result => console.log('Has permission?', result.hasPermission),
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      );
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA , this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE , this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
      this.firebaseDynamicLinks.getDynamicLink().then((data: any) => {
          if (data) {
              this.get_post(data);
          } else {
          }
      });

      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.call_network();
      });     

       this.storage.get('login').then((val) => {
           if (val == 'true'){
               this.navCtrl.navigateRoot('/tabs');
          }else{
               this.navCtrl.navigateRoot('/login/1');
           }
           console.log(val);
       });

       
        this.storage.get('userdata').then((val) => {
            this.user_name_logout = val.success.username;
        });
    });
  }
    private async setupFCM() {
            await this.platform.ready();
            console.log('FCM setup started');

            if (!this.platform.is('cordova')) {
                return;
            }
            this.fcm.onTokenRefresh().subscribe((newToken) => {
                this.token = newToken;
                console.log('onTokenRefresh received event with: ', newToken);
            });
            this.fcm.onNotification().subscribe((payload) => {
                this.pushPayload = payload;
                console.log(this.pushPayload,"sd")
                if (this.pushPayload.wasTapped == false) {
                    this.authservice.notificationGet().then(data => {
                        if (data > 0){
                            this.notificationCount = data;
                            this.notificationCount += 1;
                            this.authservice.notification(this.notificationCount)
                            this.authservice.EventStorenotification(this.notificationCount);
                        }else{
                            this.notificationCount = 1;
                            this.authservice.notification(this.notificationCount);
                            this.authservice.EventStorenotification(this.notificationCount);
                        }
                    });
                }
            if (this.pushPayload.wasTapped) {
                if (this.pushPayload.token) {
                    this.get_profile_sub(this.pushPayload);
                } else if (this.pushPayload.param1 == 'sms') {
                    this.navCtrl.navigateRoot('/tabs/tabs/tab3');
                } else if (this.pushPayload.param1 == 'request') {
                    this.navCtrl.navigateRoot('/tabs/tabs/tab4');
                } else {
                    this.get_post_detail(this.pushPayload.param1);
                }
            }

            });

        this.hasPermission = await this.fcm.requestPushPermission();
        console.log('requestPushPermission result: ', this.hasPermission);

        this.token = await this.fcm.getToken();
        console.log('getToken result: ', this.token);
        this.pushPayload = await this.fcm.getInitialPushPayload();
        if (this.pushPayload){
            console.log(this.pushPayload,'ntoi')
            if (this.pushPayload.wasTapped) {
              // alert(this.pushPayload.param1);
                if (this.pushPayload.token){
                    this.get_profile_sub(this.pushPayload);
                }else if (this.pushPayload.param1 == 'sms'){
                    this.navCtrl.navigateRoot('/tabs/tabs/tab3');
                }else if (this.pushPayload.param1 == 'request'){
                            this.navCtrl.navigateRoot('/tabs/tabs/tab4');
                        }
                else{
                    this.get_post_detail(this.pushPayload.param1);
                }
            }
        }else{
            this.storage.get('login').then((val) => {
                if (val == 'true'){
                    this.navCtrl.navigateRoot('/tabs');
                }else{
                    this.navCtrl.navigateRoot('/login/1');
                }
                console.log(val);
            });
        }
        console.log(this.pushPayload,'sdf');
    }

    public get pushPayloadString() {
        return JSON.stringify(this.pushPayload, null, 4);
    }

  async get_profile_sub(da) {
      const modal = await this.modalController.create({
          component: LiveViewPage,
          componentProps: {
              data: da,
          },
       cssClass: 'my-custom-class'
      });
      return await modal.present();
  }
  async get_profile(da) {
      const modal = await this.modalController.create({
          component: LivevideoPage,
          componentProps: {
              data: da,
          },
          cssClass: 'my-custom-class'
      });
      return await modal.present();
  }
  async get_post_detail(da) {
    // alert(JSON.stringify(da)+"anderwala");
      const modal = await this.modalController.create({
          component: RedirectPage,
          componentProps: {
              data: JSON.parse(da),
          },
          cssClass: 'my-custom-class'
      });
      return await modal.present();
  }

  async get_post(data) {
      const modal = await this.modalController.create({
          component: DeeplinkPage,
          componentProps: {
              data: data.deepLink,
          },
          cssClass: 'my-custom-class'
      });
      return await modal.present();
  }
  ngOnInit() {
      const success = 'success';
      const urimagel = 'urimagel';
      this.event.subscribe('userdata', (val) => {
          if (val){
              this.val = val.success;
              if (val.urimagel){
                  console.log(this.userimage)
                  this.userimage = val.urimagel;
              }else{
                  this.userimage = 'assets/imgs/profile2.svg';
              }
          }
          console.log(val);
      });
      const path = window.location.pathname.split('login/')[1];
      if (path !== undefined) {
          this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      }
  }

  logout(){
    // this.fcm.clearAllNotifications();
    this.platform.ready().then(() => {
                    if (this.platform.is("cordova")) {
                      this.fcm.unsubscribeFromTopic(this.user_name_logout);
                      // alert(this.fcm.unsubscribeFromTopic(this.user_name_logout));
                    }
                });
      this.fb.getLoginStatus().then(res => {
          if (res.status === 'connected') {
              console.log(res.status);
              this.fb.logout().then( () => {
                  this.storage.set('login', '');
                  this.storage.set('userdata', '');
                  this.navCtrl.navigateRoot('/login/1');
              });
          }else{
              this.storage.set('login', '');
              this.storage.set('userdata', '');
              this.navCtrl.navigateRoot('/login/1');
          }
      }, err => {
          this.storage.set('login', '');
          this.storage.set('userdata', '');
          this.navCtrl.navigateRoot('/login/1');
      });
  }

    ionViewWillEnter(){
        const success = 'success';
        const urimagel = 'urimagel';
        this.event.subscribe('userdata', (val) => {
            if (val){
                this.val = val.success;
                if (val.urimagel){
                    console.log(this.userimage)
                    this.userimage = val.urimagel;
                }else{
                    this.userimage = 'assets/imgs/profile2.svg';
                }
            }
            console.log(val);
        });
    }
    async presentToastWithOptions(pushPayload) {
        const toast = await this.toastController.create({
            message: 'Click to Close',
            position: 'top',
            buttons: [
                {
                    side: 'start',
                    text: 'Done',
                    handler: () => {
                        // alert(this.pushPayload.param1);

                        if (this.pushPayload.token) {
                            this.get_profile_sub(this.pushPayload);
                        } else if (this.pushPayload.param1 == 'sms') {
                            this.navCtrl.navigateRoot('/tabs/tabs/tab3');
                        }else if (this.pushPayload.param1 == 'request'){
                            this.navCtrl.navigateRoot('/tabs/tabs/tab4');
                        }
                         else {
                            this.get_post_detail(this.pushPayload.param1);
                        }
                    }
                }, {
                    text: 'cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await toast.present();
        const { role } = await toast.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }
}

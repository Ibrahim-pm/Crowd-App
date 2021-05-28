import { Injectable } from '@angular/core';
import {Facebook} from '@ionic-native/facebook/ngx';
import {HttpClient} from '@angular/common/http';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {LoadingController, MenuController, Platform, ToastController} from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import { HttpHeaders } from '@angular/common/http';
import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import {EventService} from './event.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loading;
  isLoading = true;
  url = 'https://crowd.tutourist.com/api/';
  constructor(public loadingController: LoadingController,
              private googlePlus: GooglePlus, private fb: Facebook,
              public alertController: AlertController,
              private platform: Platform,
              public toastController: ToastController,
              private http: HttpClient,
              private storage: Storage,private fcm: FCM,private event: EventService) {}
  async presentLoading() {
    this.isLoading = true;
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    }).then(a => {
      a.present().then( () => {
        if (!this.isLoading){
          a.dismiss().then(() => {
            console.log('dismiss');
          }).catch( err => {
            console.log(err);
          });
        }
      });
    });
  }
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
  async DismissLoading() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss().then(() => {
        console.log('dismissed');
      }).catch(err => {
        console.log('dismiss loading error');
      });
    }
  }
  facebookLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fb.logout();
      this.fb.login(['public_profile', 'user_friends', 'email'])
          .then(response => {
            resolve(response);
          }).catch(err => {
        console.log('err====>', err);
        reject(err);
      });
    });
  }
  getUserDetail(userid: any) {
    return new Promise((resolve, reject) => {
      this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
    });
  }
  doLogin(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.googlePlus.login({})
          .then((response) => {
            resolve(response);
          }).catch((err) => {
        reject(err);
      });
    });
  }
  Register(username , email , password , cpassword , type){
    username = username.replace(/\s/g, '_');
    const postData = new FormData();
    postData.append('username' , username);
    postData.append('email' , email);
    postData.append('password' , password);
    postData.append('c_password' , cpassword);
    return this.http.post(this.url + 'registeruser', postData);
  }
  Loginfbgo(username , email , type){
    username = username.replace(/\s/g, '_');
    const postData = new FormData();
    postData.append('email' , email);
    postData.append('username' , username);
    postData.append('type' , type);
    return this.http.post(this.url + 'sociallogin', postData);
  }
  Login(username , password , type){
    username = username.replace(/\s/g, '_');
    const postData = new FormData();
    postData.append('email' , username);
    postData.append('password' , password);
    return this.http.post(this.url + 'login', postData);
  }
  Storeuser(userData){
    if (userData){
      this.storage.set('userdata', userData);
    }
  }
  GetData(){
    return this.storage.get('userdata');
  }
  GetUsers(){
    const postData = new FormData();
    // postData.append('userdetail');
    return this.http.get(this.url + 'userdetail');
  }
  forgotPassword(username){
    const postData = new FormData();
    postData.append('email' , username);
    return this.http.post(this.url + 'forgot', postData);
  }
  RestPassword(data , password){
    const postData = new FormData();
    postData.append('token' , data.otp);
    postData.append('email' , data.email);
    postData.append('password' , password);
    return this.http.post(this.url + 'reset', postData);
  }
  UpdateProfile(id  , username , base64Image , fusername , dateofbirth , numbers,code){
    username = username.replace(/\s/g, '_');
    const postData = new FormData();
    postData.append('user_id' , id);
    postData.append('username' , username);
    postData.append('image' , base64Image);
    postData.append('fullname' , fusername);
    postData.append('dateofbirth' , dateofbirth);
    postData.append('phonenumber' , numbers);
    postData.append('c_code' , code);
    return this.http.post(this.url + 'profile', postData);
  }
  ChangePassword(id , oldpassword , newpassword){
    const postData = new FormData();
    postData.append('user_id' , id);
    postData.append('password' , oldpassword);
    postData.append('newpassword' , newpassword);
    return this.http.post(this.url + 'resetpassword', postData);
  }
  ImageUpload(imagepath){
    const postData = new FormData();
    postData.append('image' , imagepath);
    return this.http.post(this.url + 'userprofile', postData);
  }
  Strippament(Amount , token){
    const postData = new FormData();
    postData.append('amount' , Amount);
    postData.append('currency' , 'usd');
    postData.append('stripeToken' , token);
    return this.http.post(this.url + 'stripe', postData);
  }
  mywallet( id , Amount , token){
    const postData = new FormData();
    postData.append('userid' , id);
    postData.append('amount' , Amount);
    postData.append('currency' , 'usd');
    postData.append('stripeToken' , token);
    return this.http.post(this.url + 'mywallet', postData);
  }
  myCredit(id , cridt){
    const postData = new FormData();
    postData.append('userid' , id);
    postData.append('cradit' , cridt);
    return this.http.post(this.url + 'mycredit', postData);
  }
  usercredit(id){
    const postData = new FormData();
    postData.append('userid' , id);
    return this.http.post(this.url + 'usercredit', postData);
  }
  Transfercreadit(id,reciver,credit){
    const postData = new FormData();
    postData.append('reciver' , reciver);
    postData.append('payer' , id);
    postData.append('credit' , credit);
    return this.http.post(this.url + 'wallettransfercredit', postData);
  }
  heshtag(hash){
    const postData = new FormData();
    postData.append('hashtag' , hash);
    return this.http.post(this.url + 'hashtag', postData);
  }
  // http://crowd.tutourist.com/api/allhashtag
  getheshtag(){
    const postData = new FormData();
    // postData.append('allhashtag' , hash);
    return this.http.post(this.url + 'allhashtag','');
  }


  get_livetoken() {
    const postData = new FormData();
    // postData.append('allhashtag' , hash);
    return this.http.post(this.url + 'videostream','');
  }

   public async setupFCM(topic,title,sms,da) {
     if(da.data){
       da.data = '';
     }
     if(da.profile){
       da.profile=''
     }
    // if(da.username){
    //   da.username =''
    // }
    if(topic){
      await this.platform.ready();
      console.log('FCM setup started');

      if (!this.platform.is('cordova')) {
        return;
      }
      this.fcm.subscribeToTopic(topic);
      this.sendNotification(topic,title,sms,da);
    }
  }
  sendNotification(topic,title,sms,da) {
    const body = {
      notification: {
        title: title,
        body: sms,
        sound: 'default',
        click_action: 'FCM_PLUGIN_ACTIVITY',
        icon: 'fcm_push_icon',
        forceStart: '1'
      },
      data: {
        param1: da,
        param2: 'value2',
      },
      to: '/topics/' + topic,
      priority: 'high',
      restricted_package_name: ''
    };
    const options = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post('https://fcm.googleapis.com/fcm/send', body, {
      headers: options.set('Authorization', 'key=AAAAExFlaqM:APA91bEDOMUrMC3p3_2VOg-B3DdF-atLCrnqR6rJwxkMU9GVk54hOwIICS0S4lwThPeDRqKjfHbiZSog2C_6lUoeBT_Susdjo5G-6nqFPF3HqNZ8_ZxaQAOGrNdfjFzWRZpmhgkS-DG4'),
    }).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  public async setupFCM_call(topic,title,sms,token,data,token_,sessionId) {
    if(topic){
      await this.platform.ready();
      console.log('FCM setup started');

      if (!this.platform.is('cordova')) {
        return;
      }
      console.log('In cordova platform');
      this.fcm.subscribeToTopic(topic);
      this.sendNotification_call(topic,title,sms,token,data,token_,sessionId);
      console.log('Subscribing to token updates')
    };
  }

  sendNotification_call(topic,title,sms,token,data,token_,sessionId) {
    const body = {
      notification: {
        title: title,
        body: sms,
        sound: 'default',
        click_action: 'FCM_PLUGIN_ACTIVITY',
        icon: 'fcm_push_icon'
      },
      data: {
        token:token,
        data: data,
        token_:token_,
        sessionId:sessionId
      },
     // to: '/topics/all',
      to: '/topics/' + topic,
      priority: 'high',
      restricted_package_name: ''
    };
    console.log(body);
    const options = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post('https://fcm.googleapis.com/fcm/send', body, {
      headers: options.set('Authorization', 'key=AAAAExFlaqM:APA91bEDOMUrMC3p3_2VOg-B3DdF-atLCrnqR6rJwxkMU9GVk54hOwIICS0S4lwThPeDRqKjfHbiZSog2C_6lUoeBT_Susdjo5G-6nqFPF3HqNZ8_ZxaQAOGrNdfjFzWRZpmhgkS-DG4'),
    }).subscribe(data => {
      console.log(data);
    }, err => {
      //this.presentAlert(JSON.stringify(err));
    });
  }
   UplodeVieo(file) {
    console.log(file)
    let filedata = new FormData();
    var rootURl3 = 'https://crowd.tutourist.com/api/uservideo';
    filedata.append("video", file , file.name)
    return this.http.post(rootURl3, filedata)
  }
  
  Uplodepic(file) {
    let filedata = new FormData();
    var rootURl3 = 'https://crowd.tutourist.com/api/userimage';
    filedata.append("photo", file , file.name)
    return this.http.post(rootURl3, filedata)
  }
    EventStore(userData){
    if (userData){
      this.event.publish('userdata', userData);
    }
  }
  UplodeVieoStorey() {
    const filedata = new FormData();
    const rootURl3 = 'https://crowd.tutourist.com/api/getallstory';
    return this.http.post(rootURl3, filedata);
  }

  GetMony(UserId) {
    const filedata = new FormData();
    const rootURl3 = 'https://crowd.tutourist.com/api/withdraw/' + UserId;
    return this.http.post(rootURl3, filedata);
  }
  verifyorder(username , verify){
    const postData = new FormData();
    postData.append('username' , username);
    postData.append('status' , verify);
    return this.http.post(this.url + 'otpverify', postData);
  }
  notification(userData){
    if (userData){
      this.storage.set('notificationCount', userData);
    }
  }
  notificationGet(){
    return this.storage.get('notificationCount');
  }
  notificationClear(userData){
    this.storage.set('notificationCount', userData)
  }
  EventStorenotification(userData){
    if (userData){
      this.event.publish('notificationCount', userData);
    }
  }
}

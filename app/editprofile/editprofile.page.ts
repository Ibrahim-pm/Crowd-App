import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {AuthService} from '../services/auth.service';
import { Camera , CameraOptions  } from '@ionic-native/camera/ngx';
import {ActionSheetController, ModalController} from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Crop } from '@ionic-native/crop/ngx';
import {File} from '@ionic-native/file/ngx';
import {Storage} from '@ionic/storage';
import {BankformPage} from '../bankform/bankform.page';
import {CountrycodePage} from '../countrycode/countrycode.page';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  username = '';
  fusername = '';
  dateofbirth = '';
  number = '';
  base64Image: any = "../assets/imgs/profile.svg";
  Userdata;
  loding = true;
  data_urimagel:any;
    code = 92;
    useremail:any;
    image_user:any;
  constructor(private crop: Crop,
              private filep: File,
              public actionSheetController: ActionSheetController ,
              private camera: Camera ,
              public authservice: AuthService ,
              private location: Location,
              private storage: Storage,
              public modalController: ModalController,
              public alertController: AlertController,
              private afAuth: AngularFireAuth,
              public db: AngularFirestore,
              public toastController: ToastController) { }

  ngOnInit() {
    this.authservice.GetData().then( (data: any) => {
        console.log(data);
      if (data){
        if(data['success']['username']){
          this.username = data['success']['username'];
          this.useremail = data['success']['email'];
          console.log(this.useremail);
        }
       if(data['success']['fullname']){
           if(data['success']['fullname'] == 'undefined' || data['success']['fullname'] == 'null'){
               this.fusername;
           }else{
               this.fusername = data['success']['fullname'];
           }
       }else{
         this.fusername;
       }
       if(data['success']['dateofbirth']){
           if(data['success']['dateofbirth'] == 'undefined' || data['success']['dateofbirth'] == 'null'){
               this.dateofbirth;
           }else{
               this.dateofbirth = data['success']['dateofbirth'];
           }
       }else{
         this.dateofbirth;
       }
       if(data['success']['phonenumber']){
           if(data['success']['phonenumber'] == 'undefined' || data['success']['phonenumber'] == 'null'){
               this.number ;
           }else{
               this.number = data['success']['phonenumber'];
           }

       }else{
         this.number;
       }
       if(data['success']['c_code']){
           this.code = data['success']['c_code'];
       }else{
           this.code;
       }
        if (data['urimagel']) {
          this.base64Image = data['urimagel'];
        }else{
          this.base64Image ='../assets/imgs/profile.svg'
        }
        this.Userdata = data;
      }
    });
  }

async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [{
        text: 'Gallery',
        role: 'destructive',
        icon: 'images',
        handler: () => {
          this.GetPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.GetPicture(this.camera.PictureSourceType.CAMERA);
        }
      },  {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel');
        }
      }]
    });
    await actionSheet.present();
  }
   GetPicture(type) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: type,
    };
    this.camera.getPicture(options).then((imageData) => {
        this.cropImage(imageData);
    }, (err) => {
      console.log(err);
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
  //routerLink="/landing"
  goBack() {
	this.location.back();
  }
  UpdateProfile(){
      if(this.username){
          this.authservice.presentLoading();
          this.authservice.UpdateProfile(this.Userdata['success']['id'] , this.username , this.base64Image   , this.fusername , this.dateofbirth , this.number ,this.code).subscribe((data:any) => {
              if (data){
                  console.log(data, 'insed')
                  this.authservice.DismissLoading();
                  if (data.error){
                      // alert(JSON.stringify(data.error));
                      this.authservice.presentAlert( JSON.stringify(data.error));
                  }else if (data['success']){
                      console.log(data);
                      if(data.urimagel){
                          console.log(data.urimagel)
                          this.image_user = data.urimagel;
                      }else{
                        this.image_user = "https://crowd.tutourist.com/public/image/609bf9deafc37.png"
                      }
                      this.db.collection(this.useremail).doc('profile').update({
                          profile: this.image_user,
                          username:data.success.username,
                          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      })
                      .then(() => {
                      })
                      this.storage.set('userdata', data);
                      this.authservice.EventStore(data);
                      this.authservice.DismissLoading();
                      this.presentToast();
                  }
              }else{
                  this.authservice.DismissLoading();
              }
          } ,  err => {
              this.authservice.DismissLoading();
              console.log(err);
              this.authservice.presentAlert( JSON.stringify(err.error.message));
          });
      }else{
          this.authservice.presentAlert('Invalid User Name');
      }

  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Profile updated successfully',
      duration: 2000
    });
    toast.present();
  }
    


    async AddCode(){
            const modal = await this.modalController.create({
                component: CountrycodePage,
                cssClass: 'my-custom-class'
            });
            modal.onDidDismiss()
                .then((data) => {
                    if(data){
                        this.code= data.data['callingCodes'];
                    }
                });
            return await modal.present();
    }
}

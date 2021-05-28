import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AlertController } from '@ionic/angular';

// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';
// import * as firebase from 'firebase';
import {AuthService} from '../services/auth.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router,NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  username: string;
  email: string;
  password: string;
  cpassword: string;
  type = 'login';
  loader:any;
    ionicForm: FormGroup;
    isSubmitted = false;
    ischeck = false;
  constructor(private fcm: FCM,
              private storage: Storage,
              public authservice: AuthService ,
              public loadingController: LoadingController,
              private menu: MenuController,
              private location: Location,
              private http: HttpClient,
              public rout: Router,
              public toastController: ToastController,
              public formBuilder: FormBuilder,
              public alertController: AlertController) {
    this.menu.enable(false, 'first');
    this.menu.enable(false, 'adminMenu');
  }
  ngOnInit() {
      this.ionicForm = this.formBuilder.group({
          username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^\\d*[a-zA-Z][a-zA-Z0-9 ]*$')]],
          email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$')]],
          password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]],
          cpassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]]
      });
  }
    get errorControl() {
        return this.ionicForm.controls;
    }
  goBack() {
      this.location.back();
  }
  async Signup(){
      this.isSubmitted = true;
      console.log(this.ischeck);
      if (!this.ionicForm.valid ) {
          //this.authservice.presentAlert( 'Please provide a valid information!');
          return false;
      } else {
          if(this.ischeck){
              this.loader = 'present';
              const success = 'success';
                  if (this.password == this.cpassword){
                      this.authservice.Register(this.username ,
                          this.email ,
                          this.password,
                          this.cpassword ,
                          this.type).subscribe((data: any) => {
                          if (data){
                              if (data[success]){
                                  const navigationExtras: NavigationExtras = {
                                      state : {
                                          user: data[success]
                                      }
                                  };
                                  this.rout.navigate(['verifyemail'] , navigationExtras);
                                  this.loader = 'done';
                              }else{
                                  this.loader = 'done';
                                  this.authservice.presentAlert( data.message);
                              }
                          }else{
                              this.loader = 'done';
                          }
                      }, (err :any) => {
                          if (err){
                              console.log(err);
                              if (err.error.error.email[0]){
                                  this.loader = 'done';
                                  this.authservice.presentAlert( err.error.error.email[0]);
                              }else{
                                  this.loader = 'done';
                                  this.authservice.presentAlert( JSON.stringify(err.error.error));
                              }
                          }else{
                              this.loader = 'done';
                          }
                      });
                  }else{
                      this.authservice.presentAlert( 'Password does not match');
                      this.loader = 'done';
                  }
          }else{
              this.authservice.presentAlert( 'Accept terms and Conditions');
          }
      }
    }
    FbLogin(){
      this.type = 'facebook';
      this.loader = 'present';
      this.authservice.facebookLogin().then( data => {
          if (data){
              this.authservice.getUserDetail(data.authResponse.userID).then( datafb => {
                  this.authservice.Loginfbgo(datafb['name'] , datafb['email'] , this.type).subscribe(datalogin => {
                      if (datalogin){
                           const navigationExtras: NavigationExtras = {
                              queryParams: {
                                special: JSON.stringify(datalogin)
                              }
                            };
                           var str = datafb['email'];
                           var nameMatch = str.match(/^([^@]*)@/);
                           var name = nameMatch ? nameMatch[1] : null;
                           console.log(name);
                           this.fcm.subscribeToTopic(name);
                           this.authservice.Storeuser(datalogin);
                           this.rout.navigate(['/landing'], navigationExtras);
                           this.storage.set('login', 'true');
                           this.loader = 'done';
                      }
                      }, err => {
                        if (err.error.error){
                            this.authservice.presentAlert( err.error.error);
                            this.loader = 'done';
                        }else{
                            this.authservice.presentAlert( JSON.stringify(err.error.error));
                            this.loader = 'done';
                        }
                    });
                }, err => {
                    this.authservice.presentAlert( JSON.stringify(err.error.error));
                    this.loader = 'done';
                });
            }
        }, err => {
            this.authservice.presentAlert( JSON.stringify(err.error.error));
            this.loader = 'done';
        });
    }
    GoogleLogin(){
        this.type = 'google';
        this.loader = 'present';
        const success = 'success';
        this.authservice.doLogin().then( data => {
            if (data){
                this.authservice.Loginfbgo(data.displayName , data.email , this.type).subscribe(datalogin => {
                    if (datalogin){
                        if (datalogin[success]) {
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    special: JSON.stringify(datalogin)
                                }
                            };
                            var str = data.email;
                            var nameMatch = str.match(/^([^@]*)@/);
                            var name = nameMatch ? nameMatch[1] : null;
                            console.log(name);
                            this.fcm.subscribeToTopic(name);
                            this.authservice.Storeuser(datalogin);
                            this.rout.navigate(['/landing'], navigationExtras);
                            this.storage.set('login', 'true');
                            this.loader = 'done';
                        }else{
                            this.authservice.presentAlert(JSON.stringify(datalogin['message']));
                        }
                    }
                }, err => {
                    if (err.error.error){
                        this.authservice.presentAlert( err.error.error);
                        this.loader = 'done';
                    }else{
                        this.authservice.presentAlert(JSON.stringify(err.error.error));
                        this.loader = 'done';
                    }

                });
            }
        }, err => {
            this.authservice.presentAlert( JSON.stringify(err.error.error));
            this.loader = 'done';
        });
    }
    async PopPu(){
        const alert = await this.alertController.create({
            cssClass: 'alertcontent',
            header: 'Crowd',
            message: '<p class="ion-text-justify mg0px">If you require any more information or have any questions about our Terms of Service, please feel free to contact us by using our Contact Us form.\n' +
                '\n</p>' +
                ' <strong>Introduction\n</strong><br>' +
                '\n' +
                '<p !important;" class="ion-text-justify mg0px">These terms and conditions govern your use of this app; by using this app, you accept these terms and conditions in full and without reservation. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this app.\n' +
                '\n' +
                'You must be at least 13 [Thirteen] years of age to use this app. By using this app and by agreeing to these terms and conditions, you warrant and represent that you are at least 13 years of age.\n' +
                '\n</p>' +
                '<strong>License to use app\n</strong></br>' +
                '\n' +
                '<p  class="ion-text-justify mg0px">Unless otherwise stated, This app and/or its licensors own the intellectual property rights published on this app and materials used on This app. Subject to the license below, all these intellectual property rights are reserved.\n' +
                '\n' +
                'You may view, download for caching purposes only, and print pages, files or other content from the app for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.\n' +
                '\n'+'for more details <a href="https://crowd.tutourist.com/tos">click here</a></p>',

            mode: "ios",
            buttons: [
                {
                    text: 'Disagree',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        this.ischeck = false;
                    }
                }, {
                    text: 'Agree',
                    handler: () => {
                        this.ischeck =true;
                    }
                }
            ]
        });

        await alert.present();




    }
}

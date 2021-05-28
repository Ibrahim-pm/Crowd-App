import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router,NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

// import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import Swal from 'sweetalert2';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class loginPage implements OnInit {
  public login: string;
  username: string ;
  password: string ;
  type = 'login';
  user: any;
  loader: any;
  ionicForm: FormGroup;
  isSubmitted = false;
  constructor(private firebaseDynamicLinks: FirebaseDynamicLinks,
              private fcm: FCM,
              private storage: Storage,
              public authservice: AuthService,
              public loadingController: LoadingController,
              private menu: MenuController ,
              private activatedRoute: ActivatedRoute,
              public rout: Router, private location: Location,
              public formBuilder: FormBuilder,public toastController: ToastController) {
    this.menu.enable(false, 'first');
    this.menu.enable(false, 'adminMenu');

    this.ionicForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]]
    });
  }

    get errorControl() {
        return this.ionicForm.controls;
    }

  ngOnInit() {
    this.login = this.activatedRoute.snapshot.paramMap.get('id');
  }

  goBack() {
      this.location.back();
  }

  FbLogin(){
        this.type = 'facebook';
        // this.authservice.presentLoading();
       // this.loader = "present";
        this.authservice.facebookLogin().then( data => {
         // this.loader = "done";
            if (data){
                this.authservice.getUserDetail(data.authResponse.userID).then( datafb => {
                    //const username = datafb['name'].replace(/\s/g, '_');
                    this.authservice.Loginfbgo(datafb['name'], datafb['email'] , this.type).subscribe(datalogin => {
                        this.loader = "present";
                        if (datalogin) {
                            if (datalogin['success']) {
                                const navigationExtras: NavigationExtras = {
                                    queryParams: {
                                        special: JSON.stringify(datalogin)
                                    }
                                };
                                this.loader = "done"
                                this.authservice.Storeuser(datalogin);
                                this.authservice.EventStore(datalogin);
                                this.storage.set('login', 'true');
                                this.rout.navigate(['/landing'], navigationExtras);
                                var str = datafb['email'];
                                this.presentToast()
                            }
                        }
                    }, err => {
                        if (err.error.error){
                            this.authservice.presentAlert( err.error.error);
                            // this.authservice.DismissLoading();
                            this.loader = "done";

                        }else{
                            this.authservice.presentAlert( JSON.stringify(err.error.error));
                            // this.authservice.DismissLoading();
                            this.loader = "done";

                        }

                    });
                }, err => {
                    this.authservice.presentAlert( JSON.stringify(err.error.error));
                    // this.authservice.DismissLoading();
                    this.loader = "done";

                });
            }
        }, err => {
            this.loader = "done";

        });
    }

    GoogleLogin(){
        this.type = 'google';
        this.loader = "present";
        this.authservice.doLogin().then( data => {
            console.log(data.displayName);
          this.loader = "done";
            if (data){
                this.authservice.Loginfbgo(data.displayName , data.email , this.type).subscribe(datalogin => {
                    if (datalogin){
                        if(datalogin['success']){
                            const navigationExtras: NavigationExtras = {
                                queryParams: {
                                    special: JSON.stringify(datalogin)
                                }
                            };
                            var str= data.email;
                            //var nameMatch = str.match(/^([^@]*)@/);
                            //var name = nameMatch ? nameMatch[1] : null;
                           // console.log(name);
                            // this.fcm.subscribeToTopic(data.displayName);
                            //this.fcm.subscribeToTopic(name);

                            this.authservice.Storeuser(datalogin);
                            this.authservice.EventStore(datalogin);
                            this.storage.set('login','true');
                            this.rout.navigate(['/landing'] , navigationExtras);
                            this.loader = "done";
                            this.presentToast()
                        }else{
                            this.authservice.presentAlert(JSON.stringify(datalogin['message']));
                        }

                    }
                }, err => {
                    if (err.error.error){
                        this.authservice.presentAlert(err.error.error);
                        // this.authservice.DismissLoading();
                        this.loader = "done";
                    }else{
                        this.authservice.presentAlert( JSON.stringify(err.error.error));
                        // this.authservice.DismissLoading();
                        this.loader = "done";
                    }

                });
            }
        }, err => {
            this.authservice.presentAlert( JSON.stringify(err));
            // this.authservice.DismissLoading();
            this.loader = "done";
        });
    }

    async SingIn(){
      this.isSubmitted = true;
      if (!this.ionicForm.valid ) {
          //this.authservice.presentAlert( 'Please provide a valid information!');
          return false;
      } else {
          this.loader = "present";
          this.authservice.Login(this.username, this.password, this.type).subscribe(data => {
              if (data) {
                  console.log(data);
                  const navigationExtras: NavigationExtras = {
                      queryParams: {
                          special: JSON.stringify(data)
                      }
                  };
                  this.authservice.Storeuser(data);
                  this.authservice.EventStore(data);
                  this.storage.set('login', 'true');
                  this.rout.navigate(['landing'], navigationExtras);
                  this.loader = "done";
                  var str = this.username;
                  this.presentToast()
                  //var nameMatch = str.match(/^([^@]*)@/);
                 // var name = nameMatch ? nameMatch[1] : null;
                 // console.log(name);
                  // this.fcm.subscribeToTopic(this.username);
              } else {
                  this.loader = "done";
              }
          }, err => {
              if (err.error.error) {
                  this.authservice.presentAlert(err.error.error);
              } else {
                  this.authservice.presentAlert(JSON.stringify(err.error.error));
              }
              this.loader = "done";
          });
      }
    }
    async presentToast() {
        const toast = await this.toastController.create({
            message: 'You are successfully logged in.',
            duration: 4000
        });
        toast.present();
    }
}

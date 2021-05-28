import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
// import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {NavigationExtras, Router} from '@angular/router';
import Swal from 'sweetalert2';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  username: string;
  email: string;
  loader:any;
  ionicForm: FormGroup;
  isSubmitted = false;
  constructor(public authservice: AuthService , private menu: MenuController,
              private location: Location,
              public rout: Router,
              public formBuilder: FormBuilder)
  {
    this.menu.enable(false, 'first');
    this.menu.enable(false, 'adminMenu');
  }
  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$')]],
    });
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  goBack() {
    this.location.back();
  }
  ForgotPassword(){
    this.isSubmitted = true;
    if (!this.ionicForm.valid ) {
      //this.authservice.presentAlert( 'Please provide a valid information!');
      return false;
    } else {
      this.loader = "present";
      this.authservice.forgotPassword(this.email).subscribe((data :any) => {
        this.loader = "done";
        if(data.message != "Please login with google or facebook!"){
          if (data){
            const  otp = {
              otp: data['message'],
              email: this.email,
            };
            const navigationExtras: NavigationExtras = {
              queryParams: {
                special: JSON.stringify(otp)
              }
            };
            console.log(otp.otp);
            if(otp.otp != "User does't exists"){
              this.rout.navigate(['/otp'] , navigationExtras);
            }else{
              this.authservice.presentAlert( 'Email does not exist');
            }
          }
        }else{
          this.authservice.presentAlert(data.message);
        }
      }, err => {
        this.loader = 'done';
        if (err.error.error){
          this.authservice.presentAlert( err.error.error);
        }else{
          this.authservice.presentAlert( err.error.errors.email);
          console.log(err.error);
        }
      });
    }
  }
}

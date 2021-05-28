import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {AuthService} from "../services/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.page.html',
  styleUrls: ['./changepass.page.scss'],
})
export class ChangepassPage implements OnInit {
  oldpassword;
  newpassword;
  confirmpassword;
  Userdata;
  ionicForm: FormGroup;
  isSubmitted = false;
  constructor(public authservice: AuthService , private location: Location , public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.authservice.GetData().then( data => {
      if (data){
      this.Userdata = data;
      }
    });
    this.ionicForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]],
      newpassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]],
      confirmpassword: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]]
    });
  }
  get errorControl() {
    return this.ionicForm.controls;
  }

  ChangePassword(){
    this.isSubmitted = true;
    if (!this.ionicForm.valid ) {
      //this.authservice.presentAlert( 'Please provide a valid information!');
      return false;
    } else {
      this.authservice.presentLoading();
      if (this.newpassword == this.confirmpassword){
        this.authservice.ChangePassword(this.Userdata['success']['id'] , this.oldpassword , this.newpassword ).subscribe(data => {
          if(data){
            this.authservice.presentAlert(data['success']);
            this.location.back();
          }
          this.authservice.DismissLoading();
        }, err => {
          this.authservice.DismissLoading();
          this.authservice.presentAlert( JSON.stringify(err.error.error));
        });
      }else{
        this.authservice.presentAlert( 'Password does not match');
      }
    }
  }
goBack() {
    this.location.back();
  }
}

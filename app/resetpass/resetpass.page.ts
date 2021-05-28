import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
})
export class ResetpassPage implements OnInit {
  email: any;
  password: any;
  cpassword: any;
  data;
  ionicForm: FormGroup;
  isSubmitted = false;
  constructor(private menu: MenuController,
              private location: Location,
              public activatedRoute : ActivatedRoute,
              public rout: Router,
              public authservice: AuthService,
              public formBuilder: FormBuilder) {
      this.menu.enable(false, 'first');
      this.menu.enable(false, 'adminMenu');
      this.activatedRoute.queryParams.subscribe(params => {
          if (params && params.special) {
              this.data = JSON.parse(params.special);
              console.log(this.data);
              this.email = this.data.email;
          }
      });
  }
  ngOnInit() {
      this.ionicForm = this.formBuilder.group({
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
    RestPassword(){
        this.isSubmitted = true;
        if (!this.ionicForm.valid ) {
            //this.authservice.presentAlert( 'Please provide a valid information!');
            return false;
        } else {
            if (this.password == this.cpassword){
                this.authservice.presentLoading();
                this.authservice.RestPassword(this.data, this.password).subscribe(data => {
                    if (data){
                        this.authservice.DismissLoading();
                        this.rout.navigate(['/login/Inbox']);
                        this.authservice.presentAlert( data['message']);
                    }
                }, err => {
                    if (err.error.error){
                        this.authservice.presentAlert( err.error.error);
                    }else{
                        this.authservice.presentAlert( JSON.stringify(err.error.error));
                    }
                });
            }else{
                this.authservice.presentAlert( 'Password does not match');
            }
        }
    }

}

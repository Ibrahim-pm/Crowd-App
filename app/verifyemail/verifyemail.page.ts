import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../services/auth.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.page.html',
  styleUrls: ['./verifyemail.page.scss'],
})
export class VerifyemailPage implements OnInit {
  code;
  userdata;
  constructor(private route: ActivatedRoute, public rout: Router , 
    public authservice: AuthService,
    public toastController: ToastController) {
    this.route.queryParams.subscribe(data => {
      if (this.rout.getCurrentNavigation().extras.state){
        this.userdata = this.rout.getCurrentNavigation().extras.state.user;
        console.log(this.userdata);
      }
    });
  }

  ngOnInit() {}
  CodeMatch(){
    if (this.code == this.userdata['token']){
      this.authservice.verifyorder(this.userdata['username'] , 1).subscribe(data => {
        console.log(data);
        this.presentToast();
        this.rout.navigate(['/login/Inbox']);
      });
    }else{
      this.authservice.presentAlert( 'Code does not match');
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You have successfully signed up',
      duration: 2000
    });
    toast.present();
  }
}

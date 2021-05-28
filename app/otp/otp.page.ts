import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  data;
  code;
  constructor(public authservice: AuthService , public activatedRoute : ActivatedRoute , public rout: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        console.log(this.data);
      }
    });
  }

  ngOnInit() {
  }

  CodeMatch(){
    if (this.code == this.data.otp){
      const navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.data)
        }
      };
      this.rout.navigate(['/resetpass'] , navigationExtras);
    }else{
      this.authservice.presentAlert( 'Code does not match');
    }
  }
}

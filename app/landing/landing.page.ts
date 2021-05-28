import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras,Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  username:string;
  data:any;
  userimage;
  constructor(private location: Location,public activatedRoute : ActivatedRoute,public rout: Router,private afAuth: AngularFireAuth, private afs: AngularFirestore) { 
  	 this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        this.data = JSON.parse(params.special);
        console.log(this.data);
        this.username = this.data.success.username;
        console.log(this.data.success.profileimage);
         if (this.data.urimagel == null || this.data.urimagel == ""){
             this.userimage = '../assets/imgs/profile_user.svg';
             console.log(this.userimage);
         }else{
             this.userimage = this.data.urimagel;
             console.log("working");
         }
        this.adddata_fb(); 
        this.function_call_animation();
        console.log(this.data);
    });
   }

  adddata_fb() {
    console.log(this.data.success.email);
    console.log(this.data.success.username);
    console.log(this.data.urimagel);
    var iamge_url = this.userimage
      return this.afs.collection(this.data.success.email).doc('profile').set({
        username: this.data.success.username,
        profile: iamge_url,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(value => {
        console.log(value);
      });
  }  


  ngOnInit() {
  }

  goBack() {
	this.location.back();
  }

  function_call_animation(){
  	setTimeout(() => {
        this.rout.navigate(['tabs']);
    }, 2000);
  }

}

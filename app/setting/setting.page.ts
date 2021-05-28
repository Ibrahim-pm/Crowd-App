import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  privacy:any;	
  constructor(private location: Location,private storage: Storage) { 
  	console.log(this.privacy);
  	storage.get('privacy').then((val) => {
	    console.log('Your age is', val);
	    if(val){
	    	this.privacy = val;
		  }
	  });
  }

  ngOnInit() {
  }

  goBack() {
	this.location.back();
  }

  Clicked(){
  	console.log(this.privacy);
  	this.storage.set('privacy', this.privacy);
  }

}

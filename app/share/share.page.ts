import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  constructor(public modalController: ModalController,private location: Location) { }

  ngOnInit() {
  }

  dismiss() {
	this.modalController.dismiss();
  }

   goBack() {
	this.location.back();
  }

}

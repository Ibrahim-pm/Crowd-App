import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { Platform,NavController,ModalController } from '@ionic/angular';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {

  constructor(private platform: Platform,private network: Network,private storage: Storage,private navCtrl: NavController) {
  }

  ngOnInit() {
    // alert("");
    this.platform.backButton.subscribeWithPriority(10, () => {
      // alert('Handler was called!');
      console.log("working");
    });
  }

  check(){
  	let connectSubscription = this.network.onConnect().subscribe(() => {
       this.function_chek();
    });
  }

  function_chek(){
  	 this.storage.get('login').then((val) => {
            if (val == 'true'){
                // this.navCtrl.navigateRoot('/tabs');network
                this.navCtrl.navigateRoot('/tabs');
            }else{
                this.navCtrl.navigateRoot('/login/1');
            }
            console.log(val);
        });
  }

}

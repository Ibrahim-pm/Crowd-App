import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
// import { ModalController } from '@ionic/angular';
import { ModalController, ToastController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import { AddfriendPage } from '../addfriend/addfriend.page';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {ProfileviewerPage} from '../profileviewer/profileviewer.page';
// import {RedirectPage} from '../redirect/redirect.page';
import {HashtredingPage} from '../hashtreding/hashtreding.page';
import { TredingPage } from '../treding/treding.page';
import { RedirectPage } from '../redirect/redirect.page';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-searchtreding',
  templateUrl: './searchtreding.page.html',
  styleUrls: ['./searchtreding.page.scss'],
})
export class SearchtredingPage implements OnInit {
  items = [];
  isItemAvailable = false;
  data:any;
  segmentModel = 'Profile';
  hashtag_tag;
  hastagdata;
    post_length;
    postdata;
    postfilter;
    userinfo:any;
    friend_list_array: any =[];
    friend_list_array_request:any=[];
    requested_data:any = [];
    user_email:any;
  constructor(public toastController: ToastController,private storage: Storage,public db: AngularFirestore, public authservice: AuthService, private location: Location, public modalController: ModalController) {
     this.storage.get('userdata').then((val) => {
        this.userinfo = val;
        this.user_email = this.userinfo.success.email;
    });
     this.storage.get('friends_request').then((val) => {
        if(val){
          this.friend_list_array_request = val;
        }
      });
  }

    async ngOnInit() {
    this.get_data();
  }

  goBack() {
  	this.location.back();
  	this.modalController.dismiss();
  }
    segmentChanged($data){
        this.segmentModel = $data;
        if (this.segmentModel == 'Profile'){

        }else if (this.segmentModel == 'trends'){

        }else if (this.segmentModel == 'posts'){

        }else{

        }
    }

  get_data(){
    this.requested_data = [];
    this.authservice.presentLoading();
    this.authservice.GetUsers().subscribe((data : any) => {

        this.items = data.image;
        // console.log(this.items);
        for(let i=0; i<this.items.length; i++){
          // console.log(this.items[0][2]);
          this.getrequest(this.items[i][2]).subscribe((data)=>{
            if(data.length > 0){
              for(let j=0;j<data.length;j++){
                console.log(data[j].friendrequest+""+this.items[i][2]);
                this.requested_data.push(data[j].friendrequest+""+this.items[i][2]); 
              }
            }
              // if(data){ 
              //   for(let i=0;i<data.length;i++){
              //    if(data[i].friendrequest){ 
              //     this.requested_data.push(data[i].friendrequest+""+this.items[i][2]); 
              //    }
              //   } 
              // }
              // console.log(this.requested_data);
          }); 
        }
        console.log(this.requested_data);
        this.data = data.image;
        this.authservice.DismissLoading();
    }, err => {
        if (err.error.error){
            this.authservice.DismissLoading();
            this.authservice.presentAlert( err.error.error);
        }else{
            this.authservice.DismissLoading();
            this.authservice.presentAlert( JSON.stringify(err.error.error));
        }
    });
      const createdAt = 'createdAt';
      this.authservice.getheshtag().subscribe((data: any) => {
          if (data){
              console.log(data);
              this.hashtag_tag = data.hashtag;
              this.hastagdata = this.hashtag_tag;
          }
      }, err => {
          if (err.error.error){
              this.authservice.presentAlert( err.error.error);
          }else{
              this.authservice.presentAlert( JSON.stringify(err.error.error));
          }
      });
      this.getAllPosts().subscribe((data) => {
        // this.get_data();
          this.postdata = data.slice().reverse();
          this.postfilter = this.postdata;
          for (var i=0; i<this.postdata.length; i++) {
              if (this.postdata[i][createdAt]) {
                  const t0 = new Date(this.postdata[i][createdAt].seconds * 1000).toISOString();
                  const t1 = new Date().toISOString();
                  // @ts-ignore
                  const d = (new Date(t1)) - (new Date(t0));
                  const weekdays = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
                  const days = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
                  const hours = Math.floor(d / 1000 / 60 / 60 - weekdays * 7 * 24 - days * 24);
                  const minutes = Math.floor(d / 1000 / 60 - weekdays * 7 * 24 * 60 - days * 24 * 60 - hours * 60);
                  const seconds = Math.floor(d / 1000 - weekdays * 7 * 24 * 60 * 60 - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
                  const t = {};
                  ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach(q => {
                      if (eval(q) > 0) {
                          t[q] = eval(q);
                      }
                  });
                  if (t['seconds'] <= 60) {
                      this.postdata[i][createdAt] = t['seconds'] + 's';
                  }
                  if (t['minutes'] >= 1) {
                      this.postdata[i][createdAt] = t['minutes'] + 'm';
                  }
                  if (t['hours'] >= 1) {
                      this.postdata[createdAt] = t['hours'] + 'h';
                  }
                  if (t['days'] >= 1) {
                      this.postdata[createdAt] = t['days'] + 'd';
                  }
              } else {
                  this.postdata[createdAt] = '1s';
              }
          }
      });
      this.storage.get('userdata').then((val) => {
          this.getAllmyFriends(val).subscribe((data)=>{
              for(let i=0; i<data.length; i++){
                  this.friend_list_array.push(data[i].friend);
              }
          });
      });
      
  }

    getrequest (da): Observable<any> {
      console.log(da);
      return this.db.collection<any>(da+'/friendrequest/list/').valueChanges ();
    }

    getAllmyFriends(val): Observable<any> {
             return this.db.collection<any>(val.success.email + '/friend/friend/').valueChanges ();
    }
    getAllPosts(): Observable<any> {
        return this.db.collection<any>('feed').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                if(data.username){
                    this.db.doc(data.username).get().subscribe(doc => {
                        data.username = doc.data();
                    });
                }
                const id = a.payload.doc.id;
                return {id ,data,...data};
            }))
        );
    }

  getItems(ev: any) {
         // this.get_data();

      if(this.segmentModel == 'Profile'){
          this.items = this.data;
          const val = ev.target.value;

          if (val && val.trim() !== '') {
              this.isItemAvailable = true;
              this.items = this.items.filter((item) => {
                  return (item[1].toLowerCase().indexOf(val.toLowerCase()) > -1);
              });
          } else {
              this.isItemAvailable = false;
          }
      }
      if(this.segmentModel == 'trends'){
          this.hastagdata = this.hashtag_tag;
          const val = ev.target.value;

          if (val && val.trim() !== '') {
              this.hastagdata = this.hastagdata.filter((item) => {
                  return (item.hashtag.toLowerCase().indexOf(val.toLowerCase()) > -1);
              });
          } else {
          }
      }
      if(this.segmentModel == 'posts'){
          this.postfilter = this.postdata;
          const val = ev.target.value;
          if (val && val.trim() !== '') {
              this.postfilter = this.postfilter.filter((item) => {
                  return (item.msg.toLowerCase().indexOf(val.toLowerCase()) > -1);
              });
          } else {
          }
      }
     }  

  async openModal_2(data) {
     const modal = await this.modalController.create({
      component: AddfriendPage,
      componentProps: {
        data: data
      }
     });
     return await modal.present();
  }
    async get_profile(da) {
        const modal = await this.modalController.create({
            component: ProfileviewerPage,
            componentProps: {
                data: da,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }
    // async open_post(data, id) {
    //     const modal = await this.modalController.create({
    //         component: RedirectPage,
    //         componentProps: {
    //             data,
    //             mein_id: id,
    //         },
    //         cssClass: 'my-custom-class'
    //     });
    //     return await modal.present();
    // }
    async get_post_detail(data) {
        const modal = await this.modalController.create({
            component: HashtredingPage,
            componentProps: {
                hash: data,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }


     async openModal(data) {
       const modal = await this.modalController.create({
       component: TredingPage,
       componentProps: {
          data: this.data, 
          hash: data
       }
       // cssClass: 'my-custom-class'
       });
       return await modal.present();
      }

    async open_post(data,id) {
       const modal = await this.modalController.create({
       component: RedirectPage,
       componentProps: {
          data: data,
          mein_id: id, 
       },
       cssClass: 'my-custom-class'
       });
       return await modal.present();
      }
       send_request(da,daa){
        this.db.collection(da).doc('friendrequest')
            .collection('list').add({
            friendrequest: this.userinfo.success.email,
            // username: this.userinfo.success.username,
            username: this.db.doc(this.userinfo.success.email+'/profile').ref,
            profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
            profile_status: 'request',
            // profile: this.userinfo.urimagel,
        })
            .then(() => {
                this.friend_list_array_request.push(da);
                this.presentToast();
                this.storage.set('friends_request', this.friend_list_array_request);
                this.authservice.setupFCM(daa,'Crowd',this.userinfo.success.username+' send you follow request','request');
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
    }
    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Follow request sent successfully',
            duration: 2000
        });
        toast.present();
    }
}

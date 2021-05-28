import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatpagePage } from '../chatpage/chatpage.page';
import { ActionSheetController } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';
import { ProfileviewerPage } from '../profileviewer/profileviewer.page';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  value_show = 'false';
  friend_list:any;
  userinfo:any;
  data_msg:any;
  friend_list_length:any;
  items:any;
  isItemAvailable:any;
  last_sms_data:any = [];
  block_list:any;
  block_list_array:any=[];
  data_number:any = 8;
  event_refresher:any;
  last_sms_data_td:any=[];
  chat_sms_list:any=[];
  constructor(public modalController: ModalController,public actionSheetController: ActionSheetController,
    private storage: Storage,public db: AngularFirestore,private afAuth: AngularFireAuth,public loadingController: LoadingController) {
    this.storage.get('userdata').then((val) => {
      this.userinfo = val;
    });
    
    this.storage.get('chat_sms_list').then((val) => {
      if(val){
        this.chat_sms_list = val;
      }
    });
  }

  loadData_all(event) {
    this.event_refresher = event;
    this.data_number = this.data_number + 8;  
      this.ngOnInit();
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
     this.getBlock().subscribe((data)=>{
        this.block_list = data;
        loading.dismiss();
        for(let i=0; i < data.length; i++){
          this.block_list_array.push(data[i].id);
        }
        this.call_alldata();
    });
  }

  call_alldata(){
    this.getAllPosts().subscribe((data)=>{
        this.friend_list = data;
        console.log(this.friend_list)
        this.items = this.friend_list;
        this.friend_list_length = data.length;
        if(this.data_number > 8){
          this.event_refresher.target.complete();
        }
        for(let i=0;i<this.friend_list_length;i++){
          this.function_for(this.friend_list[i].friend);
        }
    });
  }

  function_for(da){
    this.getAllmsg(da).subscribe((data:any)=>{
          this.data_msg = data.slice().reverse();
          if(this.data_msg.length > 0 ){
            var index = this.last_sms_data.findIndex(obj => obj.message==this.data_msg[0].message);
            if(index < 0){
              this.last_sms_data.push(this.data_msg[0]);
              this.last_sms_data_td.push(this.data_msg[0].email);
              console.log(this.last_sms_data);
              console.log(this.data_msg[0].message);
              console.log(index);
            }else{
              console.log("hellooooooo");
            }
          }else{
            console.log("error");
          }
    });   
  }

  getItems(ev: any) {
         this.items = this.friend_list;
         const val = ev.target.value;
         if (val && val.trim() !== '') {
             this.isItemAvailable = true;
             this.items = this.items.filter((item) => {
                 return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
             })
         } else {
             this.isItemAvailable = false;
         }

     }  

  getBlock (): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email +'/blocklist/Block').valueChanges ();
  }   

  getAllPosts (): Observable<any> {
    // return this.db.collection<any>(this.userinfo.success.email +'/friend/friend',ref => ref.limit(this.data_number)).valueChanges ();
    let datas = [];
        return this.db.collection<any>(this.userinfo.success.email +'/friend/friend').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                // if (data.profile) {
                //     this.db.doc(data.profile).get().subscribe(doc => {
                //         data.profile = doc.data();
                //     });
                // }
                if (data.friend) {
                    this.db.doc(data.friend +'/profile').get().subscribe(doc => {
                        data.username = doc.data();
                    });
                    console.log(data)
                }
                return  { id,data ,...data };
            }))
        )
  }

  getAllmsg (da): Observable<any> {
    return this.db.collection<any>(this.userinfo.success.email+'/chatbox/'+da).valueChanges ();
    // return this.db.collection<any>(this.userinfo.success.email).doc('keep').collection<any>(this.userinfo.success.email+'keep').valueChanges ();
  }

  async chat_page(data,da) {
   if(da != "nosms"){ 
     this.chat_sms_list.push(da);
     this.storage.set('chat_sms_list',this.chat_sms_list); 
   }else{
    console.log("working");
   }

   console.log(data)

   const modal = await this.modalController.create({
   component: ChatpagePage,
   componentProps: {
      data: data
   },
   cssClass: 'my-custom-class'
   });
   modal.onDidDismiss()
      .then((data) => {
        const user = data['data']; // Here's your selected user!
        console.log(user);
        if(user.dismissed == 'true'){
          this.storage.get('chat_sms_list').then((val) => {
            if(val){
              this.chat_sms_list = val;
            }
          });
          console.log("working");
          this.last_sms_data = []; 
          console.log(this.last_sms_data); 
           this.getAllPosts().subscribe((data)=>{
              this.friend_list = data;
              
              this.items = this.friend_list;
              console.log(data , 'Profile');
              console.log(data);
              console.log("allpost");
              this.friend_list_length = data.length;
              console.log(this.last_sms_data);
              for(let i=0;i<this.friend_list_length;i++){
                console.log("allpost loop");
                this.function_for(this.friend_list[i].friend);
              }
          });          
        }else{
          console.log("error");
        }
  });
   return await modal.present();
  }

  async hiden_icon(){
    this.value_show = 'true';
  }

   async presentActionSheet(da) {
    console.log(da);
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
            this.db.collection(this.userinfo.success.email).doc('chatbox')
                            .collection(da.friend)
              .get()
              .toPromise()
              .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.delete();
              });
            }); 
        }
      },{
        text: 'Block',
        icon: 'ban',
        handler: () => {
          // console.log('Favorite clicked');
          var output = this.db.collection(this.userinfo.success.email).doc('blocklist').collection('Block').doc().set({
            id: da.friend,
          }).then(value => {
            console.log(value);
          });
            }
      }]
    });
    await actionSheet.present();
  }


  async get_profile(da) {
     const modal = await this.modalController.create({
     component: ProfileviewerPage,
     componentProps: {
        data: da,
        from:"chat_page"
     },
     cssClass: 'my-custom-class'
     });
     return await modal.present();
  } 


}

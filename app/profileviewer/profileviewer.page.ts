import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';
import { ModalController,NavParams } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Storage } from '@ionic/storage';

import firebase from 'firebase/app';
// import {AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RedirectPage } from '../redirect/redirect.page';

import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {HashtredingPage} from '../hashtreding/hashtreding.page';
import {Router} from '@angular/router';
@Component({
    selector: 'app-profileviewer',
    templateUrl: './profileviewer.page.html',
    styleUrls: ['./profileviewer.page.scss'],
})
export class ProfileviewerPage implements OnInit {
    segmentModel = "fri";
    data_length:any;
    data:any = [];
    userinfo:any;
    img_:any;
    friend_length:any;
    user_info:any;
    user_name:any;
    user_email:any;
    // userinfo:any;
    friend_list_array:any =[];
    img_data_show:any=[];
    img_data_show_id:any=[];
    friend_list_dummy:any=[];
    email_value:any;
    from:any;
    email_user:any;
    friends_data:any;
    date_current: any;
    friend_list_array_request:any=[];
    friend_request:any="";
    data_length_arry:any = [];
    usernamedis;
    constructor(public modalController: ModalController,
                public navParams: NavParams,
                private menu: MenuController,
                public authservice: AuthService,
                private storage: Storage,
                public alertController: AlertController,
                public loadingController: LoadingController,
                public db: AngularFirestore,
                private afAuth: AngularFireAuth,
                public rout: Router) {
        const date = new Date();
        this.date_current = new Date();
        this.storage.get('userdata').then((val) => {
            this.userinfo = val;
            this.email_value = this.userinfo.success.email;
            this.email_user = this.userinfo.success.email;
        });
        this.storage.get('friend_list_dummy').then((val) => {
            if(val){
                this.friend_list_dummy = val;
            }
        });
        this.storage.get('friends_request').then((val) => {
            if(val){
                this.friend_list_array_request = val;
            }
        });
        this.user_info = this.navParams.get('data');
        console.log(this.user_info.data.username.profile);
        if(this.user_info.data.profile?.profile){
            this.usernamedis = this.user_info.data.profile?.username;
            this.img_ = this.user_info.data.profile.profile;
        }else if(this.user_info.data.username.profile){
            this.img_ = this.user_info.data.username.profile;
            this.usernamedis = this.user_info.data.username?.username;
        }

        this.from = this.navParams.get('from');
        this.friend_request = this.navParams.get('friend_request');
        this.user_email = this.user_info.post_email;
        if(this.from == "chat_page"){
            this.user_email = this.user_info.friend;
            this.user_name = this.user_info.username;
            this.call_allfunction();
        }
        if(this.friend_request == "friend_request"){
            this.user_email = this.user_info.friendrequest;
            this.user_name = this.user_info.username;
            this.call_allfunction();
        }

        if(this.friend_request != "friend_request" && this.from != "chat_page"){
            this.call_allfunction();
        }
    }

    goBack() {
        this.modalController.dismiss();
    }

    async ngOnInit() {
    }

    async call_allfunction(){
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
        });
        await loading.present();
        this.getAllPosts().subscribe((data) => {
            this.data_length_arry = [];
            const createdAt = 'createdAt'
            this.data = data;
            console.log(this.data, 'see');
            loading.dismiss();
            this.data_length = data.length;
            for(let i=0;i<data.length;i++){
                if(data[i].from){
                    this.data_length_arry.push(data[i]);
                }
            }
            for(let i=0; i< data.length; i++){
                if(data[i].img){
                    this.img_data_show.push(data[i].img);
                    this.img_data_show_id.push(data[i]);
                }
                if (data[i][createdAt]){
                    const t0 = new Date(data[i][createdAt].seconds * 1000).toISOString();
                    const t1 = new Date().toISOString();
                    // @ts-ignore
                    const d = (new Date(t1)) - (new Date(t0));
                    const weekdays     = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
                    const days         = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
                    const hours        = Math.floor(d / 1000 / 60 / 60    - weekdays * 7 * 24            - days * 24);
                    // tslint:disable-next-line:max-line-length
                    const minutes      = Math.floor(d / 1000 / 60       - weekdays * 7 * 24 * 60         - days * 24 * 60         - hours*60);
                    // tslint:disable-next-line:max-line-length
                    const seconds      = Math.floor(d / 1000          - weekdays * 7 * 24 * 60 * 60      - days * 24 * 60 * 60      - hours*60*60      - minutes*60);
                    const t = {};
                    ['weekdays', 'days', 'hours', 'minutes', 'seconds'].forEach(q=>{ if (eval(q)>0) { t[q] = eval(q); } });
                    if (t['seconds'] <= 60){
                        data[i][createdAt] = t['seconds'] + 's';
                    }
                    if (t['minutes'] >= 1){
                        data[i][createdAt] = t['minutes'] + 'm';
                    }
                    if (t['hours'] >= 1){
                        data[i][createdAt] = t['hours'] + 'h';
                    }
                    if (t['days'] >=1){
                        data[i][createdAt] = t['days'] + 'd';
                    }
                }else{
                    data[i][createdAt] = '1s';
                }
            }
        });

        this.getAllFriends().subscribe((data)=>{
            // this.friends_data = data;
            this.friend_length = data.length;
        });

        this.getAllmyFriends().subscribe((data)=>{
            console.log(data);
            for(let i=0; i<data.length; i++){
                this.friend_list_array.push(data[i].friend);
            }
            console.log(this.friend_list_array);
        });
    }

    getAllmyFriends (): Observable<any> {
        // console.log(this.data_mein[2]);
        // return this.db.collection<any>(this.userinfo.success.email+'/friend/friend/').valueChanges ();
        return this.db.collection<any>(this.userinfo.success.email+'/friend/friend/').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }



    getAllPosts (): Observable<any> {
        // return this.db.collection<any>(this.user_email).valueChanges ();
        // return this.db.collection<any>(this.user_email).snapshotChanges().pipe(
        //     map(actions => actions.map(a => {
        //         const data = a.payload.doc.data();
        //         const id = a.payload.doc.id;
        //         return { id, ...data };
        //     }))
        // );

        return this.db.collection<any>(this.user_email).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            if (data.profile && data.from) {
                        this.db.doc(data.profile).get().subscribe(doc => {
                            data.profile = doc.data();
                        });
                        // console
                    }

            return { id,data,...data };
          }))
        );
    }

    // getAllFriends_my (): Observable<any> {
    //     return this.db.collection<any>(this.user_email+'/friend/friend/').valueChanges ();
    // }
    getAllFriends (): Observable<any> {
        return this.db.collection<any>(this.user_email+'/friend/friend/').valueChanges ();
    }

    async openMenu() {
        this.menu.enable(true, 'adminMenu');
        this.menu.open('adminMenu');
    }

    segmentChanged(event){
        console.log(this.segmentModel);
    }


    send_request(){
        this.friend_list_dummy.push(this.user_info.from);
        this.storage.set('friend_list_dummy',this.friend_list_dummy);
        this.db.collection(this.user_info.from).doc('friendrequest')
            .collection('list').add({
            friendrequest: this.userinfo.success.email,
            username: this.userinfo.success.username,
            profile: this.userinfo.urimagel,
        })
            .then(() => {
                console.log("Document successfully written!");
                // this.presentToast();
                this.friend_list_array_request.push(this.user_info.from);
                this.storage.set('friends_request',this.friend_list_array_request);
                this.modalController.dismiss();
                this.authservice.setupFCM(this.user_info.from,'Crowd',this.userinfo.success.username+' Send you friend request','request');
                // this.db.collection(this.data_mein[2]).doc('notificationlist')
                //                   .collection('notification').add({
                //       notification: this.userinfo.success.username + ' Send you friend request',
                //       email :this.userinfo.success.email,
                //   });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
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

    nfollow(da){
        console.log(this.userinfo.success.email);
        console.log(this.user_info.friend);
        this.db.collection(this.userinfo.success.email).doc('friend')
            .collection('friend').doc(da).delete();
        this.modalController.dismiss();
    }
    Follwing(ev){
        // console.log('good');
        // this.rout.navigateByUrl('/following');
        // this.modalController.dismiss();
    }
}

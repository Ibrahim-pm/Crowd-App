import {Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { TipnowPage } from '../tipnow/tipnow.page';
import { SharePage } from '../share/share.page';
import { ComentPage } from '../coment/coment.page';
import { HashtredingPage } from '../hashtreding/hashtreding.page';
import { LivevideoPage } from '../livevideo/livevideo.page';
import { ProfileviewerPage } from '../profileviewer/profileviewer.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { RedirectPage } from '../redirect/redirect.page';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {EventService} from '../services/event.service';
import { PostAll } from '../shared/PostData';

@Component({
    selector: 'app-tab1',
    templateUrl: './tab1.page.html',
    styleUrls: ['./tab1.page.scss'],
})

export class Tab1Page implements OnInit {
    data: any = [];
    data_length: any;
    userinfo: any;
    base64Image: any;
    news: Observable<any[]>;
    friends_list: any = [];
    post_length: any;
    my_data: any;
    my_data_length: any;
    data_fav: any;
    data_fav_length: any;
    data_fav_list: any = [];
    feed_data: any;
    feed_data_list: any = [];
    userimage: any;
    event_refresher: any;
    data_number: any = 8;
    loader: any = 'present';
    keep_remove: any;
    date_current: any;
    hash_values: any;
    StoryeUser: any;
    data_update:any=[];
    profile_img:any=[];
    data_shw:any="false";
    currentPlaying = null;
    stickyVideo = HTMLLIElement = null;
    stickyPlaying = false;
    SpeakerVideo = true;
    Playing =true;
    fav_function:any = 'false';
    kep_function:any = 'false';
    show_after:any = 'false';
    data_live:any = 0;
    @ViewChild('stickyplayer', {static: false}) stickyPlayer: ElementRef;
    @ViewChildren('player')videoPlayers: QueryList<any>;
    profile;
    username_alldata:any = [];
    username_alldata_ervers:any = [];
    username_alldata_img:any = [];
    constructor(private photoViewer: PhotoViewer,
                private imageResizer: ImageResizer,
                public actionSheetController: ActionSheetController,
                public rout: Router,
                private fcm: FCM,
                private firebaseDynamicLinks: FirebaseDynamicLinks,
                private socialSharing: SocialSharing,
                public authservice: AuthService,
                private storage: Storage,
                public alertController: AlertController,
                public loadingController: LoadingController,
                public db: AngularFirestore,
                public platform: Platform,
                private menu: MenuController,
                public modalController: ModalController,
                private camera: Camera,
                private afAuth: AngularFireAuth,
                private renderer: Renderer2,
                private event: EventService) {

        const date = new Date();
        this.date_current = new Date();
        this.get_data();
    }
    

    getAlldata_liv(): Observable<any> {
        return this.db.collection<any>(this.userinfo.success.email +'/friend_live/friend_live').snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );
      }


    ionViewWillEnter(){
        this.userimage = '';
        this.event.subscribe('userdata', (val) => {
            if (val){
                this.userinfo = val;
                //this.fcm.subscribeToTopic(this.userinfo.success.username);
                if (val.urimagel){
                    this.userimage = this.userinfo.urimagel;
                }else{
                }
            }
        });
        this.storage.get('userdata').then((val) => {
            if (val){
                this.userinfo = val;
                //this.fcm.subscribeToTopic(this.userinfo.success.username);
                this.getAlldata_liv().subscribe((data) => {

                                  this.data_live = data.length;
                        }); 
                this.OnInit_type();
                if (this.userinfo.urimagel){
                    this.userimage = this.userinfo.urimagel;
                }else{
                    this.userimage = '../assets/imgs/profile.svg';
                }

            }
        });
    }
    didScroll(){
        if (this.currentPlaying && this.isElementInViewport(this.currentPlaying)){
            return;
        }else if (this.currentPlaying && !this.isElementInViewport(this.currentPlaying)){
            this.currentPlaying.pause();
            this.currentPlaying = null;
            this.Playing = false;
            this.SpeakerVideo = true;
        }
        this.videoPlayers.forEach(player => {
            if (this.currentPlaying){
                return;
            }
            const nativeElement = player.nativeElement;
            const inView = this.isElementInViewport(nativeElement);
            if (this.stickyVideo && this.stickyVideo.src == nativeElement.src){
                return;
            }
            if (inView){
                this.currentPlaying = nativeElement;
                this.currentPlaying.muted = true;
                this.Playing = true;
                this.currentPlaying.play();
            }
        });
    }
    Mutebutton(player){
        if (this.SpeakerVideo){
            player.muted = false;
            this.SpeakerVideo = false;
        }else{
            player.muted = true;
            this.SpeakerVideo = true;
        }
    }
    playOrPause(player){
        if (this.Playing){
            player.pause();
            this.Playing = false;
        }else{
            player.play();
            this.Playing = true;
        }
    }
    openFullscreen(elem){
        if (elem.requestFullscreen){
            elem.requestFullscreen();
        }else if (elem.webkitEnterFullscreen){
            elem.webkitEnterFullscreen();
            elem.enterFullscreen();
        }
    }
    isElementInViewport(el){
        const rect = el.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
    playOnSide(elem){
        elem.muted = true;
        elem.pause();
        this.SpeakerVideo = true;
        this.Playing = false;
        if (this.stickyVideo){
            this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
        }
        this.stickyVideo = elem.cloneNode(true);
        this.renderer.appendChild(this.stickyPlayer.nativeElement , this.stickyVideo);
        if (this.currentPlaying){
            const playPosition = this.currentPlaying.currentTime;
            this.currentPlaying.pause();
            this.currentPlaying = null;
            this.stickyVideo.currentTime = playPosition;
        }
        this.stickyVideo.muted = false;
        this.stickyVideo.play();
        this.stickyPlaying = true;
    }

    closeSticky(){
        if (this.stickyVideo){
            this.renderer.removeChild(this.stickyPlayer.nativeElement , this.stickyVideo);
            this.stickyVideo = null;
            this.stickyPlaying = false;
        }
    }

    playOrPauseSticky(){
        if (this.stickyPlaying){
            this.stickyVideo.pause();
            this.stickyPlaying = false;
        }else{
            this.stickyVideo.play();
            this.stickyPlaying = true;
        }
    }
    loadData(event) {
        this.event_refresher = event;
        this.data_number = this.data_number + 8;
        // this.OnInit_type();
    }

    create_link(data){
        this.firebaseDynamicLinks.createShortDynamicLink({
            link: 'https://' + data.id
        }).then((url) => {
            // alert("Dynamic link was created:"+url);
            this.share_post(url, data);
        });
    }

    async ngOnInit() {}

    OnInit_type(){
        const createdAt = 'createdAt'
        this.getAllPosts().subscribe((data) => {
            setTimeout(() => {
                this.data = data.slice().reverse();
                this.data_shw = 'true';
                this.call_post_check();
            }, 1000);
            for(let i=0;i<data.length;i++){
                if(data[i][createdAt]){

                    const t0 = new Date(data[i][createdAt].seconds * 1000).toISOString();
                    const t1 = new Date().toISOString();
                    // @ts-ignore
                    const d = (new Date(t1)) - (new Date(t0));
                    const weekdays     = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
                    const days         = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
                    const hours        = Math.floor(d / 1000 / 60 / 60    - weekdays * 7 * 24            - days * 24);
                    const minutes      = Math.floor(d / 1000 / 60       - weekdays * 7 * 24 * 60         - days * 24 * 60         - hours*60);
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
            this.post_length = data.length;
            if (this.data_number > 8){
                this.event_refresher.target.complete();
            }
            this.loader = 'dismiss';
            this.data_length = data.length;
        });

        this.getAllFriends().subscribe((data) => {
            for (let i = 0; i < data.length; i++){
                this.friends_list.push(data[i].friend);
            }

        });
        this.getmydata().subscribe((data) => {
            this.my_data = data;
            this.my_data_length = data.length;
        });
        this.getAllfav().subscribe((data) => {
            this.data_fav = data;
            this.data_fav_length = data.length;
            for(let i = 0; i < data.length; i++){
                this.data_fav_list.push(data[i].post_id);
            }
        });

        this.getfeed().subscribe((data) => {
            this.feed_data = data;
            for (let i = 0; i < data.length; i++){
                this.feed_data_list.push(data[i].data.post_id);
            }
        });
        this.authservice.UplodeVieoStorey().subscribe(data => {
            this.StoryeUser = data['success'];
        }, err => {
        });
    }

     call_post_check(){
        this.username_alldata=[];
        for(let i=0;i<this.data.length;i++){
            if(this.data[i].data.username.username){
                this.username_alldata.push(this.data[i].data.username.username);
                this.username_alldata_img.push(this.data[i].data.username.profile);
            }
        }
    }

    getfeed(): Observable<any> {
        return this.db.collection<any>(this.userinfo.success.email + '/keep/' + this.userinfo.success.email + 'keep/', ref => ref.limit(this.data_number)).valueChanges();
    }

    get_peofile_data(da): Observable<any> {
        return this.db.collection<any>(da + '/profile/profile').valueChanges();
    }
    getAllPosts(): Observable<any> {
        return this.db.collection<any>('feed',ref => ref.orderBy('createdAt')).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                if (data.username) {
                    this.db.doc(data.username).get().subscribe(doc => {
                        data.username = doc.data();
                    });
                }
                const id = a.payload.doc.id;
                return {id , data , ...data};
            }))
        );
    }
    getAllfav(): Observable<any> {
        return this.db.collection<any>('feedfav/feedfav/' + this.userinfo.success.email, ref => ref.orderBy('createdAt').limitToLast(this.data_number)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    getAllFriends(): Observable<any> {
        return this.db.collection<any>(this.userinfo.success.email + '/friend/friend').valueChanges ();
    }

    getmydata(): Observable<any> {
        return this.db.collection<any>(this.userinfo.success.email).valueChanges ();
    }
    async openMenu() {
        this.menu.enable(true, 'first');
        this.menu.open('first');
    }
    async Tipopen(data) {
        const modal = await this.modalController.create({
            component: TipnowPage,
            componentProps: {
                data,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }
    async share_pop() {
        const modal = await this.modalController.create({
            component: SharePage,
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }
    async coment_pop(data) {
        const modal = await this.modalController.create({
            component: ComentPage,
            componentProps: {
                data,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }

    async camera_capture(){
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.CAMERA
        };
        this.camera.getPicture(options).then((imageData) => {
            this.base64Image = 'data:image/jpeg;base64,' + imageData;
            this.presentAlert();
        }, (err) => {
        });
    }
    async presentAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Post',
            inputs: [
                {
                    name: 'msg',
                    type: 'text',
                    placeholder: 'Message'
                },
                {
                    name: 'hash',
                    type: 'text',
                    placeholder: 'HasTech'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('cancel');
                    }
                }, {
                    text: 'Send',
                    handler: (data: any)  => {
                        this.upload_img(data);
                    }
                }
            ]
        });
        await alert.present();
    }

    async upload_img(data){
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
        });
        await loading.present();
        this.authservice.ImageUpload(this.base64Image).subscribe((data: any) => {
            if (data){
                loading.dismiss();
                this.base64Image = data.message;
                this.addpost(data);
            }
        }, err => {
            loading.dismiss();
            if (err.error.error){
                this.authservice.presentAlert( err.error.error);
            }else{
                this.authservice.presentAlert( JSON.stringify(err.error.error));
            }
        });
    }

    addpost(data) {
        return this.db.collection(this.userinfo.success.email).add({
            msg: data.msg,
            hash: data.hash,
            img: this.base64Image,
            vid: '',
            fav: '',
            post_id: this.post_length,
            from: this.userinfo.success.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    addkeep(data, da){
        this.data_shw = 'false';
        if(data.keep_count < 0){
            data.keep_count =0
        }
        if(this.kep_function == 'false'){
            this.kep_function = 'true';
            this.db.collection('keep').doc('keeplist').collection(this.userinfo.success.email).add({
                keep: da,
            }).then(() => {
                console.log('Document successfully written!');
            }).catch((error) => {
                console.error('Error writing document: ', error);
            });
            if (da == 'true'){
                if(data.keep_count < 0){
                    data.keep_count =0
                }
                this.db.collection(this.userinfo.success.email).doc('keep').collection(this.userinfo.success.email + 'keep').doc(data.id).set({
                    data,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                }).then(() => {
                    console.log('Document successfully written!');
                }).catch((error) => {
                    console.error('Error writing document: ', error);
                });
                this.db.collection('feed').doc(data.id).update({
                    keep_count: data.keep_count + 1
                }).then(()=>{
                    setTimeout(() => {
                        this.data_shw = 'true';
                    }, 4000);
                    this.kep_function = 'false';
                });
            }else{
                if(data.keep_count < 0){
                    data.keep_count =0
                }
                this.db.collection(this.userinfo.success.email).doc('keep')
                    .collection(this.userinfo.success.email + 'keep').doc(data.id).delete();
                this.db.collection('feed').doc(data.id).update({
                    keep_count: data.keep_count - 1
                }).then(()=>{
                    setTimeout(() => {
                        this.data_shw = 'true';
                    }, 4000);
                    this.kep_function = 'false';
                });
                this.keep_remove = 'remove';
            }
        }
    }

    share_post(da, daa){
        this.socialSharing.share(da).then(() => {
            this.db.collection('feed').doc(daa.id).update({
                shar_count: daa.shar_count + 1
            });
        }).catch(() => {
            // Sharing via email is not possible
        });
    }

    heart_fav(data, da){
        if(da.fav_count < 0){
            da.fav_count =0
        }
        this.data_shw = 'false';
        this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).add({
            data,
            post_id: da.post_id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
            .then(() => {
                if (data == 'true'){
                    this.db.collection('feed').doc(da.id).update({
                        fav_count: da.fav_count + 1
                    });
                    setTimeout(() => {
                        this.data_shw = 'true';
                    }, 4000);
                    if(da.from != this.userinfo.success.email){
                        da.username =this.userinfo.success.email
                        this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' liked your Post', da);
                        this.db.collection(da.from).doc('notificationlist')
                            .collection('notification').add({
                            notification: this.userinfo.success.username + ' liked your Post',
                            data: da,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
                        });
                    }
                }else{
                    console.log('working heart');
                }
            })
            .catch((error) => {
                console.error('Error writing document: ', error);
            });
    }

    heart_fav_update(data, da, daa){
        this.data_shw = 'false';
        if(this.fav_function == 'false'){
            this.fav_function = 'true';
            this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).doc(da.id).set({
                data,
                post_id: da.post_id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
                .then(() => {
                    if (data == 'true'){
                        if(daa.fav_count < 0){
                            daa.fav_count =0
                        }
                        this.db.collection('feed').doc(daa.id).update({
                            fav_count: daa.fav_count + 1
                        }).then(()=>{
                            this.fav_function = 'false';
                            setTimeout(() => {
                                this.data_shw = 'true';
                            }, 4000);
                        });
                        if(daa.from != this.userinfo.success.email){
                            daa.username =this.userinfo.success.email
                            this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' liked your Post', daa);
                            this.db.collection(da.from).doc('notificationlist')
                                .collection('notification').add({
                                notification: this.userinfo.success.username + ' liked your Post',
                                data: daa,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
                            });
                        }
                    }else{
                        if(daa.fav_count < 0){
                            daa.fav_count =0
                        }
                        this.db.collection('feed').doc(daa.id).update({
                            fav_count: daa.fav_count - 1
                        }).then(()=>{
                            this.fav_function = 'false';
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error writing document: ', error);
                });
        }else{
            console.log("working");
        }
    }
    add_fav(data, da){
        this.db.collection('feedfav').doc('feedfav').collection(this.userinfo.success.email).add({
            data,
            post_id: da.post_id,
        })
            .then(() => {
                this.authservice.DismissLoading()
                if (data == 'true'){
                    if(da.from != this.userinfo.success.email){
                        da.username = this.userinfo.success.email
                        this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' liked your Post', da);
                        this.db.collection(da.from).doc('notificationlist')
                            .collection('notification').add({
                            notification: this.userinfo.success.username + ' liked your Post',
                            data: da,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
                        });
                    }
                }else{
                    console.log('working heart');
                }
            })
            .catch((error) => {
                this.authservice.DismissLoading()
                console.error('Error writing document: ', error);
            });
    }

    call_notification(da){
        if(da.from != this.userinfo.success.email){
            da.username = this.userinfo.success.email
            this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' liked your Post', da);
            this.db.collection(this.userinfo.success.email).doc('notificationlist')
                .collection('notification').add({
                notification: this.userinfo.success.username + ' liked your Post',
            });
        }
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



    async livevideopage() {
        const modal = await this.modalController.create({
            component: LivevideoPage,
            componentProps: {
                data: 'data',
            },
            cssClass: 'my-custom-class'
        });
        modal.onDidDismiss().then((dataReturned) => {
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

    async open_post(data, id) {
        const modal = await this.modalController.create({
            component: RedirectPage,
            componentProps: {
                data,
                mein_id: id,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }


    async reprt_blck(da){
        if(da.from == this.userinfo.success.email){
            const actionSheet = await this.actionSheetController.create({
                cssClass: 'my-custom-class',
                buttons: [{
                    text: 'Delete Post',
                    icon: 'trash',
                    handler: () => {
                        console.log('Share clicked');
                        this.delete_post(da);
                    }
                }]
            });
            await actionSheet.present();
        }else{
            const actionSheet = await this.actionSheetController.create({
                cssClass: 'my-custom-class',
                buttons: [{
                    text: 'Block',
                    role: 'destructive',
                    icon: 'ban',
                    handler: () => {
                        console.log('Delete clicked');
                        this.call_block(da);
                    }
                },{
                    text: 'Report',
                    icon: 'alert-circle',
                    handler: () => {
                        console.log('Share clicked');
                        this.call_report(da);
                    }
                }]
            });
            await actionSheet.present();
        }
    }
    delete_post(da){
        this.db.collection('feed').doc(da.id).set({
            from: 'Deleted post',
        });
        this.db.collection(this.userinfo.success.email).doc(da.id).delete();
    }
    call_block(da){
        this.db.collection('feed').doc(da.id).delete();
    }

    call_report(da){
        this.db.collection('feed').doc(da.id).delete();
    }

    async openStory(data) {
        const navigationExtras: NavigationExtras = {
            state: {
                user: data
            }
        };
        this.rout.navigate(['/story'], navigationExtras);
    }
    async ShowImage(ShowImage){
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            // header: 'Confirm!',
            message: 'Viewer discretion is advised, would you like to proceed?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.photoViewer.show(ShowImage);
                    }
                },
            ]
        });
        await alert.present();
    }

    get_data() {
        this.authservice.GetUsers().subscribe((data: any) => {
            this.profile = data.image;
           // console.log(this.profile)
        }, err => {

        });
    }
}

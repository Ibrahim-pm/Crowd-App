
import {Component, OnInit, QueryList,ViewChild, ViewChildren ,Renderer2 , ElementRef} from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { ProfileviewerPage } from '../profileviewer/profileviewer.page';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {HashtredingPage} from '../hashtreding/hashtreding.page';
import { switchMap, map } from 'rxjs/operators';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {AddfriendPage} from '../addfriend/addfriend.page';
import {Router} from '@angular/router';

@Component({
  selector: 'app-coment',
  templateUrl: './coment.page.html',
  styleUrls: ['./coment.page.scss'],
})
export class ComentPage implements OnInit {
  data: any;
  field: any = '';
  commentdata: any;
  userinfo: any;
  data_data: any;
  hashdata: any;
  name: any;
  items_search: any;
  isItemAvailable: any;
  date_current: any;
  user_data: any;
  notification_value: any;
  safe_data: any;
  field_:any;
    SpeakerVideo = false;
    Playing = false;
    attherate:any;
    count_number:any;
    commentdata_length:any;
    removeEventListener;
    written_val;
    @ViewChild('player') player: ElementRef;
  constructor(public navParams: NavParams,
              public modalController: ModalController,
              public authservice: AuthService,
              private storage: Storage,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public db: AngularFirestore,
              private afAuth: AngularFireAuth,
              private photoViewer: PhotoViewer,
              public rout: Router,private renderer: Renderer2,
              private el: ElementRef) {
      this.data = this.navParams.get('data');
      this.count_number = this.data.com_count;
      this.hashdata = this.data.hash;
      this.storage.get('userdata').then((val) => {
      this.userinfo = val;
      this.call_users_data();
    });
      this.date_current = new Date();


       this.removeEventListener = this.renderer.listen(this.el.nativeElement, 'click', (event) => {
          if (event.target instanceof HTMLAnchorElement) {
              // Your custom anchor click event handler
              this.someFunction(event);
          }
      });
  }
  someFunction(evt){
        var name = evt.target || evt.srcElement;
        name = name.innerHTML.replace("@","");
        console.log(name)
        if (this.userinfo.success.username == name){
            this.modalController.dismiss();
            this.rout.navigate(['/tabs/tabs/tab6']);
        }else{
            this.authservice.presentLoading();
            this.authservice.GetUsers().subscribe((data: any) => {
                for(var i=0; i< data.image.length; i++){
                    if(data.image[i][1] == name){
                        this.openModal_2(data.image[i]);
                        break;
                    }
                }
                this.authservice.DismissLoading();
            }, err => {
                if (err.error.error) {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(err.error.error);
                } else {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(JSON.stringify(err.error.error));
                }
            });
        }
    }
     async openModal_2(data) {
      if(this.player){
          this.player.nativeElement.pause();
          this.Playing = false;
      }
      const modal = await this.modalController.create({
          component: AddfriendPage,
          componentProps: {
              data: data
          }
      });
      return await modal.present();

    }
  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();
    this.GetPost();
    loading.dismiss();
    this.getpost_data().subscribe((data) => {
        this.data_data = data;
        loading.dismiss();
    });
  }

  GetPost(){
      const createdAt = 'createdAt';
      this.getAllPosts().subscribe((data) => {
          this.commentdata = data.reverse();
          this.commentdata_length = data.length;
          for(var i=0; i<this.commentdata.length; i++){
              if(this.commentdata[i][createdAt]){
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
      });
  }

  onSearchChange(searchValue: string ) {
    const firstchar = searchValue;
    if (firstchar.match(/@[a-z]+/gi)) {
        const value = firstchar.match(/@[a-z]+/gi);
        const val = value[(value.length) - 1];
        var get_length = firstchar.match(/@[a-z]+/gi);
        this.attherate =  firstchar.match(/@[a-z]+/gi)[get_length.length - 1];
        this.getItems(val);
      }
      else if (firstchar === '#') {
      } else {
    }
    if (firstchar.slice(-1) == '@'){
      this.name = 'search people';
      this.items_search = this.user_data.image;
      this.getItems('');
    }else if (firstchar.slice(-1) == ' '){
      this.name = null;
    }
  }
  call_users_data(){
    this.authservice.GetUsers().subscribe((data: any) => {
        this.user_data = data;
        this.safe_data = data.image;
    }, err => {
        if (err.error.error){
            this.authservice.presentAlert( err.error.error);
        }else{
            this.authservice.presentAlert( JSON.stringify(err.error.error));
        }
    });
  }
  getItems(ev) {
      this.items_search = this.user_data.image;
      const val = ev.replace('@', '');
      this.written_val = val;
      if (val && val.trim() !== '') {
          this.isItemAvailable = true;
          this.items_search = this.items_search.filter((item: any) => {
              return (item[1].toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
      } else {
          this.isItemAvailable = false;
      }
  }
  send_notification(da){
    // this.notification_value = da[1];
    // this.name = null;
    // if (this.field.match(/@[a-z]+/gi)){
    //   this.field = this.field.replace((this.field.match(/@[a-z]+/gi))[(this.field.match(/@[a-z]+/gi)).length - 1], '@' + da[1]);
    // }else{
    //   this.field = this.field.replace(this.field.slice(-1), '@' + da[1]);
    // }
    // this.items_search = this.user_data.image;
    // this.items_search = null;

    this.notification_value = da[1];
    this.name = null;
    this.field_ = this.field;
    if(this.field.match(/@[a-z]+/gi)){
      var value_get = this.field.replace(this.field.slice(-1));
    }else{
      this.field = this.field + da[1];
    }

    if(this.field.replace(this.field.slice(-1)) == 'undefined'){
      if(this.attherate){
        this.field = this.field + da[1];

      }else{
        this.field = this.field + da[1];

      }
    }else if((value_get.match(/undefined/gi)[value_get.match(/undefined/gi).length - 1]) == 'undefined'){
      if(this.attherate){
        this.field = this.field.replace(this.written_val,'');
        this.field = this.field + da[1];

      }else{
        this.field = this.field + da[1];
      }
    }


    this.items_search = this.user_data.image;
    this.items_search = null;



  }
  call_notification(){
    this.data.username = this.userinfo.success.email
    this.authservice.setupFCM(this.notification_value, 'Crowd', this.userinfo.success.username + 'Tag you on post', this.data);
  }
  getpost_data(): Observable<any> {
    return this.db.collection<any>('feed').doc(this.data.id).valueChanges();
  }
  getAllPosts(): Observable<any> {
   return this.db.collection<any>('feed/' + this.data.id + '/comment',ref => ref.orderBy('createdAt').limitToLast(1000)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                if (data.profile) {
                    this.db.doc(data.profile).get().subscribe(doc => {
                        data.profile = doc.data();
                    });
                }
                return { id, data , ...data };
            }))
        );
  }

  delete_com(da){
    this.db.collection('feed').doc(this.data.id).update({
          com_count: this.commentdata_length-1
        }).then(()=>{
          this.db.collection('feed/').doc(this.data.id)
          .collection('comment').doc(da).delete();
        });
  }

  goBack() {
      this.modalController.dismiss();
  }
  comment_post(){
    var p = this.field;
      var checkp = p.replace(/@/g, " @");

      if(checkp){
          p= checkp;
      }else{
          p=p;
      }
      console.log(p);
      var array=p.split(' ');

      var array2=[];
      for(var i=0;i<array.length;i++){
          if(array[i].includes('@')){
              array2.push(array[i]);
          }
          else{}
      }

      var array3=[];
      for(var j=0;j<array2.length;j++){
          var temp=array2[j];
          array3.push(temp.replace('@','<a>@')+"</a>");
      }
      var rp=p;
      for(var k=0;k<array3.length;k++){
          rp=rp.replace(' ' +array2[k], array3[k]);
      }
      this.field = rp;
      console.log(this.field);

    this.db.collection('feed').doc(this.data.id).collection('comment').add({
          comment: this.field,
          username: this.db.doc(this.userinfo.success.email+'/profile').ref,
          profile: this.db.doc(this.userinfo.success.email+'/profile').ref,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
          this.db.collection('feed').doc(this.data.id).update({
            com_count: this.data_data.com_count + 1
          });
          this.field = '';

          if(this.data.from != this.userinfo.success.email){
            this.data.username = this.userinfo.success.email
            this.authservice.setupFCM(this.userinfo.success.username, 'Crowd', this.userinfo.success.username + ' commented on your Post', this.data);
            this.db.collection(this.data.from).doc('notificationlist').collection('notification').add({
                    notification: this.userinfo.success.username + ' commented on your Post',
                    data: this.data,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
          }
          this.call_notification();

      })
      .catch((error) => {
          console.error('Error writing document: ', error);
      });

  }
   async get_post_detail(data) {
      if(this.player){
          this.player.nativeElement.pause();
          this.Playing = false;
      }
      const modal = await this.modalController.create({
          component: HashtredingPage,
          componentProps: {
              hash: data,
          },
          cssClass: 'my-custom-class'
      });
      return await modal.present();
    }
    async get_profile(da) {
        if (this.userinfo.success.username == da){
            this.modalController.dismiss();
            this.rout.navigate(['/tabs/tabs/tab6']);
        }else{
            this.authservice.presentLoading();
            this.authservice.GetUsers().subscribe((data: any) => {
                for (let i = 0; i < data.image.length; i++){
                    if (data.image[i][1] == da){
                        this.openModal_2(data.image[i]);
                        break;
                    }
                }
                this.authservice.DismissLoading();
            }, err => {
                if (err.error.error) {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(err.error.error);
                } else {
                    this.authservice.DismissLoading();
                    this.authservice.presentAlert(JSON.stringify(err.error.error));
                }
            });
        }
    }
    async call_delete(da){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      // header: 'Do you want to delete this comment ?',
      message: 'Are you sure you want to delete this item?',
      buttons: [
         {
          text: 'Yes',
          handler: () => {
            this.delete_com(da);
          }
        }
      ]
    });
    await alert.present();
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
    playOrPause(player){
        if (this.Playing){
            this.player.nativeElement.pause();
            this.Playing = false;
        }else{
           this.player.nativeElement.play()
            this.Playing = true;
        }
    }
    Mutebutton(player){
        if (this.SpeakerVideo){
            this.player.nativeElement.muted = false;
            this.SpeakerVideo = false;
        }else{
            this.player.nativeElement.muted = true;
            this.SpeakerVideo = true;
        }
    }

    async ChangeProfile(da){
        if(this.player){
            this.player.nativeElement.pause();
            this.Playing = false;
        }
        const modal = await this.modalController.create({
            component: ProfileviewerPage,
            componentProps: {
                data: da,
            },
            cssClass: 'my-custom-class'
        });
        return await modal.present();
    }
}

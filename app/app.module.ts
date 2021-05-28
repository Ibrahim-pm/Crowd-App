import { NgModule } from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { Camera } from '@ionic-native/camera/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';

import { AngularFireModule } from "@angular/fire"; 
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from "@angular/fire/database"         
import { AngularFireAuthModule } from "@angular/fire/auth"; 

import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';

import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { OrderModule } from 'ngx-order-pipe';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Crop } from '@ionic-native/crop/ngx';

import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import {RedirectPageModule} from './redirect/redirect.module';
import { LongPressModule } from 'ionic-long-press';
import {IonicGestureConfig} from './gestures/ionic-gesture-config';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    OrderModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ImageCropperModule,
    NgxIonicImageViewerModule,
    RedirectPageModule,
    LongPressModule
  ],
  providers: [
    StatusBar, FirebaseDynamicLinks, Keyboard, CameraPreview, Crop, ImageResizer , PhotoViewer , LocalNotifications,
    SplashScreen, GooglePlus, Facebook,Network, Camera, MediaCapture, Media, File, FileTransfer, AndroidPermissions, SocialSharing, Stripe, InAppBrowser , FCM , PhotoLibrary,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'login/:id',
    loadChildren: () => import('./login/login.module').then( m => m.loginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'resetpass',
    loadChildren: () => import('./resetpass/resetpass.module').then( m => m.ResetpassPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then( m => m.Tab1PageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then( m => m.Tab3PageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  },
  {
    path: 'tipnow',
    loadChildren: () => import('./tipnow/tipnow.module').then( m => m.TipnowPageModule)
  },
  {
    path: 'treding',
    loadChildren: () => import('./treding/treding.module').then( m => m.TredingPageModule)
  },
  {
    path: 'searchtreding',
    loadChildren: () => import('./searchtreding/searchtreding.module').then( m => m.SearchtredingPageModule)
  },
  {
    path: 'chatpage',
    loadChildren: () => import('./chatpage/chatpage.module').then( m => m.ChatpagePageModule)
  },
  {
    path: 'share',
    loadChildren: () => import('./share/share.module').then( m => m.SharePageModule)
  },
  {
    path: 'coment',
    loadChildren: () => import('./coment/coment.module').then( m => m.ComentPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'purchase',
    loadChildren: () => import('./purchase/purchase.module').then( m => m.PurchasePageModule)
  },
  {
    path: 'bankform',
    loadChildren: () => import('./bankform/bankform.module').then( m => m.BankformPageModule)
  },
  {
    path: 'keep',
    loadChildren: () => import('./keep/keep.module').then( m => m.KeepPageModule)
  },
  {
    path: 'tipjar',
    loadChildren: () => import('./tipjar/tipjar.module').then( m => m.TipjarPageModule)
  },
  {
    path: 'helpsuport',
    loadChildren: () => import('./helpsuport/helpsuport.module').then( m => m.HelpsuportPageModule)
  },
  {
    path: 'tab6',
    loadChildren: () => import('./tab6/tab6.module').then( m => m.Tab6PageModule)
  },
  {
    path: 'editprofile',
    loadChildren: () => import('./editprofile/editprofile.module').then( m => m.EditprofilePageModule)
  },
  {
    path: 'changepass',
    loadChildren: () => import('./changepass/changepass.module').then( m => m.ChangepassPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'addfriend',
    loadChildren: () => import('./addfriend/addfriend.module').then( m => m.AddfriendPageModule)
  },
  {
    path: 'redirect',
    loadChildren: () => import('./redirect/redirect.module').then( m => m.RedirectPageModule)
  },
  {
    path: 'deeplink',
    loadChildren: () => import('./deeplink/deeplink.module').then( m => m.DeeplinkPageModule)
  },
  {
    path: 'hashtreding',
    loadChildren: () => import('./hashtreding/hashtreding.module').then( m => m.HashtredingPageModule)
  },
  {
    path: 'profileviewer',
    loadChildren: () => import('./profileviewer/profileviewer.module').then( m => m.ProfileviewerPageModule)
  },
  {
    path: 'livevideo',
    loadChildren: () => import('./livevideo/livevideo.module').then( m => m.LivevideoPageModule)
  },
  {
    path: 'story',
    loadChildren: () => import('./story/story.module').then( m => m.StoryPageModule)
  },
  {
    path: 'following',
    loadChildren: () => import('./following/following.module').then( m => m.FollowingPageModule)
  },
  {
    path: 'subcribe',
    loadChildren: () => import('./subcribe/subcribe.module').then( m => m.SubcribePageModule)
  },
  {
    path: 'braintree',
    loadChildren: () => import('./braintree/braintree.module').then( m => m.BraintreePageModule)
  },
   {
    path: 'verifyemail',
    loadChildren: () => import('./verifyemail/verifyemail.module').then( m => m.VerifyemailPageModule)
  },
  {
    path: 'live-view',
    loadChildren: () => import('./live-view/live-view.module').then( m => m.LiveViewPageModule)
  },
  {
    path: 'network',
    loadChildren: () => import('./network/network.module').then( m => m.NetworkPageModule)
  },
  {
    path: 'countrycode',
    loadChildren: () => import('./countrycode/countrycode.module').then( m => m.CountrycodePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

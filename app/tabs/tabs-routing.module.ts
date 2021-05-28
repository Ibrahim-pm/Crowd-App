import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {Tab2Page} from '../tab2/tab2.page';
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            component: Tab2Page,
           // loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)  
          }
        ]
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren:  () => import('../tab4/tab4.module').then(m => m.Tab4PageModule) 
          }
        ]
      },
      {
        path: 'tab5',
        children: [
          {
            path: '',
            loadChildren:  () => import('../tab5/tab5.module').then(m => m.Tab5PageModule)  
          }
        ]
      },
      {
        path: 'tab6',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab6/tab6.module').then(m => m.Tab6PageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabs/tab1',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

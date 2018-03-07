//
// This is routing infomration for the app
//
import { NgModule }             from '@angular/core'
import { RouterModule, Routes, RouterOutlet } from '@angular/router'

import { AuthGuard } from './auth/auth.guard'
import { LoopbackLoginComponent } from './auth/loopback/lb-login.component'

import { HomeComponent } from './general/home/home.component'

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoopbackLoginComponent },
  { path: '**', redirectTo: '/home' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { AlertModule } from 'ngx-bootstrap'
import { GeneralModule } from './general/general.module'
import { AppComponent } from './app.component'

import { PathLocationStrategy, LocationStrategy } from '@angular/common'
import { AuthGuard } from './auth/auth.guard'
import { AuthModule } from './auth/auth.module'
import { AppRoutingModule } from './app-routing.module'

import { ConversationService } from './conversation.service'
import { NLUService } from './nlu.service'
import { AppCommService } from './app-comm.service'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    GeneralModule,
    AlertModule.forRoot(),
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    ConversationService,
    NLUService,
    {provide: LocationStrategy, useClass: PathLocationStrategy} ,
    AuthGuard,
    { provide: 'Window',  useValue: window },
    AppCommService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LoopbackLoginComponent } from './loopback/lb-login.component';
import { LoopbackLoginService } from './loopback/lb-login.service';

@NgModule({
  imports:      [ BrowserModule, HttpModule, ReactiveFormsModule ],
  declarations: [ LoopbackLoginComponent ],
  providers:    [ LoopbackLoginService ],
  exports:      [ LoopbackLoginComponent ]
})
export class AuthModule {
  constructor() { }
}

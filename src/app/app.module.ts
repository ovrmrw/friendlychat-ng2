import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DeprecatedFormsModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ChatHeaderComponent } from '../header/header.component';
import { ChatMainComponent } from '../main/main.component';
import { ChatMessageComponent } from '../message/message.component';
import { ChatSnackbarComponent } from '../snackbar/snackbar.component';

import { AppService } from './app.service';
import { ChatHeaderService } from '../header/header.service';
import { ChatMainService } from '../main/main.service';
import { ChatMessageService } from '../message/message.service';

import { FirebaseController } from '../firebase/firebase.controller';


@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [ChatMessageComponent, ChatSnackbarComponent, ChatMainComponent, ChatHeaderComponent, AppComponent],
  providers: [FirebaseController, ChatMessageService, ChatHeaderService, ChatMainService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
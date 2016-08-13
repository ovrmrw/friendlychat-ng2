import { Injectable } from '@angular/core';
import { FirebaseController } from '../firebase/firebase.controller';


@Injectable()
export class ChatHeaderService {

  constructor(
    private fc: FirebaseController
  ) { }

  signIn() {
    this.fc.signIn();
  }

  signOut() {
    this.fc.signOut();
  }

  get currentUser$() { return this.fc.currentUser$; }
  
}
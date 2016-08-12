import { Injectable } from '@angular/core';
import { FirebaseController } from '../firebase/firebase.controller';


@Injectable()
export class ChatMainService {
  constructor(
    private fc: FirebaseController
  ) { }

  send(message: string) {
    this.fc.saveMessage(message);
  }

  loadMessages() {
    this.fc.loadMessages();
  }

  get messages$() { return this.fc.messages$; }

  // get currentUser$() { return this.fc.currentUser$; }
}
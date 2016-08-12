import { Injectable } from '@angular/core';
import { FirebaseController } from '../firebase/firebase.controller';


@Injectable()
export class ChatMainService {
  constructor(
    private fc: FirebaseController
  ) { }

  send(text: string) {
    this.fc.saveMessage(text);
  }

  saveImage(evnet) {
    this.fc.saveImageMessage(event);
  }

  loadMessages() {
    this.fc.loadMessages();
  }

  get messages$() { return this.fc.messages$; }
  get stableInform$() { return this.fc.stableInform$; }
}
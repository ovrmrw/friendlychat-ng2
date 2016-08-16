import { Injectable } from '@angular/core';

import { FirebaseController } from '../firebase';


@Injectable()
export class ChatMainService {

  constructor(
    private fc: FirebaseController
  ) { }

  send(text: string) {
    this.fc.saveMessage(text);
  }

  saveImage(file: File) {
    this.fc.saveImageMessage(file);
  }

  loadMessages() {
    this.fc.loadMessages();
  }

  get messages$() { return this.fc.messages$; }
  get informStable$() { return this.fc.informStable$; }

}
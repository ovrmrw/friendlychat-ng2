import { Injectable } from '@angular/core';
import { FirebaseController } from '../firebase/firebase.controller';


@Injectable()
export class ChatMessageService {
  constructor(
    private fc: FirebaseController
  ) { }

  resolveImgSrc(imageUrl: string) {
    return this.fc.setImageUrl(imageUrl);
  }

  get messages$() { return this.fc.messages$; }
  get stableInform$() { return this.fc.stableInform$; }
}
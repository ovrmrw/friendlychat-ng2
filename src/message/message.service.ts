import { Injectable } from '@angular/core';

import { FirebaseController } from '../firebase';


@Injectable()
export class ChatMessageService {

  constructor(
    private fc: FirebaseController
  ) { }

  resolveImageSrc(imageUrl: string) {
    return this.fc.setImageUrl(imageUrl);
  }

  get messages$() { return this.fc.messages$; }
  get stableInform$() { return this.fc.informStable$; }

}
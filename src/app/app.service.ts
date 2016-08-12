import { Injectable } from '@angular/core';
import { FirebaseController } from '../firebase/firebase.controller';


@Injectable()
export class AppService {
  constructor(
    private fc: FirebaseController
  ) { }

  get currentUser$() { return this.fc.currentUser$; }
}
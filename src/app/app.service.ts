import { Injectable } from '@angular/core';

import { FirebaseController } from '../firebase';


@Injectable()
export class AppService {

  constructor(
    private fc: FirebaseController
  ) { }

  get currentUser$() { return this.fc.currentUser$; }
  
}
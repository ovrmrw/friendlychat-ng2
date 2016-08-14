import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AppService } from './app.service';


@Component({
  selector: 'my-app',
  templateUrl: 'app.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  isAuthed: boolean = false;

  constructor(
    private service: AppService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.service.currentUser$.forEach(user => {
      if (user) { // Firebaseからサインインの状態を受け取った。
        this.isAuthed = true;
      } else { // Firebaseからサインアウトの状態を受け取った。
        this.isAuthed = false;
      }
      this.cd.markForCheck();
    });
  }

}
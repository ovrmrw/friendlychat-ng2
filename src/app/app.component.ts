import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { AppService } from './app.service';
import { ParentComponent } from './parent.component';


@Component({
  selector: 'my-app',
  templateUrl: 'app.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends ParentComponent implements OnInit, OnDestroy {
  isAuthed: boolean = false;

  constructor(
    private service: AppService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.disposable = this.service.currentUser$.subscribe(user => {
      if (user) { // Firebaseからサインインの状態を受け取った。
        this.isAuthed = true;
      } else { // Firebaseからサインアウトの状態を受け取った。
        this.isAuthed = false;
      }
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.disposeSubscriptions(); // Subscriptionをまとめて破棄する。適切なメモリ管理はrxjsの基本。
  }

}
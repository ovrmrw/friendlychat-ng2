import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { AppService } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  isSignedIn: boolean = false;
  private _disSubs: Subscription[] = [];
  set disSub(sub: Subscription) { this._disSubs.push(sub); }
  get disSubs() { return this._disSubs; }

  constructor(
    private service: AppService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.disSub = this.service.currentUser$.subscribe(user => {
      if (user) {
        this.isSignedIn = true;
      } else {
        this.isSignedIn = false;
      }
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.disSubs.length) {
      this.disSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
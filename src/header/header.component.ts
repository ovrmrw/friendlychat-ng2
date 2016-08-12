import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { ChatHeaderService } from './header.service';

@Component({
  selector: 'chat-header',
  templateUrl: 'header.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHeaderComponent implements OnChanges {
  @Input() isSignedIn: boolean;
  title = 'Friendly Chat';
  profilePicUrl: string | null;
  userName: string | null;

  constructor(
    private service: ChatHeaderService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges(change) {
    console.log('header - ngOnChanges');
    console.log(JSON.stringify(change));
    if (this.isSignedIn) {
      this.service.currentUser$.forEach(user => {
        if (user) {
          this.profilePicUrl = user.photoURL;
          this.userName = user.displayName;
          this.cd.markForCheck();
        }
      });
    } else {
      this.profilePicUrl = null;
      this.userName = null;
      this.cd.markForCheck();
    }
  }

  signIn() {
    this.service.signIn();
  }

  signOut() {
    this.service.signOut();
  }

}
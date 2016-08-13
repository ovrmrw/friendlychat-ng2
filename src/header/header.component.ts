import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, Input } from '@angular/core';

import { ChatHeaderService } from './header.service';


@Component({
  selector: 'chat-header',
  templateUrl: 'header.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatHeaderComponent implements OnChanges {
  @Input() isAuthed: boolean;
  profilePicUrl: string | null;
  userName: string | null;

  constructor(
    private service: ChatHeaderService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges(change) {
    console.log('header - ngOnChanges');
    console.log(JSON.stringify(change));
    if (this.isAuthed) { // Sign-In
      this.service.currentUser$.take(1).toPromise().then(user => {
        if (user) {
          this.profilePicUrl = user.photoURL;
          this.userName = user.displayName;
          this.cd.markForCheck();
        }
      });
    } else { // Sign-Out
      this.profilePicUrl = null;
      this.userName = null;
      this.cd.markForCheck();
    }
  }

  onClickSignIn() {
    this.service.signIn();
  }

  onClickSignOut() {
    this.service.signOut();
  }

}
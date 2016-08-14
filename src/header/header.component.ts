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
    if (this.isAuthed) { // サインインした。
      this.service.currentUser$.take(1).toPromise().then(user => {
        if (user) { // ユーザー情報をFirebaseから取得した。
          this.profilePicUrl = user.photoURL;
          this.userName = user.displayName;
          this.cd.markForCheck();
        }
      });
    } else { // サインアウトした。
      this.profilePicUrl = null;
      this.userName = null;
      this.cd.markForCheck();
    }
  }

  onClickSignIn() { // サインインボタンをクリックした。
    this.service.signIn();
  }

  onClickSignOut() { // サインアウトボタンをクリックした。
    this.service.signOut();
  }

}
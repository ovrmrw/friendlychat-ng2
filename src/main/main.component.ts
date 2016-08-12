import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { ChatMainService } from './main.service';

@Component({
  selector: 'chat-main',
  templateUrl: 'main.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMainComponent implements OnChanges {
  @Input() isSignedIn: boolean;
  message: string;
  messages: any[] = [];

  constructor(
    private service: ChatMainService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges(change) {
    console.log('main - ngOnChanges');
    console.log(JSON.stringify(change));
    if (this.isSignedIn) {
      this.service.loadMessages();
      this.service.messages$.subscribe(message => {
        this.messages.push(message);
        this.cd.markForCheck();
      });      
    } else {
      this.messages = [];
      this.cd.markForCheck();
    }
  }



  onSubmit() {
    if (this.isSignedIn) {
      this.service.send(this.message);
    }
  }

  // get messages() { return this.service.messages$; }

}
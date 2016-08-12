import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

// import { ChatMainService } from './main.service';

@Component({
  selector: 'chat-message',
  templateUrl: 'message.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent implements OnChanges {
  @Input() name: string;
  @Input() text: string;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    this.cd.markForCheck();
  }
}
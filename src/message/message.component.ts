import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ChatMessageService } from './message.service';


@Component({
  selector: 'chat-message',
  templateUrl: 'message.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      state('*', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000)
      ])
    ])
  ]
})
export class ChatMessageComponent implements OnChanges {
  @Input() name: string;
  @Input() text: string;
  @Input() photoUrl: string;
  @Input() imageUrl: string;
  imageSrc: Observable<string>;

  @Output() loadImageEvent = new EventEmitter();

  constructor(
    private service: ChatMessageService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    if (this.imageUrl) {
      this.imageSrc = this.service.resolveImageSrc(this.imageUrl); // 時間差でimageファイルのURLを差し替える。
    }
  }

  onLoadImage() {
    this.loadImageEvent.next(true); // imageファイルがloadされたことを親コンポーネントに通知する。
  }

}
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges, Input, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { ChatMainService } from './main.service';

@Component({
  selector: 'chat-main',
  templateUrl: 'main.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMainComponent implements OnInit, OnChanges {
  @Input() isSignedIn: boolean;
  text: string;

  constructor(
    private service: ChatMainService,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.service.stableInform$.forEach(() => this.resetForm());
  }

  ngOnChanges(change) {
    console.log('main - ngOnChanges');
    console.log(JSON.stringify(change));
    if (this.isSignedIn) {
      this.service.loadMessages();
    }
  }


  onSubmit() {
    if (this.isSignedIn) {
      this.service.send(this.text);
    }
  }

  fileSelect(event) {
    console.log(event);
    this.service.saveImage(event);
  }

  imageResolved() {
    const listElement = (<HTMLElement>this.el.nativeElement).querySelector('#messages') as HTMLElement;
    listElement.scrollTop = listElement.scrollHeight; // スクロール位置を更新する。
    this.cd.markForCheck();
  }

  resetForm() {
    setTimeout(() => {
      this.text = ''; // Messageを空にする。
      const imageFormElement = (<HTMLElement>this.el.nativeElement).querySelector('#image-form') as HTMLFormElement;
      imageFormElement.reset();
      const listElement = (<HTMLElement>this.el.nativeElement).querySelector('#messages') as HTMLElement;
      listElement.scrollTop = listElement.scrollHeight; // スクロール位置を更新する。
      const inputElement = (<HTMLElement>this.el.nativeElement).querySelector('#message') as HTMLInputElement;
      inputElement.focus(); // フォーカスを移動する。
      this.cd.markForCheck();
    }, 0);
  }

  get messages() { return this.service.messages$; }

}
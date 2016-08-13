import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges, Input, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { ChatMainService } from './main.service';


@Component({
  selector: 'chat-main',
  templateUrl: 'main.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMainComponent implements OnInit, OnChanges {
  @Input() isAuthed: boolean;
  text: string;
  snackbarText$ = new Subject<string>();

  constructor(
    private service: ChatMainService,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.service.informStable$.forEach(() => {
      this.resetForm();
      this.resetScrollPosition();
    });
  }

  ngOnChanges(change) {
    console.log('main - ngOnChanges');
    console.log(JSON.stringify(change));
    if (this.isAuthed) {
      this.service.loadMessages();
    }
  }


  onSubmitMessage() {
    if (this.isAuthed) { // サインインしている。
      this.service.send(this.text);
    } else { // サインインしていない。
      this.snackbarText$.next('You must sign-in first');
    }
  }

  onSelectImageFile(event) {
    if (event.target && event.target.files && event.target.files.length) {
      const file = event.target.files[0] as File;
      console.log(file);
      this.service.saveImage(file);
    }
  }

  onLoadImage() {
    this.resetScrollPosition();
  }

  resetForm() {
    setTimeout(() => {
      this.text = ''; // Messageを空にする。
      const imageFormElement = (<HTMLElement>this.el.nativeElement).querySelector('#image-form') as HTMLFormElement;
      imageFormElement.reset();
      const inputElement = (<HTMLElement>this.el.nativeElement).querySelector('#message') as HTMLInputElement;
      inputElement.focus(); // フォーカスを移動する。
      this.cd.markForCheck();
    }, 0);
  }

  resetScrollPosition() {
    const listElement = (<HTMLElement>this.el.nativeElement).querySelector('#messages') as HTMLElement;
    listElement.scrollTop = listElement.scrollHeight; // スクロール位置を更新する。
    this.cd.markForCheck();
  }

  get messages() { return this.service.messages$; }

}
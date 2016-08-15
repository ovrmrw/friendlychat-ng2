import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges, Input, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { ChatMainService } from './main.service';
import { ParentComponent } from '../app/parent.component';


@Component({
  selector: 'chat-main',
  templateUrl: 'main.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMainComponent extends ParentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isAuthed: boolean;
  text: string;
  snackbarText$ = new Subject<string>();

  constructor(
    private service: ChatMainService,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.disposable = this.service.informStable$.subscribe(() => { // コンポーネント外(主にFirebaseController)で.next()された。
      this.resetForm();
      this.resetScrollPosition();
    });
  }

  ngOnDestroy() {
    this.disposeSubscriptions();
  }

  ngOnChanges(change) {
    if (this.isAuthed) { // サインインしている。
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

  onSelectImageFile(event) { // ファイルを選択した。
    if (event.target && event.target.files && event.target.files.length) {
      const file = event.target.files[0] as File;
      console.log(file);
      if (file.type.match('image.*')) { // imageファイルを選択した。
        this.service.saveImage(file);
      } else { // imageファイルを選択していない。
        this.snackbarText$.next('You can only share images');
      }
    }
  }

  onLoadImage() { // imageファイルが表示された。
    this.resetScrollPosition();
  }

  resetForm() {
    setTimeout(() => {
      this.text = ''; // Messageを空にする。
      const imageFormElement = (<HTMLElement>this.el.nativeElement).querySelector('#image-form') as HTMLFormElement;
      imageFormElement.reset(); // ファイル選択をリセットする。
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
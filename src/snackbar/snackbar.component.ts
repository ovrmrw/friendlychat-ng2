import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Rx';


@Component({
  selector: 'chat-snackbar',
  templateUrl: 'snackbar.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatSnackbarComponent implements OnInit {
  informSubject$ = new Subject<SnackbarState>();

  constructor(
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.informSubject$.forEach(state => {
      if (state && state.message) {
        const data = {
          message: state.message,
          timeout: 2000
        };
        const element = (<HTMLElement>this.el.nativeElement).querySelector('#must-signin-snackbar') as any;
        element.MaterialSnackbar.showSnackbar(data);
        this.cd.markForCheck();
      }
    });
  }

}


export interface SnackbarState {
  message?: string;
}
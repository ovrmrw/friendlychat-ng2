import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'chat-snackbar',
  templateUrl: 'snackbar.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatSnackbarComponent implements OnInit {
  @Input() snackbarText: Observable<string>;

  constructor(
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.snackbarText.forEach(text => {
      if (text) {
        const data = {
          message: text,
          timeout: 2000
        };
        const element = (<HTMLElement>this.el.nativeElement).querySelector('#must-signin-snackbar') as any;
        element.MaterialSnackbar.showSnackbar(data);
        this.cd.markForCheck();
      }
    });
  }

}
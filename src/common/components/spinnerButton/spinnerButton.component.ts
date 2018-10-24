import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare var require: any;

@Component({
  selector: 'spinner-button',
  templateUrl: './spinnerButton.component.html',
  styleUrls: ['./spinnerButton.component.scss']
})
export class SpinnerButtonComponent implements OnInit {
  @Input() buttonTheme: string;
  @Input() spinnerTheme: string;
  @Input() isSpinning: boolean;
  @Input() isDisabled: boolean;

  resSpinnerWhite: any = require('./assets/spinner-white.gif');
  resSpinnerBlack: any = require('./assets/spinner-black.gif');
  spinnerResource: string;

  ngOnInit() {
    if (this.spinnerTheme == 'spinner-white') {
      this.spinnerResource = this.resSpinnerWhite;
    } else {
      this.spinnerResource = this.resSpinnerBlack;
    }
  }
}

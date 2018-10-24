import {Component} from '@angular/core';

declare var require: any;

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  assetSpondLogoUrl: any = require('./images/spinner.gif')
}

import {Component, Input} from '@angular/core';
declare var require: any;

@Component({
  selector: 'spond-header',
  templateUrl: './spondHeader.component.html',
  styleUrls: ['./spondHeader.component.scss']
})
export class SpondHeaderComponent{
	@Input()
	forCashback: boolean = false

	assetSpondLogoUrl: any = require('./images/spond_logo.svg')

    constructor() {
    }

}

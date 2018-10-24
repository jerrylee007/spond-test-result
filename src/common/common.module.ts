import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule}   from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {SpondHeaderComponent} from './components/spondHeader';
import {SpinnerComponent} from './components/spinner';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule
  ],
  declarations: [
    SpondHeaderComponent,
    SpinnerComponent
  ],
  providers: [
  ],
  exports: [
    SpondHeaderComponent,
    SpinnerComponent,
  ]
})
export class SpondCommonModule { }

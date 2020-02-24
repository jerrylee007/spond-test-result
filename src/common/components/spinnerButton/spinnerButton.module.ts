import {NgModule} from '@angular/core';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CommonModule} from '@angular/common';

import {SpinnerButtonComponent} from './spinnerButton.component';

@NgModule({
  declarations: [
    SpinnerButtonComponent
  ],
  imports: [
    ModalModule,
    CommonModule
  ],
  providers: [
  ],
  exports: [
    SpinnerButtonComponent
  ]
})
export class SpinnerButtonModule {

}

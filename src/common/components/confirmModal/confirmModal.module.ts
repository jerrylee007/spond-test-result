import {NgModule} from '@angular/core';
import {ModalModule} from 'ng2-bootstrap/modal';
import {CommonModule} from '@angular/common';

import {SpinnerButtonModule} from '../spinnerButton';
import {ConfirmModalComponent} from './confirmModal.component';

@NgModule({
  declarations: [
    ConfirmModalComponent
  ],
  imports: [
    ModalModule,
    CommonModule,
    SpinnerButtonModule
  ],
  providers: [
  ],
  exports: [
    ConfirmModalComponent
  ]
})
export class ConfirmModalModule {

}

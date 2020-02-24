import {NgModule} from '@angular/core';
import {ModalModule} from 'ngx-bootstrap/modal';

import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';

import {ImageSlideModalComponent} from './imageSlideModal.component';
import {SpinnerButtonModule} from '../../common/components/spinnerButton';

@NgModule({
  declarations: [
    ImageSlideModalComponent
  ],
  imports: [
    ModalModule,
    FormsModule,
    CommonModule,
    SpinnerButtonModule
  ],
  providers: [
  ],
  exports: [
    ImageSlideModalComponent
  ]
})
export class ImageSlideModalModule {

}

import {NgModule} from '@angular/core';
import {ModalModule} from 'ng2-bootstrap/modal';

import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';

import {ImageSlideModalComponent} from './imageSlideModal.component';

@NgModule({
  declarations: [
    ImageSlideModalComponent
  ],
  imports: [
    ModalModule,
    FormsModule,
    CommonModule
  ],
  providers: [
  ],
  exports: [
    ImageSlideModalComponent
  ]
})
export class ImageSlideModalModule {

}

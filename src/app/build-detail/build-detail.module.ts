import {NgModule} from '@angular/core';
import {ModalModule} from 'ng2-bootstrap/modal';
import {CommonModule} from '@angular/common';

import { ImageSlideModalModule } from '../imageSlideModal';
import { BuildDetailComponent } from './build-detail.component';
import {SpinnerButtonModule} from '../../common/components/spinnerButton';

@NgModule({
  declarations: [
    BuildDetailComponent
  ],
  imports: [
    ModalModule,
    CommonModule,
    ImageSlideModalModule,
    SpinnerButtonModule
  ],
  providers: [
  ],
  exports: [
    BuildDetailComponent
  ]
})
export class BuildDetailModule {

}

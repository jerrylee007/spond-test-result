import {NgModule} from '@angular/core';
import {ModalModule} from 'ngx-bootstrap/modal';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageSlideModalModule } from '../imageSlideModal';
import { BuildDetailComponent } from './build-detail.component';
import {SpinnerButtonModule} from '../../common/components/spinnerButton';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
  declarations: [
    BuildDetailComponent
  ],
  imports: [
    ModalModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageSlideModalModule,
    SpinnerButtonModule,
    InfiniteScrollModule,
    NgbModule
  ],
  providers: [
  ],
  exports: [
    BuildDetailComponent
  ]
})
export class BuildDetailModule {

}

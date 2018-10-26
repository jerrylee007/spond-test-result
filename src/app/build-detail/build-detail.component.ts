import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ResultsService } from '../results.service';

import {ImageSlideModalComponent} from '../imageSlideModal/imageSlideModal.component';
declare var require: any;

@Component({
  selector: 'build-detail',
  templateUrl: './build-detail.component.html',
  styleUrls: [ './build-detail.component.scss' ]
})
export class BuildDetailComponent implements OnInit {
  @Input()
  build: any

  @ViewChild('imageSlideModal')
  imageSlideModal: ImageSlideModalComponent

  buildId: string;
  client: string;

  passedIcon: any = require('./assets/icon_passed.png');
  failedIcon: any = require('./assets/icon_failed.png');

  constructor(
    private route: ActivatedRoute,
    private service: ResultsService,
  ) {

    var pathElements = window.location.pathname.split("/");
    this.buildId = pathElements.pop();
    this.client = pathElements.pop();

    this.service.getResultById(this.client, this.buildId).subscribe(results=>{
      this.build = results;
    });
  }

  ngOnInit() {

  }

  isCaseFixed(caseName : string) {
    return this.build.replaced && this.build.replaced.includes(caseName);
  }

  onBuildUpdated(results) {
    this.build = results;
  }

  showFailedCase(caseName : string) {
    this.imageSlideModal.show(this.build, caseName);
  }
}

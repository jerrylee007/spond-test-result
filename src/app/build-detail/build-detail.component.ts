import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ResultsService } from '../results.service';

import {ImageSlideModalComponent} from '../imageSlideModal/imageSlideModal.component';


@Component({
  selector: 'build-detail',
  templateUrl: './build-detail.component.html',
  styleUrls: [ './build-detail.component.css' ]
})
export class BuildDetailComponent implements OnInit {
  @Input()
  build: any

  @ViewChild('imageSlideModal')
  imageSlideModal: ImageSlideModalComponent

  buildId: string;

  constructor(
    private route: ActivatedRoute,
    private service: ResultsService,
  ) {

    this.buildId = window.location.pathname.split("/").pop();

    this.service.getResultById(this.buildId).subscribe(results=>{
      this.build = results;
    });
  }

  ngOnInit() {

  }

  showFailedCase(caseName : string) {
    this.imageSlideModal.show(this.build, caseName);
  }
}

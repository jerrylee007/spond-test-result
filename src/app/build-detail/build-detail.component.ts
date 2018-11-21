import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ResultsService } from '../results.service';

import {SpinnerButtonComponent} from '../../common/components/spinnerButton';

import {ImageSlideModalComponent} from '../imageSlideModal/imageSlideModal.component';
declare var require: any;


export enum BUILD_DETAIL_FILTER_TYPE {
  FAILED = <any>"Failed screenshots",
  BASE = <any>"Base screenshots",
  FIXED = <any>"Fixed screenshots",
  IGNORED = <any>"Ignored screenshots"
}

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
  @ViewChildren('btnReplace')
  passBtns: QueryList<SpinnerButtonComponent>

  buildId: string;
  client: string;

  public BUILD_DETAIL_FILTER_TYPE = BUILD_DETAIL_FILTER_TYPE;

  casesToShow: string[] = [];
  baseScreenshots: any = [];
  currentFilter: any = BUILD_DETAIL_FILTER_TYPE.FAILED;

  noResultCase: string[] = [];

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
      this.onFilterSelected(this.currentFilter);
    });

    this.service.getBaseScreenshots(this.client).subscribe(results=>{
      this.baseScreenshots = results;
    });
  }

  ngOnInit() {

  }

  onFilterSelected(filter) {
    this.currentFilter = filter;

    if (filter == BUILD_DETAIL_FILTER_TYPE.FAILED) {
       this.casesToShow = this.build.failedData;
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.FIXED) {
       this.casesToShow = this.build.replaced;
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.IGNORED) {
       this.casesToShow = this.build.ignoredData;
    }
    else {
       this.casesToShow = this.baseScreenshots;
    }
  }

  getResultScreenshotPath(screenshot) {
    return this.service.getResultScreenshotPath(this.client, screenshot, this.build);
  }

  getNewScreenshotPath(screenshot) {
    return this.service.getNewScreenshotPath(this.client, screenshot, this.build);
  }

  getBaseScreenshotPath(screenshot) {
    return this.service.getBaseScreenshotPath(this.client, screenshot, this.build);
  }

  isCaseFixed(caseName : string) {
    return this.build.replaced && this.build.replaced.includes(caseName);
  }

  isResultValid(caseName : string) {
     return !this.noResultCase.includes(caseName);
  }

  loadImageFailed(caseName : string) {
    this.noResultCase.push(caseName);
  }

  onBuildUpdated(results) {
    this.build = results;
  }

  showFailedCase(caseName : string) {
    this.imageSlideModal.show(this.client, this.build, caseName);
  }

  onUndoReplacementClicked(screenshot, index) {
    let btnUndoReplace = this.passBtns.find((btn, i)=>i == index);
    btnUndoReplace.isSpinning = true;
    this.service.undoReplacement(this.build.client, this.build.buildNumber, screenshot).subscribe(results=>{
      btnUndoReplace.isSpinning = false;
      this.build = results;
    }, error=>{
      btnUndoReplace.isSpinning = false;
    });
  }

  onReplaceClicked(screenshot, index) {
    let btnReplace = this.passBtns.find((btn, i)=>i == index);
    btnReplace.isSpinning = true;
    this.service.replaceScreenshot(this.build.client, this.build.buildNumber, screenshot).subscribe(results=>{
      btnReplace.isSpinning = false;
      this.build = results;
    }, error=>{
      btnReplace.isSpinning = false;
    });
  }
}

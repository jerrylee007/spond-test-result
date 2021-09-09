import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ResultsService } from '../results.service';

import {SpinnerButtonComponent} from '../../common/components/spinnerButton';

import {ImageSlideModalComponent} from '../imageSlideModal/imageSlideModal.component';
declare var require: any;


export enum BUILD_DETAIL_FILTER_TYPE {
  FAILED = <any>"Failed",
  FAILED_AFTER_FIXED = <any>"Failed after fixed",
  BASE = <any>"Base",
  FIXED = <any>"Fixed",
  NEW = <any>"New",
  IGNORED = <any>"Ignored",
  CRASHED = <any>"Crashed",
  SIMILAR_FAILED = <any>"Similar failed",
  BASE_DUPLICATED = <any>"Base duplicated",
}

@Component({
  selector: 'build-detail',
  templateUrl: './build-detail.component.html',
  styleUrls: [ './build-detail.component.scss' ]
})
export class BuildDetailComponent implements OnInit {
  @Input()
  build: any

  @ViewChild('imageSlideModal', { static: true })
  imageSlideModal: ImageSlideModalComponent
  @ViewChildren('btnReplace')
  passBtns: QueryList<SpinnerButtonComponent>
  @ViewChildren('btnBatchReplace')
  batchReplaceBtns: QueryList<SpinnerButtonComponent>
  @ViewChildren('btnBatchReplaceOnlyXml')
  batchReplaceOnlyXmlBtns: QueryList<SpinnerButtonComponent>
  @ViewChildren('btnReplaceSimilar')
  replaceSimilarBtns: QueryList<SpinnerButtonComponent>
  @ViewChild('searchKeyControl')
  searchKeyControl: any;

  @ViewChild('passSimilarFailedButton')
  passSimilarFailedButton: SpinnerButtonComponent;

  buildId: string;
  client: string;
  diff: string;

  searchKey: string = ""
  oldSearchKey: string = ""

  public BUILD_DETAIL_FILTER_TYPE = BUILD_DETAIL_FILTER_TYPE;

  casesToShow: string[] = [];
  caseCategories: any[] = [];

  baseScreenshots: any = [];
  baseDuplicated: string[] = [];
  crashedScreenshots: any = [];
  currentFilter: any = BUILD_DETAIL_FILTER_TYPE.FAILED;

  noResultCase: string[] = [];
  noBaseCase: string[] = [];

  keyMap: any = {};
  xmlResult: any = {};

  categoryToShow: any = 4;

  passedIcon: any = require('./assets/icon_passed.png');
  failedIcon: any = require('./assets/icon_failed.png');


  constructor(
    private route: ActivatedRoute,
    private service: ResultsService,
  ) {
    var self = this

    var pathElements = window.location.pathname.split("/");
    this.buildId = pathElements.pop();
    this.client = pathElements.pop();

    route.queryParams.subscribe(params => {
      this.diff = params['diff'] || ""
    })

    this.service.getResultById(this.client, this.buildId).subscribe(results=>{
      this.service.getBaseScreenshots(this.client).subscribe(bases=>{
        this.baseScreenshots = bases;
        self.onInitBuilds(results)
        self.onFilterSelected(self.currentFilter)
      })
    })

    if (this.client.includes('android')) {
      this.service.getAndroidStringsKeyMap(this.client, this.buildId).subscribe(keyMap=>{
        this.keyMap = keyMap;
      })
    }
  }

  getXml() {
    this.service.getXml(this.client, this.buildId).subscribe(xml=>{
      this.xmlResult = xml.results.testcase.map(function(caseObj, index) {
        return {
          id: caseObj.external_id,
          result: caseObj.result.$t == 'p'
        }
      })
    })
  }

  ngOnInit() {
    setInterval(() => {
        if (this.oldSearchKey !== this.searchKey) {
          this.onFilterSelected(this.currentFilter)
          this.oldSearchKey = this.searchKey
        }
    }, 1000);
  }

  onInitBuilds(results) {
    this.getXml();

    this.build = results;
    if (this.build.failedData && this.build.failedData.constructor !== Array) {
      this.build.failedScreenshots = Object.keys(this.build.failedData)
      this.noBaseCase = this.build.failedScreenshots.filter( ( el ) => !this.baseScreenshots.includes( el ) )
      if (this.build.crashData) {
        this.crashedScreenshots = this.build.failedScreenshots.filter( ( el ) => 
          this.build.crashData.filter(caseId=> el.includes(caseId)).length > 0)
      }
      else {
        this.crashedScreenshots = [];
      }

    }
    else {
      this.build.failedScreenshots = this.build.failedData;
    }


    //find duplicated baseScreenshots, using (first case name) + (screenshot index) to make every screenshot unique
    var screenshotsIndexs = {}
    for (let base of this.baseScreenshots) {
      var caseId = base.split("_")[0];
      var parts = base.split(".");
      parts.pop();
      var index = parts.pop().split("_")[0]
      var screenshotId = `${caseId}_${index}`;

      if (screenshotsIndexs[screenshotId]) {
        if (!this.baseDuplicated.includes(screenshotsIndexs[screenshotId])) {
          this.baseDuplicated.push(screenshotsIndexs[screenshotId]);
        }
        
        this.baseDuplicated.push(base);
      }
      else {
        screenshotsIndexs[screenshotId] = base;
      }
    }

    if (this.diff.length > 0) {
     this.build.similarData = this.build.failedScreenshots.filter(image=> (Math.abs(this.build.failedData[image].diff - +this.diff) <= 30) && this.build.failedData[image].diff > 0)
     this.onFilterSelected(BUILD_DETAIL_FILTER_TYPE.SIMILAR_FAILED)
    }
  }

  onFilterSelected(filter) {
    this.currentFilter = filter;

    if (filter == BUILD_DETAIL_FILTER_TYPE.FAILED) {
       this.casesToShow = this.build.failedScreenshots;
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.CRASHED) {
       this.casesToShow = this.crashedScreenshots;
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.FAILED_AFTER_FIXED) {
       this.casesToShow = this.build.failedScreenshots.filter( ( el ) => !!!this.build.replaced || !this.build.replaced.includes( el ) )
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.FIXED) {
       this.casesToShow = this.build.replaced;
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.IGNORED) {
       this.casesToShow = this.build.ignoredData;
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.NEW) {
       this.casesToShow = this.noBaseCase;
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.SIMILAR_FAILED) {
       this.casesToShow = this.build.similarData || [];
    }
    else if (filter == BUILD_DETAIL_FILTER_TYPE.BASE_DUPLICATED) {
       this.casesToShow = this.baseDuplicated || [];
    }
    else {
       this.casesToShow = this.baseScreenshots;
    }

    var categoryDict = {};
    this.caseCategories = [];

    for (let caseName of this.casesToShow) {
        if (caseName.includes('2392')) {
            //debugger
        }
      if (this.searchKey.length == 0 || caseName.includes(this.searchKey) || (this.keyMap[this.searchKey] && this.keyMap[this.searchKey].includes(caseName))) {

        var caseIds = caseName.split("_");
        var category = '';
        for (let caseId of caseIds) {
          if (caseId.startsWith('SPND')) {
            if (category.length > 0) {
              category += '_';
            }
            category += caseId;
          }
          else {
            break;
          }
        }

        if (!categoryDict[category]) {
          categoryDict[category] = [];
        }

        categoryDict[category].push(caseName);
      }
    }

    for (let category in categoryDict) {
      this.caseCategories.push({
        name:category,
        cases:categoryDict[category]
      });
    }

    this.categoryToShow = 4;
  }

  xmlPassed(category) {
    var caseIds = [];

    for (let caseName of category.cases) {
       var names = (caseName.split(".")[1]).split("_");
        for (let name of names) {
          if (name.startsWith('SPND')) {
            caseIds.push(name.replace('SPND', 'SPND-'));
          }
        }
    }

    var result = true;

    for (let caseId of caseIds) {
       var caseResult = this.xmlResult.find(x=>x.id == caseId);
       if (!caseResult.result) {
         result = false;
         break;
       }
    }

    return result;
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

  isResultFailed(caseName : string) {
     return this.noResultCase.includes(caseName);
  }

    testAccountName(caseName) {
        return this.build.failedData[caseName]?.mainAccount;
    }


  isBaseFailed(caseName : string) {
     return this.noBaseCase.includes(caseName);
  }

  isResultValid(caseName : string) {
    return !this.isResultFailed(caseName) && !this.isBaseFailed(caseName);
  }

  loadImageFailed(caseName : string) {
    if (!this.baseScreenshots.includes(caseName)) {
      this.noBaseCase.push(caseName);
    }
    else {
      this.noResultCase.push(caseName);
    }
  }

  onScrolled() {
    this.categoryToShow += 2;
  }

  onBuildUpdated(results) {
    this.build = results;
  }

  onViewSimilarFailed(screenshot) {
     window.open(window.location.origin + window.location.pathname + "?diff=" + this.build.failedData[screenshot].diff, '_blank')
  }

  showFailedCase(caseName : string) {
    this.imageSlideModal.show(this.client, this.build, caseName);
  }

  onRemoveSimilarClicked(screenshot, index) {
    this.build.similarData = this.build.similarData.filter(image=> image !== screenshot)
    this.onFilterSelected(BUILD_DETAIL_FILTER_TYPE.SIMILAR_FAILED)
  }

  onUndoReplacementClicked(screenshot, index) {
    let btnUndoReplace = this.passBtns.find((btn, i)=>i == index);
    btnUndoReplace.isSpinning = true;
    this.service.undoReplacement(this.client, this.build.buildNumber, screenshot, false).subscribe(results=>{
      btnUndoReplace.isSpinning = false;
     this.onInitBuilds(results)
    }, error=>{
      btnUndoReplace.isSpinning = false;
    });
  }

  onBatchReplaceClicked(category, index) {
    let btnBatchReplace = this.batchReplaceBtns.find((btn, i)=>i == index);
    btnBatchReplace.isSpinning = true;
    this.service.batchReplaceScreenshots(this.client, this.build.buildNumber, category.cases, false).subscribe(results=>{
      btnBatchReplace.isSpinning = false;
      this.onInitBuilds(results)
    }, error=>{
      btnBatchReplace.isSpinning = false;
    });
  }

  onBatchReplaceOnlyXmlClicked(category, index) {
    let btnBatchReplace = this.batchReplaceOnlyXmlBtns.find((btn, i)=>i == index);
    btnBatchReplace.isSpinning = true;
    this.service.batchReplaceScreenshots(this.client, this.build.buildNumber, category.cases, true).subscribe(results=>{
      btnBatchReplace.isSpinning = false;
      this.onInitBuilds(results)
    }, error=>{
      btnBatchReplace.isSpinning = false;
    });
  }

  onUndoBatchReplaceOnlyXmlClicked(category, index) {
    let btnBatchReplace = this.batchReplaceOnlyXmlBtns.find((btn, i)=>i == index);
    btnBatchReplace.isSpinning = true;
    this.service.undoReplacement(this.client, this.build.buildNumber, category.cases[0], true).subscribe(results=>{
      btnBatchReplace.isSpinning = false;
      this.onInitBuilds(results)
    }, error=>{
      btnBatchReplace.isSpinning = false;
    });
  }


  onBatchPassSimilarFailedClicked() {
    this.passSimilarFailedButton.isSpinning = true;
    this.service.batchPassSimilarScreenshots(this.client, this.build.buildNumber, this.build.similarData.slice(0, 500)).subscribe(results=>{
      this.passSimilarFailedButton.isSpinning = false;
      this.onInitBuilds(results)
      this.onFilterSelected(this.currentFilter);
    }, error=>{
      this.passSimilarFailedButton.isSpinning = false;
    });
  }

  onReplaceClicked(screenshot, index) {
    let btnReplace = this.passBtns.find((btn, i)=>i == index);
    btnReplace.isSpinning = true;
    this.service.replaceScreenshot(this.client, this.build.buildNumber, screenshot).subscribe(results=>{
      btnReplace.isSpinning = false;
      this.onInitBuilds(results)
    }, error=>{
      btnReplace.isSpinning = false;
    });
  }
}

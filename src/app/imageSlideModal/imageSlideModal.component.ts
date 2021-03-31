import {Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Observable} from 'rxjs';

import {CLIENT_API} from '../results.service';
import { ResultsService } from '../results.service';

import {SpinnerButtonComponent} from '../../common/components/spinnerButton';

@Component({
  selector: 'image-slide-modal',
  templateUrl: './imageSlideModal.component.html',
  styleUrls: ['./imageSlideModal.component.scss'],
})
export class ImageSlideModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal: ModalDirective;
  @ViewChild('btnReplace')
  btnReplace: SpinnerButtonComponent
  @ViewChild('btnUndoReplace')
  btnUndoReplace: SpinnerButtonComponent
  @ViewChild('btnRemove')
  btnRemove: SpinnerButtonComponent

  showingImage: any
  imageCandidates: any[]
  currentIndex: number
  build: any
  client: string
  similarCount: any

  baseImageInvalid: Boolean;
  resultImageInvalid: Boolean;
  newImageInvalid: Boolean;

  @Output() onBuildUpdated: EventEmitter<any> = new EventEmitter();
  @Output() onViewSimilarFailed: EventEmitter<any> = new EventEmitter();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.code == 'ArrowLeft' || event.code == 'ArrowUp') {
      this.onPreviousClicked();
    }
    else if (event.code == 'ArrowRight' || event.code == 'ArrowDown') {
      this.onNextClicked();
    }
    
  }

  constructor(private service: ResultsService) {
  }

  ngOnInit() {
  }

  show(client: string, build: any, imageToShow: any) {
    this.baseImageInvalid = false
    this.resultImageInvalid = false
    this.newImageInvalid = false

    this.client = client;
    this.build = build;
    this.showingImage = imageToShow;
    if (build.failedData && build.failedData.constructor !== Array) {
      this.imageCandidates = build.failedData ? Object.keys(build.failedData) : [];
      this.similarCount = (this.imageCandidates.filter(image=> build.failedData[imageToShow] && build.failedData[image] && (Math.abs(build.failedData[image].diff - build.failedData[imageToShow].diff) <= 30)
                                                                && build.failedData[image].diff > 0)).length
    }
    else {
      this.imageCandidates = build.failedData ? build.failedData : [];
    }

    this.currentIndex = this.imageCandidates.findIndex(image => image.fileName == imageToShow.fileName);

    this.modal.show()
  }

  loadBaseImageFailed() {
    this.baseImageInvalid = true
  }

  loadResultImageFailed() {
    this.resultImageInvalid = true
  }

  loadNewImageFailed() {
    this.newImageInvalid = true
  }

  openBaseImage() {
    window.open(this.getBaseScreenshotPath());
  }

  openResultImage() {
    window.open(this.getResultScreenshotPath());
  }

  openNewImage() {
    window.open(this.getNewScreenshotPath());
  }

  viewSimilar(screenshot) {
    this.onViewSimilarFailed.emit(screenshot)
    this.modal.hide()
  }

  hasScreenshotBeenReplaced() {
    return this.service.hasScreenshotBeenReplaced(this.showingImage, this.build);
  }

  getResultScreenshotPath() {
    return this.service.getResultScreenshotPath(this.client, this.showingImage, this.build);
  }

  getNewScreenshotPath() {
    return this.service.getNewScreenshotPath(this.client, this.showingImage, this.build);
  }

  getBaseScreenshotPath() {
    return this.service.getBaseScreenshotPath(this.client, this.showingImage, this.build);
  }

  onPreviousClicked(){
    if (this.currentIndex > 1) {
      this.currentIndex--;
      this.showingImage = this.imageCandidates[this.currentIndex];
    }
  }

  onNextClicked() {
    if (this.currentIndex < this.imageCandidates.length - 2) {
      this.currentIndex++;
      this.showingImage = this.imageCandidates[this.currentIndex];
    }
  }

  onUndoReplacementClicked(screenshot) {
    this.btnUndoReplace.isSpinning = true;
    this.service.undoReplacement(this.build.client, this.build.buildNumber, screenshot, false).subscribe(results=>{
      this.btnUndoReplace.isSpinning = false;
      this.hide();
      this.onBuildUpdated.emit(results);
    }, error=>{
      this.btnUndoReplace.isSpinning = false;
    });
  }

  onReplaceClicked(screenshot) {
    this.btnReplace.isSpinning = true;
    this.service.replaceScreenshot(this.build.client, this.build.buildNumber, screenshot).subscribe(results=>{
      this.btnReplace.isSpinning = false;
      this.onNextClicked();
      this.onBuildUpdated.emit(results);
    }, error=>{
      this.btnReplace.isSpinning = false;
    });
  }

   onRemoveBaseeClicked(screenshot) {
    this.btnRemove.isSpinning = true;
    this.service.removeBaseScreenshot(this.build.client, this.build.buildNumber, screenshot).subscribe(results=>{
      this.btnRemove.isSpinning = false;
      this.onBuildUpdated.emit(results);
      this.hide();
    }, error=>{
      this.btnRemove.isSpinning = false;
    });
  }

  hide() {
    this.modal.hide()
  }

  onCancelClicked() {
    this.hide()
  }

  onConfirmClicked() {

  }
}

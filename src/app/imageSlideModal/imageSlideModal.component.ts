import {Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {ModalDirective} from 'ng2-bootstrap/modal';
import {Observable} from 'rxjs/Observable';

import {CLIENT_API} from '../results.service';
import { ResultsService } from '../results.service';

import {SpinnerButtonComponent} from '../../common/components/spinnerButton';

@Component({
  selector: 'image-slide-modal',
  templateUrl: './imageSlideModal.component.html',
  styleUrls: ['./imageSlideModal.component.scss'],
})
export class ImageSlideModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalDirective;
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

  baseImageInvalid: Boolean;
  resultImageInvalid: Boolean;
  newImageInvalid: Boolean;

  @Output() onBuildUpdated: EventEmitter<any> = new EventEmitter();

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
    this.baseImageInvalid = false
    this.resultImageInvalid = false
    this.newImageInvalid = false
  }

  show(client: string, build: any, imageToShow: any) {
    this.client = client;
    this.build = build;
    this.showingImage = imageToShow;
    this.imageCandidates = build.failedData ? build.failedData : [];

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

  hasScreenshotBeenReplaced(screenshot) {
    return this.service.hasScreenshotBeenReplaced(screenshot, this.build);
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
    this.service.undoReplacement(this.build.client, this.build.buildNumber, screenshot).subscribe(results=>{
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

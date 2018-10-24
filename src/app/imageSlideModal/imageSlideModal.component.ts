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

  showingImage: any
  imageCandidates: any[]
  currentIndex: number
  build: any

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
  }

  show(build: any, imageToShow: any) {
    this.build = build;
    this.showingImage = imageToShow;
    this.imageCandidates = build.failedData;

    this.currentIndex = this.imageCandidates.findIndex(image => image.fileName == imageToShow.fileName);

    this.modal.show()
  }

  hasScreenshotBeenReplaced(screenshot) {
    return this.build.replaced.includes(screenshot);
  }

  getResultScreenshotPath(screenshot) {
    return CLIENT_API  + `android/results/${this.build.buildNumber}/Screenshots/result/${screenshot}`;
  }

  getNewScreenshotPath(screenshot) {
    return CLIENT_API  + `android/results/${this.build.buildNumber}/Screenshots/new/${screenshot}`;
  }

  getBaseScreenshotPath(screenshot) {
    return CLIENT_API + `android/base/${screenshot}`;
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
    this.service.undoReplacement(this.build.buildNumber, screenshot).subscribe(results=>{
      this.btnUndoReplace.isSpinning = false;
      this.hide();
      this.onBuildUpdated.emit(results);
    }, error=>{
      this.btnUndoReplace.isSpinning = false;
    });
  }

  onReplaceClicked(screenshot) {
    this.btnReplace.isSpinning = true;
    this.service.replaceScreenshot(this.build.buildNumber, screenshot).subscribe(results=>{
      this.btnReplace.isSpinning = false;
      this.onNextClicked();
      this.onBuildUpdated.emit(results);
    }, error=>{
      this.btnReplace.isSpinning = false;
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

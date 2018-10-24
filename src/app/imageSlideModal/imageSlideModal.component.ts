import {Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {ModalDirective} from 'ng2-bootstrap/modal';
import {Observable} from 'rxjs/Observable';

import {CLIENT_API} from '../results.service';
import { ResultsService } from '../results.service';


@Component({
  selector: 'image-slide-modal',
  templateUrl: './imageSlideModal.component.html',
  styleUrls: ['./imageSlideModal.component.scss'],
})
export class ImageSlideModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalDirective;

  showingImage: any
  imageCandidates: any[]
  currentIndex: number
  build: any

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

  getResultScreenshotPath(screenshot) {
    return CLIENT_API  + `results/${this.build.buildNumber}/Screenshots/result/${screenshot}`;
  }

  getNewScreenshotPath(screenshot) {
    return CLIENT_API  + `results/${this.build.buildNumber}/Screenshots/new/${screenshot}`;
  }

  getBaseScreenshotPath(screenshot) {
    return CLIENT_API + `base/${screenshot}`;
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

  onReplaceClicked(screenshot) {
    this.service.replaceScreenshot(this.build.buildNumber, screenshot).subscribe(results=>{
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

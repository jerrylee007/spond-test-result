import {Component, OnInit, ViewChild, Input,
  Output, EventEmitter} from '@angular/core';
import {ModalDirective} from 'ng2-bootstrap/modal';
import {Observable} from 'rxjs/Observable';

import {DeferredClickEvent} from './deferredClickEvent';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirmModal.component.html',
  styleUrls: ['./confirmModal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  isDestructive: boolean;
  isSubmitting: boolean;
  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  @Output() onConfirm: EventEmitter<DeferredClickEvent> = new EventEmitter();
  @ViewChild('modal') modal: ModalDirective;

  constructor() {
  }

  ngOnInit() {
  }

  show(title: string, description: string, cancelLabel?: string, confirmLabel?: string, destructive?: boolean) {
    this.title = title;
    this.description = description;
    this.cancelLabel = cancelLabel;
    this.confirmLabel = confirmLabel;
    this.isDestructive = destructive;
    this.isSubmitting = false;

    this.modal.show()
  }

  hide() {
    this.modal.hide()
  }

  onCancelClicked() {
    this.hide()
    this.onCancel.emit()
  }

  onConfirmClicked() {
    this.isSubmitting = true;
    this.onConfirm.emit({
      success: () => {
        this.hide()
      },
      error: (shouldHide: boolean) => {
        this.isSubmitting = false
        if (shouldHide) {
          this.hide()
        }
      }
    })
  }
}

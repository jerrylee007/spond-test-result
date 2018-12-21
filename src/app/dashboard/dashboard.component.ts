import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultsService } from '../results.service';

import {Router} from '@angular/router';

import {ConfirmModalComponent, DeferredClickEvent} from '../../common/components/confirmModal';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  @ViewChild('confirmRemoveModal')
  confirmRemoveModal: ConfirmModalComponent;

  allBuilds: any = {}

  removingBuild: any


  constructor(private service: ResultsService,
            private router: Router) {
    this.service.getAllResults('android').subscribe(results=>{
      this.allBuilds.android = results;
    });
    this.service.getAllResults('ios').subscribe(results=>{
      this.allBuilds.ios = results;
    });
    this.service.getAllResults('web').subscribe(results=>{
      this.allBuilds.web = results;
    });
  }

  ngOnInit() {
  }

  onRemoveBuild(build: any) {
    this.confirmRemoveModal.show(
        'Confirm Remove',
        'Are you sure you want to remove this build, you will lose it forever?',
        'Cancel',
        'Remove',
        true
        )
    this.removingBuild = build;
  }

  onConfirmRemoveClicked(event: DeferredClickEvent) {
    this.service.removeBuild(this.removingBuild.client, this.removingBuild.buildNumber).subscribe(results=>{
      this.allBuilds[this.removingBuild.client] = results;
      event.success();
    }, err=>{
       event.success();
    });

  }

  goToBuildFailedDetails(client, build) {
    this.router.navigate([`build/${client}/${build.buildNumber}`]);
  }
}

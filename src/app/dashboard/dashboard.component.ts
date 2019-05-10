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

  allBuilds: any = [{}, {}, {}, {}, {}, {}]

  removingBuild: any


  constructor(private service: ResultsService,
            private router: Router) {
    this.service.getAllResults('android_dev').subscribe(results=>{
      var buildInfo = {client: 'android_dev', 
                      server: 'dev',
                      results: results}


      this.allBuilds[0] = buildInfo;
    });

    this.service.getAllResults('android_staging').subscribe(results=>{
      var buildInfo = {client: 'android_staging', 
                      server: 'staging',
                      results: results}


      this.allBuilds[1] = buildInfo;
    });

    this.service.getAllResults('ios_dev').subscribe(results=>{
      var buildInfo = {client: 'ios_dev', 
                      server: 'dev',
                      results: results}


      this.allBuilds[2] = buildInfo;
    });

    this.service.getAllResults('ios_staging').subscribe(results=>{
      var buildInfo = {client: 'ios_staging', 
                      server: 'staging',
                      results: results}


      this.allBuilds[3] = buildInfo;
    });

    this.service.getAllResults('web_dev').subscribe(results=>{
      var buildInfo = {client: 'web_dev', 
                      server: 'dev',
                      results: results}


      this.allBuilds[4] = buildInfo;
    });

    this.service.getAllResults('web_staging').subscribe(results=>{
      var buildInfo = {client: 'web_staging', 
                      server: 'staging',
                      results: results}


      this.allBuilds[5] = buildInfo;
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

  getTestLinkResultPath(client, build) {
    return this.service.getTestLinkResultPath(client, build);
  }

  goToBuildFailedDetails(client, build) {
    this.router.navigate([`build/${client}/${build.buildNumber}`]);
  }
}

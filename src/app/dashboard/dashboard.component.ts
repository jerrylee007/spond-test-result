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
  @ViewChild('confirmRemoveBaseModal')
  confirmRemoveBaseModal: ConfirmModalComponent;

  @ViewChild('removeBaseResultModal')
  removeBaseResultModal: ConfirmModalComponent;

  @ViewChild('searchKeyControl')
  searchKeyControl: any;


  searchKey: string = ""

  allBuilds: any = [{}, {}, {}, {}, {}, {}]

  removingBuild: any
  isRemovingBase: boolean


  constructor(private service: ResultsService,
            private router: Router) {
    this.service.getAllResults('android_dev').subscribe(results=>{
      var buildInfo = {client: 'android_dev', 
                      server: 'dev',
                      results: results}


      this.allBuilds[this.clientToIndex('android_dev')] = buildInfo;
    });

    this.service.getAllResults('android_staging').subscribe(results=>{
      var buildInfo = {client: 'android_staging', 
                      server: 'staging',
                      results: results}


      this.allBuilds[this.clientToIndex('android_staging')] = buildInfo;
    });

    this.service.getAllResults('ios_dev').subscribe(results=>{
      var buildInfo = {client: 'ios_dev', 
                      server: 'dev',
                      results: results}


      this.allBuilds[this.clientToIndex('ios_dev')] = buildInfo;
    });

    this.service.getAllResults('ios_staging').subscribe(results=>{
      var buildInfo = {client: 'ios_staging', 
                      server: 'staging',
                      results: results}


      this.allBuilds[this.clientToIndex('ios_staging')] = buildInfo;
    });

    // this.service.getAllResults('web_dev').subscribe(results=>{
    //   var buildInfo = {client: 'web_dev', 
    //                   server: 'dev',
    //                   results: results}


    //   this.allBuilds[this.clientToIndex('web_dev')] = buildInfo;
    // });

    // this.service.getAllResults('web_staging').subscribe(results=>{
    //   var buildInfo = {client: 'web_staging', 
    //                   server: 'staging',
    //                   results: results}


    //   this.allBuilds[this.clientToIndex('web_staging')] = buildInfo;
    // });
  }

  ngOnInit() {
  }

  clientToIndex(client: string) {
    if (client === "android_dev") {
      return 0;
    }
    else if (client === "android_staging") {
      return 1;
    }
    else if (client === "ios_dev") {
      return 2;
    }
    else if (client === "ios_staging") {
      return 3;
    }
    else if (client === "web_dev") {
      return 4;
    }
    else if (client === "web_staging") {
      return 5;
    }
  }

  onRemoveBaseSucceed(result: any) {
    this.removeBaseResultModal.show(
        'Remove succeed',
        result.join("\r\n"),
        'Cancel',
        undefined,
        true
        )
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

   onRemoveBase() {
    this.confirmRemoveBaseModal.show(
        'Confirm Remove Base',
        'Are you sure you want to remove this base images, you will lose them forever?',
        'Cancel',
        'Remove',
        true
        )
  }

   onConfirmRemoveBaseClicked(event: DeferredClickEvent) {
    this.service.batchRemoveBaseScreenshots(this.searchKey).subscribe(results=>{
      event.success();

      this.onRemoveBaseSucceed(results);

    }, err=>{
       event.success();
    });

  }

  onConfirmRemoveClicked(event: DeferredClickEvent) {
    this.service.removeBuild(this.removingBuild.client, this.removingBuild.buildNumber).subscribe(results=>{
      this.allBuilds[this.clientToIndex(this.removingBuild.client)].results = results;
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

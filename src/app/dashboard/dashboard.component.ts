import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../results.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  androidBuilds: any
  iosBuilds: any
  webBuilds: any

  constructor(private service: ResultsService,
            private router: Router) {
    this.service.getAllResults('android').subscribe(results=>{
      this.androidBuilds = results;
    });
    this.service.getAllResults('ios').subscribe(results=>{
      this.iosBuilds = results;
    });
    this.service.getAllResults('web').subscribe(results=>{
      this.webBuilds = results;
    });
  }

  ngOnInit() {
  }

  goToBuildFailedDetails(build) {
    this.router.navigate(['build/' + build.buildNumber]);
  }
}

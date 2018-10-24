import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../results.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  builds: any
  buildsDetails: any

  constructor(private service: ResultsService,
            private router: Router) {
    this.service.getAllResults().subscribe(results=>{
      this.builds = results;
    });
  }

  ngOnInit() {
  }

  goToBuildFailedDetails(build) {
    this.router.navigate(['build/' + build.buildNumber]);
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { routes } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { BuildDetailModule }  from './build-detail';
import { SpondCommonModule }  from '../common/common.module';

import {SpinnerButtonModule} from '../common/components/spinnerButton';
import {ConfirmModalModule} from '../common/components/confirmModal';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BuildDetailModule,
    SpondCommonModule,
    SpinnerButtonModule,
    ConfirmModalModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: false }),
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
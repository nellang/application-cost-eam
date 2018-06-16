import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule} from './app.routing';
import { AppComponent } from './app.component';
import { SafePipe } from './utility/safe.pipe';
import { BusinessFunctionComponent } from './business-function/business-function.component';
import { Application } from './application/application.component';
import { HomeComponent } from './home/home.component';
import { BfuncListComponent } from './business-function/bfunc-list/bfunc-list.component';
import { ApplicationListComponent } from './application/application-list/application-list.component';
import { SearchNamePipe } from './search-name.pipe';
import { OrderByPipe } from './order-by.pipe';
import { MyDatePickerModule} from 'mydatepicker';
import { LoginComponent } from './login/login.component';
import {AuthenticationService} from "./authentication.service";
import {NavbarService} from "./navbar.service";
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {Chart} from 'chart.js';
import {ApplicationCostComponent} from './application/application-cost/application-cost.component';



@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    BusinessFunctionComponent,
    Application,
    HomeComponent,
    BfuncListComponent,
    SearchNamePipe,
    OrderByPipe,
    LoginComponent,
    ApplicationListComponent,
    ApplicationCostComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MyDatePickerModule,
    ChartsModule

  ],
  providers: [AuthenticationService, NavbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }

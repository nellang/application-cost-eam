import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BusinessFunctionComponent} from './business-function/business-function.component';
import {BfuncListComponent} from './business-function/bfunc-list/bfunc-list.component';
import {ApplicationListComponent} from './application/application-list/application-list.component';
import {Application} from './application/application.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {ApplicationCostComponent} from './application/application-cost/application-cost.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'function',
    component: BusinessFunctionComponent,
  },
  {
    path: 'function/:name',
    component: BfuncListComponent,
  },
  {
    path: 'application',
    component: Application,
  },
  {
    path: 'application/:name',
    component: ApplicationListComponent,
  },
  {
    path: 'application/cost/:name',
    component: ApplicationCostComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}

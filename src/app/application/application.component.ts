import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {DataService} from '../data.service';
import {Http} from '@angular/http';
import {SearchNamePipe} from '../search-name.pipe';
import {rootRoute} from '@angular/router/src/router_module';
import {LoginComponent} from '../login/login.component';
import {IMyOptions} from 'mydatepicker';
import {NavbarService} from '../navbar.service';
import {resolve} from 'q';


declare var firebase: any;
const d: Date = new Date();


@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataService, SearchNamePipe, LoginComponent]
})
export class Application implements OnInit {

  name: String;
  description: String;
  currentDate: String;
  type: String;
  list = [];
  isDescending: boolean = false;
  column: string = 'Name';
  direction: number;
  loginName: String;
  dateFrom: string;
  dateTo: string;
  geography: string;
  version: string;
  radio_asis: boolean;
  radio_tobe: boolean;
  radio_hasbeen: boolean;
  statusForm: Boolean = false;

  private myDatePickerOptions: IMyOptions = {

    dateFormat: 'dd.mm.yyyy',

  };


  constructor(
    private dataService: DataService,
    private router: Router,
    private navbarService: NavbarService,
    private route: ActivatedRoute,
    private searchName: SearchNamePipe,
    private loginComponent: LoginComponent) {

    this.currentDate = Date().toString();

  }

  ngOnInit() {
    this.fbGetData();
    this.navbarService.show();
  }


  fbGetData() {

    firebase.database().ref().child('/Application/').orderByChild('CFlag').equalTo('active').on('child_added', (snapshot) => {
      this.list.push(snapshot.val());
    });
  }

  fbPostData(name, description, dateFrom, dateTo, geography, version) {
    console.log(name, description, dateFrom, dateTo, geography);
    firebase.database().ref().child('/Application/').child(name).set({
      AName: name,
      BDescr: description,
      CFlag: 'active',
      DCreationDate: this.currentDate,
      GDateFrom: dateFrom,
      HDateTo: dateTo,
      IGeography: geography,
      JVersion: version
    });
    this.name = '';
    this.description = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.geography = '';
    this.version = '';
    this.statusForm = false;
  }

  fbDeleteData(key) {
    firebase.database().ref().child('/Application/').child(key).update({
      CFlag: 'archived'
    });
    this.performDelete('erste').then((res) => {
      return ('refresh confirmed');
    }).then((res) => {
      window.location.href = window.location.href;
    });
  }

  performDelete = function (test: string): Promise<{ test: string }> {
    return new Promise((resolve) => {
      console.log(`Status: ${test}`);
      setTimeout(() => {
        resolve({test: test});
      }, 200);
    });
  };


  sort(property) {
    this.isDescending = !this.isDescending; //change the direction
    this.column = property;
    this.direction = this.isDescending ? 1 : -1;
  };

  displayForm(val) {
    if (val == true) {
      this.statusForm = false;
      console.log('status ' + this.statusForm);
    } else {
      this.statusForm = true;
      console.log(this.statusForm);
    }
  }

  onRadioClick(val) {
    if (val == 0) {
      console.log(val);
      this.radio_asis = true;
      this.radio_tobe = false;
      this.radio_hasbeen = false;
    } else if (val == 1) {
      console.log(val);
      this.radio_asis = false;
      this.radio_tobe = true;
      this.radio_hasbeen = false;
    } else if (val == 2) {
      console.log(val);
      this.radio_asis = false;
      this.radio_tobe = false;
      this.radio_hasbeen = true;
    }
  }


}

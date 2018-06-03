import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../data.service';
import {Http, HttpModule} from '@angular/http';
import {rootRoute} from '@angular/router/src/router_module';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {IMyOptions} from 'mydatepicker';
import {Application} from '../../entities/application';
import 'rxjs/add/operator/map';


declare var firebase: any;

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataService]
})

export class ApplicationListComponent implements OnInit {
  private sub2: any;
  private ID: string;

  application: Application = new Application();

  currentDate: String;
  isDesc: boolean = false;
  column: string = 'Name';
  direction: number;
  loginName: String;
  radio_asis: boolean;
  radio_tobe: boolean;
  radio_hasbeen: boolean;
  statusForm: Boolean = false;

  private editData = [];

  private myDatePickerOptions: IMyOptions = {

    dateFormat: 'dd.mm.yyyy',

  };

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, public http: Http) {

    this.currentDate = Date().toString();

  }

  ngOnInit() {
    this.fbGetData();

  }

  fbGetData() {
    this.sub2 = this.route.params.subscribe(params => {
      this.application.name = params['name'];
    });
    firebase.database().ref().child('/Application/' + this.application.name).on('child_added', (snapshot) => {
      this.editData.push(snapshot.val());
    });
    console.log(this.editData);
    this.application.name = this.editData[0];
    this.application.description = this.editData[1];
    this.application.creationDate = this.editData[3];
    this.application.dateFrom = this.editData[4];
    this.application.dateTo = this.editData[5];
    this.application.geography = this.editData[6];
    this.application.version = this.editData[7];
    this.application.lastModified = this.editData[8];
    if (this.application.dateTo < Date()) {
      this.application.type = 'has-been';
    }
    else if (this.application.dateFrom > Date()) {
      this.application.type = 'to-be';
    }
    else {
      this.application.type = 'as-is';
    }
    ;
  }

  fbEditData(name, descr, dateFrom, dateTo, geography, version) {
    firebase.database().ref().child('/Application/').child(this.application.name).set({
      AName: this.application.name,
      BDescr: this.application.description,
      CFlag: 'active',
      DCreationDate: this.application.creationDate,
      GDateFrom: this.application.dateFrom,
      HDateTo: this.application.dateTo,
      IGeography: this.application.geography,
      JVersion: this.application.version,
      KEditDate: this.currentDate
    });
  }

  ngOnDestroy() {
    this.sub2.unsubscribe();
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

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {DataService} from '../data.service';
import {Http} from '@angular/http';
import {rootRoute} from '@angular/router/src/router_module';
import {SearchNamePipe} from '../search-name.pipe';
import {LoginComponent} from '../login/login.component';
import {NavbarService} from '../navbar.service';

declare var firebase: any;
const d: Date = new Date();


@Component({
  selector: 'app-business-function',
  templateUrl: './business-function.component.html',
  styleUrls: ['./business-function.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataService, SearchNamePipe, LoginComponent]
})

export class BusinessFunctionComponent implements OnInit {

  id;
  name: String;
  description: String;
  type: String;
  currentDate: String;
  list = [];
  isDescending: boolean = false;
  column: String = 'Name';
  direction: number;
  loginName: String;
  statusForm: Boolean = false;


  private idlist = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private searchName: SearchNamePipe,
    private navbarService: NavbarService
  ) {

    this.currentDate = Date().toString();
  }


  ngOnInit() {
    firebase.database().ref().child('/AllID/').on('child_added', (snapshot) => {
      this.idlist.push(snapshot.val());
      this.id = this.idlist[0];
      this.id++;
      this.fbGetData();
    });
  }


  fbGetData() {

    firebase.database().ref().child('/BFunctions/').orderByChild('CFlag').equalTo('active').on('child_added', (snapshot) => {
      this.list.push(snapshot.val());
    });

  }


  fbPostData(name, descr, typ) {
    firebase.database().ref().child('/BFunctions/').child(this.id).set({
      ZID: this.id,
      AName: name,
      BDescr: this.description,
      CFlag: 'active',
      DCreationDate: this.currentDate,
      FTyp: this.type
    });
    this.name = '';
    this.description = '';


    firebase.database().ref().child('/AllID/').set({
      BfuncID: this.id++
    });


  }


  fbDeleteData(key) {
    firebase.database().ref().child('/BFunctions/').child(key).update({
      CFlag: 'archived'
    });
    window.location.reload();
  }

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

}




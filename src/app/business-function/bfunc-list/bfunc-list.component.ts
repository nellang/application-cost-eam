import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../data.service';
import { Http, HttpModule } from '@angular/http';
import { rootRoute } from '@angular/router/src/router_module';
import { Router, ActivatedRoute, Params} from '@angular/router'
import 'rxjs/add/operator/map';
import {Capability} from '../../entities/capability';


declare var firebase: any;
@Component({
  selector: 'app-bfunc-list',
  templateUrl: './bfunc-list.component.html',
  styleUrls: ['./bfunc-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataService]
})

export class BfuncListComponent implements OnInit {
  
  capability: Capability = new Capability();
  currentDate: String;
  private sub: any;
  private editData = [];

  ID: string;
  allProcesses=[];
  allApplications=[];
  
  constructor(private dataService: DataService,
    private router: Router, private route: ActivatedRoute, public http: Http) {

      this.currentDate=Date().toString();
      
  }
  
  

  ngOnInit() {
    this.fbGetData();
  }
    

  fbGetData(){
    this.sub = this.route.params.subscribe(params=> {
      this.ID = params['name']
     })
     firebase.database().ref().child('/BFunctions/'+this.ID+'/').on('child_added', (snapshot) => {
     this.editData.push(snapshot.val())
    }
      
    )
    console.log(this.editData[0]);
    this.capability.id = this.ID;
    this.capability.name = this.editData[0];
    this.capability.description = this.editData[1];
    this.capability.creationDate = this.editData[3];
    this.capability.type = this.editData[4];
  }

  fbEditData(name,descr,typ,bprocess,applications){
    firebase.database().ref().child('/BFunctions/').child(this.ID).set({
      ZID: this.ID, 
      AName: this.capability.name ,
      BDescr: this.capability.description, 
      CFlag: 'active', 
      DCreationDate: this.capability.creationDate, 
      FTyp: this.capability.type, 
      KEditDate: this.currentDate, 
    });
  }

    ngOnDestroy(){
      this.sub.unsubscribe();
    }
}

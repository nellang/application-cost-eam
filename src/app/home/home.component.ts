import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../data.service';
import { Http } from '@angular/http';
import { rootRoute } from '@angular/router/src/router_module';
import { SearchNamePipe } from '../search-name.pipe';
import { LoginComponent } from '../login/login.component';
import { NavbarService } from '../navbar.service';

declare var firebase: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataService, SearchNamePipe, LoginComponent],
})
export class HomeComponent implements OnInit {
  
  USA = false;
  ITALY = false;
  GERMANY = false;
  POLAND = false;
  UK = false;
  SPAIN = false;
  BRAZIL = false;
  FRANCE = false;
  MEXIKO = false;
  CHINA=false;
  AUSTRALIA=false;


  activeGeos2 = [];
  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private searchName: SearchNamePipe,
    private navbarService: NavbarService) { }


  ngOnInit() {
    this.fbGetGeo();
  }

  fbGetGeo() {
    const rootRef = firebase.database().ref();
    const maintable = rootRef.child('Application/').orderByChild('CFlag').equalTo('active');
    maintable.on('child_added', snap => {
      if (snap.val()) { }

      let geographys = rootRef.child('/Application/' + snap.key + '/IGeography');

      geographys.once('value').then(activeGeos => {
        if (activeGeos.val()) {
          this.activeGeos2.push(activeGeos.val())
        }


        if (this.activeGeos2[this.activeGeos2.length-1] == "DE" ){
          this.GERMANY = true;
         }
        if(this.activeGeos2[this.activeGeos2.length-1] == "US"){
           this.USA = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "IT"){
           this.ITALY = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "UK"){
           this.UK = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "PL"){
           this.POLAND = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "BR"){
           this.BRAZIL = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "ES"){
           this.SPAIN = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "FR"){
           this.FRANCE = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "CN"){
           this.CHINA = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "AU"){
           this.AUSTRALIA = true;
         }
         if(this.activeGeos2[this.activeGeos2.length-1] == "MX"){
           this.MEXIKO = true;
         }

      })
      
    })

    

  }

}

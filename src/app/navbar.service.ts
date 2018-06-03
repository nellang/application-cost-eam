import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Location } from '@angular/common';

@Injectable()
export class NavbarService {

  visible = false;

  constructor(private location: Location) { }

  // Sind jetzt nutzlos
  show(){
    this.visible = true;
  }

  hide(){
    this.visible = false;
  }

  isVisible(){
    return new Observable(observer => {
      // Navbar nur auf /login deaktiviert
      if(this.location.path() !== '/login'){
        observer.next(false);
      }else {
        observer.next(true);
      }
    });
  }

}

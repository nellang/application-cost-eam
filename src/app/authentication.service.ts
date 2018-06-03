import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

declare var firebase: any;

@Injectable()
export class AuthenticationService {

  private loggedIn: false;
  constructor() { }

  login(username: string, password: string) {
    return new Observable( observer => {
      firebase.database().ref().child('/Users/' + username).once('value', (snapshot) => {
        if (snapshot.val() == null) {
          observer.error('No user');
          observer.complete();
        }else{
          if (snapshot.val().Password === password) {
            observer.next(true);
            observer.complete();
          }else{
            observer.next(false);
            observer.complete();
          }
        }
      });
    });
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class DataService {

  data = [];

  constructor(private http: Http) { }
 
  private getError(error: Response): Observable<any>{
    console.log(error);
    return Observable.throw(error.json() || 'Server Issue');
  }

  fetchData(): Observable<any>{
    return this.http.get('https://eam-project.firebaseio.com/.json')
      .map((result: Response) => result.json())
      .catch(this.getError);
  }
}
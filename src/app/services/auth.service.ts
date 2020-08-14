import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';

import { User } from '../models/user';
import { AppService } from './app.service';
import { Constants } from './constant.service';
@Injectable()

export class AuthService {
  public BASE_URL = this._service.apiServerUrl;
  //'https://dev-service.eiac.gov.ae/webservice';
  appErrorStack: Subject<String>;

  constructor(private http: HttpClient, private _service: AppService, private _constant:  Constants) {
      this.appErrorStack = new Subject<String>();
  }

  logIn(email: string, password: string): Observable<any> {
    ////console.log("@@@ API End point: ", this._constant.API_ENDPOINT);
    const url = `${this.BASE_URL}` + this._constant.API_ENDPOINT.authToken;
    let post: any ={};
    post['username'] = email;
    post['password'] = password;
    return this.http.post<User>(url, post);
  }

  getTrainer(){
     const url ="http://localhost:3000/trainer";
     ////console.log(">>>> trainer API: ", url);
     return this.http.get(url)
  }

  signUp(email: string, password: string): Observable<User> {
    const url = `${this.BASE_URL}/register`;
    return this.http.post<User>(url, {email, password});
  }
}

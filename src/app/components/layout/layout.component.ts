import { Component, OnInit } from '@angular/core';
import { AppState, selectAuthState } from '../../store/app.states';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router'
import { LogOut, LogInSuccess, LogInState } from '../../store/actions/auth.actions';
import { filter} from 'rxjs/operators';

import { AppService } from '../../services/app.service'; 
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
//import { type } from 'os';

@Component({
  selector: 'portal-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  getState: Observable<any>; 
  isAuthenticated: boolean = false;
  user = null;
  errorMessage = null;
  currentState: string;
  resetPassword: string;
  verifyAccount:any;
  isCompleteness:any;
  pageId:any;
  verifyId:any;
  dynamicsVar:any;

  constructor(private store: Store<AppState>, private router: Router,
    public route: ActivatedRoute, private _service: AppService) { 
    let getToken = sessionStorage.getItem('token');
    if(getToken != '' && getToken != 'null'){
      // //console.log('>>> layout state status calling....');
      this.store.dispatch(new LogInState({token: getToken}));
    }
    //this._service.updateStoreAuthenticated();
    // let getToken = this._service.getToken();
    // if(getToken != '' && getToken != 'null'){
    //   //console.log('store layout update....');
    //   this.store.dispatch(new LogInSuccess({token: getToken}));
    // }
        
    // this.verifyAccount = this.route.snapshot.paramMap.get('verify-id');
    // this.resetPassword = this.route.snapshot.paramMap.get('reset-id');

    // //console.log(this.verifyAccount);
    // //console.log(this.resetPassword);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
        let data: any = event;
        //console.log(this.href.substring(this.href.lastIndexOf('/') + 1));
        // if(data && typeof data == 'object' && data.url != ''){
        //   let getLastPart: any = data.url.substring(data.url.lastIndexOf('/') + 1)
        //   console.log(">>>part: ", getLastPart);
        //   sessionStorage.setItem('routerId', getLastPart);
        //   // console.log('lst part: ', getLastPart, " -- ", Number.isInteger(parseInt(getLastPart)), " :: ", typeof (parseInt(getLastPart)));
        //   // //&& Number.isInteger(parseInt(getLastPart)) === true
        //   // if(getLastPart != null && getLastPart != undefined ){
        //   //     let getDecID = window.atob(getLastPart);
        //   //     console.log('Routr param: ', getLastPart, " :: ", getDecID);
        //   //     sessionStorage.setItem('routerId', getDecID);
        //   // }
        // }

        var wholeUrl = data.urlAfterRedirects;
        
        var splitUrl = wholeUrl.split('/');
        var splitForverifyAccount = wholeUrl.split('?');
        // this.dynamicsVar = '4';
        // this._service.addDynamicsVal(this.dynamicsVar);
        //console.log(splitUrl,'splitUrl');
        if(splitUrl[2] == 'account-details') {
          // this._service.setValueUrl(splitUrl[3]);
          sessionStorage.setItem('accountDetailId', splitUrl[3]);
        }
        if(splitUrl[2] == 'account-upload') {
          // this._service.setValueUrl(splitUrl[3]);
          sessionStorage.setItem('accountUploadId', splitUrl[3]);
        }

        //alert("...." + splitUrl[3] +" -- " + eval(splitUrl));
        
        if(splitUrl[3] == 'testing-calibration-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'inspection-bodies-form') {
          let id = splitUrl[4];
          sessionStorage.setItem('ibUrlId', id);
          //this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'health-care-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'certification-bodies-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'pt-providers-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'halal-conformity-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'accreditation-service-details') {
          sessionStorage.setItem('routeId', splitUrl[4]);
        }else if(splitUrl[3] == 'work-permit-form') {
          sessionStorage.setItem('workPermitId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-course-details') {
          sessionStorage.setItem('courseDetailId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-public-course-form') {
          sessionStorage.setItem('publicCourseId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-inpremise-details') {
          sessionStorage.setItem('inpremiseCourseId', splitUrl[4]);
        }else{
          this._service.setValueUrl('');
        }

        if(splitForverifyAccount[0] == '/reset-password')
        {
          this.currentState = 'reset-password';
          this.pageId = splitForverifyAccount[1];
        }else if(splitForverifyAccount[0] == '/verify-account')
        {
          this.currentState = 'verify-account';
          this.verifyId = splitForverifyAccount[1];
          // console.log(this.verifyId,'verifyId');
        }else if(splitUrl[1] == 'verify-account')
        {
          this.currentState = 'verify-account';
        }
        else if(splitUrl[1] == 'profile-completion')
        {
          this.currentState = 'profile-completion';
        }else{
          this.currentState = data.urlAfterRedirects;
        }
        //console.log('>>> router...', this.currentState);
        // console.log('>>> router...', splitForverifyAccount);
      }); 

      // this.router.params.switchMap(params => { 
      // })
  }

  ngOnInit() {


    setTimeout(()=>{
      this.getState = this.store.select(selectAuthState);
      this.getState.subscribe((state) => {
        // console.log(">>>layout State subscribed: ", state);

        // console.log("@@@Auth status: ", state);
        if(state.user != null && state.user.token != undefined && state.user.token != null) {
          
          let authUserData = this._service.decodeJWT(state.user.token);
          // console.log(authUserData,'authUserData')
          if(state.user.token !=null && authUserData.isVerified == '0')
          {
            
            this.isAuthenticated = false;
          }else if(state.user.token !=null && authUserData.isCompleteness == '0'){
            this.isAuthenticated = state.isAuthenticated;
            this.isCompleteness = '0';
          }else if(state.user.token !=null && authUserData.isCompleteness == '1'){
            this.isAuthenticated = state.isAuthenticated;
            this.isCompleteness = '1';
            //console.log('@Enter....1.2: ');
          }
        }
        else{
          //console.log('@Enter....2');
          this.isAuthenticated = state.isAuthenticated;
        }
        
        // console.log(">>>layout State subscribed: ", state);
        //this.isAuthenticated = state.isAuthenticated;
        // this.isCompleteness = '1';
        // this.user = state.user;
        // this.errorMessage = state.errorMessage;
      });
    },0)
    
  }

}

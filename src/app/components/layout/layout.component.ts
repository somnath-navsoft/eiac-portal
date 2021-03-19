import { Component, OnInit } from '@angular/core';
import { AppState, selectAuthState } from '../../store/app.states';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute} from '@angular/router'
import { LogOut, LogInSuccess, LogInState } from '../../store/actions/auth.actions';
import { filter} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../services/app.service'; 
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

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
  modalOptions:NgbModalOptions;
  closeResult: string;

  popupHeaderText: string ='';
  popupBodyText: string ='';

  constructor(private store: Store<AppState>, private router: Router, private modalService: NgbModal,
    public route: ActivatedRoute, private _service: AppService, public toastr: ToastrService) { 
    let getToken = localStorage.getItem('token');
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
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
        //   localStorage.setItem('routerId', getLastPart);
        //   // console.log('lst part: ', getLastPart, " -- ", Number.isInteger(parseInt(getLastPart)), " :: ", typeof (parseInt(getLastPart)));
        //   // //&& Number.isInteger(parseInt(getLastPart)) === true
        //   // if(getLastPart != null && getLastPart != undefined ){
        //   //     let getDecID = window.atob(getLastPart);
        //   //     console.log('Routr param: ', getLastPart, " :: ", getDecID);
        //   //     localStorage.setItem('routerId', getDecID);
        //   // }
        // }

        var wholeUrl = data.urlAfterRedirects;
        var splitUrl = wholeUrl.split('/');
        console.log("@...URL: ", wholeUrl);
        //Check Outside URL Access

        console.log("@Layout....");

        let getLocalToken = localStorage.getItem('token');
        let userToken: any = (getLocalToken != null) ? getLocalToken : '';
        if (userToken !== '' && userToken != null)  {
          let authUserData: any = this._service.decodeJWT(userToken);
              console.log("@Auth Data: ", authUserData);
              if(authUserData.user_type != 'cab_client'){
                console.log(".>>>> Not cab client...");
                if(wholeUrl == '/dashboard/cab_client/inspection-bodies-form'        || wholeUrl == '/dashboard/cab_client/testing-calibration-form' ||
                   wholeUrl == '/dashboard/cab_client/certification-bodies-form'     || wholeUrl == '/dashboard/cab_client/health-care-form' || 
                   wholeUrl == '/dashboard/cab_client/halal-conformity-form'         || wholeUrl == '/dashboard/cab_client/pt-providers-form' || 
                   wholeUrl == '/dashboard/cab_client/no-objection-certificate-form' || wholeUrl == '/dashboard/cab_client/work-permit-form'){
                    //sessionStorage.setItem("outaccess", 'yes');
                    //this.toastr.error("You are not permit to submit....");
                    //this.suspendAlert('suspendBox');
                    setTimeout(()=>{
                      let elem = document.getElementById('openAppDialog');
                      //console.log("App dialog hash....", elem);
                      this.popupHeaderText  = 'Restricted';
                      this.popupBodyText    = 'Your account is not permitted to apply.';
                      if(elem){
                        elem.click();
                      }
                    }, 100)
                    this.router.navigateByUrl('/dashboard/home');
                }
              }else{
                console.log(".>>>> Cab client...");
              //Check suspended
              let servURL = this._service.apiServerUrl+"/"+'pillar_page/?data=accreditation_service&language_id=1&user_id='+parseInt(localStorage.getItem('userId'));
              console.log("@SUSpend URL: ", servURL);
              this._service.getwithoutData(servURL)
              .subscribe(
                res => {
                  let dataRec: any = res;        
                    let serviceList: any  = res['allServiceList'];
                    let suspendedService: any[] =[];
                    console.log(res,'@@@@ Serv list', " == ", serviceList);
                    let getSuspended: any = dataRec.serviceStatus;
                    let suspendIds: any = [];
                    for(let key in getSuspended){
                        let val: string = getSuspended[key];
                        console.log(val[0], " -- ", key);
                        if(val[0] === 'Suspended'){
                          suspendIds.push({id: parseInt(key) });
                        }
                    }
                    serviceList.forEach((item, key) => {
                    let suspendId: any = suspendIds.find(rec => rec.id === item.service_page.id);
                    console.log("@Found susps: ", suspendId);
                    let metaData: string = '';
                    if(item.service_page.meta_title != undefined && item.service_page.meta_title != ''){
                      metaData = item.service_page.meta_title.toString();
                      metaData += '-form';
                    }
                    if(suspendId != undefined){
                      //serviceList[key]['suspend'] = true;
                      suspendedService.push({title: item.title, meta: metaData})
                    }
          })
               let supendSelected: boolean = false;

               console.log("@Suspended URL: ", suspendedService.length, " -- ", suspendedService);

                if(suspendedService.length > 0){
                  suspendedService.forEach(rec =>{
                    if(rec.meta === splitUrl[3]){
                       supendSelected = true;
                       localStorage.setItem("suspendURL",'true');
                       localStorage.setItem("redirectURL",'');
                       setTimeout(()=>{
                         let elem = document.getElementById('openAppDialog');
                         this.popupHeaderText = 'Suspended';
                         this.popupBodyText = 'Your account is temporarily suspended.';
                         if(elem){
                           elem.click();
                         }
                       }, 100)
                       this.router.navigateByUrl('/dashboard/home');
                   }else{
                    if(localStorage.getItem("redirectURL") != '' && localStorage.getItem("redirectURL") != null && 
                    localStorage.getItem("redirectURL") != undefined){
                    let urlRedirect: string = localStorage.getItem("redirectURL");
                    localStorage.setItem("redirectURL",'');
                    console.log(">>>LOG In redirecting....", urlRedirect);
                    this.router.navigateByUrl(urlRedirect);
                  } 
                   }
                  });
                }else{
                  if(localStorage.getItem("redirectURL") != '' && localStorage.getItem("redirectURL") != null && 
                    localStorage.getItem("redirectURL") != undefined){
                    let urlRedirect: string = localStorage.getItem("redirectURL");
                    localStorage.setItem("redirectURL",'');
                    console.log(">>>LOG In redirecting....", urlRedirect);
                    this.router.navigateByUrl(urlRedirect);
                  }  
                }

              /* suspendedService.forEach(rec =>{
               if(rec.meta === splitUrl[3]){
                  supendSelected = true;
                  localStorage.setItem("suspendURL",'true');
                  setTimeout(()=>{
                    let elem = document.getElementById('openAppDialog');
                    this.popupHeaderText = 'Suspended';
                    this.popupBodyText = 'Your account is temporarily suspended.';
                    if(elem){
                      elem.click();
                    }
                  }, 100)
                  this.router.navigateByUrl('/dashboard/home');
              }
              else{
                if(localStorage.getItem("redirectURL") != '' && localStorage.getItem("redirectURL") != null && 
                localStorage.getItem("redirectURL") != undefined){
                let urlRedirect: string = localStorage.getItem("redirectURL");
                localStorage.setItem("redirectURL",'');
                //console.log(">>>LOG In redirecting....", urlRedirect);
                this.router.navigateByUrl(urlRedirect);
              }  
               } 
          })*/
           
          console.log('@@@@ Revised Serv list', " == ", suspendedService, " -- ", splitUrl[3], " -- ", supendSelected);
          });

        }
      }    
        var splitForverifyAccount = wholeUrl.split('?');
        // this.dynamicsVar = '4';
        // this._service.addDynamicsVal(this.dynamicsVar);
        // console.log(splitForverifyAccount,'splitForverifyAccount');
        if(splitUrl[2] == 'account-details') {
          //console.log(">>>AC Details: ", splitUrl);
          localStorage.setItem('accountDetailId', splitUrl[3]);
          localStorage.setItem('accountDetailType', splitUrl[4]);
        }
        if(splitUrl[2] == 'account-upload') {
          localStorage.setItem('accountUploadId', splitUrl[3]);
          //localStorage.setItem('accountDetailType', splitUrl[4]);
        }

        //alert("...." + splitUrl[3] +" -- " + eval(splitUrl));

        if(localStorage.getItem('inpremiseApplyCourseId') != ''){
          localStorage.setItem('inpremiseApplyCourseId','');
        }
        
        if(splitUrl[3] == 'testing-calibration-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'inspection-bodies-form') {
          let id = splitUrl[4];
          localStorage.setItem('ibUrlId', id);
          //this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'health-care-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'no-objection-certificate-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'certification-bodies-form') { 
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'pt-providers-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'halal-conformity-form') {
          this._service.setValueUrl(splitUrl[4]);
        }else if(splitUrl[3] == 'accreditation-service-details') {
          localStorage.setItem('routeId', splitUrl[4]);
        }else if(splitUrl[3] == 'registration-service-details') {
          localStorage.setItem('registrationId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-service-details') {
          localStorage.setItem('trainingId', splitUrl[4]);
        }else if(splitUrl[3] == 'work-permit-form') {
          localStorage.setItem('workPermitId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-course-details') {
          localStorage.setItem('courseDetailId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-public-course-form') {
          localStorage.setItem('publicFormId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-inpremise-form') {
          localStorage.setItem('inpremiseFormId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-inpremise-details') {
          localStorage.setItem('inpremiseCourseId', splitUrl[4]);
        }else if(splitUrl[3] == 'training-inpremise-apply-details') {
          localStorage.setItem('inpremiseApplyCourseId', splitUrl[4]);
        }else{
          this._service.setValueUrl('');
        }

        if(splitForverifyAccount[0] == '/reset-password')
        {
          this.currentState = 'reset-password';
          this.pageId = splitForverifyAccount[1];
        }else if(splitForverifyAccount[0] == '/dashboard/cab_client/training-public-course-form'){
          localStorage.setItem('trainingPublicCourse', splitForverifyAccount[1]);
        }else if(splitForverifyAccount[0] == '/dashboard/cab_client/training-inpremise-form'){
          localStorage.setItem('trainingInpremiseCourse', splitForverifyAccount[1]);
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
  closeDialog(){
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  suspendAlert(content) { 
    console.log("...", content); 
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ngOnInit() {
    console.log("@Layout...");

    // let isTokenExpired: boolean = this._service.isTokenExpired()
    // if(isTokenExpired){
    //   this.isAuthenticated = false;
    // }
    setTimeout(()=>{
      this.getState = this.store.select(selectAuthState);
      this.getState.subscribe((state) => {
        // console.log(">>>layout State subscribed: ", state);

        // console.log("@@@Auth status: ", state);
        if(state.user != null && state.user.token != undefined && state.user.token != null) {
          
          let authUserData = this._service.decodeJWT(state.user.token);
          //console.log(authUserData,'@layout authUserData') 
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

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    public token: any;
    constructor( public router: Router, public _service: AppService, public toastr: ToastrService) 
    { 
       
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
        let getLocalToken = localStorage.getItem('token');
        this.token = (getLocalToken != null) ? getLocalToken : '';        
        console.log('Auth guard: 1',this.token);
        console.log("Auth guard..." + state.url + " == " +route.url);

        if(state.url != null && 
          (state.url == '/dashboard/cab_client/inspection-bodies-form'          || state.url == '/dashboard/cab_client/certification-bodies-form' ||
            state.url == '/dashboard/cab_client/health-care-form')              || state.url == '/dashboard/cab_client/testing-calibration-form'  ||
            state.url == '/dashboard/cab_client/halal-conformity-form'          || state.url == '/dashboard/cab_client/pt-providers-form' || 
            state.url == '/dashboard/cab_client/no-objection-certificate-form'  || state.url == '/dashboard/cab_client/work-permit-form'){
          // if(localStorage.getItem("suspendURL") == '' || localStorage.getItem("suspendURL") == null ||
          // localStorage.getItem("suspendURL") == undefined){

            localStorage.setItem("redirectURL", state.url);
          //}            
            // if (this.token == '' || this.token == null)  {
            //   console.log('Auth guard 2: ',this.token);
            //   this.router.navigate(['/sign-in']);
            //   return false;
            // }
        }
        if (this.token == '' || this.token == null)  {
            console.log('Auth guard 2: ',this.token);
            //this.router.navigate(['/sign-in/'], { queryParams: { returnUrl: state.url }});
            this.router.navigate(['/sign-in']);
            return false;
        }
        //Check for usertype allowed to form access only for CAB - redirect to Dashboard
        //If CAB but suspended redirecto Dashboard and showing message - You are suspended
        //If IO redirect to Dashboard and show message - You are not allowed to submission.

        /*if(this.token){
            console.log("@Auth Login.....");
            let authUserData: any = this._service.decodeJWT(this.token);
            console.log("@Auth Data: ", authUserData);
            if(authUserData.user_type == 'cab_client'){
                //this.router.navigate(['/dashboard']);
                //return false;
                var wholeUrl = state.url;
                var splitUrl = wholeUrl.split('/');

                if(authUserData.user_type != 'cab_client'){
                    console.log(".>>>> Not cab client...");
                    if(wholeUrl == '/dashboard/cab_client/inspection-bodies-form'        || wholeUrl == '/dashboard/cab_client/testing-calibration-form' ||
                       wholeUrl == '/dashboard/cab_client/certification-bodies-form'     || wholeUrl == '/dashboard/cab_client/health-care-form' || 
                       wholeUrl == '/dashboard/cab_client/halal-conformity-form'         || wholeUrl == '/dashboard/cab_client/pt-providers-form' || 
                       wholeUrl == '/dashboard/cab_client/no-objection-certificate-form' || wholeUrl == '/dashboard/cab_client/work-permit-form'){
                        //sessionStorage.setItem("outaccess", 'yes');
                        this.toastr.error("@@@You are not permit to submit....");
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
                        //console.log("@suspended List: ", getSuspended);
                        for(let key in getSuspended){
                            let val: string = getSuspended[key];
                            console.log(val[0], " -- ", key);
                            if(val[0] === 'Suspended'){
                              suspendIds.push({id: parseInt(key) });
                            }
                        }
                        //console.log("#Suspendids: ", suspendIds);
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
                        }else{
                          //serviceList[key]['suspend'] = false;
                        }
              })
              let supendSelected: boolean = false;
              suspendedService.forEach(rec =>{
                   if(rec.meta === splitUrl[3]){
                      supendSelected = true;
                      this.toastr.error("############You are supended to submit selected application");
                      this.router.navigateByUrl('/dashboard/home');
                      return false;
                   }
              })
              console.log('@@@@ Revised Serv list', " == ", suspendedService, " -- ", splitUrl[3], " -- ", supendSelected);
              });    
            }
            }else{
                return true;
            }
        }*/
       return true;
    }
}
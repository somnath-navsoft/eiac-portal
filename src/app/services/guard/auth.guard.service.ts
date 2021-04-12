import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    public token: any;
    constructor( public router: Router, public _service: AppService, public toastr: ToastrService) 
    { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
        let getLocalToken = localStorage.getItem('token');
        this.token = (getLocalToken != null) ? getLocalToken : '';
        if(state.url != null && 
          (state.url == '/dashboard/cab_client/inspection-bodies-form'          || state.url == '/dashboard/cab_client/certification-bodies-form' ||
            state.url == '/dashboard/cab_client/health-care-form')              || state.url == '/dashboard/cab_client/testing-calibration-form'  ||
            state.url == '/dashboard/cab_client/halal-conformity-form'          || state.url == '/dashboard/cab_client/pt-providers-form' || 
            state.url == '/dashboard/cab_client/no-objection-certificate-form'  || state.url == '/dashboard/cab_client/work-permit-form'){
         
            localStorage.setItem("redirectURL", state.url);
        }
        if (this.token == '' || this.token == null)  {
            //this.router.navigate(['/sign-in']);
            window.top.location.href = '/sign-in';
            return false;
        }
        //Check for usertype allowed to form access only for CAB - redirect to Dashboard
        //If CAB but suspended redirecto Dashboard and showing message - You are suspended
        //If IO redirect to Dashboard and show message - You are not allowed to submission.
       return true;
    }
}
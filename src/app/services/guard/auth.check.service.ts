import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Injectable({ providedIn: 'root' })
export class AuthCheck implements CanActivate {
   public token: any;
    constructor( public router: Router, public _service:AppService) 
    {  }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let getLocalToken = localStorage.getItem('token');
        this.token = (getLocalToken != null || getLocalToken != undefined) ? getLocalToken : '';
        // console.log('portal Auth check: 1',this.token, " ---> #", getLocalToken);
        //&& this.token  !== 'null'
        console.log("Auth Check..." + state.url + " == " +route.url);

        if(state.url != null && 
            (state.url == '/dashboard/cab_client/inspection-bodies-form' || state.url == '/dashboard/cab_client/certification-bodies-form')) {
            console.log("@redirect reset....");
            //localStorage.setItem("redirectURL", state.url);
        }

        let authUserData = this._service.decodeJWT(this.token);
        if(this.token  !== '' && authUserData.isVerified == '0')  {
            // console.log('portal Auth check: 2',this.token);
            // this.router.navigate(['/dashboard']);
            this.router.navigateByUrl('/sign-in');
            return false;           
        }else if(this.token  !== '' && authUserData.isCompleteness == '0')  {
            // console.log('portal Auth check: 2',this.token);
            // this.router.navigate(['/dashboard']);
            this.router.navigateByUrl('/profile-completion');
            return false;           
        }else if(this.token  !== '' && authUserData.isCompleteness == '2')  {
            // console.log('portal Auth check: 2',this.token);
            // this.router.navigate(['/dashboard']);
            this.router.navigateByUrl('/sign-in');
            return false;           
        }else if(this.token  !== '' && authUserData.isVerified == '1' && authUserData.isCompleteness == '1')  {
            // console.log('portal Auth check: 2',this.token);
            // this.router.navigate(['/dashboard']);
            // this.router.navigateByUrl('/profile-completation');
            var logType = localStorage.getItem('type');
            let landURL = '/dashboard/'+logType+'/home';
            this.router.navigateByUrl(landURL);
            return false;           
        }else{
            console.log("@Token in check auth....");
        }
        return true;        
    }
}
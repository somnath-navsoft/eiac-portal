import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    public token: any;
    constructor( public router: Router) 
    { 
       
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let getLocalToken = localStorage.getItem('token');
        this.token = (getLocalToken != null) ? getLocalToken : '';        
        // console.log('Auth guard: 1',this.token);
        //this.token == undefined || this.token == '' || 
        //this.token == 'null' ||
        if (this.token == '' || this.token == null)  {
            console.log('Auth guard 2: ',this.token);
            this.router.navigate(['/sign-in']);
            return false;
        }
        return true;
    }
}
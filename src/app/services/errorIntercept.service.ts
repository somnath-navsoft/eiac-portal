
import { HttpClient, HttpInterceptor,HttpRequest, HttpHeaders ,HttpHandler,HttpEvent,HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../store/app.states';
import { AddGlobalError, LogInFailure} from '../store/actions/auth.actions';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import {AppService} from '../services/app.service';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private _service: AppService,
    private _router: Router,
    public _toastr: ToastrService
  ) {}
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Token': localStorage.getItem("token")
  });

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("#intercepted request ... ");

    if(localStorage.getItem('token') != undefined && localStorage.getItem('token') != '' && localStorage.getItem('token') != null){
        let jwtToken: any = localStorage.getItem('token');
        let tokenExpDate: any = this._service.getTokenExpirationDate(jwtToken);
        let isTokenExpired: boolean = this._service.isTokenExpired()
        console.log("@Token Exp Date: ", tokenExpDate, " -- ", isTokenExpired);
        //Token expired
        if(isTokenExpired){
            localStorage.setItem('token', '');
            localStorage.setItem('type', '');
            localStorage.setItem('email','');
            //this._toastr.error("Your Session has expired, Please login again");
            //window.top.location.href = '/sign-in';
            // setTimeout(() => {
            //   //window.top.location.href = '/sign-in';
            //   //this._router.navigateByUrl('/sign-in')
            // }, 3000)            
        }
    }    

    //Clone the request to add the new header.
    //const authReq = request.clone({ headers: request.headers.set("token", localStorage.getItem("token")) });
    //console.log("Sending request with new header now ...", authReq);
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('@Error: ', error, " -- ", error.status);  
          let parsrUrlService: any; 
          if(error.url != undefined){
            let getURL = this.authService.BASE_URL + '/';
            parsrUrlService = error.url.toString().split(getURL).pop();
          }
          ////console.log('url parse: ', parsrUrlService, " -- ", error);
          switch(parsrUrlService){
            case 'api/token/':
              this.store.dispatch(new LogInFailure({ error: error.error.detail }));
            break;
            default:
              switch(error.status){
                case 500:
                  ////console.log("HTTP error occured.....");
                  //this._service.openMessageDialog(error.message, error.statusText, 0);                
                  break;
                
              }
              //this.store.dispatch(new AddGlobalError({ error: error.error.message }));
            break;
          }
          return throwError(error);
        })
      )
  }
  
}
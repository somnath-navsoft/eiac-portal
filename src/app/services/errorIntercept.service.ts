
import { HttpClient, HttpInterceptor,HttpRequest,HttpHandler,HttpEvent,HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.states';
import { AddGlobalError, LogInFailure} from '../store/actions/auth.actions';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import {AppService} from '../services/app.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private _service: AppService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          ////console.log('@Error: ', error);
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
                  this._service.openMessageDialog(error.message, error.statusText, 0);                
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
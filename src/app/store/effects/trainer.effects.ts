import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, from } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { tap,mergeMap, switchMap, map  } from 'rxjs/operators';
import { User } from '../../models/user';
import { TrainerService } from '../../services/trainer.service';
import { AppService } from '../../services/app.service';
import { Constants} from  '../../services/constant.service';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../../store/app.states';
import {
   Listing, ListingEvent, ListingAccredService, ListingAttendance, ListingAgenda, ListSuccess, SaveNew, Edit, Update, Delete, All, TrainerActionTypes
  } from '../actions/trainer.actions';
  import {SnackbarService} from 'ngx-snackbar';

@Injectable()
export class TrainerEffects {
  getState: any; 
  appState: Store<AppState>; 
  constructor(
    private store: Store,
    private snackbarService: SnackbarService,
    private actions: Actions,
    private _trainerService: TrainerService,
    private router: Router,
    private _appServ: AppService,
    private _constants:  Constants
  ) {}

  @Effect({ dispatch: false })
  ListSuccess: Observable<any> = this.actions.pipe(
  ofType(TrainerActionTypes.LIST_SUCCESS),
  tap((trainer) => {
    ////console.log("@Effects List success...", trainer);
    return trainer.payload;
  }));
/*
  @Effect({ dispatch: false })
  AddSave: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.TRAINER_SAVE),
      map((action: SaveNew) => action.payload),
      switchMap(payload => {
        return this._trainerService.saveNew(payload).pipe(
          map(data => {
            let result: any = data;
             ////console.log("@Effect Trainer SAVE Data: ", data);
             if(typeof result === 'object' && result.first_name != undefined){
              //this._appServ.openMessageDialog(this._constants.addSuccessMessage, this._constants.successDialogHeader);
              setTimeout(()=>{
                this._appServ.openFlashMessage(this._constants.addSuccessMessage);
              },100)
              this.router.navigateByUrl('/dashboard/trainers');
             }
          }
      ))
  }))

  @Effect({ dispatch: false })
  UpdateSave: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.TRAINER_UPDATE),
      map((action: SaveNew) => action.payload),
      switchMap(payload => {
        return this._trainerService.update(payload, payload.id).pipe(
          map(data => {
            let result: any = data;
             ////console.log("@Effect Trainer UPDATE Data: ", data);
             if(typeof result === 'object' && result.first_name != undefined){
              //this._appServ.openMessageDialog(this._constants.addSuccessMessage, this._constants.successDialogHeader);
              setTimeout(()=>{
                this._appServ.openFlashMessage(this._constants.updateSuccessMessage);
              },100)
              this.router.navigateByUrl('/dashboard/trainers');
             }
             //this.store.dispatch(new ListSuccess(data));
             //            
          }
      ))
  }))

  @Effect({ dispatch: false })
  Delete: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.TRAINER_DELETE),
      map((action: SaveNew) => action.payload),
      switchMap(payload => {
        return this._trainerService.deleteRecord(payload).pipe(
          map(data => {
            let result: any = data;
             ////console.log("@Effect Trainer DELETE Data: ", data);
             if(typeof result === 'object'){
                  //this._appServ.openMessageDialog(this._constants.deleteSuccessMessage, this._constants.successDialogHeader);
                  this._appServ.openFlashMessage(this._constants.deleteSuccessMessage, this._constants.flashMessageTypeInfo);
                  this.store.dispatch(new Listing({record: data, successMessage: 'Record Deleted Successfully'}));
             }
          }
      ))
  }))

  @Effect({ dispatch: false })
  Edit: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.TRAINER_EDIT),
      map((action: SaveNew) => action.payload),
      switchMap(payload => {
        return this._trainerService.getRecordByID(payload).pipe(
          map(data => {
            let result: any = data;
             ////console.log("@Effect Trainer EDIT Data: ", result);
             if(typeof result === 'object'){
                this.store.dispatch(new ListSuccess({record: result}));
             }
          }
      ))
  }))
  */

  @Effect({ dispatch: false })
  Listing: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.LIST),
      map((action: Listing) => action.payload),
      switchMap(payload => {
        return this._trainerService.getRecordAll(payload).pipe(
          map(data => {
             ////console.log("@Effect Trainer Data: ", data);
             this.store.dispatch(new ListSuccess({record: data}));
          }          
      ))        
  }))

  //
  @Effect({ dispatch: false })
  ListingAccredService: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.LIST_ACCRED_SERV),
      map((action: ListingAccredService) => action),
      switchMap(payload => {
        return this._trainerService.getAccreditationServiceList().pipe(
          map(data => {
             console.log("@Effect Trainer Accreditation Status list Data: ", data);
             return;
             this.store.dispatch(new ListSuccess({record: data}));
          }          
      ))        
  }))

  @Effect({ dispatch: false })
  ListingEvent: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.LIST_EVENT),
      map((action: ListingEvent) => action.payload),
      switchMap(payload => {
        return this._trainerService.getEventList().pipe(
          map(data => {
             ////console.log("@Effect Trainer Event Data: ", data);
             this.store.dispatch(new ListSuccess({record: data}));
          }          
      ))        
  }))
  @Effect({ dispatch: false })
  ListingAttendance: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.LIST_ATTEND),
      map((action: ListingAttendance) => action.payload),
      switchMap(payload => {
        return this._trainerService.getAttendanceList().pipe(
          map(data => {
             ////console.log("@Effect Trainer Event Data: ", data);
             this.store.dispatch(new ListSuccess({record: data}));
          }          
      ))        
  }))
  //Listing Agenda
  @Effect({ dispatch: false })
  ListingAgenda: Observable<any> = this.actions.pipe(
    ofType(TrainerActionTypes.LIST_AGENDA),
      map((action: ListingAgenda) => action.payload),
      switchMap(payload => {
        return this._trainerService.getAgendaList().pipe(
          map(data => {
             ////console.log("@Effect Trainer Event Data: ", data);
             this.store.dispatch(new ListSuccess({record: data}));
          }          
      ))        
  }))
}


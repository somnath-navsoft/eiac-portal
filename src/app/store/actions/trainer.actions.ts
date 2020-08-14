import { Action } from '@ngrx/store';
import { TrainerModel } from '../../models/trainer';

export enum TrainerActionTypes {
  LIST                = '[Trainer] Listing',
  LIST_EVENT          = '[Trainer] Listing Event',
  LIST_ATTEND         = '[Trainer] Listing Attendance',
  LIST_AGENDA         = '[Trainer] Listing Agenda',
  LIST_SUCCESS        = '[Trainer] List Success',
  TRAINER_SAVE        = '[Trainer] Add Save',
  TRAINER_EDIT        = '[Trainer] Edit',
  TRAINER_UPDATE      = '[Trainer] Edit Save',
  TRAINER_DELETE      = '[Trainer] Delete'
}

export class Listing implements Action {  
    readonly type = TrainerActionTypes.LIST;
    constructor(public payload: any) {
      ////console.log('@Action Trainer Listing...', payload);
    }
}
export class ListingEvent implements Action {  
  readonly type = TrainerActionTypes.LIST_EVENT;
  constructor(public payload: any) {
    ////console.log('@Action Trainer Listing...', payload);
  }
}
export class ListingAttendance implements Action {  
  readonly type = TrainerActionTypes.LIST_ATTEND;
  constructor(public payload: any) {
    ////console.log('@Action Trainer Listing...', payload);
  }
}
export class ListingAgenda implements Action {  
  readonly type = TrainerActionTypes.LIST_AGENDA;
  constructor(public payload: any) {
    ////console.log('@Action Trainer Listing...', payload);
  }
}
export class ListSuccess implements Action {
  readonly type = TrainerActionTypes.LIST_SUCCESS;
  constructor(public payload: any) {
    ////console.log('enter ACTION LIST SUCCESS>>>', payload);
  }
}
// export class AddNew implements Action {
//     readonly type = TrainerActionTypes.TRAINER_ADD;
//     constructor(public payload: any) {
//         ////console.log('@Trainer Add New Action', payload);
//     }
// }
export class SaveNew implements Action {
    readonly type = TrainerActionTypes.TRAINER_SAVE;
    constructor(public payload: any) {
        ////console.log('@Trainer Save New Action', payload);
    }
}
export class Edit implements Action {
    readonly type = TrainerActionTypes.TRAINER_EDIT;
    constructor(public payload: any) {
        ////console.log('@Trainer Edit Action', payload);
    }
  }
  export class Update implements Action {
    readonly type = TrainerActionTypes.TRAINER_UPDATE;
    constructor(public payload: any, public id: number) {
        ////console.log('@Trainer Update Action', payload);
    }
  }
  export class Delete implements Action {
    readonly type = TrainerActionTypes.TRAINER_DELETE;
    constructor(public payload: any) {
        ////console.log('@Trainer Delete Action', payload);
    }
  }
  //| AddNew
  export type All =
    | Listing 
    | ListingEvent
    | ListingAttendance
    | ListingAgenda
    | ListSuccess    
    | SaveNew
    | Edit
    | Update
    | Delete;
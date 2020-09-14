import { TrainerModel } from '../../models/trainer';
import { TrainerActionTypes, All } from '../actions/trainer.actions';

export interface State {
  trainer: TrainerModel | null; 
  errorMessage: string | null;
  successMessage: string | null;
}
export const initialState: State = {
    trainer: null,
    errorMessage: null,
    successMessage: null
}; 

export function reducer(state = initialState, action: All): State {
    switch (action.type) {
          
      case TrainerActionTypes.LIST: {
        ////console.log('@Reducer Trainer LIST');
        return {
          ...state,
          trainer: action.payload.record,
          successMessage: action.payload.successMessage,
          errorMessage: action.payload.errorMessage
        };
      }
      case TrainerActionTypes.LIST_ACCRED_SERV: {
        console.log('@Reducer Accreditation status LIST');
        return {
          ...state,
          trainer: action.payload.records,
          successMessage: action.payload.successMessage,
          errorMessage: action.payload.errorMessage
        };
      }
      case TrainerActionTypes.LIST_EVENT: {
        ////console.log('@Reducer Trainer LIST');
        return {
          ...state,
          trainer: action.payload.record,
          successMessage: action.payload.successMessage,
          errorMessage: action.payload.errorMessage
        };
      }
      case TrainerActionTypes.LIST_ATTEND: {
        ////console.log('@Reducer Trainer LIST');
        return {
          ...state,
          trainer: action.payload.record,
          successMessage: action.payload.successMessage,
          errorMessage: action.payload.errorMessage
        };
      }
      case TrainerActionTypes.LIST_AGENDA: {
        ////console.log('@Reducer Trainer LIST');
        return {
          ...state,
          trainer: action.payload.record,
          successMessage: action.payload.successMessage,
          errorMessage: action.payload.errorMessage
        };
      }
      case TrainerActionTypes.LIST_SUCCESS: {
        //////console.log('enter reducer LOGIN SUCCESS>>>', action);
        return {
          ...state,
          trainer: action.payload.record,
          successMessage: action.payload.successMessage,
          errorMessage: action.payload.errorMessage
        };
      }
      case TrainerActionTypes.TRAINER_SAVE: {
        ////console.log('@Trainer reduce SAVE');      
        return {
            ...state,          
        };
      }
      case TrainerActionTypes.TRAINER_EDIT: {
        ////console.log('@Trainer reduce EDIT');
        return {
          ...state,
          trainer: action.payload,        
          errorMessage: null
        };
      }
      case TrainerActionTypes.TRAINER_UPDATE: {
        ////console.log('@Trainer reduce UPDATE');
        return {
          ...state,          
          errorMessage: null
        };
      }
      case TrainerActionTypes.TRAINER_DELETE: {
        ////console.log('@Trainer reduce DELETE');
        return {
          ...state,          
          errorMessage: null
        };
      }
      default: {
        return state;
      }
    }
  }
export const allTrainer = (state: State) => state.trainer;

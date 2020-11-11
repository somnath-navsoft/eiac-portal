import * as auth from './reducers/auth.reducers';
import * as trainer from './reducers/trainer.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';


export interface AppState {
  authState: auth.State;
  //trainer
  trainerState: trainer.State;
}

export const reducers = {
    auth: auth.reducer,
    trainer: trainer.reducer
}; 
  export const selectAuthState = createFeatureSelector<AppState>('auth');

  //select trainer
  export const selectTrainerList = createFeatureSelector<AppState>('trainer');
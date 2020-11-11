import * as auth from './reducers/auth.reducers';
import * as trainer from './reducers/trainer.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';


export interface TrainerState {
  //trainer
  trainerState: trainer.State;
}

export const reducers = {
    trainer: trainer.reducer
}; 
  //select trainer
  export const selectTrainerList = createFeatureSelector<TrainerState>('trainer');
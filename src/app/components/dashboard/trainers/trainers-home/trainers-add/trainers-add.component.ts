import { Component, OnInit } from '@angular/core';

//Store section ---- Start
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TrainerState, selectTrainerList} from '../../../../../store/trainer.states';
import { Listing, SaveNew } from '../../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../../models/trainer';
import { AppService } from '../../../../../services/app.service';
import { Constants } from '../../../../../services/constant.service';
//Store section ---- End

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-trainers-add',
  templateUrl: './trainers-add.component.html',
  styleUrls: ['./trainers-add.component.scss']
})
export class TrainersAddComponent implements OnInit {
  trainerModel: TrainerModel;
  constructor(private store: Store<TrainerState>, private _snackBar: MatSnackBar,
              private _service: AppService, private _constant: Constants) { }

  ngOnInit() {
    this.trainerModel = new TrainerModel();
    ////console.log(this.trainerModel, "model data");
  }

  isValid(){
    let regExEmail = this._service.regExEmail;
    if(this.trainerModel.first_name === '' || this.trainerModel.last_name === '' || 
      this.trainerModel.username === '' || this.trainerModel.email === ''){
      this._service.openMessageDialog(this._constant.generalFormValidationError, this._constant.errorDialogHeader);
      return false;
    }
    if(this.trainerModel.email != '' && !regExEmail.test(this.trainerModel.email)){
      this._service.openMessageDialog(this._constant.emailValidationError, this._constant.errorDialogHeader);
      return false;
    }
    return true;
  }

  createRecord(){
     if(this.isValid()){
        //Submit process
        ////console.log("POst:: ", this.trainerModel);
        this.store.dispatch(new SaveNew(this.trainerModel));
     }     
  }

}

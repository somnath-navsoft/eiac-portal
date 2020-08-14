import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//Store section ---- Start
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TrainerState, selectTrainerList} from '../../../../../store/trainer.states';
import { Edit, Update } from '../../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../../models/trainer';
import { AppService } from '../../../../../services/app.service';
import { Constants } from '../../../../../services/constant.service';
//Store section ---- End

@Component({
  selector: 'app-trainers-edit',
  templateUrl: './trainers-edit.component.html',
  styleUrls: ['./trainers-edit.component.scss']
})
export class TrainersEditComponent implements OnInit {
  trainerModel: TrainerModel;
  editId: number;
  getTrainer: Observable<any>; 
  trainerdata: any;
  constructor(private store: Store<TrainerState>,private _service: AppService, 
              private _constant: Constants, private route: ActivatedRoute) { }

  ngOnInit() {
    this.trainerModel = new TrainerModel();
    this.route.params.subscribe(params => {
        //////console.log("@@@Get params: ", params);
        if(params.id != undefined && params.id > 0){
          //////console.log('get Id: ', params.id);
          this.editId = params.id;
          this.store.dispatch(new Edit(this.editId));
        this.getTrainer = this.store.select(selectTrainerList);
        //////console.log("@Trainer Data >>>", this.getTrainer);
        this.getTrainer.subscribe((state) => {
          //////console.log(">>>Edit ..... State subscribed: ", state);
          let tempModel: any = {}; 
          setTimeout(()=>{
            Object.assign(tempModel,state.trainer);
            this.trainerModel = tempModel;
            ////console.log(">>>> Trainer Model: ", this.trainerModel);
          },0)             
          });
        }
    });
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

  updateRecord(){
    ////console.log(">>>Post: ", this.trainerModel);
    if(this.isValid()){
       //Submit process
       ////console.log("POst:: ", this.trainerModel);
       this.store.dispatch(new Update(this.trainerModel, this.editId));
    }     
 }

}

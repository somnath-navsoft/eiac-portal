import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FlashMessagesService } from 'angular2-flash-messages';

//import { AppState, selectTrainerList } from '../../.././../store/app.states';
import { TrainerState, selectTrainerList} from '../../../../store/trainer.states';
import { Listing, Delete } from '../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../models/trainer';

@Component({
  selector: 'app-trainers-home',
  templateUrl: './trainers-home.component.html',
  styleUrls: ['./trainers-home.component.scss']
})
 
export class TrainersHomeComponent implements OnInit {
  trainerObject: TrainerModel;
  getTrainer: Observable<any>; 
  trainerdata: any;

  //Add pagination
  paginationConfig: any;
  pageLimit: number = 2;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;
  
  
  constructor(private store: Store<TrainerState>) { 
    //////console.log("@Trainer Home >>>");

    this.pageData['page']   = this.pageCurrentNumber;
    this.pageData['limit']  = this.pageLimit;
    // this.store.dispatch(new Listing(this.pageData));
    this.store.dispatch(new Listing({}));
  }
 
  ngOnInit() {
     this.getTrainer = this.store.select(selectTrainerList);
     //////console.log("@Trainer Data >>>", this.getTrainer);     
     this.loadPageData();
  }

  loadPageData(){
    this.getTrainer.subscribe((state) => {
      ////console.log(">>>State subscribed: ", state);      
      setTimeout(()=>{
        this.trainerdata = state;
        if(state.trainer != undefined && state.trainer.length > 0){
          this.pageTotal = state.trainer.length;
        }
        // if(state.trainer != undefined && state.trainer.length > 0){
        //   this.pageTotal = state.trainer.length;
        //   this.pageConfigData = {
        //     itemsPerPage: this.pageLimit,
        //     currentPage: this.pageCurrentNumber,
        //     totalItems: 6
        //   };
        // }
      },0)      
    });
  }

  //paginate page change
  pageChanged(event){
    this.pageCurrentNumber          = event;
    this.pageConfigData.currentPage = event;
    let pagedata: any = {};
    pagedata['page'] = event;
    pagedata['limit'] = this.pageLimit;
    //////console.log('**** page changed: ', this.pageData, " -- ", event)
    this.store.dispatch(new Listing(Object.assign({},pagedata)));
    //this.store.dispatch(new Listing({}));
    this.loadPageData();
  }

  //Delete record
  deleteRecord(id: number){
    if(id){
       let confirmDelete = confirm("Do you really delete?");
       ////console.log('>>>>response confirm...', confirmDelete);
       if(confirmDelete){ 
          ////console.log(">>> Delete...");
          this.store.dispatch(new Delete(id));
       }
    }
  }

}

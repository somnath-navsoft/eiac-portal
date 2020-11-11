/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate-attendance-list',
  templateUrl: './candidate-attendance-list.component.html',
  styleUrls: ['./candidate-attendance-list.component.scss']
})
export class CandidateAttendanceListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';

import { TrainerState, selectTrainerList} from '../../../../store/trainer.states';
import { Listing, ListingAttendance, Delete } from '../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../models/trainer';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-candidate-attendance-list',
  templateUrl: './candidate-attendance-list.component.html',
  styleUrls: ['./candidate-attendance-list.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  
})
export class CandidateAttendanceListComponent implements OnInit, OnDestroy {
  getTrainerCourse: Observable<any>; 
  trainerdata: any[] = [];
  trainerTempdata: any;
  //Observable subscription
  subscriptions: Subscription[] = [];
  modalOptions:NgbModalOptions;

  //Add pagination
  paginationConfig: any;
  pageLimit: number = 5;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;

  curSortDir: any = {};
  dataLoad: boolean = false;

  advSearch: boolean = false;
  selectCustomCourses: any[] = [];
  selectCustomCourse: string='';
  selectAgreementStatus: string='';
  selectPaymentStatus: string='';
  selectCode: string='';
  selectFees: string='';
  agreementStatus: any[] =[];
  paymentStatus: any[] =[];

  selectCourse: string = '';
  selectStartDate: any;
  selectEndDate: any;
  
  closeResult: string;
  courseViewData: any = {};
  voucherEntry: any = {};
  selectCourseData: any = [];
  selectDeleteID: number =0;



  constructor(private store: Store<TrainerState>, private _service: AppService, private _constant: Constants,
    private _trainerService: TrainerService, private modalService: NgbModal) { 
    this.store.dispatch(new ListingAttendance({}));
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  } 

  ngOnDestroy() {
     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit() {
    this.getTrainerCourse = this.store.select(selectTrainerList);
    this.curSortDir['course']                   = false;
    this.curSortDir['participants']             = false;
    this.loadPageData();
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
  }

  filterSearchReset(){
    //Reset serach
    this.selectStartDate = '';
    this.selectEndDate = '';
    this.selectCourse = '';

    this.loadPageData();
  }
  
  isValidSearch(){
    if(this.selectCourse === '' && 
    (this.selectStartDate == null || this.selectStartDate == '') && 
    (this.selectEndDate == null || this.selectEndDate == '')){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
     let postObject: any = {};
     //console.log("Search click....", );
     if(this.isValidSearch()){
       if(this.selectCourse != ''){
        postObject['course_title'] = this.selectCourse;
       }
       if(this.selectStartDate != null && this.selectStartDate != ''){
         //console.log("@start...");
         let data: any = this.selectStartDate;
         let dateObj = data._i;
         let dateStr = '';
          if(dateObj){
            if(dateObj.year != undefined){
              dateStr = dateObj.year + "-";
            }
            if(dateObj.month != undefined){
              dateStr += (dateObj.month + 1) + "-";
            }
            if(dateObj.date != undefined){
              dateStr += dateObj.date;
            }
          } 
        //console.log("final start: ", dateStr);
        postObject['start_date'] = dateStr;
       } 
       if(this.selectEndDate != null && this.selectEndDate != ''){
          let data: any = this.selectEndDate;
          let dateObj   = data._i;
          let dateStr   = '';
          if(dateObj){
            if(dateObj.year != undefined){
              dateStr = dateObj.year + "-";
            }
            if(dateObj.month != undefined){
              dateStr += (dateObj.month + 1) + "-";
            }
            if(dateObj.date != undefined){
              dateStr += dateObj.date;
            }
          } 
        postObject['end_date'] = dateStr;
       }      
        //console.log(">>>POST: ", postObject);
        if((postObject['start_date'] != '' && postObject['start_date'] != undefined) && 
          (postObject['end_date'] != '' && postObject['end_date'] != undefined)){
          let stDate: Date = new Date(postObject['start_date'].toString());
          let endDate: Date = new Date(postObject['end_date'].toString()); 
          const daysDiff = Math.floor((<any>endDate - <any>stDate) / (1000*60*60*24));
          //console.log("Start Date and End Date not match...", stDate, " -- ", endDate, " :: ",daysDiff );
          if(daysDiff < 0){
            this._service.openMessageDialog('Please check Start Date and End Date properly.', "Validation Error");
            return false;
          }
        }
        //return;

        if(postObject){
          this.subscriptions.push(this._trainerService.searchAttendance((postObject))
          .subscribe(
             result => {
               let data: any = result;
                ////console.log("search results: ", result);
                if(data != undefined && typeof data === 'object' && data.records.length){
                    //console.log(">>> Search Data: ", data.records);
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;
                    this.trainerdata = data.records;
                    this.pageTotal = data.records.length;
                }
             }
            )
          )
        }

     }else{
      this._service.openMessageDialog('Please select search fields properly.', "Validation Error");
     }     
  }

  sortedList(data: any, sortBy: string, sortDir: boolean){
       //true - asc / false - desc
       ////console.log('>>>', data);
      if(data.length){
          if(sortBy === 'course'){
            //console.log(">>>Enter type...");
            this.curSortDir.course = !sortDir;
            if(this.curSortDir.course){
              let array = data.slice().sort((a, b) => (a.course > b.course) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type > b.training_course_type) ? 1 : -1);
            }
            if(!this.curSortDir.course){
              let array = data.slice().sort((a, b) => (a.course < b.course) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
            }
          }
          //By course_code
          if(sortBy == 'participants'){
            this.curSortDir.participants = !sortDir;
            //console.log(">>>Enter code...", data, " -- ", this.curSortDir.participants);
            if(this.curSortDir.participants){
              let array = data.slice().sort((a, b) => (a.participants > b.participants) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.participants){
              let array = data.slice().sort((a, b) => (a.participants < b.participants) ? 1 : -1)
              this.trainerdata = array;
            }
          }          
      }
  }

  //Load Record
  loadPageData(){
    
    this.getTrainerCourse.subscribe((state) => {
      //console.log(">>>State subscribed: ", state);      
      setTimeout(()=>{
        
        if(state.trainer != undefined && state.trainer.records != undefined){
          this.dataLoad = true;
          let dataRec: any=[];
          this.trainerdata = state.trainer.records;
          this.pageTotal = state.trainer.records.length;
          dataRec = state.trainer.records;          
          //console.log(">>>Load Data: ", this.trainerdata, " -- ", dataRec);
        }
        
      },100)      
    });
  }
}




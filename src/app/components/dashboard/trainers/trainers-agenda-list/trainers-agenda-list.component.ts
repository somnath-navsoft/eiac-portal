import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';

import { TrainerState, selectTrainerList} from '../../../../store/trainer.states';
import { Listing, ListingAgenda, Delete } from '../../../../store/actions/trainer.actions';
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
  selector: 'app-trainers-agenda-list',
  templateUrl: './trainers-agenda-list.component.html',
  styleUrls: ['./trainers-agenda-list.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  
})
export class TrainersAgendaListComponent implements OnInit, OnDestroy {
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
    this.store.dispatch(new ListingAgenda({}));
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  } 


  //Delete Course
  deleteCourse(id: number){
    if(id){
      this.subscriptions.push(this._trainerService.deleteTrainerCourseByID(id)
          .subscribe(
             result => {
               let data: any = result;
               //console.log("delte response:1 ", data);
                if(data != undefined && data.status != undefined && data.status == 200){
                  //console.log("delte response:2 ", data);
                  this._service.openFlashMessage(data.msg,'',5000);
                  this.modalService.dismissAll();
                  this.store.dispatch(new ListingAgenda({}));
                  this.loadPageData();
                }
             }
          )
      );
    }
  }

  openDelete(content, id: number){
    //console.log(">>>delete ", id);
    if(id){
      //console.log("assign delete id: ", id);
      this.selectDeleteID = id;
    }
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //console.log("Closed: ", this.closeResult);
      
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // Modal Actions
  openView(content, id: number) {
    //console.log(">>> ", id);
    if(id){     
      this.subscriptions.push(this._trainerService.getTrainerCourseByID(id)
          .subscribe(
             result => {
               let data: any = result;
                if(data != undefined && data.records != undefined){
                  this.selectCourseData = data.records;
                }
             }
          )
      );
    }
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //console.log("Closed: ", this.closeResult);
      this.courseViewData['courseDuration'] = '';
      this.courseViewData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //console.log("Closed with ESC ");
      this.courseViewData['courseDuration'] = '';
      this.courseViewData['courseFees'] = '';
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //console.log("Closed with CLOSE ICON ");
      this.courseViewData['courseDuration'] = '';
      this.courseViewData['courseFees'] = '';
      return 'by clicking on a backdrop';
    } else {
      //console.log("Closed ",`with: ${reason}`);
      this.courseViewData['courseDuration'] = '';
      this.courseViewData['courseFees'] = '';
      return  `with: ${reason}`;
    }
  }
  ngOnDestroy() {
     ////console.log(">>>Component Destroying...");
     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit() {
    this.getTrainerCourse = this.store.select(selectTrainerList);
    this.curSortDir['course']                   = false;
    this.curSortDir['participants']             = false;

    this.selectCustomCourses.push({title: 'Custom Course', value: 'custom_course'})
    this.selectCustomCourses.push({title: 'Public Course', value: 'public_course'})

    this.agreementStatus.push({title: 'Pending', value: 'pending'})
    this.paymentStatus.push({title: 'Pending', value: 'pending'})

    //this.courseViewData['courseDuration'] = '';
    this.courseViewData['courseFees'] = '';
    this.courseViewData['courseID'] = 0;

    //Get params
    


    this.loadPageData();
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
  }

  setStartDate(event: any){
    //console.log("@Get Date: ", event, " -- ", this.selectStartDate);
    let dateObj = event._i;
    let dateStr = ''
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
    if(dateStr != ''){
      this.selectStartDate = dateStr;
    }
    //console.log("update start date: ", this.selectStartDate);
  }
  setEndDate(event: any){
    //console.log("@Get Date: ", event);
    let dateObj = event._i;
    let dateStr = ''
    if(dateObj){
      if(dateObj.year != undefined){
        dateStr = dateObj.year + "-";
      }
      if(dateObj.month != undefined){
        dateStr += dateObj.month + "-";
      }
      if(dateObj.date != undefined){
        dateStr += dateObj.date;
      }
    }
    if(dateStr != ''){
      this.selectEndDate = dateStr;
    }
    //console.log("update start date: ", this.selectEndDate);
  }

  filterSearchReset(){
    //Reset serach
    this.selectStartDate = '';
    this.selectEndDate = '';
    this.selectCourse = '';

    this.loadPageData();
  }
  
  isValidSearch(){
    //console.log("valid: ", this.selectStartDate);
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
          this.subscriptions.push(this._trainerService.searchAgenda((postObject))
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
          //By Agreement Status
          // if(sortBy == 'agreement_status'){
          //   this.curSortDir.agreement_status = !sortDir;
          //   //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          //   if(this.curSortDir.agreement_status){
          //     let array = data.slice().sort((a, b) => (a.agreement_status > b.agreement_status) ? 1 : -1)
          //     this.trainerdata = array;
          //     //console.log("after:: ", array, " :: ", this.trainerdata);
          //   }
          //   if(!this.curSortDir.agreement_status){
          //     let array = data.slice().sort((a, b) => (a.agreement_status < b.agreement_status) ? 1 : -1)
          //     this.trainerdata = array;
          //   }
          // }
          // //By Payment Status
          // if(sortBy == 'agreement_status'){
          //   this.curSortDir.payment_status = !sortDir;
          //   //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
          //   if(this.curSortDir.payment_status){
          //     let array = data.slice().sort((a, b) => (a.payment_status > b.payment_status) ? 1 : -1)
          //     this.trainerdata = array;
          //     //console.log("after:: ", array, " :: ", this.trainerdata);
          //   }
          //   if(!this.curSortDir.payment_status){
          //     let array = data.slice().sort((a, b) => (a.payment_status < b.payment_status) ? 1 : -1)
          //     this.trainerdata = array;
          //   }
          // }          
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




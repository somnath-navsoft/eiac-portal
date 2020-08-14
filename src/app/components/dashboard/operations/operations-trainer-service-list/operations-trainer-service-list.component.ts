/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operations-trainer-service-list',
  templateUrl: './operations-trainer-service-list.component.html',
  styleUrls: ['./operations-trainer-service-list.component.scss']
})
export class OperationsTrainerServiceListComponent implements OnInit {

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
import { Listing, Delete } from '../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../models/trainer';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';

@Component({
  selector: 'app-operations-trainer-service-list',
  templateUrl: './operations-trainer-service-list.component.html',
  styleUrls: ['./operations-trainer-service-list.component.scss'],
  providers: [CustomModalComponent]
})
export class OperationsTrainerServiceListComponent implements OnInit, OnDestroy {
  getTrainerCourse: Observable<any>; 
  trainerdata: any[] = [];
  trainerTempdata: any;
  //Observable subscription
  subscriptions: Subscription[] = [];
  modalOptions:NgbModalOptions;

  //Add pagination
  paginationConfig: any;
  pageLimit: number = 10;
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
  
  closeResult: string;
  voucherSentData: any = {};
  selectCourseData: any = [];
  courseViewData: any = {};
  selectDeleteID: number = 0;

  deleteConfirm: boolean = false;

  constructor(private store: Store<TrainerState>, private _service: AppService, private _constant: Constants,
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent) { 
    this.store.dispatch(new Listing({}));
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
                  //this.modalService.dismissAll();
                  this._customModal.closeDialog();
                  this.store.dispatch(new Listing({}));
                  this.loadPageData();
                }
             }
          )
      );
    }
  }

  openDelete(id: number){
    //console.log(">>>delete ", id);
    if(id){
      console.log("assign delete id: ", id);
      this.selectDeleteID = id;
      this.deleteConfirm = true;
    }

    // this.modalService.open(content, this.modalOptions).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    //   //console.log("Closed: ", this.closeResult);
      
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  //Open View Action
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
             },
             error => {
              if(error != undefined && typeof error === 'object'){
               this.modalService.dismissAll();
              }               
             //console.log("@@@@ ServerError:   ", error);
            },
             () =>{
              this.modalService.open(content, this.modalOptions).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                //console.log("Closed: ", this.closeResult);
                this.courseViewData['courseDuration'] = '';
                this.courseViewData['courseFees'] = '';
              }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              });
             },
             
          )
      );
    }
    
  }

  // Modal Actions
  open(content, id: number) {
    //console.log(">>> ", id);
    if(id){
      this.voucherSentData['courseID'] = id;
      
      this.subscriptions.push(this._trainerService.getTrainerCourseByID(id)
          .subscribe(
             result => {
               let data: any = result;
                if(data != undefined && data.records != undefined){
                  this.selectCourseData = data.records;
                }
                //console.log(">>Get details: ", this.selectCourseData);
             }
          )
      );
    }
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //console.log("Closed: ", this.closeResult);
      this.voucherSentData['courseDuration'] = '';
      this.voucherSentData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //console.log("Closed with ESC ");
      this.voucherSentData['courseDuration'] = '';
      this.voucherSentData['courseFees'] = '';
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //console.log("Closed with CLOSE ICON ");
      this.voucherSentData['courseDuration'] = '';
      this.voucherSentData['courseFees'] = '';
      return 'by clicking on a backdrop';
    } else {
      //console.log("Closed ",`with: ${reason}`);
      this.voucherSentData['courseDuration'] = '';
      this.voucherSentData['courseFees'] = '';
      return  `with: ${reason}`;
    }
  }

  isValidVoucher(){
    //console.log("Check: ",this.voucherSentData.courseDuration ," -- ", this.voucherSentData.courseFees);
    if((this.voucherSentData.courseDuration === '' || this.voucherSentData.courseDuration === null) 
        || (this.voucherSentData.courseFees === '' || this.voucherSentData.courseFees === null)){
        return false;
    }
    return true;
  }

  voucherSentSubmit(theForm){
     //console.log("Valid/Invalid: ", this.isValidVoucher());
     let postObject: any = {};
     if(this.isValidVoucher()){
        //console.log(">>call to API") 
        if(postObject){
          postObject['course_id']         = this.voucherSentData.courseID;
          postObject['training_days']     = this.voucherSentData.courseDuration;
          postObject['fees_per_trainee']  = this.voucherSentData.courseFees;
          //console.log("voucher sent: ", postObject);
          this.subscriptions.push(this._trainerService.courseVoucherSave((postObject))
          .subscribe(
             result => {
               let data: any = result;
                //console.log("submit voucher: ", data);
                if(data != undefined && typeof data === 'object'){
                    //this.pageCurrentNumber = 1;
                    this._service.openFlashMessage('Voucher Sent Successfully','',5000);
                    this.modalService.dismissAll();
                    this.dataLoad = true;
                    //this.trainerdata = data.records;
                    //this.pageTotal = data.records.length;
                }
             }
            )
          )
        }

     }else{
       //console.log('error message...');
      this._service.openMessageDialog('Please enter required fields properly.', "Validation Error");
     }
  }


  ngOnDestroy() {
     ////console.log(">>>Component Destroying...");
     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit() {
    this.getTrainerCourse = this.store.select(selectTrainerList);
    this.curSortDir['training_course_type']   = false;
    this.curSortDir['course_code']            = false;
    this.curSortDir['agreement_status']       = false;
    this.curSortDir['payment_status']         = false;

    this.selectCustomCourses.push({title: 'Custom Course', value: 'custom_course'})
    this.selectCustomCourses.push({title: 'Public Course', value: 'public_course'})

    this.agreementStatus.push({title: 'Pending', value: 'pending'})
    this.agreementStatus.push({title: 'Accepted', value: 'accepted'})
    this.paymentStatus.push({title: 'Pending', value: 'pending'})

    this.voucherSentData['courseDuration'] = '';
    this.voucherSentData['courseFees'] = '';
    this.voucherSentData['courseID'] = 0;

    this.loadPageData();
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
  }

  filterSearchReset(){
    //Reset serach
    this.selectCode = '';
    this.selectFees = '';
    this.selectAgreementStatus = '';
    this.selectPaymentStatus = '';
    this.selectCustomCourse = '';

    this.loadPageData();
  }
  
  isValidSearch(){
    if(this.selectCode === '' && this.selectFees === '' && this.selectAgreementStatus === '' && 
        this.selectPaymentStatus === '' && this.selectCustomCourse === ''){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
     let postObject: any = {};
     //console.log("Search click....");
     if(this.isValidSearch()){
       if(this.selectCode != ''){
        postObject['course_code'] = this.selectCode;
       }
       if(this.selectFees != '' && this.selectFees != null){
        postObject['fees_per_trainee'] = this.selectFees;
       }
       if(this.selectAgreementStatus != ''){
        postObject['agreement_status'] = this.selectAgreementStatus;
       }
       if(this.selectPaymentStatus != ''){
        postObject['payment_status'] = this.selectPaymentStatus;
       }
       if(this.selectCustomCourse != ''){
        postObject['training_course_type'] = this.selectCustomCourse;
       }
        //postObject['training_course_type'] = this.selectCustomCourse;
        //postObject['course_code'] = this.selectCode;
        //postObject['agreement_status'] = this.selectAgreementStatus;
        //postObject['payment_status'] = this.selectPaymentStatus;
        //postObject['fees_per_trainee'] = (this.selectFees == '') ? 0.00 : this.selectFees;
        
        //console.log(">>>POST: ", postObject);

        if(postObject){
          this.subscriptions.push(this._trainerService.searchCourse((postObject))
          .subscribe(
             result => {
               let data: any = result;
                ////console.log("search results: ", result);
                if(data != undefined && typeof data === 'object' && data.records.length){
                    //console.log(">>> Data: ", data.records);
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
          if(sortBy === 'training_course_type'){
            //console.log(">>>Enter type...");
            this.curSortDir.training_course_type = !sortDir;
            if(this.curSortDir.training_course_type){
              let array = data.slice().sort((a, b) => (a.training_course_type > b.training_course_type) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type > b.training_course_type) ? 1 : -1);
            }
            if(!this.curSortDir.training_course_type){
              let array = data.slice().sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
            }
          }
          //By course_code
          if(sortBy == 'course_code'){
            this.curSortDir.course_code = !sortDir;
            //console.log(">>>Enter code...", data, " -- ", this.curSortDir.course_code);
            if(this.curSortDir.course_code){
              let array = data.slice().sort((a, b) => (a.course_code > b.course_code) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.course_code){
              let array = data.slice().sort((a, b) => (a.course_code < b.course_code) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By Agreement Status
          if(sortBy == 'agreement_status'){
            this.curSortDir.agreement_status = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.agreement_status){
              let array = data.slice().sort((a, b) => (a.agreement_status > b.agreement_status) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.agreement_status){
              let array = data.slice().sort((a, b) => (a.agreement_status < b.agreement_status) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By Payment Status
          if(sortBy == 'payment_status'){
            this.curSortDir.payment_status = !sortDir;
            //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
            if(this.curSortDir.payment_status){
              let array = data.slice().sort((a, b) => (a.payment_status > b.payment_status) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.payment_status){
              let array = data.slice().sort((a, b) => (a.payment_status < b.payment_status) ? 1 : -1)
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
          dataRec = state.trainer.records;
          console.log(">>>Load Data: ", this.trainerdata, " -- ", dataRec);
        }
        
        if(state.trainer != undefined && state.trainer.records != undefined && state.trainer.records.length > 0){
          this.pageTotal = state.trainer.records.length;
        }
      },100)      
    });
  }
}



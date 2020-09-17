/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operations-accreditation-service-list',
  templateUrl: './operations-accreditation-service-list.component.html',
  styleUrls: ['./operations-accreditation-service-list.component.scss']
})
export class OperationsAccreditationServiceListComponent implements OnInit {

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
import { ListingAccredService, Delete,  } from '../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../models/trainer';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';

@Component({
  selector: 'app-operations-accreditation-service-list',
  templateUrl: './operations-accreditation-service-list.component.html',
  styleUrls: ['./operations-accreditation-service-list.component.scss'],
  providers: [CustomModalComponent, ToastrService, Overlay, OverlayContainer]
})
export class OperationsAccreditationServiceListComponent implements OnInit, OnDestroy {
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
  voucherFile:any = new FormData();
  paymentReceiptValidation: boolean = true;

  deleteConfirm: boolean = false;
  private store: Store<TrainerState>;
  constructor( private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent) { 
    //this.store.dispatch(new ListingAccredService({}));
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
                  //this.store.dispatch(new ListingAccredService({}));
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
      // this.subscriptions.push(this._trainerService.getTrainerCourseByID(id)
      //     .subscribe(
      //        result => {
      //          let data: any = result;
      //           if(data != undefined && data.records != undefined){
      //             this.selectCourseData = data.records;
      //           }
      //        },
      //        error => {
      //         if(error != undefined && typeof error === 'object'){
      //          this.modalService.dismissAll();
      //         }               
      //        //console.log("@@@@ ServerError:   ", error);
      //       },
      //        () =>{
      //         this.modalService.open(content, this.modalOptions).result.then((result) => {
      //           this.closeResult = `Closed with: ${result}`;
      //           //console.log("Closed: ", this.closeResult);
      //           this.courseViewData['courseDuration'] = '';
      //           this.courseViewData['courseFees'] = '';
      //         }, (reason) => {
      //           this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      //         });
      //        },
             
      //     )
      // );
    }
    
  }

  // Modal Actions
  open(content, id: number) {
    //console.log(">>> ", id);
    if(id){
      this.voucherSentData['accreditation'] = id;
      
      // this.subscriptions.push(this._trainerService.getTrainerCourseByID(id)
      //     .subscribe(
      //        result => {
      //          let data: any = result;
      //           if(data != undefined && data.records != undefined){
      //             this.selectCourseData = data.records;
      //           }
      //           //console.log(">>Get details: ", this.selectCourseData);
      //        }
      //     )
      // );
    }
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //console.log("Closed: ", this.closeResult);
      //this.voucherSentData['courseDuration'] = '';
      //this.voucherSentData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //console.log("Closed with ESC ");
      //this.voucherSentData['courseDuration'] = '';
      //this.voucherSentData['courseFees'] = '';
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //console.log("Closed with CLOSE ICON ");
      //this.voucherSentData['courseDuration'] = '';
      //this.voucherSentData['courseFees'] = '';
      return 'by clicking on a backdrop';
    } else {
      //console.log("Closed ",`with: ${reason}`);
      //this.voucherSentData['courseDuration'] = '';
      //this.voucherSentData['courseFees'] = '';
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
     console.log("Valid/Invalid: ", theForm.form, " -- ", this.voucherSentData);
     let postObject: any = {};

     if(theForm.form.valid){
        //console.log(">>call to API") 
        //if(postObject){
          //postObject['course_id']         = this.voucherSentData.courseID;
          //postObject['training_days']     = this.voucherSentData.courseDuration;
          //postObject['fees_per_trainee']  = this.voucherSentData.courseFees;
          //console.log("voucher sent: ", postObject);
          let dtFormat: string = '';;
          if(this.voucherSentData['voucher_date'] != undefined && 
          this.voucherSentData['voucher_date']._i != undefined){
            var dtData = this.voucherSentData['voucher_date']._i;
            var year = dtData.year;
            var month = dtData.month;
            var date = dtData.date;
            dtFormat = year + "-" + month + "-" + date;
          }
          if(dtFormat != ''){
            //this.voucherSentData['voucher_date'] = dtFormat;
          }
          //let dtData = this.step5Data.perlim_visit_select_date._i;
          //let year = dtData.year;
          //let month = dtData.month;
          //let date = dtData.date;         



          this.voucherFile.append('voucher_no',this.voucherSentData['voucher_no']);
          this.voucherFile.append('voucher_date',dtFormat);
          this.voucherFile.append('accreditation',this.voucherSentData['accreditation']);
          console.log(this.voucherFile, " -- ", this.voucherFile);

          this.subscriptions.push(this._trainerService.courseVoucherSave((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                console.log("submit voucher: ", data);
                if(data.status){
                  this.voucherFile = new FormData();
                  this.voucherSentData = {};
                  this.modalService.dismissAll();
                  this._toaster.success(data.msg,'');
                }else{
                  this._toaster.warning(data.msg,'');
                }
                // if(data != undefined && typeof data === 'object'){
                //     //this.pageCurrentNumber = 1;
                //     this._service.openFlashMessage('Voucher Sent Successfully','',5000);
                //     this.modalService.dismissAll();
                //     this.dataLoad = true;
                //     //this.trainerdata = data.records;
                //     //this.pageTotal = data.records.length;
                // }
             }
            )
          )
        //}

     }else{
       //console.log('error message...');
      //this._service.openMessageDialog('Please enter required fields properly.', "Validation Error");
      this._toaster.warning('Please Fill required field','Validation Error',{timeOut:5000});
     }
  }


  ngOnDestroy() {
     ////console.log(">>>Component Destroying...");
     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  validateFile(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf', 'PDF'];
    var ex_check = this._service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.paymentReceiptValidation = true;
      //if(type == undefined){
        this.voucherFile.append('voucher_invoice',fileEvent.target.files[0]);
      //}
    }else{
        this.paymentReceiptValidation = false;
        
    }
      // }if(type != undefined){
      //   console.log(">>>File: ", fileEvent.target.files[0]);
      //   this.step5Data.payment_receipt = fileEvent.target.files[0].name;
      //   this.step5Data.payment_receipt_file = fileEvent.target.files[0];
      //   this.step5DataBodyFormFile.append(type,fileEvent.target.files[0]);
      //   console.log(">>> data file: ", this.step5DataBodyFormFile);
      //   //this.step7DataBodyFormFile.append(type,fileEvent.target.files[0]);
      // }
      
    //   this.file_validation = true;
    //   if(type == undefined){
    //     this.tradeLicensedValidation = true;
    //   }
    //   if(type != undefined){
    //     this.paymentReceiptValidation = true;
    //   }
    //   return true;
    // }else{
    //   this.file_validation = false;
    //   if(type == undefined){
    //     this.tradeLicensedValidation = false;
    //   }if(type != undefined){
    //     this.paymentReceiptValidation = false;
    //   }
    // }
  }

  ngOnInit() {
    //this.getTrainerCourse = this.store.select(selectTrainerList);
    this.curSortDir['id']   = false;
    this.curSortDir['created_date']            = false;
    this.curSortDir['accr_status']       = false;
    this.curSortDir['form_meta']       = false;
    this.curSortDir['payment_status']         = false;
    this.curSortDir['applicant']         = false;

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
          if(sortBy === 'id'){
            //console.log(">>>Enter type...");
            this.curSortDir.id = !sortDir;
            if(this.curSortDir.id){
              let array = data.slice().sort((a, b) => (a.id > b.id) ? 1 : -1)
              this.trainerdata = array;
            }
            if(!this.curSortDir.id){
              let array = data.slice().sort((a, b) => (a.id < b.id) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
            }
          }
          //By created_date
          if(sortBy == 'created_date'){
            this.curSortDir.created_date = !sortDir;
            //console.log(">>>Enter code...", data, " -- ", this.curSortDir.course_code);
            if(this.curSortDir.created_date){
              let array = data.slice().sort((a, b) => (a.created_date > b.created_date) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.created_date){
              let array = data.slice().sort((a, b) => (a.created_date < b.created_date) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By accr_status
          if(sortBy == 'accr_status'){
            this.curSortDir.accr_status = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.accr_status){
              let array = data.slice().sort((a, b) => (a.accr_status > b.accr_status) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.accr_status){
              let array = data.slice().sort((a, b) => (a.accr_status < b.accr_status) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By accr_status
          if(sortBy == 'accr_status'){
            this.curSortDir.form_meta = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.form_meta){
              let array = data.slice().sort((a, b) => (a.form_meta > b.form_meta) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.form_meta){
              let array = data.slice().sort((a, b) => (a.form_meta < b.form_meta) ? 1 : -1)
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
          if(sortBy == 'applicant'){
            this.curSortDir.applicant = !sortDir;
            //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
            if(this.curSortDir.applicant){
              let array = data.slice().sort((a, b) => (a.applicant > b.applicant) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.applicant){
              let array = data.slice().sort((a, b) => (a.applicant < b.applicant) ? 1 : -1)
              this.trainerdata = array;
            }
          }        
      }
  }

  //Load Record
  loadPageData(){ 
    //let url = this._service.apiServerUrl + "/" + this._constant.API_ENDPOINT.trainerAccredServList; 
    
    //let url1 = 'https://dev-service.eiac.gov.ae/webservice/profile-service/?userType=cab_client&email=abhishek@navsoft.in';
    // console.log(">>API: ", url);
    // this._service.getwithoutData(url).subscribe(record => {
    //    console.log(">>> ", record);
    // },
    // error =>{
    //   console.log("error calling...", error);
    // },
    // ()=>{
    //   console.log("complete calling...");
    // }
    
    // );

    this.subscriptions.push(this._trainerService.getAccreditationServiceList()
          .subscribe(
            result => {
              let data: any = result;
              let dataRec: any=[];
              this.dataLoad = true;
              console.log('loading...', data.records);
              console.log(">>>List: ", data);
              this.trainerdata = data.records;
              dataRec = data.records;
              this.pageTotal = data.records.length;
            },
            ()=>{
              console.log('comp...');
            }
          )          
          )
    
    // this.getTrainerCourse.subscribe((state) => {
    //   //console.log(">>>State subscribed: ", state);      
    //   setTimeout(()=>{
        
    //     if(state.trainer != undefined && state.trainer.records != undefined){
    //       this.dataLoad = true;
    //       let dataRec: any=[];
    //       this.trainerdata = state.trainer.records;
    //       dataRec = state.trainer.records;
    //       console.log(">>>Load Data: ", this.trainerdata, " -- ", dataRec);
    //     }
        
    //     if(state.trainer != undefined && state.trainer.records != undefined && state.trainer.records.length > 0){
    //       this.pageTotal = state.trainer.records.length;
    //     }
    //   },100)      
    // });
  }
}




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
import { Observable, Subscription, forkJoin } from 'rxjs';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';

import { TrainerState, selectTrainerList} from '../../../../store/trainer.states';
import { ListingAccredService, Delete,  } from '../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../models/trainer';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

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
  // paymentStatus: any[] =[];
  
  closeResult: string;
  voucherSentData: any = {};
  selectCourseData: any = [];
  courseViewData: any = {};
  selectDeleteID: number = 0;
  voucherFile:any = new FormData();
  paymentReceiptValidation: boolean = true;
  loader:boolean = true;
  exportAs:any = {};

  deleteConfirm: boolean = false;
  private store: Store<TrainerState>;
  exportAsConfig: ExportAsConfig;
  paymentStatus:any;

  selectAccrType: any =[];
  applicationNo: string = '' || null;
  paymentStatusValue: string = '' || null;
  selectAccrTypeValue: string = '' || null;
  show_data:any;
  searchValue:any;
  searchText:any;
  selectStatus:any = [];
  allSchemeData: any[] = [];
  allSchemeREcord: any[] = [];
  getCountryLists:any = [];

  constructor( private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent, private exportAsService: ExportAsService) { 
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

  serviceStatus(index,id){
    this.loader = false;

    this.subscriptions.push(this._trainerService.updateStatus(id)
      .subscribe(
        result => {
          this.loader = true;
          // console.log(result,'result');
          this.trainerdata[index].accr_status = 'complete';
          this._toaster.success("Payment Completed Successfully",'');
      })
    );
    
    // this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.accrStatus+id)
    // .subscribe(
    //   res => {
    //     this.trainerdata[index].accr_status = 'Complete';
    //   });

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
    //this.voucherSentData = {};
    if(id){
      console.log(">>ID: ", id);
      this.voucherSentData['accreditation'] = id;
    }
    this.paymentReceiptValidation = null;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  voucherSentSubmit(theForm){ 
     
     let postObject: any = {};
     let is_valid: boolean = false;
     if(this.voucherSentData['voucher_no'] != undefined && this.voucherSentData['amount'] != undefined &&
      this.voucherSentData['voucher_date'] != undefined){
        is_valid = true;
      }
      //console.log("Valid/Invalid: ", theForm.form.valid, " -- "," --", is_valid, " --", this.voucherSentData);

    //return false;
     if(is_valid == true && this.paymentReceiptValidation === true){ 
          let dtFormat: string = '';;
          if(this.voucherSentData['voucher_date'] != undefined && 
          this.voucherSentData['voucher_date']._i != undefined){
            var dtData = this.voucherSentData['voucher_date']._i;
            var year = dtData.year;
            var month = dtData.month + 1;
            var date = dtData.date;
            dtFormat = year + "-" + month + "-" + date;
          }

          //console.log(">>> Date: ", (dtFormat), " -- ", this.voucherSentData['voucher_date'], " -- ", this.voucherSentData['voucher_date']._i);
          //console.log("@accred ID: ", this.voucherSentData['accreditation'])
          this.voucherFile.append('voucher_no',this.voucherSentData['voucher_no']);
          this.voucherFile.append('amount',this.voucherSentData['amount']);
          this.voucherFile.append('voucher_date',dtFormat);
          this.voucherFile.append('accreditation',this.voucherSentData['accreditation']);

          this.subscriptions.push(this._trainerService.courseVoucherSave((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                if(data.status){
                  this.voucherFile = new FormData();
                  this.voucherSentData = {};
                  this.modalService.dismissAll();
                  this._toaster.success("Invoice Uploaded Successfully",'Upload');
                }else{
                  this._toaster.warning(data.msg,'');
                }
             }
            )
          )

     }else if(theForm.form.valid && (this.paymentReceiptValidation == false || this.paymentReceiptValidation == null)){
      this._toaster.warning('Please Upload Valid Files','Upload Error',{timeOut:5000});
     }
     else{
      this._toaster.warning('Please Fill required fields','Validation Error',{timeOut:5000});
     }
  }


  ngOnDestroy() {
     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  validateFile(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf', 'PDF'];
    var ex_check = this._service.isInArray(file_exe,ex_type);
    if(ex_check){
        this.paymentReceiptValidation = true;
        this.voucherFile.append('voucher_invoice',fileEvent.target.files[0]);
    }else{
        this.paymentReceiptValidation = false;
        
    }
  }

  searchableColumn() {
    this.searchText = '';
    var myClasses = document.querySelectorAll('.field_show'),
          i = 0,
          l = myClasses.length;
       for (i; i < l; i++) {
          let elem: any = myClasses[i]
          elem.style.display = 'none';
      }
    if(this.searchValue == 'cab_name') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'id') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'form_meta') {
      document.getElementById('accreditation_type').style.display = 'block';
    }else if(this.searchValue == 'accr_status') {
      document.getElementById('status').style.display = 'block';
    }else if(this.searchValue == 'cab_code') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'criteria') {
      document.getElementById('criteria').style.display = 'block';
    }else if(this.searchValue == 'country') {
      document.getElementById('country').style.display = 'block';
    }
  }

  ngOnInit() {
    //this.getTrainerCourse = this.store.select(selectTrainerList);
    this.curSortDir['id']                 = false;
    this.curSortDir['created_date']       = false;
    this.curSortDir['accr_status']        = false;
    this.curSortDir['prelim_status']      = false;
    this.curSortDir['form_meta']          = false;
    this.curSortDir['payment_status']     = false;
    this.curSortDir['applicant']          = false;

    /*
     <span *ngIf="item.form_meta == 'testing_calibration'">Testing Calibration</span>
    <span *ngIf="item.form_meta == 'inspection_body'">Inspection Bodies</span>
    <span *ngIf="item.form_meta == 'health_care'">Health Care</span>
    <span *ngIf="item.form_meta == 'certification_bodies'">Certification Bodies</span>
    <span *ngIf="item.form_meta == 'pt_providers'">Proficiency Testing Providers</span>
    <span *ngIf="item.form_meta == 'halal_conformity_bodies'">Halal Confirmity Bodies</span>

    */

    //Assign Search Type
    this.selectAccrType = [ 
    {title: 'Inspection Bodies', value:'inspection_body'},
    {title: 'Certification Bodies', value:'certification_bodies'},
    {title: 'Testing Calibration', value:'testing_calibration'},
    {title: 'Health Care', value:'health_care'},
    {title: 'Halal Conformity Bodies', value:'halal_conformity_bodies'},
    {title: 'Proficiency Testing Providers', value:'pt_providers'}      
    ];

    //Assign Search Type
    this.selectStatus =  [
      {title: 'Payment Pending', value:'pending'},
      {title: 'Under Process', value:'application_process'},
      {title: 'Under Review', value:'under_review'},
      {title: 'Complete', value:'complete'},
      {title: 'Draft', value:'draft'}
    ];
	
    // this.selectPaymentStatusType = [ 
    //   {title: 'Paid', value:'paid'},
    //   {title: 'Unpaid', value:'unpaid'}     
    //   ];
    
    this.loadPageData();
    //this.selectCustomCourses = [{'value':'Inspection Bodies'},{'value':'Certification Bodies'},{'value':'Testing Calibration'},{'value':'Health Care'},{'value':'Proficiency Testing Providers'},{'value':'Halal Confirmity Bodies'}];

    this.loadCriteriaScheme();
    this.loadCountryStateCity();
  }

  loadCountryStateCity = async() => {
    let countryList =  this._service.getCountry();
    await countryList.subscribe(record => {
      // ////console.log(record,'record');
      this.getCountryLists = record['countries'];
    });
  }

  loadCriteriaScheme = async () => {
      let promiseIB: any = this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.inspection_form_basic_data);
      let promiseTC: any = this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.testing_cal_form_basic_data);
      let promiseCB: any = this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.certificationBodies);
      let promiseHP: any = this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.healthcare_form_basic_data);
      let promiseHCAB: any = this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.halal_conformity_form_management);
      let promisePTP: any = this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.pt_provider);

      forkJoin([promiseIB, promiseTC, promiseCB, promiseHP, promiseHCAB, promisePTP]).subscribe(results => {
        let getData: any = results;
        if(getData != undefined && typeof getData == 'object' && getData.length > 0){
            getData.forEach(rec => {
              if(rec.data != undefined && rec.data.criteriaList != undefined && rec.data.criteriaList.length > 0){
                  this.allSchemeREcord.push(rec.data.criteriaList);
              }
            })
        }
        //console.log("@Multiple Results: ", getData, " -- ", this.allSchemeREcord);
        if(this.allSchemeREcord.length  > 0){
            this.allSchemeREcord.forEach(item => {
                //console.log("#", item);
                if(typeof item == 'object' && item.length > 0){
                    let getItem: any = item;
                    getItem.forEach(rec => {
                      if(rec.code != undefined && rec.code != ''){
                        this.allSchemeData.push({title: rec.service, value: rec.code})
                      }
                    })
                }
            })
        }
        // console.log("@Scheme record: ", this.allSchemeData);
      });
  }
  exportFile() {
    // console.log(this.exportAs);
    this.exportAsConfig = {
      type: 'csv', // the type you want to download
      elementIdOrContent: 'accreditation-service-export', // the id of html/table element
    }
    // let fileName: string = (this.exportAs.toString() == 'xls') ? 'accreditation-service-report' : 
    this.exportAsService.save(this.exportAsConfig, 'report').subscribe(() => {
      // save started
    });
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
    // console.log(this.advSearch);
    this.filterSearchReset();
  }

  filterSearchReset(type?: string){
    this.searchValue = {};
    this.searchText = '';
    var myClasses = document.querySelectorAll('.field_show'),
          i = 0,
          l = myClasses.length;
       for (i; i < l; i++) {
          let elem: any = myClasses[i]
          elem.style.display = 'none';
      }
    document.getElementById('applicant').style.display = 'block';
    //Reset serach
    this.applicationNo = '' || null;
    this.selectAccrTypeValue = '' || null;
    this.paymentStatusValue = '' || null;
    this.show_data = this.pageLimit = 10;
    this.exportAs = null;
    if(type != undefined && type != ''){
      this.loadPageData();
    }
  }
  
  isValidSearch(){
    if((this.searchValue == '' || this.searchValue == null) && (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
     let postObject: any = new FormData();
     //console.log("Search click....");
     if(this.isValidSearch()){
      //  if(this.applicationNo != '' && this.applicationNo != null){
      //   postObject.append('id', this.applicationNo);
      //  }
      //  if(this.selectAccrTypeValue != '' && this.selectAccrTypeValue != null){
      //   postObject.append('form_meta', this.selectAccrTypeValue);
      //  }
      var appendKey = this.searchValue;
       if(this.searchValue != '' && this.searchValue != null && this.searchText != '' && this.searchText != null){
        postObject.append(appendKey, this.searchText);
       }
        
        console.log(">>>POST: ", postObject); 

        if(postObject){
          this.loader = false;
          this.subscriptions.push(this._trainerService.searchAccrServList((postObject))
          .subscribe(
             result => {
               this.loader = true;
               let data: any = result;
                ////console.log("search results: ", result);
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    // console.log(">>> Data: ", data.records);
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;

                    data.records.forEach((res,key) => {
                      data.records[key]['payment_status'] = res.payment_status == '' || res.payment_status == null || res.payment_status == 'pending' ? 'pending' : 'paid';
                    });
                    this.trainerdata = data.records;
                    this.pageTotal = data.records.length;
                }
                if(data != undefined && typeof data === 'object' && data.records.length == 0){
                  this.trainerdata = data.records;
                  this.pageTotal = data.records.length;
                }
             }
            )
          )
        }

     }else{
      //this._service.openMessageDialog('Please select search fields properly.', "Validation Error");
      this._toaster.warning("Please select search fields properly",'')
     }     
  }

  getRouteId(routeId) {
    // sessionStorage.setItem('routeId',routeId);
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
              let array = data.slice().sort((a, b) => (a.created > b.created) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.created_date){
              let array = data.slice().sort((a, b) => (a.created < b.created) ? 1 : -1)
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
          //By Prelim Status
          if(sortBy == 'prelim_visit'){
            this.curSortDir.prelim_visit = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.prelim_visit){
              let array = data.slice().sort((a, b) => (a.is_prelim_visit > b.is_prelim_visit) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.prelim_visit){
              let array = data.slice().sort((a, b) => (a.is_prelim_visit < b.is_prelim_visit) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By form_meta
          if(sortBy == 'form_meta'){
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
          if(sortBy == 'cab_name'){
            this.curSortDir.cab_name = !sortDir;
            if(this.curSortDir.cab_name){
              let array = data.slice().sort((a, b) => (a.cabDetails.cab_name > b.cabDetails.cab_name) ? 1 : -1)
              this.trainerdata = array;
            }
            if(!this.curSortDir.cab_name){
              let array = data.slice().sort((a, b) => (a.cabDetails.cab_name < b.cabDetails.cab_name) ? 1 : -1)
              this.trainerdata = array;
            }
          }

          if(sortBy == 'cab_code'){
            this.curSortDir.cab_code = !sortDir;
            if(this.curSortDir.cab_code){
              let array = data.slice().sort((a, b) => (a.cabDetails.cab_code > b.cabDetails.cab_code) ? 1 : -1)
              this.trainerdata = array;
            }
            if(!this.curSortDir.cab_code){
              let array = data.slice().sort((a, b) => (a.cabDetails.cab_code < b.cabDetails.cab_code) ? 1 : -1)
              this.trainerdata = array;
            }
          }

          if(sortBy == 'criteria_request'){
            this.curSortDir.criteria_request = !sortDir;
            if(this.curSortDir.criteria_request){
              let array = data.slice().sort((a, b) => (a.criteria_request > b.criteria_request) ? 1 : -1)
              this.trainerdata = array;
            }
            if(!this.curSortDir.criteria_request){
              let array = data.slice().sort((a, b) => (a.criteria_request < b.criteria_request) ? 1 : -1)
              this.trainerdata = array;
            }
          }

          if(sortBy == 'country'){
            this.curSortDir.country = !sortDir;
            if(this.curSortDir.country){
              let array = data.slice().sort((a, b) => (a.country > b.country) ? 1 : -1)
              this.trainerdata = array;
            }
            if(!this.curSortDir.country){
              let array = data.slice().sort((a, b) => (a.country < b.country) ? 1 : -1)
              this.trainerdata = array;
            }
          }

      }
  }

  showData() {
    //this.pageLimit = this.show_data;
    // this.loadPageData();
    this.pageLimit = this.show_data;
    this.pageCurrentNumber = 1;
    this.trainerdata.slice(0, this.show_data);
  }

  paginationReset() {
    this.exportAs = {};
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
    this.loader = false;
    this.subscriptions.push(this._trainerService.getAccreditationServiceList()
          .subscribe(
            result => {
              this.loader = true;
              let data: any = result;
              let dataRec: any=[];
              this.dataLoad = true;
              // console.log('loading...', data.records);
              data.records.forEach((res,key) => {
                data.records[key]['payment_status'] = res.payment_status == '' || res.payment_status == null || res.payment_status == 'pending' ? 'pending' : 'paid';
              });
              // console.log(">>>List: ", data);
              this.trainerdata = data.records;
              dataRec = data.records;
              this.pageTotal = data.records.length;
            },
            ()=>{
              // console.log('comp...');
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





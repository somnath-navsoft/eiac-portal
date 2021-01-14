import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-operations-registration-service-list', 
  templateUrl: './operations-registration-service-list.component.html',
  styleUrls: ['./operations-registration-service-list.component.scss'],
  providers: [CustomModalComponent, ToastrService, Overlay, OverlayContainer]
})
export class OperationsRegistrationServiceListComponent implements OnInit { 

  //Observable subscription
  subscriptions: Subscription[] = [];
  modalOptions:NgbModalOptions;
  voucherSentData: any = {};
  voucherFile:any = new FormData();
  paymentReceiptValidation: boolean = true;
  loader:boolean = true;
  closeResult: string;
  trainerdata: any[] = [];
  trainerTempdata: any;

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
  paymentStatus:any;
  selectCustomCourse:any;
  selectCustomCourses:any[] = [];
  exportAsConfig: ExportAsConfig; 
  exportAs:any = {};

  selectRegType: any[] =[];

  applicationNo: string = '' || null;
  selectRegTypeValue: string = '' || null;
  paymentStatusValue: string = '' || null;
  show_data:any;
  searchValue:any;
  searchText:any;
  selectAccrType:any = [];
  selectStatus:any = [];
  getCountryLists:any = [];

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private modalService: NgbModal, private exportAsService: ExportAsService) { 
      this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop'
      }
    }

  ngOnInit() {
    this.loadPageData();
    this.curSortDir['id']                 = false;
    this.curSortDir['created_date']       = false;
    this.curSortDir['accr_status']        = false;
    this.curSortDir['prelim_status']      = false;
    this.curSortDir['form_meta']          = false;
    this.curSortDir['payment_status']     = false;
    this.curSortDir['applicant']          = false;
    this.selectRegType = [{title:'No Objection Certificate', value: 'no_objection'},{title:'Work Activity Permit', value:'work_activity'}];
    //this.selectCustomCourses = [{title:'No Objection Certificate', value: 'no_objection_certificate'},{title:'Work Activity Permit', value:'work_activity'}];

    //Assign Search Type
    this.selectAccrType = [ 
      {title: 'No Objection Certificate', value:'no_objection'},
      {title: 'Work Activity Permit', value:'work_activity'},   
      ];
  
    //Assign Search Type
    this.selectStatus =  [
      {title: 'Payment Pending', value:'pending'},
      {title: 'Under Process', value:'under_process'},
      {title: 'Under Review', value:'under_review'},
      {title: 'Complete', value:'complete'},
      {title: 'Draft', value:'draft'}
    ];
      this.loadCountryStateCity();
  }

  loadCountryStateCity = async() => {
    let countryList =  this._service.getCountry();
    await countryList.subscribe(record => {
      // ////console.log(record,'record');
      this.getCountryLists = record['countries'];
    });
  }

  filterSearchReset(type?: string){
    //Reset serach
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

    this.applicationNo = '' || null;
    this.selectRegTypeValue = '' || null;
    this.paymentStatusValue = '' || null;
    this.show_data = this.pageLimit = 10;
    this.exportAs = null;
    if(type != undefined && type != ''){
      this.loadPageData();
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
    }else if(this.searchValue == 'cab_code') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'country') {
      document.getElementById('country').style.display = 'block';
    }else if(this.searchValue == 'form_meta') {
      document.getElementById('accreditation_type').style.display = 'block';
    }else if(this.searchValue == 'application_status') {
      document.getElementById('application_status').style.display = 'block';
    }
  }

  isValidSearch(){
    if((this.searchValue == '' || this.searchValue == null) || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
     let postObject: any = new FormData();
     //console.log("Search click....");
     if(this.isValidSearch()){
        var appendKey = this.searchValue;
        if(this.searchValue != '' && this.searchValue != null && this.searchText != '' && this.searchText != null){
        postObject.append(appendKey, this.searchText);
        }
        

        if(postObject){
          this.loader = false;
          this.subscriptions.push(this._trainerService.searchRegServList((postObject))
          .subscribe(
             result => {
               let data: any = result;
               this.loader = true;
                ////console.log("search results: ", result);
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    console.log(">>> Data: ", data.records);
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;
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

  loadPageData(){
    this.loader = false;
    this.subscriptions.push(this._trainerService.getRegistratationServiceList()
      .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          let dataRec: any=[];
          this.dataLoad = true;
          console.log('loading...', data.records);
          // console.log(">>>List: ", data);
          this.trainerdata = data.records;
          dataRec = data.records;
          this.pageTotal = data.records.length;
        },
        ()=>{
          
        }
      )          
    )
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

       if(sortBy == 'application_status'){
        this.curSortDir.application_status = !sortDir;
        if(this.curSortDir.application_status){
          let array = data.slice().sort((a, b) => (a.application_status > b.application_status) ? 1 : -1)
          this.trainerdata = array;
        }
        if(!this.curSortDir.application_status){
          let array = data.slice().sort((a, b) => (a.application_status < b.application_status) ? 1 : -1)
          this.trainerdata = array;
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
       if(sortBy == 'prelim_status'){
         this.curSortDir.prelim_status = !sortDir;
         //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
         if(this.curSortDir.prelim_status){
           let array = data.slice().sort((a, b) => (a.prelim_status > b.prelim_status) ? 1 : -1)
           this.trainerdata = array;
           //console.log("after:: ", array, " :: ", this.trainerdata);
         }
         if(!this.curSortDir.prelim_status){
           let array = data.slice().sort((a, b) => (a.prelim_status < b.prelim_status) ? 1 : -1)
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

  serviceStatus(index,id){
    var changableIndex = index;
    var currIndex = 10 * (this.pageCurrentNumber -1) + parseInt(changableIndex);
    this.loader = false;

    this.subscriptions.push(this._trainerService.updateStatusReg(id)
      .subscribe(
        result => {
          this.loader = true;
          // console.log(result,'result');
          this.trainerdata[currIndex].application_status = 'complete';
          this._toaster.success("Payment Completed Successfully",'');
      })
    );

  }

  open(content, id: number,index: number) {
    //this.voucherSentData = {};
    if(id){
      console.log(">>ID: ", id);
      this.voucherSentData['accreditation'] = id;
    }
    this.voucherSentData['index'] = index;
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
          // this.voucherFile.append('accreditation',this.voucherSentData['accreditation']);
          this.voucherFile.append('registration',this.voucherSentData['accreditation']);

          this.subscriptions.push(this._trainerService.registrationVoucherSave((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                if(data.status){
                  var currIndex = 10 * (this.pageCurrentNumber -1) + parseInt(this.voucherSentData['index']);
                  this.trainerdata[currIndex].application_status = 'payment_pending';
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
  }
}
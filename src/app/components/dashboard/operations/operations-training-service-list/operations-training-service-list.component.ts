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
  selector: 'app-operations-training-service-list',
  templateUrl: './operations-training-service-list.component.html',
  styleUrls: ['./operations-training-service-list.component.scss'],
  providers: [CustomModalComponent, ToastrService, Overlay, OverlayContainer]
})
export class OperationsTrainingServiceListComponent implements OnInit {

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
  public minDate;
  voucherIndex:any;
  exportAsConfig: ExportAsConfig;
  exportAs:any;
  advSearch: boolean = false;

  selectTrainingType: any =[];
  selectCustomCourses:any[] = [];

  
  applicationNo: string = '' || null;
  selectTrainingTypeValue: string = '' || null;
  paymentStatusValue: string = '' || null;
  show_data:any;
  searchValue:any;
  searchText:any;
  selectAccrType:any = [];
  selectStatus:any = [];

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
    this.curSortDir['training_form_type']          = false;
    this.curSortDir['payment_status']     = false;
    this.curSortDir['applicant']          = false;
    // var cdate = new Date();
    this.minDate = new Date();
    this.selectTrainingType = [{'title':'In Premise', value: 'inprimise'},{'title':'Public Training', value: 'public_training'}];
    //this.selectCustomCourses = [{'value':'In Premise'},{'value':'Public Training'}];
    
    //Assign Search Type
    this.selectAccrType = [ 
      {title: 'In Premise', value:'inprimise'},
      {title: 'Public Training', value:'public_training'},
      ];
  
    //Assign Search Type
    this.selectStatus =  [
      {title: 'Payment Pending', value:'payment_pending'},
      {title: 'Under Process', value:'under_process'},
      {title: 'Under Review', value:'under_review'},
      {title: 'Complete', value:'complete'},
      {title: 'Draft', value:'draft'}
    ];
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
    this.selectTrainingTypeValue = '' || null;
    this.paymentStatusValue = '' || null;
    this.show_data = this.pageLimit = 10;
    this.exportAs = null;
    if(type != undefined && type != ''){
      this.loadPageData();
    }
  }
  
  isValidSearch(){
    if((this.searchValue == '' || this.searchValue == null) || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
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
    if(this.searchValue == 'application_number') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'cab_code') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'id') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'training_form_type') {
      document.getElementById('accreditation_type').style.display = 'block';
    }else if(this.searchValue == 'application_status') {
      document.getElementById('status').style.display = 'block';
    }else if(this.searchValue == 'course_name') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'capacity') {
      document.getElementById('applicant').style.display = 'block';
    }
  }

  filterSearchSubmit(){
     let postObject: any = new FormData();
     //console.log("Search click....");
    //  let postData: any = new FormData();
     if(this.isValidSearch()){
        var appendKey = this.searchValue;
        if(this.searchValue != '' && this.searchValue != null && this.searchText != '' && this.searchText != null){
        postObject.append(appendKey, this.searchText);
        }
        
        console.log(">>>POST: ", postObject); 

        if(postObject){
          this.loader = false;
          this.subscriptions.push(this._trainerService.searchTrainingServList((postObject))
          .subscribe(
             result => {
               this.loader = true;
               let data: any = result;
                ////console.log("search results: ", result);
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    console.log(">>> Data: ", data.records);
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;
                    
                    data.records.forEach((item,key) => {
                      if(item.courseEventDetails != undefined && item.courseEventDetails != 'NA'){
                        data.records[key]['course_name']      = item.courseEventDetails.course_details.course;
                        data.records[key]['course_capacity']  = item.courseEventDetails['event_details'][0].capacity != null ? item.courseEventDetails['event_details'][0].capacity : 'N/A';
                      }else{
                        data.records[key]['course_name'] = '';
                        data.records[key]['course_capacity'] = '';
                      }
                  })
                  
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

  setexDate(date, index){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));   
  }

  loadPageData(){
    this.loader = false;
    this.subscriptions.push(this._trainerService.getTrainingServiceList()
      .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          let dataRec: any=[];
          this.dataLoad = true;
          console.log('loading...', data.records);
          // console.log(">>>List: ", data);
          data.records.forEach((item,key) => {
            if(item.courseEventDetails != undefined && item.courseEventDetails != 'NA'){
              data.records[key]['course_name']      = item.courseEventDetails.course_details.course;
              data.records[key]['course_capacity']  = item.courseEventDetails['event_details'][0].capacity != null ? item.courseEventDetails['event_details'][0].capacity : 'N/A';
            }else{
              data.records[key]['course_name'] = '';
              data.records[key]['course_capacity'] = '';
            }
        })
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
       //By training_form_type
       if(sortBy == 'training_form_type'){
         this.curSortDir.training_form_type = !sortDir;
         //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
         if(this.curSortDir.training_form_type){
           let array = data.slice().sort((a, b) => (a.training_form_type > b.training_form_type) ? 1 : -1)
           this.trainerdata = array;
           //console.log("after:: ", array, " :: ", this.trainerdata);
         }
         if(!this.curSortDir.training_form_type){
           let array = data.slice().sort((a, b) => (a.training_form_type < b.training_form_type) ? 1 : -1)
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
          let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_name > b.cabDetails[0].cab_name) ? 1 : -1)
          this.trainerdata = array;
        }
        if(!this.curSortDir.cab_name){
          let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_name < b.cabDetails[0].cab_name) ? 1 : -1)
          this.trainerdata = array;
        }
      }

      if(sortBy == 'cab_code'){
        this.curSortDir.cab_code = !sortDir;
        if(this.curSortDir.cab_code){
          let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_code > b.cabDetails[0].cab_code) ? 1 : -1)
          this.trainerdata = array;
        }
        if(!this.curSortDir.cab_code){
          let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_code < b.cabDetails[0].cab_code) ? 1 : -1)
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

      if(sortBy == 'course_name'){
        this.curSortDir.course_name = !sortDir;
        if(this.curSortDir.course_name){
          let array = data.slice().sort((a, b) => (a.course_name > b.course_name) ? 1 : -1)
          this.trainerdata = array;
        }
        if(!this.curSortDir.course_name){
          let array = data.slice().sort((a, b) => (a.course_name < b.course_name) ? 1 : -1)
          this.trainerdata = array;
        }
      }

      // if(sortBy == 'capacity'){
      //   this.curSortDir.capacity = !sortDir;
      //   if(this.curSortDir.capacity){
      //     let array = data.slice().sort((a, b) => (a['courseEventDetails'] && b['courseEventDetails'] && a['courseEventDetails']['event_details'] && b['courseEventDetails']['event_details'] && a['courseEventDetails']['event_details'][0] && b['courseEventDetails']['event_details'][0] && a['courseEventDetails']['event_details'][0].capacity > b['courseEventDetails']['event_details'][0].capacity) ? 1 : -1)
      //     this.trainerdata = array;
      //   }
      //   if(!this.curSortDir.capacity){
      //     let array = data.slice().sort((a, b) => (a['courseEventDetails'] && b['courseEventDetails'] && a['courseEventDetails']['event_details'] && b['courseEventDetails']['event_details'] && a['courseEventDetails']['event_details'][0] && b['courseEventDetails']['event_details'][0] && a['courseEventDetails']['event_details'][0].capacity < b['courseEventDetails']['event_details'][0].capacityy) ? 1 : -1)
      //     this.trainerdata = array;
      //   }
      // }

      if(sortBy == 'capacity'){
        this.curSortDir.capacity = !sortDir;
        if(this.curSortDir.capacity){
          let array = data.slice().sort((a, b) => (a.course_capacity > b.course_capacity) ? 1 : -1)
          this.trainerdata = array;
        }
        if(!this.curSortDir.capacity){
          let array = data.slice().sort((a, b) => (a.course_capacity < b.course_capacity) ? 1 : -1)
          this.trainerdata = array;
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
    }
  }

  serviceStatus(index,id){

    // console.log(index);
    // console.log(this.pageCurrentNumber);
    var changableIndex = index;
    var currIndex = 10 * (this.pageCurrentNumber -1) + parseInt(changableIndex);
    this.loader = false;

    this.subscriptions.push(this._trainerService.updateStatusTraining(id)
      .subscribe(
        result => {
          this.loader = true;
          // console.log(result,'result');
          this.trainerdata[currIndex].application_status = 'complete';
          this._toaster.success("Payment Completed Successfully",'');
      })
    );

  }

  open(content, id: number, application_number:number, key:any) {
    // console.log(key)
    //this.voucherSentData = {};
    if(id){
      console.log(">>ID: ", id);
      this.voucherSentData['accreditation'] = id;
      this.voucherSentData['application_number'] = application_number;
      this.voucherSentData['index'] = key;
      this.voucherIndex = key
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
          // this.voucherFile.append('accreditation',this.voucherSentData['accreditation']);
          this.voucherFile.append('training',this.voucherSentData['accreditation']);
          this.voucherFile.append('application_number',this.voucherSentData['application_number']);

          this.subscriptions.push(this._trainerService.courseVoucherSave((this.voucherFile))
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
                  
                  var changableIndex = this.voucherIndex;
                  var currIndex = 10 * (this.pageCurrentNumber -1) + parseInt(changableIndex);
                  
                  this.trainerdata[currIndex].application_status = 'payment_pending';
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

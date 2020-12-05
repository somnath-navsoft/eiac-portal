import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private modalService: NgbModal) { 
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

  serviceStatus(index,id){
    this.loader = false;

    this.subscriptions.push(this._trainerService.updateStatusReg(id)
      .subscribe(
        result => {
          this.loader = true;
          // console.log(result,'result');
          this.trainerdata[index].accr_status = 'Complete';
          this._toaster.success("Payment Completed Successfully",'');
      })
    );

  }

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
          // this.voucherFile.append('accreditation',this.voucherSentData['accreditation']);
          this.voucherFile.append('registration',this.voucherSentData['accreditation']);

          this.subscriptions.push(this._trainerService.registrationVoucherSave((this.voucherFile))
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
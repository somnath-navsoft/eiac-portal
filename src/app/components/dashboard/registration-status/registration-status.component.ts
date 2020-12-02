import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../services/app.service'; 
import { TrainerService } from '../../../services/trainer.service';
import { Constants } from '../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';

@Component({
  selector: 'app-registration-status',
  templateUrl: './registration-status.component.html',
  styleUrls: ['./registration-status.component.scss']
})
export class RegistrationStatusComponent implements OnInit {

  subscriptions: Subscription[] = [];
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
    private _trainerService: TrainerService) { }

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
  //"no_objection"

  editVisible(item: any){
    if(item){
        switch(item.form_meta.toString()){

          case 'work_activity':
            console.log("work activity....", item);
            if(item.saved_step != null && item.saved_step < 4 && (item.is_draft == true || item.is_draft == false)){
              // console.log("@Enter....3");
              return false;
            }
            if(item.saved_step != null && item.saved_step > 4 && item.is_draft == false && 
              item.paymentDetails != undefined && item.paymentDetails != "NA" && 
              typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
              return true;
             }
            if(item.saved_step != null && item.saved_step < 4 && item.is_draft == false && 
              item.paymentDetails != undefined && item.paymentDetails != "NA" && 
              typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
              return true;
            }
            if(item.saved_step != null && item.saved_step == 6 && (item.is_draft == false || item.is_draft == true) && 
              item.paymentDetails != undefined && item.application_status !== 'complete'){
                // console.log("@Enter....1");
              return false;
            }
      
             if(item.saved_step != null && item.saved_step == 4 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails == "NA"){
              return true;
            }
             if(item.saved_step != null && item.saved_step == 4 && item.is_draft == false && 
              item.paymentDetails != undefined && item.paymentDetails != "NA" && item.paymentDetails != false && 
              typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != ''){
                // console.log("@Enter....2");
              return false;
            }
          break;

            case 'work_permit':
              console.log("work permit....", item);
              if(item.saved_step != null && item.saved_step < 4 && (item.is_draft == true || item.is_draft == false)){
                // console.log("@Enter....3");
                return false;
              }
              if(item.saved_step != null && item.saved_step > 4 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
               }
              if(item.saved_step != null && item.saved_step < 4 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
              }
              if(item.saved_step != null && item.saved_step == 6 && (item.is_draft == false || item.is_draft == true) && 
                item.paymentDetails != undefined && item.application_status !== 'complete'){
                  // console.log("@Enter....1");
                return false;
              }
        
               if(item.saved_step != null && item.saved_step == 4 && item.is_draft == false && 
                  item.paymentDetails != undefined && item.paymentDetails == "NA"){
                return true;
              }
               if(item.saved_step != null && item.saved_step == 4 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && item.paymentDetails != false && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != ''){
                  // console.log("@Enter....2");
                return false;
              }
            break;

            case 'no_objection':
              console.log("No Objection....", item);
              if(item.saved_step != null && item.saved_step < 6 && (item.is_draft == true || item.is_draft == false)){
                // console.log("@Enter....3");
                return false;
              }
              if(item.saved_step != null && item.saved_step > 6 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
               }
              if(item.saved_step != null && item.saved_step < 6 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
              }             
        
               if(item.saved_step != null && item.saved_step == 6 && item.is_draft == false && 
                  item.paymentDetails != undefined && item.paymentDetails == "NA"){
                    console.log("@@@@@@@ ", item.id);
                return true;
              }
              if(item.saved_step != null && item.saved_step == 8 && (item.is_draft == false || item.is_draft == true) && 
                item.paymentDetails != undefined && item.application_status !== 'complete'){
                  console.log("@Enter....1", item.id);
                return false;
              }
               if(item.saved_step != null && item.saved_step == 6 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && item.paymentDetails != false && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != ''){
                  // console.log("@Enter....2");
                return false;
              }
            break;

            default:
            break;
        }
    }
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
}

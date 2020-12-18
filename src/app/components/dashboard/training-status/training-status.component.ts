import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../services/app.service'; 
import { TrainerService } from '../../../services/trainer.service';
import { Constants } from '../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';

@Component({
  selector: 'app-training-status',
  templateUrl: './training-status.component.html',
  styleUrls: ['./training-status.component.scss']
})
export class TrainingStatusComponent implements OnInit {

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
    this.curSortDir['training_form_type'] = false;
    this.curSortDir['payment_status']     = false;
    this.curSortDir['cab_code']           = false;
    this.curSortDir['applicant']          = false;
  }
  
    editVisible(item: any){
    if(item){
        // console.log(item);
        switch(item.training_form_type.toString()){

            case 'inprimise':
              // console.log("inpremise....", item);
              if(item.saved_step != null && item.saved_step < 5 && (item.is_draft == true || item.is_draft == false)){
                // console.log("@Enter....3");
                return false;
              }
              if(item.saved_step != null && item.saved_step > 5 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
               }
              if(item.saved_step != null && item.saved_step < 5 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
              }
              if(item.saved_step != null && item.saved_step == 7 && (item.is_draft == false || item.is_draft == true) && 
                item.paymentDetails != undefined && item.application_status !== 'complete'){
                  // console.log("@Enter....1");
                return false;
              }
        
               if(item.saved_step != null && item.saved_step == 5 && item.is_draft == false && 
                  item.paymentDetails != undefined && item.paymentDetails == "NA"){
                return true;
              }
               if(item.saved_step != null && item.saved_step == 5 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && item.paymentDetails != false && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != ''){
                  // console.log("@Enter....2");
                return false;
              }
            break;

            case 'public_training':
              // console.log("No Objection....", item);
              if(item.saved_step != null && item.saved_step < 5 && (item.is_draft == true || item.is_draft == false)){
                // console.log("@Enter....3");
                return false;
              }
              if(item.saved_step != null && item.saved_step > 5 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
               }
              if(item.saved_step != null && item.saved_step < 5 && item.is_draft == false && 
                item.paymentDetails != undefined && item.paymentDetails != "NA" && 
                typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.application_status == 'complete'){
                return true;
              }             
        
               if(item.saved_step != null && item.saved_step == 5 && item.is_draft == false && 
                  item.paymentDetails != undefined && item.paymentDetails == "NA"){
                    // console.log("@@@@@@@ ", item.id);
                return true;
              }
              if(item.saved_step != null && item.saved_step == 7 && (item.is_draft == false || item.is_draft == true) && 
                item.paymentDetails != undefined && item.application_status !== 'complete'){
                  // console.log("@Enter....1", item.id);
                return false;
              }
               if(item.saved_step != null && item.saved_step == 5 && item.is_draft == false && 
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
    this.subscriptions.push(this._trainerService.getTrainingServiceList()
      .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          let dataRec: any=[];
          this.dataLoad = true;
          // console.log('loading...', data.records);
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
         }
       }
       //Cab Name
      //  if(sortBy === 'cab_code'){
      //   //console.log(">>>Enter type...");
      //   this.curSortDir.cab_code = !sortDir;
      //   if(this.curSortDir.cab_code){
      //     let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_code > b.cabDetails[0].cab_code) ? 1 : -1)
      //     this.trainerdata = array;
      //   }
      //   if(!this.curSortDir.cab_code){
      //     let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_code < b.cabDetails[0].cab_code) ? 1 : -1)
      //     this.trainerdata = array;
      //   }
      // }
       //By created_date
       if(sortBy == 'created_date'){
         this.curSortDir.created_date = !sortDir;
         if(this.curSortDir.created_date){
           let array = data.slice().sort((a, b) => (a.created_date > b.created_date) ? 1 : -1)
           this.trainerdata = array;
         }
         if(!this.curSortDir.created_date){
           let array = data.slice().sort((a, b) => (a.created_date < b.created_date) ? 1 : -1)
           this.trainerdata = array;
         }
       }
       //By accr_status
       if(sortBy == 'accr_status'){
         this.curSortDir.accr_status = !sortDir;
         if(this.curSortDir.accr_status){
           let array = data.slice().sort((a, b) => (a.accr_status > b.accr_status) ? 1 : -1)
           this.trainerdata = array;
         }
         if(!this.curSortDir.accr_status){
           let array = data.slice().sort((a, b) => (a.accr_status < b.accr_status) ? 1 : -1)
           this.trainerdata = array;
         }
       }
       //By Prelim Status
       if(sortBy == 'prelim_status'){
         this.curSortDir.prelim_status = !sortDir;
         if(this.curSortDir.prelim_status){
           let array = data.slice().sort((a, b) => (a.prelim_status > b.prelim_status) ? 1 : -1)
           this.trainerdata = array;
         }
         if(!this.curSortDir.prelim_status){
           let array = data.slice().sort((a, b) => (a.prelim_status < b.prelim_status) ? 1 : -1)
           this.trainerdata = array;
         }
       }
       //By training_form_type
       if(sortBy == 'training_form_type'){
         this.curSortDir.training_form_type = !sortDir;
         if(this.curSortDir.training_form_type){
           let array = data.slice().sort((a, b) => (a.training_form_type > b.training_form_type) ? 1 : -1)
           this.trainerdata = array;
         }
         if(!this.curSortDir.training_form_type){
           let array = data.slice().sort((a, b) => (a.training_form_type < b.training_form_type) ? 1 : -1)
           this.trainerdata = array;
         }
       }
       //By Payment Status
       if(sortBy == 'payment_status'){
         this.curSortDir.payment_status = !sortDir;
         if(this.curSortDir.payment_status){
           let array = data.slice().sort((a, b) => (a.payment_status > b.payment_status) ? 1 : -1)
           this.trainerdata = array;
         }
         if(!this.curSortDir.payment_status){
           let array = data.slice().sort((a, b) => (a.payment_status < b.payment_status) ? 1 : -1)
           this.trainerdata = array;
         }
       }  
       if(sortBy == 'applicant'){
         this.curSortDir.applicant = !sortDir;
         if(this.curSortDir.applicant){
           let array = data.slice().sort((a, b) => (a.applicant > b.applicant) ? 1 : -1)
           this.trainerdata = array;
         }
         if(!this.curSortDir.applicant){
           let array = data.slice().sort((a, b) => (a.applicant < b.applicant) ? 1 : -1)
           this.trainerdata = array;
         }
       }        
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../services/app.service'; 
import { TrainerService } from '../../../services/trainer.service';
import { Constants } from '../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

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

  selectRegType: any[] =[];

  applicationNo: string = '' || null;
  selectRegTypeValue: string = '' || null;
  paymentStatusValue: string = '' || null;
  exportAsConfig: ExportAsConfig; 
  exportAs:any = {};
  advSearch: boolean = false;
  show_data:any;
  userType: string;

  searchValue: any;
  searchText: any;
  selectAccrStatus: any[];
  getCountryStateCityAll: any[] = [];

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private exportAsService: ExportAsService) { } 

  ngOnInit() {
    this.loadPageData();
    this.curSortDir['id']                 = false;
    this.curSortDir['created_date']       = false;
    this.curSortDir['application_status']        = false;
    this.curSortDir['prelim_status']      = false;
    this.curSortDir['form_meta']          = false;
    this.curSortDir['payment_status']     = false;
    this.curSortDir['applicantName']            = false;
    this.curSortDir['applicantCode']            = false;
    this.curSortDir['country']            = false;
    this.userType = localStorage.getItem('type');
    this.selectRegType = [{title:'No Objection Certificate', value: 'no_objection'},{title:'Work Activity Permit', value:'work_activity'}];
    this.selectAccrStatus  = [
      {title: 'Payment Pending', value:'payment_pending'},
      //{title: 'Pending', value:'payment_pending'},
      {title: 'Under Review', value:'under_review'},
      {title: 'Under Process', value:'under_process'},
      {title: 'Complete', value:'complete'},
      {title: 'Draft', value:'draft'}
    ];
    this.loadCountryStateCityAll();
  }

  loadCountryStateCityAll  = async() =>{
    let cscLIST = this._service.getCSCAll();
    await cscLIST.subscribe(record => {
      console.log("...> ", record);
      this.getCountryStateCityAll = record['Countries'];
      console.log("...>>> ", this.getCountryStateCityAll);
    });
    //console.log("ALL CSC: ", this.getCountryStateCityAll);
  }

  changeFilter(theEvt: any, type?:any){
    console.log("@change: ", theEvt, " :: ", theEvt.value);
    let getIdValue: string = '';
    if(type == undefined){
      getIdValue= theEvt.value;
    }
    if(type != undefined){
      getIdValue= theEvt;
    }
    this.searchText = '';
    var myClasses = document.querySelectorAll('.slectType'),i = 0,length = myClasses.length;
       for (i; i < length; i++) {
          let elem: any = myClasses[i]
          console.log("@Elem: ", elem);
            elem.style.display = 'none';
            if(getIdValue == 'cab_name' || getIdValue == 'cab_code' || getIdValue == 'application_number') {
                let getElementId = document.getElementById('textType');
                getElementId.style.display = 'block';
            }else{
              if(elem.id === getIdValue){
                elem.style.display = 'block';
              }
            }
      }
  }

  showData() {
    //this.pageLimit = this.show_data;
    //this.loadPageData();
    console.log(this.show_data);
    console.log(">>>1 ", this.trainerdata);
    // this.pageLimit = this.show_data;
    // this.pageCurrentNumber = 1;
    // this.trainerdata.slice(0, this.show_data);
    // console.log(">>> ", this.trainerdata);
    if(this.show_data != 'all'){
      this.pageLimit = this.show_data;
      this.pageCurrentNumber = 1;
      this.trainerdata.slice(0, this.show_data);
    }else{
      console.log('....');
      this.pageLimit = this.pageTotal;
      this.pageCurrentNumber = 1;
      this.trainerdata.slice(0, this.pageTotal);
    }
  }

  paginationReset() {
    this.exportAs = {};
  }

  filterSearchReset(type?: string){
    //Reset serach
    
    this.show_data = this.pageLimit = 10;
    this.exportAs = null;
    this.searchText = null;
    this.searchValue = null;
    this.changeFilter('id','reset');    
    if(type != undefined && type != ''){
      this.loadPageData();
    }
    if(type != undefined && type != ''){
      this.loadPageData();
    }
  }
  
  isValidSearch(){
    if((this.searchValue == '') || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
     
     let postObject: any = {};
     //console.log("Search click....");
     let postData: any = new FormData();
     if(this.isValidSearch()){
      this.loader = false;
      //  if(this.applicationNo != '' && this.applicationNo != null){
      //   postData.append('id', this.applicationNo)
      //  }
      //  if(this.selectRegTypeValue != '' && this.selectRegTypeValue != null){
      //   postData.append('form_meta', this.selectRegTypeValue)
      //  }
      //  if(this.paymentStatusValue != '' && this.paymentStatusValue != null){
      //   postData.append('payment_status', this.paymentStatusValue)
      //  }

      let appendKey = this.searchValue;
      if(this.searchValue != ''  && (this.searchText != '' || this.searchText != null)){
       postData.append(appendKey, this.searchText);
      }   

        if(postData){
          this.subscriptions.push(this._trainerService.searchRegStatus((postData))
          .subscribe(
             result => {
               let data: any = result;
               this.loader = true;
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

  editVisible(item: any){
    if(item){
        switch(item.form_meta.toString()){

          case 'work_activity':
            //console.log("work activity....", item);
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
              //console.log("work permit....", item);
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
              //console.log("No Objection....", item);
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
                    //console.log("@@@@@@@ ", item.id);
                return true;
              }
              if(item.saved_step != null && item.saved_step == 8 && (item.is_draft == false || item.is_draft == true) && 
                item.paymentDetails != undefined && item.application_status !== 'complete'){
                  //console.log("@Enter....1", item.id);
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
          this.pageCurrentNumber = 1;
          dataRec = data.records;
          this.pageTotal = data.records.length;
        },
        ()=>{
          
        }
      )          
    )
  }

  isNumber(param: any){
    return isNaN(param);
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
       if(sortBy == 'application_status'){
         this.curSortDir.application_status = !sortDir;
         //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
         if(this.curSortDir.application_status){
           let array = data.slice().sort((a, b) => (a.application_status > b.application_status) ? 1 : -1)
           this.trainerdata = array;
           //console.log("after:: ", array, " :: ", this.trainerdata);
         }
         if(!this.curSortDir.application_status){
           let array = data.slice().sort((a, b) => (a.application_status < b.application_status) ? 1 : -1)
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
       if(sortBy == 'country'){
        this.curSortDir.country = !sortDir;
        //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
        if(this.curSortDir.country){
          let array = data.slice().sort((a, b) => (a.country > b.country) ? 1 : -1)
          this.trainerdata = array;
          //console.log("after:: ", array, " :: ", this.trainerdata);
        }
        if(!this.curSortDir.country){
          let array = data.slice().sort((a, b) => (a.country < b.country) ? 1 : -1)
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
        //By Prelim Status
        if(sortBy == 'applicantName'){
          this.curSortDir.applicantName = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.applicantName){
            let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_name > b.cabDetails[0].cab_name) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.applicantName){
            let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_name < b.cabDetails[0].cab_name) ? 1 : -1)
            this.trainerdata = array;
          }
        }
        //By Prelim Status
        if(sortBy == 'applicantCode'){
          this.curSortDir.applicantCode = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.applicantCode){
            let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_code > b.cabDetails[0].cab_code) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.applicantCode){
            let array = data.slice().sort((a, b) => (a.cabDetails[0].cab_code < b.cabDetails[0].cab_code) ? 1 : -1)
            this.trainerdata = array;
          }
        }       
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from 'src/app/components/utility/custom-modal/custom-modal.component';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'], 
  providers: [CustomModalComponent],
})
export class StatusComponent implements OnInit {

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
  loader:boolean = true;

  deleteConfirm: boolean = false;
  exportAsConfig: ExportAsConfig;
  exportAs: any = '';
  selectAccrType: any =[];
  selectAccrStatus: any =[];
  applicationNo: string = '' || null;
  paymentStatusValue: string = '' || null;
  selectAccrTypeValue: string = '' || null;
  show_data:any;

  userType: string;
  searchValue: any;
  searchText: any;
  allSchemeData: any[] = [];
  allSchemeREcord: any[] = [];
  accreditation_type: string;
  accreditation_status: string;
  accreditation_scope: string;

  getCountryStateCityAll: any[]=[];
  allCities: any[] =[];
  searchCountryText: string = '';
  searchCityText: string = '';
  criteria: string = '';


  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent, private exportAsService: ExportAsService) { }

    

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

  ngOnInit() { 
    this.loadPageData();
    this.curSortDir['id']                       = false;
    this.curSortDir['created_date']             = false;
    this.curSortDir['accr_status']              = false;
    this.curSortDir['applicantName']            = false;
    this.curSortDir['applicantCode']            = false;
    this.curSortDir['criteria_request']         = false;
    this.curSortDir['form_meta']                = false;
    this.curSortDir['country']                  = false;
    this.curSortDir['prelim_visit']                  = false;
    

    this.userType = localStorage.getItem('type');
    this.loadCriteriaScheme();
    this.loadCountryStateCityAll();

    //Assign Search Type
    this.selectAccrType = [ 
      {title: 'Inspection Bodies', value:'inspection_body'},
      {title: 'Certification Bodies', value:'certification_bodies'},
      {title: 'Testing Calibration', value:'testing_calibration'},
      {title: 'Health Care', value:'health_care'},
      {title: 'Halal Conformity Bodies', value:'halal_conformity_bodies'},
      {title: 'Proficiency Testing Providers', value:'pt_providers'}      
      ];
    this.selectAccrStatus  = [
      {title: 'Payment Pending', value:'payment_pending'},
      {title: 'Under Process', value:'application_process'},
      {title: 'Under Review', value:'under_review'},
      {title: 'Complete', value:'complete'},
      {title: 'Draft', value:'draft'}
    ]

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
          console.log("@Scheme record: ", this.allSchemeData);
        });
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
    this.filterSearchReset();
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
  }
  
  isValidSearch(){
    if((this.searchValue == '') || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  showData() {
    //this.pageLimit = this.show_data;
    // this.loadPageData();
    console.log(">>Tortal: ", this.pageTotal);
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

  cityByCountryAll(cname: string, index: number){
    console.log(">>> Get county/index: ", cname, " :: ", index);
    let tempCities: any[] =[];
    if(cname != ''){
      let countryFind : any = this.getCountryStateCityAll.find(item => item.CountryName === cname);
      console.log(">>> found country/city: ", countryFind);
        if(countryFind != undefined && countryFind.States != undefined && countryFind.States.length > 0){
          countryFind.States.forEach((item, k) => {
                if(item.Cities != undefined && item.Cities.length > 0){
                  item.Cities.forEach(rec => {
                    tempCities.push({name: rec});
                  })
                }
          })
        }
        this.allCities = tempCities;       
        console.log(">>>GET Cities: ", " :: ", this.allCities);
    }
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
            if(getIdValue == 'cab_name' || getIdValue == 'cab_code' ||  getIdValue == 'application_number') {
                let getElementId = document.getElementById('textType');
                getElementId.style.display = 'block';
            }else{
              if(elem.id === getIdValue){
                elem.style.display = 'block';
              }
            }
      }
  }

  filterSearchSubmit(){
     
     let postData: any = new FormData();
     if(this.isValidSearch()){
      this.loader = false;
      //  if(this.applicationNo != '' && this.applicationNo != null){
      //   postData.append('id', this.applicationNo)
      //  }
      //  if(this.selectAccrTypeValue != '' && this.selectAccrTypeValue != null){
      //   postData.append('form_meta', this.selectAccrTypeValue)
      //  }
      //  if(this.paymentStatusValue != '' && this.paymentStatusValue != null){
      //   postData.append('payment_status', this.paymentStatusValue)
      //  }
       let appendKey = this.searchValue;
       if(this.searchValue != ''  && (this.searchText != '' || this.searchText != null)){
        postData.append(appendKey, this.searchText);
       }
                      

        if(postData){
          this.subscriptions.push(this._trainerService.searchAccrStatus((postData))
          .subscribe(
             result => {
               let data: any = result;
                console.log("search results: ", result);
                this.loader = true;
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    console.log(">>> Data: ", data.records);
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

  setIB(id: any){
    // console.log(">>>url id set...", id);
    localStorage.setItem('ibUrlId', id);
  }

  editVisible(item: any){
    //console.log(">>> Item data: ", object);

    /*

if((item.saved_step != null && item.saved_step == 6 && item.form_meta == 'halal_conformity_bodies') && (item.is_draft == true || item.is_draft == false)){
        console.log("@Enter....3.1: ",item.id);
        return true;  
      }
    */
    
    if(item){

      
      if((item.saved_step != null && item.saved_step == 6 && item.form_meta == 'halal_conformity_bodies') && 
      (item.is_draft == true || item.is_draft == false) && item.paymentDetails != undefined && item.paymentDetails == false){
        // console.log("@Enter....3.1: ",item.id); 
        return true;  
      }
      if((item.saved_step != null && item.saved_step == 6 && item.form_meta == 'halal_conformity_bodies') && item.is_draft == false && 
        item.paymentDetails != undefined && item.paymentDetails != false && item.paymentDetails != false && 
        typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != ''){
          // console.log("@Enter....2222"); 
        return false;
      }
      if((item.saved_step != null && item.saved_step == 5 && item.form_meta == 'certification_bodies') && 
      (item.is_draft == true || item.is_draft == false) && item.paymentDetails != undefined && item.paymentDetails == false){
        // console.log("@Enter....3.11: ",item.id); 
        return true;  
      }
      if((item.saved_step != null && item.saved_step == 5 && item.form_meta == 'certification_bodies') && item.is_draft == false && 
        item.paymentDetails != undefined && item.paymentDetails != false && item.paymentDetails != false && 
        typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != ''){
          // console.log("@Enter....4444");
        return false;
      }
      
      if(item.saved_step != null && item.saved_step < 7 && (item.is_draft == true || item.is_draft == false)){
        // console.log("@Enter....3");
        return false;
      }

      if(item.saved_step != null && item.saved_step == 7 && item.form_meta == 'certification_bodies'  && item.is_draft == false && 
        item.paymentDetails != undefined && item.paymentDetails != false &&  typeof item.paymentDetails == 'object' && 
        item.paymentDetails.voucher_invoice != '' && item.accr_status == 'complete'){
        return true;
       }
       if(item.saved_step != null && item.saved_step == 8 && item.form_meta == 'halal_conformity_bodies'  && item.is_draft == false && 
        item.paymentDetails != undefined && item.paymentDetails != false &&  typeof item.paymentDetails == 'object' && 
        item.paymentDetails.voucher_invoice != '' && item.accr_status == 'complete'){
        return true;
       }
      
       if(item.saved_step != null && item.saved_step > 7 && item.is_draft == false && 
        item.paymentDetails != undefined && item.paymentDetails != false && 
        typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.accr_status == 'complete'){
        return true;
       }
      if(item.saved_step != null && item.saved_step < 7 && item.is_draft == false && 
        item.paymentDetails != undefined && item.paymentDetails != false && 
        typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != '' && item.accr_status == 'complete'){
        return true;
      }
      if(item.saved_step != null && item.saved_step == 9 && (item.is_draft == false || item.is_draft == true) && 
        item.paymentDetails != undefined && item.accr_status !== 'complete'){
          // console.log("@Enter....1");
        return false;
      }

       if(item.saved_step != null && item.saved_step == 7 && item.is_draft == false && 
          item.paymentDetails != undefined && item.paymentDetails == false){
        return true;
      }
       if(item.saved_step != null && item.saved_step == 7 && item.is_draft == false && 
        item.paymentDetails != undefined && item.paymentDetails != false && item.paymentDetails != false && 
        typeof item.paymentDetails == 'object' && item.paymentDetails.voucher_invoice != ''){
          // console.log("@Enter....2");
        return false;
      }
    }
  }

  loadPageData() { 
    this.loader = false;
    var id = 'all';
    this.subscriptions.push(this._trainerService.getAccreditationStatusList(id)
      .subscribe(
        result => {
          let tempData: any[]= [];
          this.loader = true;
          let data: any = result;
          let dataRec: any=[];
          this.dataLoad = true;
          console.log('Data load...', data.records);          
          data.records.forEach((res,key) => {
            data.records[key]['payment_status'] = res.payment_status == '' || res.payment_status == null || res.payment_status == 'pending' ? 'pending' : 'paid';
          });
          console.log('Data filter...', tempData);
          this.trainerdata = data.records;
          this.pageCurrentNumber = 1;
          dataRec = data.records;
          this.pageTotal = data.records.length;
        },
        ()=>{
          // console.log('comp...');
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
        if(sortBy == 'applicantName'){
          this.curSortDir.applicantName = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.applicantName){
            let array = data.slice().sort((a, b) => (a.cabDetails.cab_name > b.cabDetails.cab_name) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.applicantName){
            let array = data.slice().sort((a, b) => (a.cabDetails.cab_name < b.cabDetails.cab_name) ? 1 : -1)
            this.trainerdata = array;
          }
        }
        //By Prelim Status
        if(sortBy == 'applicantCode'){
          this.curSortDir.applicantCode = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.applicantCode){
            let array = data.slice().sort((a, b) => (a.cabDetails.cab_code > b.cabDetails.cab_code) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.applicantCode){
            let array = data.slice().sort((a, b) => (a.cabDetails.cab_code < b.cabDetails.cab_code) ? 1 : -1)
            this.trainerdata = array;
          }
        }
        //By criteria_request
        if(sortBy == 'criteria_request'){
          this.curSortDir.criteria_request = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.criteria_request){
            let array = data.slice().sort((a, b) => (a.criteria_request > b.criteria_request) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.criteria_request){
            let array = data.slice().sort((a, b) => (a.criteria_request < b.criteria_request) ? 1 : -1)
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
        //prelim_visit
        if(sortBy == 'prelim_visit'){
          this.curSortDir.prelim_visit = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.prelim_visit){
            let array = data.slice().sort((a, b) => (a.prelim_visit > b.prelim_visit) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.prelim_visit){
            let array = data.slice().sort((a, b) => (a.prelim_visit < b.prelim_visit) ? 1 : -1)
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
    }
  }
}

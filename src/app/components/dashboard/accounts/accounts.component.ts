import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from 'src/app/components/utility/custom-modal/custom-modal.component';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html', 
  styleUrls: ['./accounts.component.scss'], 
  providers: [CustomModalComponent],
})
export class AccountsComponent implements OnInit {

  modalOptions:NgbModalOptions;
  loader:boolean = true;

  paginationConfig: any;
  pageLimit: number = 10;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;
  subscriptions: Subscription[] = [];
  accountsData:any[] = [];
  // accountList:any = {};
  userType:any;
  voucherSentData: any = {};

  exportAsConfig: ExportAsConfig;
  // exportAs: any = '';
  exportAs:any = {};
  eventTitle:any;
  show_data:any;
  advSearch: boolean = false;
  dataLoad: boolean = false;

  selectAccrType: any[] =[];
  selectPaymentStatus: any[] =[];
  searchText: any;
  searchValue: string = '';
  isExport: boolean = false;
  paymentDate: any;
  selectAccrStatus: any[]=[];

  curSortDir: any = {};

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService, private exportAsService: ExportAsService,
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent,public router: Router) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('type');
    // if(this.userType != 'cab_client' || this.userType != 'operations' || this.userType != 'candidate'){
    //   this.router.navigateByUrl('/dashboard'+this.userType'/cab_client/home');
    // }

    //Column Sorting
    this.curSortDir['id']                       = false;
    this.curSortDir['createdDate']              = false;
    this.curSortDir['cabName']                  = false;
    this.curSortDir['cabCode']                  = false;
    this.curSortDir['appType']                  = false;
    this.curSortDir['voucher_no']               = false;
    this.curSortDir['app_amount']               = false;
    this.curSortDir['pay_amount']               = false;

    //Application Fees Sort
    this.curSortDir['app_fees']                 = false;
    this.curSortDir['app_fees_date']            = false;
    this.curSortDir['app_fees_status']          = false;    

    //Preliminary Fees Sort
    this.curSortDir['prelim_fees']               = false;
    this.curSortDir['prelim_fees_date']          = false;
    this.curSortDir['prelim_fees_status']        = false;

    //Document Fees Sort
    this.curSortDir['doc_fees']                   = false;
    this.curSortDir['doc_fees_date']              = false;
    this.curSortDir['doc_fees_status']            = false;

    //Assessment Fees Sort
    this.curSortDir['asses_fees']                 = false;
    this.curSortDir['asses_fees_date']            = false;
    this.curSortDir['asses_fees_status']          = false;

    //Certification Fees Sort
    this.curSortDir['certif_fees']                = false;
    this.curSortDir['certif_fees_date']           = false;
    this.curSortDir['certif_fees_status']         = false;


    if(this.userType == 'cab_client'){
      this.router.navigateByUrl('/dashboard/accounts');
    }else if(this.userType == 'operations'){
      this.router.navigateByUrl('/dashboard/accounts');
    }else if(this.userType == 'candidate'){
      this.router.navigateByUrl('/dashboard/accounts'); 
    }else if(this.userType == 'trainers'){
      this.router.navigateByUrl('/dashboard'+this.userType+'/cab_client/home');
    }else if(this.userType == 'assessors'){
      this.router.navigateByUrl('/dashboard'+this.userType+'/cab_client/home');
    }

    //Assign Search Type
    this.selectAccrType = [ 
      {title: 'Inspection Bodies', value:'inspection_body'},
      {title: 'Certification Bodies', value:'certification_bodies'},
      {title: 'Testing Calibration', value:'testing_calibration'},
      {title: 'Health Care', value:'health_care'},
      {title: 'Halal Conformity Bodies', value:'halal_conformity_bodies'},
      {title: 'Proficiency Testing Providers', value:'pt_providers'}      
      ];
    this.selectPaymentStatus  = [
      {title: 'Unpaid', value:'pending'},
      {title: 'Paid', value:'paid'},
    ]
    this.selectAccrStatus  = [
      {title: 'Payment Pending', value:'pending'},
      //{title: 'Pending', value:'payment_pending'},
      //{title: 'Application Process', value:'application_process'},
      {title: 'Under Review', value:'under_review'},
      {title: 'Under Process', value:'under_process'},
      {title: 'Complete', value:'complete'},
      {title: 'Draft', value:'draft'}
    ]

    this.loadPageData();
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
            if(getIdValue == 'cab_name' || getIdValue == 'cab_code' || getIdValue == 'id'  || getIdValue == 'voucher_no'){
                let getElementId = document.getElementById('textType');
                getElementId.style.display = 'block';
            }else{
              if(elem.id === getIdValue){
                elem.style.display = 'block';
              }
            }
      }
  }

  exportFile() {
    // console.log(this.exportAs);
    this.isExport = true;
    this.exportAsConfig = {
      type: 'csv', // the type you want to download
      elementIdOrContent: 'accreditation-service-export', // the id of html/table element
    }
    // let fileName: string = (this.exportAs.toString() == 'xls') ? 'accreditation-service-report' : 
    this.exportAsService.save(this.exportAsConfig, 'accounts').subscribe(() => {
      // save started
      this.isExport = false;
    });
  }

  showData() {
    // this.pageLimit = this.show_data;
    // this.pageCurrentNumber = 1;
    // this.accountsData.slice(0, this.show_data);

    if(this.show_data != 'all'){
      this.pageLimit = this.show_data;
      this.pageCurrentNumber = 1;
      this.accountsData.slice(0, this.show_data);
    }else{
      console.log('....');
      this.pageLimit = this.pageTotal;
      this.pageCurrentNumber = 1;
      this.accountsData.slice(0, this.pageTotal);
    }
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
    this.filterSearchReset();
  }
  
  filterSearchReset(type?: string){
    //Reset serach
    this.show_data = this.pageLimit = 10;
    this.exportAs = null;
    this.searchText = '';
    this.searchValue = '';
    this.changeFilter('id','reset');
    this.accountsData = [];
    if(type != undefined && type != ''){
      this.loadPageData();
    }
  }

  paginationReset() {
    this.exportAs = {};
  }

  isValidSearch(){
    if((this.searchValue == '') || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
    
    let postObject: any = {};
    // console.log("Search click....", this.applicationNo, " -- ", this.selectAccrTypeValue, " == ", this.paymentStatusValue);
    let postData: any = new FormData();
    console.log("@@srch value: ", this.searchText);
    // if(this.searchValue === 'voucher_date'){
    //     this.searchText = this.paymentDate;
    // }
    if(this.isValidSearch()){
      // if(this.eventTitle != '' && this.eventTitle != null){
      //   postData.append('cab_name', this.eventTitle)
      // }
      this.loader = false;
      let appendKey = this.searchValue;
      //console.log("@@srch value: 1 ", this.searchText);
       if(this.searchValue != ''  && (this.searchText != '' || this.searchText != null)){
          if(this.searchValue === 'voucher_date'){
              let dtDate: any = this.searchText;
              //console.log(">>>Date: ", dtData);
              var dtData = dtDate._i;
            var year = dtData.year;
            var month = dtData.month + 1;
            var date = dtData.date;
            let dtFormat = year + "-" + month + "-" + date;
            //this.searchText = dtFormat;
            postData.append(appendKey, dtFormat);
          }else{
          postData.append(appendKey, this.searchText);
          }
       }
        
        // console.log(">>>POST: ", JSON.stringify(postData)); 

        if(postObject){
          this.subscriptions.push(this._trainerService.searchAccountlist((postData))
          .subscribe(
            result => {
              let data: any = result;
                console.log("search results: ", result);
                this.loader = true;
                this.accountsData = [];
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    //console.log(">>> Data: ", );
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;
                    // this.accountsData = data.records;

                    let data: any = result;
                    // let dataRec: any=[];
                    // console.log('loading...', data.records);
                    
                    var allRecords = [];
                    allRecords = data.records
                    allRecords.forEach((res,key) => {
                      if(allRecords[key].paymentDetails != false) {
                        var getDetails = {};

                        getDetails['appNo'] = allRecords[key].id;
                        getDetails['createdDate'] = allRecords[key].created;
                        getDetails['form_meta'] = allRecords[key].form_meta;
                        getDetails['payment_details'] = allRecords[key].paymentDetails;
                        getDetails['application_status'] = (allRecords[key].accr_status == null) ? 'pending' : allRecords[key].accr_status;
                        getDetails['cabName'] = allRecords[key].cabDetails.cab_name;
                        getDetails['cabCode'] = allRecords[key].cabDetails.cab_code;
                        getDetails['appType'] = allRecords[key].form_meta;
                        getDetails['totalPayment'] = allRecords[key].paymentDetails.length;
                        getDetails['vouncherNumb'] = (allRecords[key].paymentDetails != null && typeof allRecords[key].paymentDetails === 'object' && allRecords[key].paymentDetails.voucher_no != null) ? allRecords[key].paymentDetails.voucher_no : 'NA';
                        getDetails['appAmount'] = (allRecords[key].paymentDetails != null && typeof allRecords[key].paymentDetails === 'object' && allRecords[key].paymentDetails.amount != null) ? allRecords[key].paymentDetails.amount : 0;
                        getDetails['payAmount'] = (allRecords[key].paymentDetails != null && typeof allRecords[key].paymentDetails === 'object' && allRecords[key].paymentDetails.amount != null) ? allRecords[key].paymentDetails.amount : 0;
                        
                        //For Tab wise data
                        getDetails['prelim_visit'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'prelim_visit');
                        getDetails['application_fees'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'application_fees');
                        getDetails['document_review'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'document_review');
                        getDetails['assessment'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'assessment');
                        getDetails['certification'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'certification');
                        console.log("@...", getDetails);

                        this.accountsData.push(getDetails);
                      }
                    this.pageTotal = this.accountsData.length;
                });
                console.log(">>>.Accounts Data: ", this.accountsData);
                }
              if(data != undefined && typeof data === 'object' && data.records.length == 0){
                this.accountsData = data.records;
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

  loadPageData() {
    this.loader = false;
    this.subscriptions.push(this._trainerService.getAccountLists()
      .subscribe(
        result => {
          
          this.loader = true;
          let data: any = result;
          // let dataRec: any=[];
          console.log('loading...', data.records);
          
          var allRecords = [];
          allRecords = data.records
          allRecords.forEach((res,key) => {
            if(allRecords[key].paymentDetails != false) {
              var getDetails = {};
              //console.log("....> ", allRecords[key].paymentDetails);

              getDetails['appNo'] = allRecords[key].id;
              getDetails['createdDate'] = allRecords[key].created;
              getDetails['form_meta'] = allRecords[key].form_meta;
              getDetails['payment_details'] = allRecords[key].paymentDetails;
              getDetails['application_status'] = (allRecords[key].accr_status == null) ? 'pending' : allRecords[key].accr_status;
              //

              getDetails['cabName'] = allRecords[key].cabDetails.cab_name;
              getDetails['cabCode'] = allRecords[key].cabDetails.cab_code;
              getDetails['appType'] = allRecords[key].form_meta;
              getDetails['totalPayment'] = allRecords[key].paymentDetails.length;
              getDetails['vouncherNumb'] = (allRecords[key].paymentDetails != null && typeof allRecords[key].paymentDetails === 'object' && allRecords[key].paymentDetails[0].voucher_no != null) ? allRecords[key].paymentDetails[0].voucher_no : 'NA';
              getDetails['appAmount'] = (allRecords[key].paymentDetails != null && typeof allRecords[key].paymentDetails === 'object' && allRecords[key].paymentDetails[0].amount != null) ? allRecords[key].paymentDetails[0].amount : 0;
              getDetails['payAmount'] = (allRecords[key].paymentDetails != null && typeof allRecords[key].paymentDetails === 'object' && allRecords[key].paymentDetails[0].amount != null) ? allRecords[key].paymentDetails[0].amount : 0;
              
              getDetails['prelim_visit'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'prelim_visit');
              getDetails['application_fees'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'application_fees');
              getDetails['document_review'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'document_review');
              getDetails['assessment'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'assessment');
              getDetails['certification'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'certification');

              this.accountsData.push(getDetails);
            }
            // this.accountsData.push(getDetails);
          })
         console.log(this.accountsData,'result');


          // this.accountsData = data.records;
          // dataRec = data.records;
          this.pageTotal = this.accountsData.length;
        },
        ()=>{
          // console.log('comp...');
        }
      )          
    )
  }


  //Sorted Column
  sortedList(data: any, sortBy: string, sortDir: boolean){
    //true - asc / false - desc
    ////console.log('>>>', data);
    if(data.length){
        if(sortBy === 'id'){
          this.curSortDir.id = !sortDir;
          if(this.curSortDir.id){
            let array = data.slice().sort((a, b) => (a.id > b.id) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.id){
            let array = data.slice().sort((a, b) => (a.id < b.id) ? 1 : -1)
            this.accountsData = array;
          }
        }
        // //By created_date
        if(sortBy == 'createdDate'){
          this.curSortDir.createdDate = !sortDir;
          if(this.curSortDir.createdDate){
            let array = data.slice().sort((a, b) => (a.createdDate > b.createdDate) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.createdDate){
            let array = data.slice().sort((a, b) => (a.createdDate < b.createdDate) ? 1 : -1)
            this.accountsData = array;
          }
        }

        // //By Cab Name
        if(sortBy == 'cabName'){
          this.curSortDir.cabName = !sortDir;
          if(this.curSortDir.cabName){
            let array = data.slice().sort((a, b) => (a.cabName > b.cabName) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.cabName){
            let array = data.slice().sort((a, b) => (a.cabName < b.cabName) ? 1 : -1)
            this.accountsData = array;
          }
        }

        // //By Cab Code
        if(sortBy == 'cabCode'){
          this.curSortDir.cabCode = !sortDir;
          if(this.curSortDir.cabCode){
            let array = data.slice().sort((a, b) => (a.cabCode > b.cabCode) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.cabCode){
            let array = data.slice().sort((a, b) => (a.cabCode < b.cabCode) ? 1 : -1)
            this.accountsData = array;
          }
        }

        // By Application Type
        if(sortBy == 'appType'){
          this.curSortDir.appType = !sortDir;
          if(this.curSortDir.appType){
            let array = data.slice().sort((a, b) => (a.appType > b.appType) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.appType){
            let array = data.slice().sort((a, b) => (a.appType < b.appType) ? 1 : -1)
            this.accountsData = array;
          }
        }

        // By Voucher Number
        if(sortBy == 'voucher_no'){
          this.curSortDir.voucher_no = !sortDir;
          if(this.curSortDir.voucher_no){
            let array = data.slice().sort((a, b) => (a.voucher_no > b.voucher_no) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.voucher_no){
            let array = data.slice().sort((a, b) => (a.voucher_no < b.voucher_no) ? 1 : -1)
            this.accountsData = array;
          }
        }

        // By Application Amount
        if(sortBy == 'app_amount'){
          this.curSortDir.app_amount = !sortDir;
          if(this.curSortDir.app_amount){
            let array = data.slice().sort((a, b) => (a.application_fees.amount > b.application_fees.amount) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.app_amount){
            let array = data.slice().sort((a, b) => (a.application_fees.amount < b.application_fees.amount) ? 1 : -1)
            this.accountsData = array;
          }
        }

        // By Payment Amount
        if(sortBy == 'pay_amount'){
          this.curSortDir.pay_amount = !sortDir;
          if(this.curSortDir.pay_amount){
            let array = data.slice().sort((a, b) => (a.application_fees.amount > b.application_fees.amount) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.pay_amount){
            let array = data.slice().sort((a, b) => (a.application_fees.amount < b.application_fees.amount) ? 1 : -1)
            this.accountsData = array;
          }
        }

        //Application fees column sort
        //Application Fees :: Fees
        if(sortBy == 'app_fees'){
          this.curSortDir.app_fees = !sortDir;
          if(this.curSortDir.app_fees){
            let array = data.slice().sort((a, b) => (a.application_fees.amount > b.application_fees.amount) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.app_fees){
            let array = data.slice().sort((a, b) => (a.application_fees.amount < b.application_fees.amount) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Application Fees :: Fees Date
        if(sortBy == 'app_fees_date'){
          this.curSortDir.app_fees_date = !sortDir;
          if(this.curSortDir.app_fees_date){
            let array = data.slice().sort((a, b) => (a.application_fees.voucher_date > b.application_fees.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.app_fees_date){
            let array = data.slice().sort((a, b) => (a.application_fees.voucher_date < b.application_fees.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Application Fees :: Status
        if(sortBy == 'app_fees_status'){
          this.curSortDir.app_fees_status = !sortDir;
          if(this.curSortDir.app_fees_status){ 
            let array = data.slice().sort((a, b) => (a.application_fees.payment_status > b.application_fees.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.app_fees_status){
            let array = data.slice().sort((a, b) => (a.application_fees.payment_status < b.application_fees.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
        }

        //Preliminary Visit column sort
        //Preliminary Visit :: Fees
        if(sortBy == 'prelim_fees'){
          this.curSortDir.prelim_fees = !sortDir;
          if(this.curSortDir.prelim_fees){
            let array = data.slice().sort((a, b) => (a.prelim_visit !=  undefined && a.prelim_visit.amount > b.prelim_visit.amount) ? 1 : -1);
            this.accountsData = array;
            // data.forEach(item => {
            //     console.log(">>> ", item);
            // })
          }
          if(!this.curSortDir.prelim_fees){
            let array = data.slice().sort((a, b) => (a.prelim_visit !=  undefined && a.prelim_visit.amount < b.prelim_visit.amount) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Preliminary Visit :: Fees Date
        if(sortBy == 'prelim_fees_date'){
          this.curSortDir.prelim_fees_date = !sortDir;
          if(this.curSortDir.prelim_fees_date){
            let array = data.slice().sort((a, b) => (a.prelim_visit !=  undefined && a.prelim_visit.voucher_date > b.prelim_visit.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.prelim_fees_date){
            let array = data.slice().sort((a, b) => (a.prelim_visit !=  undefined && a.prelim_visit.voucher_date < b.prelim_visit.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Preliminary Visit :: Status
        if(sortBy == 'prelim_fees_status'){
          this.curSortDir.prelim_fees_status = !sortDir;
          if(this.curSortDir.prelim_fees_status){ 
            let array = data.slice().sort((a, b) => (a.prelim_visit !=  undefined && a.prelim_visit.payment_status > b.prelim_visit.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.prelim_fees_status){
            let array = data.slice().sort((a, b) => (a.prelim_visit !=  undefined && a.prelim_visit.payment_status < b.prelim_visit.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
        }

        //Document Review column sort
        //Document Review :: Fees
        if(sortBy == 'doc_fees'){
          this.curSortDir.doc_fees = !sortDir;
          if(this.curSortDir.doc_fees){
            let array = data.slice().sort((a, b) => (a.document_review !=  undefined && a.document_review.amount > b.document_review.amount) ? 1 : -1);
            this.accountsData = array;
          }
          if(!this.curSortDir.doc_fees){
            let array = data.slice().sort((a, b) => (a.document_review !=  undefined && a.document_review.amount < b.document_review.amount) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Document Review :: Fees Date
        if(sortBy == 'doc_fees_date'){
          this.curSortDir.doc_fees_date = !sortDir;
          if(this.curSortDir.doc_fees_date){
            let array = data.slice().sort((a, b) => (a.document_review !=  undefined && a.document_review.voucher_date > b.document_review.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.doc_fees_date){
            let array = data.slice().sort((a, b) => (a.document_review !=  undefined && a.document_review.voucher_date < b.document_review.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Document Review :: Status
        if(sortBy == 'doc_fees_status'){
          this.curSortDir.doc_fees_status = !sortDir;
          if(this.curSortDir.doc_fees_status){ 
            let array = data.slice().sort((a, b) => (a.document_review !=  undefined && a.document_review.payment_status > b.document_review.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.doc_fees_status){
            let array = data.slice().sort((a, b) => (a.document_review !=  undefined && a.document_review.payment_status < b.document_review.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
        }

        //Assessment column sort
        //Assessment :: Fees
        if(sortBy == 'asses_fees'){
          this.curSortDir.asses_fees = !sortDir;
          if(this.curSortDir.asses_fees){
            let array = data.slice().sort((a, b) => (a.assessment !=  undefined && a.assessment.amount > b.assessment.amount) ? 1 : -1);
            this.accountsData = array;
          }
          if(!this.curSortDir.asses_fees){
            let array = data.slice().sort((a, b) => (a.assessment !=  undefined && a.assessment.amount < b.assessment.amount) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Assessment :: Fees Date
        if(sortBy == 'asses_fees_date'){
          this.curSortDir.asses_fees_date = !sortDir;
          if(this.curSortDir.asses_fees_date){
            let array = data.slice().sort((a, b) => (a.assessment !=  undefined && a.assessment.voucher_date > b.assessment.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.asses_fees_date){
            let array = data.slice().sort((a, b) => (a.assessment !=  undefined && a.assessment.voucher_date < b.assessment.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Assessment :: Status
        if(sortBy == 'asses_fees_status'){
          this.curSortDir.asses_fees_status = !sortDir;
          if(this.curSortDir.asses_fees_status){ 
            let array = data.slice().sort((a, b) => (a.assessment !=  undefined && a.assessment.payment_status > b.assessment.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.asses_fees_status){
            let array = data.slice().sort((a, b) => (a.assessment !=  undefined && a.assessment.payment_status < b.assessment.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
        }

        //Certification column sort
        //Certification :: Fees 
        if(sortBy == 'certif_fees'){
          this.curSortDir.certif_fees = !sortDir;
          if(this.curSortDir.certif_fees){
            let array = data.slice().sort((a, b) => (a.certification !=  undefined && a.certification.amount > b.certification.amount) ? 1 : -1);
            this.accountsData = array;
          }
          if(!this.curSortDir.certif_fees){
            let array = data.slice().sort((a, b) => (a.certification !=  undefined && a.certification.amount < b.certification.amount) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Certification :: Fees Date
        if(sortBy == 'certif_fees_date'){
          this.curSortDir.certif_fees_date = !sortDir;
          if(this.curSortDir.certif_fees_date){
            let array = data.slice().sort((a, b) => (a.certification !=  undefined && a.certification.voucher_date > b.certification.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.certif_fees_date){
            let array = data.slice().sort((a, b) => (a.certification !=  undefined && a.certification.voucher_date < b.certification.voucher_date) ? 1 : -1)
            this.accountsData = array;
          }
        }
        //Certification :: Status
        if(sortBy == 'certif_fees_status'){
          this.curSortDir.certif_fees_status = !sortDir;
          if(this.curSortDir.certif_fees_status){ 
            let array = data.slice().sort((a, b) => (a.certification !=  undefined && a.certification.payment_status > b.certification.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
          if(!this.curSortDir.certif_fees_status){
            let array = data.slice().sort((a, b) => (a.certification !=  undefined && a.certification.payment_status < b.certification.payment_status) ? 1 : -1)
            this.accountsData = array;
          }
        }
        
    }
  }

}

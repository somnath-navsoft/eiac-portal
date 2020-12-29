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

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService, private exportAsService: ExportAsService,
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent,public router: Router) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('type');
    // if(this.userType != 'cab_client' || this.userType != 'operations' || this.userType != 'candidate'){
    //   this.router.navigateByUrl('/dashboard'+this.userType'/cab_client/home');
    // }
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
    // this.selectPaymentStatus  = [
    //   {title: 'Pending', value:'pending'},
    //   {title: 'Paid', value:'paid'},
    //   // {title: 'Application Process', value:'application_process'},
    //   {title: 'Under Review', value:'under_review'},
    //   {title: 'Complete', value:'complete'},
    //   {title: 'Draft', value:'draft'}
    // ]
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
    this.pageLimit = this.show_data;
    this.pageCurrentNumber = 1;
    this.accountsData.slice(0, this.show_data);
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
    if(this.searchValue === 'voucher_date'){
        this.searchText = this.paymentDate;
    }
    if(this.isValidSearch()){
      // if(this.eventTitle != '' && this.eventTitle != null){
      //   postData.append('cab_name', this.eventTitle)
      // }
      this.loader = false;
      let appendKey = this.searchValue;
      console.log("@@srch value: 1 ", this.searchText);
       if(this.searchValue != ''  && (this.searchText != '' || this.searchText != null)){
          if(this.searchValue === 'voucher_date'){
              let dtDate: any = this.paymentDate;
              console.log(">>>Date: ", dtData);
              var dtData = dtDate._i;
            var year = dtData.year;
            var month = dtData.month + 1;
            var date = dtData.date;
            let dtFormat = year + "-" + month + "-" + date;
            this.searchText = dtFormat;
          }
          postData.append(appendKey, this.searchText);
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

}

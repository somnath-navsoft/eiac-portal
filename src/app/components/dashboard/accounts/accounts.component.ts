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
  searchText: string = '';
  searchValue: string = '';

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
    this.selectPaymentStatus  = [
      {title: 'Payment Pending', value:'pending'}
      // {title: 'Application Process', value:'application_process'},
      // {title: 'Under Review', value:'under_review'},
      // {title: 'Complete', value:'complete'},
      // {title: 'Draft', value:'draft'}
    ]

    this.loadPageData();
  }

  changeFilter(theEvt: any){
    console.log("@change: ", theEvt, " :: ", theEvt.value);
    let getIdValue: string = theEvt.value;
    this.searchText = '';
    var myClasses = document.querySelectorAll('.slectType'),i = 0,length = myClasses.length;
       for (i; i < length; i++) {
          let elem: any = myClasses[i]
          console.log("@Elem: ", elem);
            elem.style.display = 'none';
            if(getIdValue == 'applicant') {
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
    this.exportAsConfig = {
      type: 'csv', // the type you want to download
      elementIdOrContent: 'accreditation-service-export', // the id of html/table element
    }
    // let fileName: string = (this.exportAs.toString() == 'xls') ? 'accreditation-service-report' : 
    this.exportAsService.save(this.exportAsConfig, 'accounts').subscribe(() => {
      // save started
    });
  }

  showData() {
    //this.pageLimit = this.show_data;
    // this.loadPageData();
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
    this.eventTitle = '' || null;
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
    this.loader = false;
    let postObject: any = {};
    // console.log("Search click....", this.applicationNo, " -- ", this.selectAccrTypeValue, " == ", this.paymentStatusValue);
    let postData: any = new FormData();
    if(this.isValidSearch()){
      // if(this.eventTitle != '' && this.eventTitle != null){
      //   postData.append('cab_name', this.eventTitle)
      // }
      let appendKey = this.searchValue;
       if(this.searchValue != ''  && (this.searchText != '' || this.searchText != null)){
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
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    // console.log(">>> Data: ", data.records);
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
                        getDetails['cabName'] = allRecords[key].cabDetails.cab_name;
                        getDetails['appType'] = allRecords[key].form_meta;
                        getDetails['totalPayment'] = allRecords[key].paymentDetails.length;
                        
                        getDetails['prelim_visit'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'prelim_visit');
                        getDetails['application_fees'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'application_fees');
                        getDetails['document_review'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'document_review');
                        getDetails['assessment'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'assessment');
                        getDetails['certification'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'certification');

                        this.accountsData.push(getDetails);
                      }
                    this.pageTotal = data.records.length;
                });
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
          // console.log('loading...', data.records);
          
          var allRecords = [];
          allRecords = data.records
          allRecords.forEach((res,key) => {
            if(allRecords[key].paymentDetails != false) {
              var getDetails = {};

              getDetails['appNo'] = allRecords[key].id;
              getDetails['createdDate'] = allRecords[key].created;
              getDetails['cabName'] = allRecords[key].cabDetails.cab_name;
              getDetails['appType'] = allRecords[key].form_meta;
              getDetails['totalPayment'] = allRecords[key].paymentDetails.length;
              
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

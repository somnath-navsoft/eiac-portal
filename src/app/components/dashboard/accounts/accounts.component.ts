import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from 'src/app/components/utility/custom-modal/custom-modal.component';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
  pageLimit: number = 5;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;
  subscriptions: Subscription[] = [];
  accountsData:any[] = [];
  // accountList:any = {};
  userType:any;
  voucherSentData: any = {};

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
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

    this.loadPageData();
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

import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from 'src/app/components/utility/custom-modal/custom-modal.component';
import { Observable, Subscription } from 'rxjs';

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

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent) { }

  ngOnInit() {
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
              let getDetails = {};
              console.log(allRecords[key].id,'key');

              getDetails['appNo'] = allRecords[key].id;
              getDetails['createdDate'] = allRecords[key].created;
              getDetails['cabName'] = allRecords[key].cabDetails.cab_name;
              getDetails['appType'] = allRecords[key].form_meta;
              
              getDetails['prelim_visit'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'prelim_visit');
              getDetails['application_fees'] = allRecords[key].paymentDetails.find(item => item.application_fees == 'application_fees');
              getDetails['document_review'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'document_review');
              getDetails['assessment'] = allRecords[key].paymentDetails.find(item => item.assessment == 'assessment');
              getDetails['certification'] = allRecords[key].paymentDetails.find(item => item.payment_meta == 'certification');

              this.accountsData.push(getDetails);
            }
            // this.accountsData.push(getDetails);
          })
          console.log(this.accountsData,'result');


          // this.accountsData = data.records;
          // // dataRec = data.records;
          // this.pageTotal = data.records.length;
        },
        ()=>{
          // console.log('comp...');
        }
      )          
    )
  }

}

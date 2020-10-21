import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Constants } from 'src/app/services/constant.service';
import { Observable, Subscription } from 'rxjs';
import { ToastrService} from 'ngx-toastr';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  accountDetailId:any;
  subscriptions: Subscription[] = [];
  loader:boolean = true;
  accountsData:any;
  allRecords:any[] = []

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.accountDetailId = sessionStorage.getItem('accountDetailId');

    this.loader = false;
    this.subscriptions.push(this._trainerService.getAccountDetails(this.accountDetailId)
      .subscribe(
        result => {
          this.loader = true;
          var getDetails = {};
          // var allRecords = [];
          this.allRecords = result['data'];
          this.allRecords.forEach((res,key) => {
            if(res.payment_meta == 'prelim_visit'){
              getDetails['prelim_visit'] = this.allRecords[key];
            }
            if(res.payment_meta == 'application_fees'){
              getDetails['application_fees'] = this.allRecords[key];
            }
            if(res.payment_meta == 'document_review'){
              getDetails['document_review'] = this.allRecords[key];
            }
            if(res.payment_meta == 'assessment'){
              getDetails['assessment'] = this.allRecords[key];
            }
            if(res.payment_meta == 'certification'){
              getDetails['certification'] = this.allRecords[key];
            }
            this.accountsData = getDetails;
          })
          
      })
    )
  }

}

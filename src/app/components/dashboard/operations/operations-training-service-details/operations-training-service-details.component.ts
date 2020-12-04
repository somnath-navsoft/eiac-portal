import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-operations-training-service-details',
  templateUrl: './operations-training-service-details.component.html',
  styleUrls: ['./operations-training-service-details.component.scss']
})
export class OperationsTrainingServiceDetailsComponent implements OnInit {

  loader:boolean = false; 
  subscriptions: Subscription[] = [];
  routeId:any;
  serviceDetail:any;
  ownershipOfOrg:any;
  ownOrgMembInfo:any;
  paymentDetails:any;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = sessionStorage.getItem('trainingId');
    this.loadData();
  }

  loadData() {
    this.loader = false;
    this.subscriptions.push(this._trainerService.trainingDetailsServ(this.routeId)
      .subscribe(
        result => {
          this.loader = true;
          this.serviceDetail = result['data'];
          this.ownershipOfOrg = result['data']['ownershipOfOrg'];
          this.ownOrgMembInfo = result['data']['bodMember'];
          this.paymentDetails = result['data'].paymentDetails;
        })
    )
  }
}

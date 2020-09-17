import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-operations-accreditation-service-details',
  templateUrl: './operations-accreditation-service-details.component.html',
  styleUrls: ['./operations-accreditation-service-details.component.scss'],
  providers: [CustomModalComponent, ToastrService, Overlay, OverlayContainer]
})
export class OperationsAccreditationServiceDetailsComponent implements OnInit {

  loader:boolean = false;
  subscriptions: Subscription[] = [];
  routeId:any;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = sessionStorage.getItem('routeId');
    this.loadData();
  }

  loadData() {
    this.subscriptions.push(this._trainerService.trainerAccredDetailsServtrainerAccredDetailsServ(this.routeId)
          .subscribe(
            result => {
              console.log(result);
            },
            ()=>{
              console.log('comp...');
            }
          )          
    )
  }
}

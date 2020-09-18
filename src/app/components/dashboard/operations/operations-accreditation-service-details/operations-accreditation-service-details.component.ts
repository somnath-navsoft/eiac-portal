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
  serviceDetail:any[] = [];
  ownershipOfOrg:any;
  bodMember:any;
  otherAccr:any;
  other_accr_model:any;
  Object = Object;
  ptParticipation:any;
  technicalManager:any;
  managementManager:any;
  paymentDetails:any;
  applicantInfo:any;
  scopeDetailsHeading:any;
  scopeDetailvalues:any;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = sessionStorage.getItem('routeId');
    this.loadData();
  }

  jsonParse(data) {
    // console.log(data);
    // console.log(JSON.parse(data.toString()));
    // return JSON.parse(data.toString());
    // var obj = "{'include':true,'fn':'1-12'}"; //Assuming double quotes outside
    if(data) {
      var obj1 = data.replace(/'/g, "\""); //Replace single quotes with double quotes
      // console.log(typeof obj1); // string

      // var myjsonobj = JSON.parse(obj1); //convert to JSON
      return Array(JSON.parse(obj1));
    }
  }

  jsonParseKeyvalue(data) {
    if(data) {
      var obj1 = data.replace(/'/g, "\"");
      return JSON.parse(obj1);
    }
  }

  jsonParsevalue(data) {
    if(data) {
      return JSON.parse(data);
    }
  }

  loadData() {
    this.subscriptions.push(this._trainerService.trainerAccredDetailsServtrainerAccredDetailsServ(this.routeId)
      .subscribe(
        result => {
          // console.log(result);
          this.serviceDetail = result['data']
          this.ownershipOfOrg = result['data']['ownershipOfOrg']
          this.bodMember = result['data']['bodMember'];
          this.otherAccr = result['data']['otherAccr'];
          this.other_accr_model = result['data']['otherAccr'] != '' ? '1' : '0' ;
          this.ptParticipation = result['data']['ptParticipation'];
          this.technicalManager = result['data']['technicalManager'][0];
          this.managementManager = result['data']['technicalManager'][0];
          this.paymentDetails = result['data'].paymentDetails;
          this.scopeDetailsHeading = result['data']['scopeDetails'].heading.column_list;
          this.scopeDetailvalues = result['data']['scopeDetails']['details'];
        },
        ()=>{
          console.log('comp...');
        }
      )     
    )

    this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.profileService+'?id='+this.routeId)
    .subscribe(
      res => { 
        // console.log(res);
        this.applicantInfo = res['data']['step1'][0];
      })
  }
}

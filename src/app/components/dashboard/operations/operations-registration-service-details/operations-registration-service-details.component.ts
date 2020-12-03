import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-operations-registration-service-details',
  templateUrl: './operations-registration-service-details.component.html',
  styleUrls: ['./operations-registration-service-details.component.scss']
})
export class OperationsRegistrationServiceDetailsComponent implements OnInit { 

  loader:boolean = false; 
  subscriptions: Subscription[] = [];
  routeId:any;
  serviceDetail:any;
  ownershipOfOrg:any;
  ownOrgMembInfo:any;
  paymentDetails:any;
  activitySection:any;
  scopes_to_be_authorized:any;
  onBehalfApplicantDetails:any;

  nocCabTypeData: any = {};
  nocTableScopeData: any;
  nocTableListEquip: any;
  nocTableListStaff: any;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = sessionStorage.getItem('registrationId');
    this.loadData();
  }

  loadData() {
    this.loader = false;
    this.subscriptions.push(this._trainerService.registrationDetailsService(this.routeId)
      .subscribe(
        result => {
          console.log("Get Data: ", result);
          let getData: any = result;
          // console.log("Get Data: ", result);
          this.loader = true;
          this.serviceDetail = result['data'];

          if(this.serviceDetail.form_meta == 'no_objection'){
            if(getData.data.nocData != null && getData.data.nocData.cab_type != ''){
                this.nocCabTypeData['lab'] = [];
                this.nocCabTypeData['cb'] = [];
                this.nocCabTypeData['hcab'] = [];
                this.nocCabTypeData['ib'] = [];
                let getCabType: any = JSON.parse((getData.data.nocData.cab_type));
                console.log("Type: ", getCabType);
                if(getCabType.lab != undefined && getCabType.lab.length > 0){
                    for(let k in getCabType.lab[0]){
                      console.log(k, " -- ", getCabType.lab[0][k]);
                      if(getCabType.lab[0][k]){
                        if( k === 'cabTypeLaboratory_testing'){
                          this.nocCabTypeData['lab'].push('Testing Laboratory')
                        }
                        if( k === 'cabTypeLaboratory_calibration'){
                          this.nocCabTypeData['lab'].push('Calibration Laboratory')
                        }
                      }
                    }
                }
                if(getCabType.CB != undefined && getCabType.CB.length > 0){
                  for(let k in getCabType.CB[0]){
                    console.log(k, " -- ", getCabType.CB[0][k]);
                    if(getCabType.CB[0][k]){
                      if( k === 'cabTypeCertificationBody_management_system_cb'){
                        this.nocCabTypeData['cb'].push('Management System CB')
                      }
                      if( k === 'cabTypeCertificationBody_personal_cb'){
                        this.nocCabTypeData['cb'].push('Personal CB')
                      }
                      if( k === 'cabTypeCertificationBody_product_cb'){
                        this.nocCabTypeData['cb'].push('Product CB')
                      }
                    }
                  }
                }
                if(getCabType.IB != undefined && getCabType.IB.length > 0){
                  for(let k in getCabType.IB[0]){
                    console.log(k, " -- ", getCabType.IB[0][k]);
                    if(getCabType.IB[0][k]){
                      if( k === 'cabTypeInspectionBody_engineering_ib'){
                        this.nocCabTypeData['ib'].push('Engineering IB')
                      }
                      if( k === 'cabTypeInspectionBody_sustainability_ib'){
                        this.nocCabTypeData['ib'].push('Sustainability IB')
                      }
                    }
                  }
                }
                if(getCabType.HCAB != undefined && getCabType.HCAB.length > 0){
                  for(let k in getCabType.HCAB[0]){
                    console.log(k, " -- ", getCabType.HCAB[0][k]);
                    if(getCabType.HCAB[0][k]){
                      if( k === 'cabTypeHalal_cb'){
                        this.nocCabTypeData['hcab'].push('CB')
                      }
                      if( k === 'cabTypeHalal_ib'){
                        this.nocCabTypeData['hcab'].push('IB')
                      }
                      if( k === 'cabTypeHalal_lab'){
                        this.nocCabTypeData['hcab'].push('LAB')
                      }
                    }
                  }
                }
            }

            //Services Scope
            if(getData.data.nocTableData != undefined && typeof getData.data.nocTableData == 'object'){
              this.nocTableScopeData = getData.data.nocTableData;

              this.nocTableListStaff = '';
              this.nocTableListEquip = '';

            }

          }


          this.ownershipOfOrg = result['data']['ownershipOfOrg'];
          this.ownOrgMembInfo = result['data']['bodMember'];
          this.paymentDetails = result['data'].paymentDetails;
          this.onBehalfApplicantDetails = result['data'].onBehalfApplicantDetails;
          this.serviceDetail = result['data'];

          var newwapdata = result['data'].wapData;
          // this.activity_section = wapdata.activity_section != null ? wapdata.activity_section : '';

          this.scopes_to_be_authorized = newwapdata.scopes_to_be_authorized != null ? newwapdata.scopes_to_be_authorized : '';

          if(newwapdata.activity_section != null) {
            this.activitySection = JSON.parse(newwapdata.activity_section);
          }
        })
    )
  }
}

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
  check_list_path:any;
  work_instruction_path:any;
  quality_manual_path:any;
  licence_document_path:any;
  licence_document:any;
  quality_manual:any;
  check_list:any;
  work_instruction:any;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = sessionStorage.getItem('registrationId');
    this.loadData();
  }

  getFile(file: string){
    let fname: string = file.split('/')[1].split('.')[0];
    console.log(fname);
    return fname;
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
              console.log(">>>Table scope: ", this.nocTableScopeData);
              

            }

          }


          this.ownershipOfOrg = result['data']['ownershipOfOrg'];
          this.ownOrgMembInfo = result['data']['bodMember'];
          this.paymentDetails = result['data'].paymentDetails;
          this.onBehalfApplicantDetails = result['data'].onBehalfApplicantDetails;
          this.serviceDetail = result['data'];

          var newwapdata = result['data'].wapData;
          // this.activity_section = wapdata.activity_section != null ? wapdata.activity_section : '';
          if(newwapdata != null && newwapdata != undefined){
            if(newwapdata.activity_section != null) {
              this.activitySection = JSON.parse(newwapdata.activity_section);
            }
            this.scopes_to_be_authorized = newwapdata.scopes_to_be_authorized != null ? newwapdata.scopes_to_be_authorized : '';
          }
          if(this.serviceDetail.wapData != undefined){
            if(this.serviceDetail.wapData.licence_document_file != null){
              var recognized_logo1 = this.serviceDetail.wapData.licence_document_file;
              if(recognized_logo1 != ''){
                let getFile =recognized_logo1.toString().split('/');
                if(getFile.length){
                  this.licence_document = getFile[4].toString().split('.')[0];
                  this.licence_document_path = this._constant.mediaPath +'/media/'+ recognized_logo1.toString();
                }
              }
            }
            if(this.serviceDetail.wapData.quality_manual_file != null){

            var quality_manual1 = this.serviceDetail.wapData.quality_manual_file;
            if(quality_manual1 != ''){
              let getFile = quality_manual1.toString().split('/');
              if(getFile.length){
                this.quality_manual = getFile[4].toString().split('.')[0];
                this.quality_manual_path = this._constant.mediaPath +'/media/'+ quality_manual1.toString();
              }
            }
            }
            if(this.serviceDetail.wapData.work_instruction_file != null){
              var work_instruction1 = this.serviceDetail.wapData.work_instruction_file;
              if(work_instruction1 != ''){
                let getFile = work_instruction1.toString().split('/');
                if(getFile.length){
                  this.work_instruction = getFile[4].toString().split('.')[0];
                  this.work_instruction_path = this._constant.mediaPath +'/media/'+ work_instruction1.toString();
                }
              }
            }
            if(this.serviceDetail.wapData.check_list_file != null){
              var check_list1 = this.serviceDetail.wapData.check_list_file;
              if(check_list1 != ''){
                let getFile = check_list1.toString().split('/');
                if(getFile.length){
                  this.check_list = getFile[4].toString().split('.')[0];
                  this.check_list_path = this._constant.mediaPath +'/media/'+ check_list1.toString();
                }
              }
            }
          }
            


        })
    )
  }

  downloadCsv() {
    // /admin/accreditation-application-csv?id=1068
    // this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.accrediationCsv+this.routeId)
    // .subscribe(
    //   res => {
    //     console.log(res,'res');
    //   })
    window.open(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.registrationCsv+this.routeId, '_blank');
  }

  downloadApplications() {
    window.open(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.registrationPdf+this.routeId, '_blank');
  }
}

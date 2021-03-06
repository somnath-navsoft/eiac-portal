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
  participantTraineeDetails:any[] = [];
  noofParticipants:any;
  tutionFees:any;
  taxVat:any;
  knowledgeFees:any;
  innovationFees:any;
  subTotal:any;
  training_duration:any;
  course_title:any;
  fee_day_pertime1:any = 1000;
  fee_day_pertime2:any = '5%';
  fee_day_pertime3:any = 10;
  fee_day_pertime4:any = 10;
  applicantDetails:any;
  undertaking_confirmTop3:boolean = true;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = localStorage.getItem('trainingId');
    this.loadData();
    // this.undertaking_confirmTop3 = true;
  }
  getFile(file: string){
    let fname: string = file.split('/')[1].split('.')[0];
    console.log(fname);
    return fname;
  }

  loadData() {
    this.loader = false;
    this.subscriptions.push(this._trainerService.trainingDetailsServ(this.routeId)
      .subscribe(
        result => {
          this.loader = true;
          this.serviceDetail = result['data'];
          // this.ownershipOfOrg = result['data']['ownershipOfOrg'];
          // this.ownOrgMembInfo = result['data']['bodMember'];
          this.paymentDetails = result['data'].paymentDetails;
          this.applicantDetails = result['data'].onBehalfApplicantDetails;
          this.participantTraineeDetails = result['data']['eventParticipant'];

          this.training_duration = result['data'].training_duration;
          this.course_title = result['data'].course_title;
          // console.log(this.training_duration);
          // console.log(this.course_title);


          //call service 
          this.loader = false;
          let url5 = this._service.apiServerUrl+"/"+'rate-master';
          this._service.getwithoutData(url5)
          .subscribe(
            record =>  {
                //console.log("@@@Rate call...", record);
                this.loader = true;
                let dataRec: any = record;
                let feesPerTrainee: any;
                let taxTrainee: any;
                if(dataRec.records != undefined && dataRec.records.length > 0){
                    if(dataRec.records[1].meta_title =='fees_per_day'){
                      feesPerTrainee        = dataRec.records[1].value;
                      this.fee_day_pertime1 = feesPerTrainee;
                    }
                    if(dataRec.records[2].meta_title =='tax'){
                      taxTrainee            = dataRec.records[2].value;
                      this.fee_day_pertime2 = taxTrainee;
                    }
                }                    
                var training_duration_current = this.serviceDetail.training_duration;
                this.noofParticipants         = this.participantTraineeDetails.length;
                this.tutionFees               = feesPerTrainee * parseInt(this.noofParticipants) * parseInt(training_duration_current);

                console.log(">>> ", feesPerTrainee, " :: ", this.noofParticipants, " :: ", training_duration_current);
             
                this.taxVat   = this.tutionFees * taxTrainee / 100;
                this.subTotal = this.tutionFees + this.taxVat;
                
            });

          /*
          var training_duration_current = this.serviceDetail.training_duration;
          this.noofParticipants = this.participantTraineeDetails.length;
          this.tutionFees = 1000 * parseInt(this.noofParticipants) * parseInt(training_duration_current);        
          this.taxVat = 0.05 * this.tutionFees;
          this.subTotal = this.tutionFees + this.taxVat ;
          */
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
    window.open(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.trainingCsv+this.routeId, '_blank');
  }

  downloadApplications() {
    window.open(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.trainingPdf+this.routeId, '_blank');
  }
}

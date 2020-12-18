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
    this.routeId = sessionStorage.getItem('trainingId');
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

          var training_duration_current = this.serviceDetail.training_duration;
          this.noofParticipants = this.participantTraineeDetails.length;
          this.tutionFees = 1000 * parseInt(this.noofParticipants) * parseInt(training_duration_current);
          // console.log(this.noofParticipants);
          // console.log(training_duration_current);
          // console.log(this.tutionFees);
          this.taxVat = 0.05 * this.tutionFees;
          // this.knowledgeFees = 10 * this.noofParticipants;
          // this.innovationFees = 10 * this.noofParticipants;
          this.subTotal = this.tutionFees + this.taxVat ;
        })
    )
  }
}

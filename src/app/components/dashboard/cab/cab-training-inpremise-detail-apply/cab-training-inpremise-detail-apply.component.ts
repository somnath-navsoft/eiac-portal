import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';

@Component({
  selector: 'app-cab-training-inpremise-detail',
  templateUrl: './cab-training-inpremise-detail.component.html',
  styleUrls: ['./cab-training-inpremise-detail.component.scss']
})
export class CabTrainingInpremiseDetailComponent implements OnInit {

  loaderData:boolean = true;
  routeId:any;
  courseDetails:any;

  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    this.routeId = sessionStorage.getItem('inpremiseCourseId');
    this.loadData();
  }

  loadData() {
    this.loaderData = false;
    this._service.getwithoutData(this._service.apiServerUrl+'/'+this._constant.API_ENDPOINT.course_details+this.routeId+'?data=1')
    .subscribe(
      res => {
        this.loaderData = true;
        this.courseDetails = res['courseDetails'];
      })
  }
}

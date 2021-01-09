import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { iif, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cab-training-detail',
  templateUrl: './cab-training-detail.component.html',
  styleUrls: ['./cab-training-detail.component.scss']
})
export class CabTrainingDetailComponent implements OnInit {

  loaderData:boolean = true;
  routeId:any;
  courseDetails:any;
  audienceData: string = '';

  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    this.routeId = sessionStorage.getItem('courseDetailId');
    this.loadData();
  }

  loadData() {
    //public-course-event-details-show
    this.loaderData = false;
    this._service.getwithoutData(this._service.apiServerUrl+'/'+this._constant.API_ENDPOINT.course_details_publicForm+this.routeId)
    .subscribe(
      res => {
        let audAr: any[] =[];
        let getData: any = res['eventData'];
        this.loaderData = true;
        console.log(getData);
        if(getData.public_course.allTargatedAud != undefined && getData.public_course.allTargatedAud.length > 0){
          getData.public_course.allTargatedAud.forEach(item => {
               if(item.target_aud_name != undefined && typeof item.target_aud_name == 'object'){
                audAr.push(item.target_aud_name.title);
               }
          })
        }
        if(audAr.length > 0){
          this.audienceData = audAr.join(', ');
        }
        this.courseDetails = res['eventData'];
        //this.courseDetails.remaining_capacity = 0;
        console.log(this.courseDetails);
      })
  }
}

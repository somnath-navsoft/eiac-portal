import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';

@Component({
  selector: 'app-cab-training-inpremise-apply-detail',
  templateUrl: './cab-training-inpremise-apply-detail.component.html',
  styleUrls: ['./cab-training-inpremise-apply-detail.component.scss']
})
export class CabTrainingInpremiseApplyDetailComponent implements OnInit {

  loaderData:boolean = true;
  routeId:any;
  courseDetails:any;
  audienceData: any;

  trainingDetails: any;

  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    this.routeId = sessionStorage.getItem('inpremiseApplyCourseId');
    this.loadData();
  }

  loadData() {
    this.loaderData = false;
    let url: string = this._service.apiServerUrl + "/" + "custom-course-details-show/" + this.routeId;
    console.log(">>> URL: ", url); 
    //this._service.apiServerUrl+'/'+this._constant.API_ENDPOINT.course_details+this.routeId+'?data=1'
    this._service.getwithoutData(url)
    .subscribe(
      res => {
        this.loaderData = true;
        let getData: any = res;
        let audAr: any ={};
        console.log(">>>>data: ", getData);
        //this.courseDetails = getData.records[0].course[0];
        this.trainingDetails = res['records'][0];
        let tempCourse: any =[];
        //tempCourse.push(getData.records[0].course[0]);

        // tempCourse.forEach((item, key) => {
        //   audAr[key] = {};
        //   audAr[key]['audience'] = '';
        //   let tempAr: any =[];
        //   if(item.public_course_dtls.allTargatedAud != undefined && item.public_course_dtls.allTargatedAud.length > 0){
        //     item.public_course_dtls.allTargatedAud.forEach(rec => {
        //         if(rec.target_aud_name != undefined && rec.target_aud_name.title != ''){
        //           tempAr.push(rec.target_aud_name.title);
        //         }
        //     })
        //     if(tempAr.length > 0){
        //       audAr[key]['audience'] = tempAr.join(', ')
        //     }
        //   }
        // })

        console.log("@Aud ar: ", audAr);
        this.audienceData = audAr;
        console.log("#Aud ar: ", this.audienceData, " -- ", this.audienceData[0]);
        this.courseDetails = tempCourse;
        
        // if(getData.records[0].course.public_course[0].allTargatedAud != undefined && getData.records[0].course[0].public_course.allTargatedAud.length > 0){
        //   getData.records[0].course[0].public_course.allTargatedAud.forEach(item => {
        //        if(item.target_aud_name != undefined && typeof item.target_aud_name == 'object'){
        //         audAr.push(item.target_aud_name.title);
        //        }
        //   })
        // }
        // if(audAr.length > 0){
        //   this.audienceData = audAr.join(', ');
        // }
        console.log("@Details: ", this.courseDetails);
      })
  }
}

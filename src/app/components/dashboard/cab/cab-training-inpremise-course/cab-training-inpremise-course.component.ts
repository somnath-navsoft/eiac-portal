import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cab-training-inpremise-course',
  templateUrl: './cab-training-inpremise-course.component.html',
  styleUrls: ['./cab-training-inpremise-course.component.scss']
})
export class CabTrainingInpremiseCourseComponent implements OnInit {

  subscriptions: Subscription[] = [];
  loaderData: boolean = true;
  allCourseTraining:any[] = [];
  totalRow:any = 5;
  rowCount:any = 1;
  allCourses:any;
  programEvent:string = '';
  scheduleProgramSection :string = '';
  programSection:any;
  trainingList:any = [];

  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    this.loadTrainingData();
  }

  loadTrainingData() {
    this.loaderData = false;
    this._service.getwithoutData(this._service.apiServerUrl+'/'+this._constant.API_ENDPOINT.training_course_list+'all/0')
    .subscribe(
      res => {
        this.loaderData = true;

        var targatedAudianceCourse = res['targatedAudianceCourse'];
        //this.trainingList = res['targatedAudianceCourse'];
        
        for(let key in targatedAudianceCourse)
        {
          if(targatedAudianceCourse[key].event && targatedAudianceCourse[key].event.tutor != '')
          {
            this.trainingList.push(targatedAudianceCourse[key]);
            
            this.trainingList = this.getUnique(this.trainingList);
            
            // //console.log(targatedAudianceCourse[key],'targatedAudianceCourse');
          }
        }
      });
  }

  getUnique(array){
    var uniqueArray = [];      
    // Loop through array values
    for(var key in array){
      // //console.log(value['training_course']);
        if(uniqueArray.indexOf(array[key]['training_course']) === -1){
            uniqueArray.push(array[key]['training_course']);
        }
    }
    return this.getmainArray(uniqueArray);
}

getmainArray(uniqueArray){
  var allData  = [];
  for(var key in uniqueArray){
    // this.trainingList.find(
    //    rec => rec.training_course == uniqueArray[key]
    // );

    var result = this.trainingList.find(rec => rec.training_course === uniqueArray[key]);
    allData.push(result);
  }
  return allData;
}

shortProgramListing(section:any) {
    // console.log('event');
    // console.log(this.programEvent,'programEvent');
    // console.log(section,'section');
    
    if(section == 'program_listing')
    {
      this.programSection = section;
      if(this.programEvent == 'coursename')
      {
        // this.allCourseTraining = ;
          this.allCourseTraining.sort((a,b) => (a.course.name > b.course.name) ? 1 : -1);
          // console.log()
      }else if(this.programEvent == 'audience')
      {
          this.allCourseTraining.sort((a,b) => (a.target_audiance > b.target_audiance) ? 1 : -1);

      }else if(this.programEvent == 'days')
      {
          this.allCourseTraining.sort((a,b) => (a.course.training_course.training_days > b.course.training_course.training_days) ? 1 : -1);
      }
      
    }else if(section == 'schedule_program_listing')
    {
      // this.scheduleProgramSection = section;
      if(this.scheduleProgramSection == 'coursename')
      {
        // this.allCourseTraining = ;
          this.trainingList.sort((a,b) => (a.course.name > b.course.name) ? 1 : -1);
          // console.log()
      }else if(this.scheduleProgramSection == 'audience')
      {
          this.trainingList.sort((a,b) => (a.target_audiance > b.target_audiance) ? 1 : -1);

      }else if(this.scheduleProgramSection == 'date')
      {
          this.trainingList.sort((a,b) => (a.event.eventDates[0].event_date > b.event.eventDates[0].event_date) ? 1 : -1);

      }else if(this.scheduleProgramSection == 'days')
      {
          this.trainingList.sort((a,b) => (a.course.training_course.training_days > b.course.training_course.training_days) ? 1 : -1);
      }
      
    }
    
  }

  load_more(total_show){
    this.rowCount = this.rowCount + parseInt(total_show) ;
    this.totalRow = this.rowCount*5;
    this.allCourseTraining = [];
    var courseArrLength = Object.keys(this.allCourses).length;
    for(let i=0; i<= this.totalRow; i++){
      if(this.allCourses[i])
      {
        
        this.allCourseTraining.push(this.allCourses[i]);
      }
    }

    if(this.programEvent != '' && this.programSection != '')
    {
      this.shortProgramListing(this.programSection);
    }
    
    // for(let i=1; i<= this.rowCount*1; i++)
      //console.log(courseArrLength,'courseArrLength')
  }
}

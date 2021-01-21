import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cab-training-public-course-list',
  templateUrl: './cab-training-public-course-list.component.html',
  styleUrls: ['./cab-training-public-course-list.component.scss']
})
export class CabTrainingPublicCourseListComponent implements OnInit {

  subscriptions: Subscription[] = [];
  pageDetails: any[]= [];
  loaderData: boolean = true;
  trainingList:any = [];
  trainingCourseList:any;
  trainingPreviousCourseList:any;
  audienceList:any;
  trainingCourceId:any = '';
  audId:any = '';
  trainingCourceId2:any = '';
  audienceId:any = 0;
  isTable:any = '';
  isTable2:any = '';
  targated_aud_name:any;
  allCourseTraining:any = [];
  rowCount:any = 1;
  allCourses:any;
  totalRow:any = 5;
  programlistingForm:any = {};
  programEvent:string = '';
  scheduleProgramSection :string = '';
  programSection:any;

  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    // this.loadData();
  
    this.loadTrainingData();
  }
  // ngOnDestroy(){
  //   this.subscriptions.forEach(subscription => subscription.unsubscribe());
  // }
  //Load Data
  // loadData(){
  //   this.loaderData = false;
  //   this.subscriptions.push(this._trainerService.getTrainerCourseTypeDetails()
  //   .subscribe(
  //      result => {
  //        let data: any = result;
  //        this.pageDetails = data.data;
  //        this.loaderData = true;
  //        //console.log(">>>>List REcord: ", this.pageDetails);
  //      }
  //   ));
  // }

  getTargetAudNames(audData: any){
      let audname: any[] = [];
      if(audData && audData.length){
          audData.forEach(item => {
              if(item.target_aud_name != undefined){
                audname.push(item.target_aud_name.title);
              }
          })
      }
      if(audname.length){
        let strAud: string = audname.join(', ');
        return strAud;
      }
  }

  setCourseAvailability(available: number){
      sessionStorage.setItem("courseAvailable", available.toString());
  }

  loadTrainingData() {
    this.loaderData = false;
    //this._service.apiServerUrl+'/'+this._constant.API_ENDPOINT.training_course_list+'all/0?data=1'
    let url: string = this._service.apiServerUrl+'/'+'public-course-event-list/';
    this._service.getwithoutData(url)
    .subscribe(
      res => {
        this.loaderData = true;
        let targatedAudianceCourse: any = res['allEventData']; 
        //console.log(res['allEventData'])
        //this.trainingList = res['targatedAudianceCourse'];
        let listCourse: any[] =[];
        targatedAudianceCourse.forEach(item => {
          let tempObj: any = {};
          if(item.public_course != undefined  ){
            let pcourse: any = item.public_course;

            tempObj['courseName'] = pcourse.course;
            tempObj['courseID'] = item.id;
            tempObj['courseCapacity'] = item.capacity;
            // if(item.id == 60 || item.id ==63){
            //   item.seat_availability = 0;
            // }
            tempObj['courseAvailability'] = item.seat_availability;
            tempObj['courseDuration']     = pcourse.training_days;
            tempObj['courseDate']         = new Date(item['eventDate'][0].event_date);
            tempObj['courseLocation']     = (pcourse.location != '' && pcourse.location == 'eiac_training_center') ? "EIAC Training Center" : '';
            tempObj['courseAudience']     = (pcourse.allTargatedAud != undefined && pcourse.allTargatedAud.length > 0) ? this.getTargetAudNames(pcourse.allTargatedAud) : '';
            listCourse.push(tempObj);
          }
        })
        this.trainingList = listCourse;
        //console.log("List course...", listCourse);

        
        // for(let key in targatedAudianceCourse)
        // {
        //   if(targatedAudianceCourse[key].event && targatedAudianceCourse[key].event.tutor != '')
        //   {
        //     this.trainingList.push(targatedAudianceCourse[key]);
        //     if(this.audienceId == '0')
        //     {
        //       this.trainingList = this.getUnique(this.trainingList);
        //     }
        //     // //console.log(targatedAudianceCourse[key],'targatedAudianceCourse');
        //   }
        // }
        // //console.log(this.trainingList,'trainingList');
        // this.allCourses = res['courseList'];
        // //console.log(this.allCourses,'allCourses')
       
        // for(let i=0; i<= this.rowCount*4; i++){
        //   if(this.allCourses[i]){
        //     this.allCourseTraining.push(this.allCourses[i]);
        //   }
        // }
        
        // console.log(this.allCourseTraining,'allCourseTraining');
        
        //this.targated_aud_name = res['targatedAudName'];
    })
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

}

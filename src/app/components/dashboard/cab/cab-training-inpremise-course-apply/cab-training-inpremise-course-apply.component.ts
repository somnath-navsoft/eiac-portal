import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cab-training-inpremise-course-apply',
  templateUrl: './cab-training-inpremise-course-apply.component.html',
  styleUrls: ['./cab-training-inpremise-course-apply.component.scss']
})
export class CabTrainingInpremiseCourseApplyComponent implements OnInit {

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
  targated_aud_name:any;
  audienceId:any = 0;
  inPremiseForm:any = {};
  trainingCartArr:any[] = []; 

  searchCountryLists: any[] =[];

  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    this.loadTrainingData();
  }

  getPlaceName()
   {
     if(typeof this.inPremiseForm.select_location != 'undefined')
     {
       this._service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.inPremiseForm.select_location+'.json?access_token='+this._service.mapboxToken+'','')
         .subscribe(res => {
             ////console.log(res['features']);
             this.searchCountryLists = res['features'];
           },
           error => {
           
       })
     }
   }

  addTraining(obj,index,id) {
    // console.log(obj);
    // console.log(index);
    // var newArray = [];
    // console.log(this.trainingCartArr);
    if(this.trainingCartArr.length == 0) {
      
        var findElem = obj.find((res,key) => key == index);
        
        // newArray.push();
        this.trainingCartArr.push(findElem);
        console.log(this.trainingCartArr);
    }else{
      var checkId = this.trainingCartArr.find(res => res.id == id);
      if(!checkId || typeof checkId == undefined) {
        var findElem = obj.find((res,key) => key == index);
        
        this.trainingCartArr.push(findElem);
        console.log(this.trainingCartArr);
      }
    }

  }

  removeTraining(obj,index) {
    this.trainingCartArr.splice(index,1);
     return true;
  }

  loadTrainingData() {
    this.loaderData = false;
    let url = this._service.apiServerUrl+'/'+'cust-course-event-list'
    //this._service.getwithoutData(this._service.apiServerUrl+'/'+this._constant.API_ENDPOINT.training_course_list+'all/0?data=1')
    this._service.getwithoutData(url)
    .subscribe(
      res => {
        this.loaderData = true;
        let getData: any = res;

       // var targatedAudianceCourse = res['records'];
        console.log(">>> ", getData.records[0].course)
        //this.trainingList = res['targatedAudianceCourse'];
        this.trainingList = getData.records[0].course;
        // for(let key in targatedAudianceCourse)
        // {
        //   if(targatedAudianceCourse[key].event && targatedAudianceCourse[key].event.tutor != '')
        //   {
        //     this.trainingList.push(targatedAudianceCourse[key]);
            
        //     this.trainingList = this.getUnique(this.trainingList);
            
        //     // //console.log(targatedAudianceCourse[key],'targatedAudianceCourse');
        //   }
        // }
        /*
        for(let key in targatedAudianceCourse)
        {
          if(targatedAudianceCourse[key].event_type)
          {
            this.trainingList.push(targatedAudianceCourse[key]);
            //if(this.audienceId == '0')
           // {
              this.trainingList = this.getUnique(this.trainingList);
            //}
            // //console.log(targatedAudianceCourse[key],'targatedAudianceCourse');
          }
        }
        // //console.log(this.trainingList,'trainingList');
        this.allCourses = res['records'];
        //console.log(this.allCourses,'allCourses')
       
        for(let i=0; i<= this.rowCount*4; i++){
          if(this.allCourses[i]){
            this.allCourseTraining.push(this.allCourses[i]);
          }
        }*/
        
        // console.log(this.allCourseTraining,'allCourseTraining');
        
        //this.targated_aud_name = res['targatedAudName'];
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
          this.trainingList.sort((a,b) => (a.course.name > b.course.name) ? 1 : -1);
          // console.log()
      }else if(this.programEvent == 'audience')
      {
          this.trainingList.sort((a,b) => (a.target_audiance > b.target_audiance) ? 1 : -1);

      }else if(this.programEvent == 'days')
      {
          this.trainingList.sort((a,b) => (a.course.training_course.training_days > b.course.training_course.training_days) ? 1 : -1);
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

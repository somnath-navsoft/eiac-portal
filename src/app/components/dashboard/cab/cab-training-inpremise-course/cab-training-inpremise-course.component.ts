import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { iif, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  targated_aud_name:any;
  audienceId:any = 0;
  inPremiseForm:any = {};
  trainingCartArr:any[] = []; 

  minDate: any = new Date();

  searchCountryLists: any[] =[];

  pageLimit: number = 5;
  totalListCount: number = 0;
  totalListData: any[] =[];
  totalListLen: number =0;
  sortValue: string ="";

  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService, public _toastr: ToastrService) { }

  ngOnInit() {
    this.loadTrainingData();
  }

  checkMin(theEvt: any, range: number){
    console.log(theEvt, " -- ", range);
    if(theEvt){
      console.log('.....', range)
        if(!isNaN(theEvt.key) && theEvt.key < range){
          console.log("...less number");
          //this.inPremiseForm.no_of_candidate = '';
          theEvt.preventDefault()
          return false;
        }
    }
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
      if(checkId != undefined){
        this._toastr.warning('Course already added','',{timeOut:1500})
        return false;
      }
      if(!checkId || typeof checkId == undefined) {
        var findElem = obj.find((res,key) => key == index);
        
        this.trainingCartArr.push(findElem);
        console.log(this.trainingCartArr);
      }
    }
    this._toastr.success('Course has been added','',{timeOut:1500})
    window.scrollTo(0,0);

  }

  removeTraining(obj,index) {
    this.trainingCartArr.splice(index,1);
    this._toastr.success('Course has been removed','');
     return true;
  }

  getPaginateData(limit: number, listData: any) {
    let pageData: any[];
    if (listData.length) {
      pageData = listData.slice(0, limit);
    }
    this.allCourseTraining = pageData;
    //console.log("....sorting....");
    this.sortByList(this.sortValue);
    console.log(">>>Page Data: ", pageData);
  }
  
  loadMore() {
    this.totalListCount = this.totalListCount + 10;
    this.pageLimit += 10;
    this.getPaginateData(this.pageLimit, this.totalListData)
    //
    

  }

  loadTrainingData() {
    this.loaderData = false;
    let url: any = this._service.apiServerUrl+'/'+'public-course-list';
    //this._service.apiServerUrl+'/'+this._constant.API_ENDPOINT.training_course_list+'all/0?data=1'
    this._service.getwithoutData(url)
    .subscribe(
      res => {
        this.loaderData = true;

        console.log(">>> ", res);

        var targatedAudianceCourse = res['records'];
        //this.trainingList = res['targatedAudianceCourse'];
        this.allCourseTraining = res['records'];
        if(this.sortValue == ''){
          //this.sortValue = 'course';
        }
        //this.sortByList(this.sortValue);
        this.totalListLen = this.allCourseTraining.length;
        this.totalListData = this.allCourseTraining        
        this.getPaginateData(this.pageLimit, this.totalListData);
        
        
        // for(let key in targatedAudianceCourse)
        // {
        //   if(targatedAudianceCourse[key].event && targatedAudianceCourse[key].event.tutor != '')
        //   {
        //     this.trainingList.push(targatedAudianceCourse[key]);
            
        //     this.trainingList = this.getUnique(this.trainingList);
            
        //     // //console.log(targatedAudianceCourse[key],'targatedAudianceCourse');
        //   }
        // }

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
        // // //console.log(this.trainingList,'trainingList');
        // this.allCourses = res['courseList'];
        // //console.log(this.allCourses,'allCourses')
       
        // for(let i=0; i<= this.rowCount*4; i++){
        //   if(this.allCourses[i]){
        //     this.allCourseTraining.push(this.allCourses[i]);
        //   }
        // }
        
        // console.log(this.allCourseTraining,'allCourseTraining');
        
        this.targated_aud_name = res['targatedAudName'];
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
//webservice/cust-course-save/
//{"course_id_arr":["69","70"],"course_type":"custom_course","event_start_date_time":"2020-08-21T18:30:00.000Z","custom_location":"15, Topsia Road","agreement_status":"accepted"}

setexDate(){
  this.minDate.setDate(this.minDate.getDate());
}

onSubmit(theForm: any){
  
  if(theForm.form.valid){
    let courseIdAr: any[] =[];
    this.trainingCartArr.forEach(item => {
      courseIdAr.push(item.id);
    })

    if(this.inPremiseForm.no_of_candidate < 10){
      this._toastr.warning("Number of candidate should be minimum 10", '', {timeOut: 2300})
      return false;
    }

    //{"course_id_arr":["69","70"],"course_type":"custom_course","event_start_date_time":"2020-08-21T18:30:00.000Z",
    //"capacity":"20","custom_location":"7 nG Kolkata","agreement_status":"accepted"}

    // console.log(this.inPremiseForm.select_date,'select_date');
    let postData: any = {};
    postData['course_type']           = "custom_course";
    postData['capacity']              = this.inPremiseForm.no_of_candidate;

    let date_establishment= new Date(this.inPremiseForm.select_date);
    date_establishment.setMinutes(date_establishment.getMinutes() - date_establishment.getTimezoneOffset());

    postData['event_start_date_time'] = date_establishment;
    postData['custom_location']       = this.inPremiseForm.select_location;
    postData['agreement_status']      = "accepted";
    postData['course_id_arr']         = courseIdAr;
    let urlPost: string = this._service.apiServerUrl+"/"+'cust-course-save/';
    console.log(">>>submitting....", postData, " -- ", urlPost, " == ", this.trainingCartArr);
    this._service.post(urlPost, postData)
      .subscribe(
        res => {
          console.log(">>>Submit post: ", res);
          if(res['status'] == 200) {
            let data: any = {};
             data = res;               
            this._toastr.success(res['msg'],'');
            this.trainingCartArr = [];
          }else{
            this._toastr.warning(res['msg'], '');
          }
        });    

  }else{
    this._toastr.warning("Please Fill Required Fields.", '', {timeOut: 2500})
  }

}


sortByList(field: any){
  //console.log(">>> Get field: ", field);
  if(field != undefined && field == 'course'){
    //console.log(">> sort by course: ", field);
    this.allCourseTraining.sort((a,b) => (a.course.toString().toLowerCase() > b.course.toString().toLowerCase()) ? 1 : -1);
  }
  // if(field != undefined && field.value == 'course'){
  //   console.log(">> sort by course: ", field);
  //   this.allCourseTraining.sort((a,b) => (a.course > b.course) ? 1 : -1);
  // }
  if(field != undefined && field == 'rate'){
    //console.log(">> sort by course: ", field);
    this.allCourseTraining.sort((a,b) => (a.fees_per_trainee > b.fees_per_trainee) ? 1 : -1);
  }
  if(field != undefined && field == 'days'){
    //console.log(">> sort by course: ", field);
    this.allCourseTraining.sort((a,b) => (a.training_days > b.training_days) ? 1 : -1);
  }
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
          this.allCourseTraining.sort((a,b) => (a.course > b.course) ? 1 : -1);
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
          this.trainingList.sort((a,b) => (a.course > b.course) ? 1 : -1);
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

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { 
  MatStepper
} from '@angular/material';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { Router } from '@angular/router';

import { TrainerState, selectTrainerList} from '../../../../store/trainer.states';
import { Listing, Delete } from '../../../../store/actions/trainer.actions';
import { TrainerCourseModel} from '../../../../models/trainerCourse';

@Component({
  selector: 'app-trainer-service',
  templateUrl: './trainer-service.component.html',
  styleUrls: ['./trainer-service.component.scss'],
  providers: [Constants, AppService, ToastrService, Overlay, OverlayContainer]
})
export class TrainerServiceComponent implements OnInit, OnDestroy {

  //Observable subscription
  subscriptions: Subscription[] = [];
  applyForm: any= {};
  isCompletedCourse: boolean = false;
  selectValue: string = "course1";
  selectValue1: string = "course2";
  courseSelection: Array<any> = [];
  newRow: any = {};
  isAgree: boolean =false;

  selectCourses: any = [];
  selectCoursePayment: any = [];
  selectCustomCourse: any = ''; 
  selectCustomCourses: any[] = [];
  selectCustomCourseValue: string = 'custom_course';
  headerSteps: any[] = [];


  //Public Course
  public_course_item: any ={};
  trainingDays: any[] =[];
  selectPublicCourseOptions: any = {};
  selectFeesCalData: any[] = [];
  feesPerTrainee: any;


  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('stepper1', {static: false}) stepper1: MatStepper;

  constructor(private _service: AppService, private http: HttpClient,
    public _toaster: ToastrService, private _router: Router,
    private _trainerService: TrainerService, private _constant: Constants) { }

  addRow(obj: any = []){
      this.newRow = {};
      ////console.log("prev values: ", obj);
      obj.push(this.newRow);
    return true;
  }
  removeRow(obj: any, index: number){
    obj.splice(index, 1);
    return true;
  }

  getAllCourse(){
    this.subscriptions.push(this._trainerService.getTrainerCourseAll()
       .subscribe(
          result => {
            let data: any = result;
            this.selectCourses = data.records;
            //console.log(">>>>course: ", this.selectCourses);
          }
       ))
  }

  getCalculateFeesByDays(){
    let getDays = this.public_course_item.course_days;
    let feesCalData: any = this.selectFeesCalData;
    let fees_per_day = 0; let tax: any;
    let knowledge_fees = 0; let investment_fees = 0;
    if(feesCalData && feesCalData.length){
      feesCalData = this.selectFeesCalData;
      if(feesCalData != undefined && typeof feesCalData === 'object'){
         //console.log(">>>get calculation ", feesCalData, " :: ", feesCalData[1].value);
         fees_per_day     = parseInt(feesCalData[0].value);
         tax              = (feesCalData[1].value);
         knowledge_fees   = parseInt(feesCalData[2].value);
         investment_fees  = parseInt(feesCalData[3].value); 

         var calcDays = parseInt((tax * getDays * fees_per_day).toString());
         var afterWard = calcDays;
         var fees_per_trainee = parseInt((getDays * fees_per_day).toString()) + parseInt((knowledge_fees+investment_fees + afterWard).toString());
         //console.log("@Value of fees_per_day: ", fees_per_day, "-", tax, '-', knowledge_fees, '-', investment_fees, " -- ", getDays);
         //console.log("Value calc: ", fees_per_trainee);
         this.feesPerTrainee = fees_per_trainee.toString();
      }
    }
  }

  getAllPublicOptions(){
    this.subscriptions.push(this._trainerService.getTrainerPublicCourseOptions()
        .subscribe(
           result => {
             let data: any = result;
             if(data && data.targatedAudiance != undefined && data.targatedAudiance.length){
               this.selectPublicCourseOptions['targatedAudiance'] = data.targatedAudiance;
             }
             if(data && data.cabType != undefined && data.cabType.length){
              this.selectPublicCourseOptions['cabType'] = data.cabType;
            }
            if(data && data.courseType != undefined && data.courseType.length){
              this.selectPublicCourseOptions['courseType'] = data.courseType;
            }
            if(data && data.feesCalData != undefined && data.feesCalData.length){
                this.selectFeesCalData = data.feesCalData;
            }
             //console.log(">>>>Public course: ", this.selectPublicCourseOptions, " :: ", this.selectFeesCalData);
           }
      ))
   }

  selectCourseType(value: any){

    if(value != undefined){
      this.selectCustomCourse             = value;
      this.applyForm['selectCourseType']  = this.selectCustomCourse;
    }
  }

  ngOnDestroy() {
    ////console.log(">>>Component Destroying...");
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit() {
    this.courseSelection                = [{}]; 
    this.selectCustomCourse             =  this.selectCustomCourseValue;
    this.applyForm['selectCourseType']  = this.selectCustomCourse;
    this.applyForm['selectCourse']      = this.courseSelection;
    this.applyForm['selectPayment']     = {};

    this.selectCustomCourses.push({title: 'Custom Course', value: 'custom_course'})
    this.selectCustomCourses.push({title: 'Public Course', value: 'public_course'}) 

    this.selectPublicCourseOptions['targatedAudiance'] = [];
    this.selectPublicCourseOptions['cabType'] = [];
    this.selectPublicCourseOptions['courseType'] = [];
    this.selectPublicCourseOptions['courseLocations'] = [];
    this.selectPublicCourseOptions['courseLocations'].push({title: 'Client premise', value: 'client_premisis'});
    this.selectPublicCourseOptions['courseLocations'].push({title: 'EIAC Training Center', value: 'eiac_training_center'});

    this.public_course_item['target_audience'] = [];
    this.public_course_item['course_arabic_name'] = '';
    this.public_course_item['course_english_name'] = '';
    this.public_course_item['course_arabic_details'] = '';
    this.public_course_item['course_english_details'] = '';
    this.public_course_item['cabs_type'] = [];
    this.public_course_item['course_type'] = '';
    this.public_course_item['course_location'] = '';
    this.public_course_item['course_days'] = '';
    this.public_course_item['course_capacity'] = '';
    for(var k=1;k<=29; k++){
      this.trainingDays.push(k);
    }

    //Assign steps
    this.headerSteps.push(
    {
        title:'course', desc:'1. Course <br> Information', stepComp:false, active:'user-done', nextStep:'payment'
        },
        {
        title:'payment', desc:'2. Payment <br> Information', stepComp:false, active:'', nextStep:'review'
        },
        {
        title:'review', desc:'3. Review <br> Information', stepComp:false, active:'', nextStep:'finish'
        },
        {
        title:'finish', desc:'4. Finish', stepComp:false, active:'', nextStep:null
        }
      );


    this.getAllCourse();
    this.getAllPublicOptions();
  }


  nextClicked(event) {
    // complete the current step
    //console.log("step: ", event);
    this.stepper.selected.completed = true;
    // move to next step
    this.stepper.next();
  }

  stepClick(event: any){
    this.stepper.selected.completed = false;
    this.stepper.previous();
    return;
    if(!this.isCompletedCourse){
      this.stepper.reset();
      //this._service.openMessageDialog('Course Not Completed, Please complete first', "Wizard Step Error!");
      
    }
    //console.log("step: ", event);
    //return false;
  }

  headerStepClick(stepId: string, target?: any){
     let stepElem = document.getElementById(stepId);
     let targetElem = document.getElementById(target);

     //let headerID = stepId.toString() + '_header';
     //let headerSec = document.getElementById(headerID);
     //, document.getElementById(headerID).classList

     let curStep = this.headerSteps.findIndex(rec => rec.title === stepId.toString());
     if(curStep){
       if(curStep-1 < 0){
         return false;
       }
        let prevSteps = this.headerSteps[curStep-1];
        //console.log("prev steps: >>>>", prevSteps);
        if(prevSteps){
            let prevStepComp = prevSteps.stepComp;
            if(!prevStepComp){
              return false;
            }
        }
     }
     //console.log(">>>Elem: ", stepElem, " -- ", " -- ");
     if(stepElem){
       switch(stepId){
         
         case 'course':
          stepElem.style.display = 'block';
          if(targetElem){
            targetElem.style.display = 'none';
          }
         break;
         case 'review':
          stepElem.style.display = 'block';
          if(targetElem){
            targetElem.style.display = 'none';
          }
         break;
         case 'payment':
          // if(!this.isCompletedCourse){
          //   //console.log("course not comp...");
          //   return false;
          // } 
          
          stepElem.style.display = 'block';
          if(targetElem){
            targetElem.style.display = 'none';
          }
          //targetElem.style.display = 'none';
         break;
         case 'finish':
          stepElem.style.display = 'block';
          if(targetElem){
            targetElem.style.display = 'none';
          }
         break;
       }      
     }
  }

  isValid(){
    //console.log("custom course: ", this.selectCustomCourse);
    if(!this.isAgree){
      return false;
    }
    if(this.courseSelection.length != undefined && this.courseSelection.length > 0){
          //check empty
          for(var k=0; k<this.courseSelection.length; k++){
            let emptyObj = this._service.isObjectEmpty(this.courseSelection[k]);
            ////console.log("Emty ...", emptyObj, " -- ", k);
            if(emptyObj){
               return false;
            }
        }
    }
    return true;
  }

  //--------SUBMIT for Course Request
  onCourseNext(event: any){
    //console.log(">>Form 1 :", event, " -- ", this.isAgree, " -- ", this.courseSelection, " -- ", 

    if(this.isValid()){
      this.stepper.selected.completed = false;
      this.stepper.next();
      this.isCompletedCourse = true;
      // let curStep = this.headerSteps.find(rec => rec.title === 'course');
      // let findStep = this.headerSteps.findIndex(rec => rec.title === 'payment');
      // //console.log("find stete: ", findStep);
      // if(findStep){
      //   this.headerSteps[findStep].active = 'user-done';
      //   //previous steps;
      //   curStep.stepComp = true;
      //   let prevTitle = this.headerSteps[findStep-1].title;
      //   let targetElem = document.getElementById(prevTitle.toString());
      //   targetElem.style.display = 'none';
      // }
      // //console.log("build stete: ", this.headerSteps);
      // this.headerStepClick('payment');
      // //payment list data
      this.selectCoursePayment = [];
      if(this.applyForm && this.applyForm.selectCourse.length){
          this.applyForm.selectCourse.forEach(rec => {
               let findData = this.selectCourses.find(item => item.id == rec.course);
               //console.log("@Find Data: ", findData);
               if(findData){
                 this.selectCoursePayment.push(findData);
               }
          })
     }
    }else{
      this._service.openMessageDialog('Please enter required fields.', "Validation Error");
    }    
  }

  backStep(){
    this.stepper.previous();
    // let targetElem = document.getElementById('course');
    // let currentElem = document.getElementById('payment');
    // targetElem.style.display = 'block';
    // currentElem.style.display = 'none';
    // this.headerStepClick('course');
  }

  isValidPublicCourse(){
    //console.log("validate public course: ", this.public_course_item);
    if(this.public_course_item.course_english_name === '' || this.public_course_item.course_arabic_name === '' ||
    this.public_course_item.target_audience.length == 0 || this.public_course_item.cabs_type.length == 0 || 
    this.public_course_item.course_location === '' || this.public_course_item.course_days === ''){
       return false;
    }
    return true;
  }

  onPublicCourse(){
     //console.log('Add Public course');
     let postObject: any = {};

     if(this.isValidPublicCourse()){
        postObject['name_dtls_arr'] = [];
        //english
        postObject['name_dtls_arr'].push({title: this.public_course_item.course_english_name, details: this.public_course_item.course_english_details})
        //arabic
        postObject['name_dtls_arr'].push({title: this.public_course_item.course_arabic_name, details: this.public_course_item.course_arabic_details})
        postObject['target_audiance_arr'] = this.public_course_item.target_audience;
        postObject['cab_type_arr'] = this.public_course_item.cabs_type;
        postObject['course_type'] = this.selectCustomCourse;
        postObject['location'] = this.public_course_item.course_location;
        postObject['training_days'] = this.public_course_item.course_days;
        postObject['fees_per_trainee'] = this.feesPerTrainee;
        postObject['capacity'] = this.public_course_item.course_capacity;
        postObject['course_type_id'] = this.public_course_item.course_type;

        //console.log(">>>POST Req: ", postObject);
        //return;
        if(postObject){

        this.subscriptions.push(this._trainerService.savePublicCourse((postObject))
            .subscribe(
              result => {
               let data: any = result;
               //console.log(">>>>public course saving...: ", result);
               if(data && data.status == 200 && data.response === 'success'){   
                  setTimeout(()=>{
                   let custMsg = '';
                   custMsg = data.msg;
                   
                   if(data.course_code != undefined && data.course_code != ''){
                    custMsg += ' :: Course CODE - ' + data.course_code;
                   }
                   this._service.openFlashMessage(custMsg,'',5000);
                 },100)
                 this._router.navigateByUrl('/dashboard/trainers/training-service');
               }
             }
          ))
        }
     }else{
      this._service.openMessageDialog('Please enter required fields.', "Validation Error");
     }
  }

  //--------SUBMIT for Payment
  onPaymentRequest(){
      let postData: any[] = [];
      let postObj: any = {};
      if(this.courseSelection.length){
        this.courseSelection.forEach(rec => {
             if(rec.course != undefined){
              postData.push(rec.course);
             }
        })
      }  
      
      // //Step travarse
      // let curStep = this.headerSteps.find(rec => rec.title === 'payment');
      // let findStep = this.headerSteps.findIndex(rec => rec.title === 'review');
      // //console.log("find stete: ", findStep, " -- ", curStep);
      // if(findStep){
      //   this.headerSteps[findStep].active = 'user-done';
      //   //previous steps;
      //   curStep.stepComp = true;
      //   let prevTitle = curStep.title; //this.headerSteps[findStep-1].title;
      //   let targetElem = document.getElementById(prevTitle.toString());
      //   targetElem.style.display = 'none';
      // }
      // //console.log("build stete: ", this.headerSteps);
      // this.headerStepClick('review');  


      postObj['course_id_arr']  = postData;
      postObj['course_type']    = this.selectCustomCourse;
      // let authUserData = this._service.decodeJWT(this._service.getToken());
      // //console.log(">>>Auth ", authUserData);
      // if(authUserData){
      //   let userId = authUserData.user_id;
      //   postObj['user_id'] = userId;
      // }
      //console.log('post data: ', JSON.stringify(postObj), " -- ", postObj);
      //return;

      this.subscriptions.push(this._trainerService.saveTrainerCourse((postObj))
          .subscribe(
            result => {
            let data: any = result;
            //console.log(">>>>course saving...: ", result);
            if(data && data.status == 200 && data.response === 'success'){
              //  this.isCompletedCourse = false;
              //  this.isAgree = false;
              //  this.courseSelection = [{}];
              //  this.applyForm['selectCourse'] = this.courseSelection;
              //  this.stepper.previous();

               setTimeout(()=>{
                this._service.openFlashMessage(data.msg);
              },100)
              this._router.navigateByUrl('/dashboard/trainers/training-service');
               //this._toaster.show(data.msg,data.response);
            }
          }
    ))
  }

  onComplete(event: any){
    //console.log(">>Complete :", event);
  }
}

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
import { Router, ActivatedRoute } from '@angular/router';

import { TrainerState, selectTrainerList} from '../../../../store/trainer.states';
import { Listing, Delete } from '../../../../store/actions/trainer.actions';
import { TrainerCourseModel} from '../../../../models/trainerCourse';

@Component({
  selector: 'app-cab-trainer-service',
  templateUrl: './cab-trainer-service.component.html',
  styleUrls: ['./cab-trainer-service.component.scss'],
  providers: [Constants, AppService, ToastrService, Overlay, OverlayContainer]
})
export class CabTrainerServiceComponent implements OnInit, OnDestroy {

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

  selectCustomCourseType: any;
  courseEditID: number = 0;


  //Public Course
  public_course_item: any ={};
  trainingDays: any[] =[];
  selectPublicCourseOptions: any = {};
  selectFeesCalData: any[] = [];
  feesPerTrainee: any;
  courseTypeDisabled: boolean = false;


  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('stepper1', {static: false}) stepper1: MatStepper;

  constructor(private _service: AppService, private http: HttpClient,
    public _toaster: ToastrService, private _router: Router, private _route: ActivatedRoute,
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
    //this.courseSelection                = [{}]; 
    this.selectCustomCourse             =  this.selectCustomCourseValue;
    this.applyForm['selectCourseType']  = this.selectCustomCourse;
    //this.applyForm['selectCourse']      = this.courseSelection;
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

    this.getAllCourse();
    this.getAllPublicOptions();

    //Assign steps
    this.headerSteps.push(
      {
      title:'course', desc:'1. Course <br> Information', activeStep:true, stepComp:true, active:'user-done', nextStep:'payment'
      },
      {
      title:'payment', desc:'2. Payment <br> Information', activeStep:false, stepComp:false, active:'user-done', nextStep:null
      }
    );
    // this.headerSteps.push(
    // {
    //     title:'course', desc:'1. Course <br> Information', stepComp:false, active:'user-done', nextStep:'payment'
    //     },
    //     {
    //     title:'payment', desc:'2. Payment <br> Information', stepComp:false, active:'', nextStep:'review'
    //     },
    //     {
    //     title:'review', desc:'3. Review <br> Information', stepComp:false, active:'', nextStep:'finish'
    //     },
    //     {
    //     title:'finish', desc:'4. Finish', stepComp:false, active:'', nextStep:null
    //     }
    //   );

      this._route.params.subscribe(params => {
        //console.log("@@@Get params: ", params);
        if(params.id != undefined && params.id > 0){
          //console.log('get Id: ', params.id);
          this.courseEditID = params.id;

          if(this.courseEditID){  
            this.courseTypeDisabled = true;   
            this.subscriptions.push(this._trainerService.getTrainerCourseByID(this.courseEditID)
                .subscribe(
                   result => {
                     let data: any = result;
                      if(data != undefined && data.records != undefined){
                        //console.log("@Edite data: ", data.records);//
                        if(data.records.courseTypeId != undefined && data.records.courseTypeId > 0){
                            this.selectCustomCourseType = data.records.courseTypeId;
                        }
                        if(data.records.agreement_status != undefined && data.records.agreement_status === 'accepted'){
                            this.isAgree = true;
                        }
                        if(data.records.customCourseListDetails != undefined && data.records.customCourseListDetails.length > 0){
                          data.records.customCourseListDetails.forEach(rec =>{
                               let id = rec.id;
                               this.courseSelection.push({course: id}); 
                          })
                          this.applyForm['selectCourse']      = this.courseSelection;
                              this.selectCoursePayment = [];
                              if(this.applyForm && this.applyForm.selectCourse.length){
                                  console.log('payment courses: ',this.applyForm.selectCourse, " -- ",  this.selectCourses);
                                  this.applyForm.selectCourse.forEach(rec => {
                                      let findData = this.selectCourses.find(item => item.id == rec.course);
                                      console.log("@Find Data: ", findData);
                                      if(findData){
                                        this.selectCoursePayment.push(findData);
                                      }
                                  })
                            }
                        }  
                      }
                   }
                )
            );
          }
        }else{
          this.courseSelection                = [{}];
          this.applyForm['selectCourse']      = this.courseSelection;
        }
    });

    
  }



  isValid(){
    //console.log("custom course: ", this.selectCustomCourse);
    if(!this.isAgree){
      return false;
    }
    if(this.selectCustomCourseType === ''){
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
      //console.log("@Enter....1")
      // this.stepper.selected.completed = false;
      // this.stepper.next();
      // this.isCompletedCourse = true;
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
      //console.log("@Enter....2: ", this.applyForm)
      this.selectCoursePayment = [];
      if(this.applyForm && this.applyForm.selectCourse.length){
          //console.log('payment courses: ',this.applyForm.selectCourse, " -- ",  this.selectCourses);
          this.applyForm.selectCourse.forEach(rec => {
               let findData = this.selectCourses.find(item => item.id == rec.course);
               //console.log("@Find Data: ", findData);
               if(findData){
                 this.selectCoursePayment.push(findData);
               }
          })
     }
     this._service.moveSteps('course','payment',this.headerSteps);
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
                 this._router.navigateByUrl('/dashboard/cab_client/training-service');
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
      postObj['agreement_status'] = (this.isAgree) ? 'accepted' : 'rejected';
      if(this.courseEditID == 0){
        postObj['course_type_id']    = this.selectCustomCourseType;
      }
      // let authUserData = this._service.decodeJWT(this._service.getToken());
      // //console.log(">>>Auth ", authUserData);
      // if(authUserData){
      //   let userId = authUserData.user_id;
      //   postObj['user_id'] = userId;
      // }
      //console.log('post data: ', JSON.stringify(postObj), " -- ", postObj);
      //return;

      if(this.courseEditID > 0){
        //console.log("@Update calling: ", postObj);
        this.subscriptions.push(this._trainerService.updateTrainerCourse(postObj, this.courseEditID)
                .subscribe(
                  result => {
                  let data: any = result;
                  //console.log(">>>>course updating...: ", result);
                  if(data && data.status == 200 && data.response === 'success'){
                    setTimeout(()=>{
                      this._service.openFlashMessage(data.msg);
                    },100)
                    this._router.navigateByUrl('/dashboard/cab_client/training-service');
                  }
                }
          ))
      }else{
        this.subscriptions.push(this._trainerService.saveTrainerCourse(postObj)
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
                    this._router.navigateByUrl('/dashboard/cab_client/training-service');
                    //this._toaster.show(data.msg,data.response);
                  }
                }
          ))
      }       
  }

  onComplete(event: any){
    //console.log(">>Complete :", event);
  }
}


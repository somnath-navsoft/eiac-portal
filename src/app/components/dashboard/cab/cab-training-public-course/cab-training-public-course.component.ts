

import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

declare let paypal: any;
@Component({
  selector: 'app-cab-training-public-course',
  templateUrl: './cab-training-public-course.component.html',
  styleUrls: ['./cab-training-public-course.component.scss'],
  providers: [Constants, AppService, ToastrService, Overlay, OverlayContainer] 
})
export class CabTrainingPublicCourseComponent implements OnInit {

  subscriptions: Subscription[] = [];
  headerSteps: any[] = [];

  public publicTrainingForm: any = {
    training_duration:0,
  };
  public newRow: any = {};
  public participant_details: Array<any> = [];
  public participant_details_addMOre: Array<any> = [];
  first_programe_val:any;
  countryLists:any;
  eventLists:any[] = [];
  participant_trainee:number = 0;
  amount1:any;
  amount2:any;
  amount3:any;
  amount4:any;
  training_duration_data: any[]=[];
  fee_day_pertime1:any = 1000;
  fee_day_pertime2:any = '5%';
  fee_day_pertime3:any = 10;
  fee_day_pertime4:any = 10;
  total:any;
  count:number=0;
  selectCustomCourses: any[] = [];
  transactions: any[] =[];
  transactionsItem: any={};
  publicCourseId:any;
  step1Data:any = {};
  step2Data:any = {};
  step3Data:any = {};
  step4Data:any = {};
  step5Data:any = {};
  step6Data:any = {};
  step7Data:any = {};
  step8Data:any = {};

  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  step4DataBodyFormFile:any = new FormData();
  step5DataBodyFormFile:any = new FormData();
  step6DataBodyFormFile:any = new FormData();
  step7DataBodyFormFile:any = new FormData();
  step8DataBodyFormFile:any = new FormData();
  participantTraineeDetails:any = [{}];
  loader:boolean = true;
  userEmail:any;
  userType:any;
  voucherSentData: any = {};
  getCountryLists:any;
  allStateList:any[] = [];
  allCityList: Array<any> = [];
  formApplicationId:any
  trainingDuration:any[] = [];

  constructor(private Service: AppService, private http: HttpClient,
    public _toaster: ToastrService, private _router: Router, private _route: ActivatedRoute,
    private _trainerService: TrainerService, private _constant: Constants) { }

  ngOnInit() {
    this.publicCourseId = sessionStorage.getItem('publicCourseId');
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');

    this.amount1 = 1 * this.fee_day_pertime1 * this.publicTrainingForm.training_duration;
    this.amount2 = 0.5 * this.amount1;
    this.amount3 = 0 * 1;
    this.amount4 = 0 * 1;
    this.total = this.amount1 + this.amount2 + this.amount3 + this.amount4;

    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
      },
      {
      title:'participant', desc:'2.Participant/Trainee Details', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'training_details', desc:'3. Training Details', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
      },
      {
      title:'fees_details', desc:'4. Fees Details', activeStep:false, stepComp:false, icon:'icon-task', activeClass:''
      },
      {
        title:'authorization_application', desc:'5. Authorization of The Application', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
      },
      {
      title:'proforma_invoice', desc:'6. Proforma Invoice', activeStep:false, stepComp:false, icon:'icon-paper', activeClass:''
      },
      {
      title:'payment_update', desc:'7. Payment Update', activeStep:false, stepComp:false, icon:'icon-work', activeClass:''
      },
      {
        title:'application_complete', desc:'8. Application Complete', activeStep:false, stepComp:false, icon:'icon-file_invoice', activeClass:''
      },
    );

    this.loadCountryStateCity();
    this.loadDetailsPage();
    this.trainingDuration = [{key:1,title:'1 Day'},{key:2,title:'2 Days'},{key:3,title:'3 Days'},{key:4,title:'4 Days'},{key:5,title:'5 Days'},{key:6,title:'6 Days'},{key:7,title:'7 Days'},{key:8,title:'8 Days'},{key:9,title:'9 Days'},{key:10,title:'10 Days'}]
  }

  loadDetailsPage() {
    this.Service.getwithoutData(this.Service.apiServerUrl+'/'+this._constant.API_ENDPOINT.course_details+this.publicCourseId+'?data=1')
    .subscribe(
      res => {
        var courseDetails = res['courseDetails'];
        this.step3Data.training_course_title = courseDetails.course;
        this.step3Data.training_duration = courseDetails.training_days;
        console.log(courseDetails.training_days,'training_days');
      })
  }

  loadCountryStateCity = async() => {
    let countryList =  this.Service.getCountry();
    await countryList.subscribe(record => {
      // console.log(record,'record');
      this.getCountryLists = record['countries'];
    });
    
  }

  statelistById = async(country_id) => {
    this.allStateList = [];
    let stateList =  this.Service.getState();
    await stateList.subscribe( result => {
        for(let key in result['states']) {
          if(result['states'][key]['country_id'] == country_id )
          {
            this.allStateList.push(result['states'][key]);
          }
        }
    });
    // console.log(this.allStateList);
  }

  citylistById = async(state_id) => {
    this.allCityList = [];
    let cityList =  this.Service.getCity();
    await cityList.subscribe( result => {
        for(let key in result['cities']) {
          if(result['cities'][key]['state_id'] == state_id )
          {
            this.allCityList.push(result['cities'][key]);
          }
        }
    },
    error =>{
        console.log("Error: ", error);
    }
    
    );
  }

  onSubmitStep1(ngForm1){
    this.Service.moveSteps('application_information', 'participant', this.headerSteps);
    if(ngForm1.form.valid) {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step1 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '1';
      this.step1Data.is_draft = false;
      this.step1Data.training_form_type = 'public_training';

      this.publicTrainingForm.step1 = this.step1Data;

      // console.log(this.publicTrainingForm);
      this.loader = false;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          if(res['status'] == true) {
            this.formApplicationId = (this.formApplicationId && this.formApplicationId != '') ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['id']);
            this.Service.moveSteps('application_information', 'participant', this.headerSteps);
          // console.log(res);
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }
  }

  onSubmitStep2(ngForm2){
    this.Service.moveSteps('participant', 'training_details', this.headerSteps);
    if(ngForm2.form.valid) {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step2 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step1Data.is_draft = false;

      this.publicTrainingForm.step2 = this.step2Data;

      this.publicTrainingForm.step2['trainee_details'] = [];
    
      if(this.participantTraineeDetails) {
        this.publicTrainingForm.step2['trainee_details'] = this.participantTraineeDetails;
      }

      // console.log(this.publicTrainingForm);
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.Service.moveSteps('participant', 'training_details', this.headerSteps);
            // console.log(res);
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }
  }

    onSubmitStep3(ngForm3){
      this.Service.moveSteps('training_details', 'fee_details', this.headerSteps);
      if(ngForm3.form.valid) {
        this.publicTrainingForm = {};
        this.publicTrainingForm.step3 = {};
        this.publicTrainingForm.email = this.userEmail;
        this.publicTrainingForm.userType = this.userType;
        this.publicTrainingForm.saved_step = '3';
        this.step1Data.is_draft = false;

        var applicationId = sessionStorage.getItem('applicationId');
        // this.step2Data.application_id = applicationId;
        this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

        this.publicTrainingForm.step3 = this.step3Data;

        // console.log(this.publicTrainingForm);
        this.step2DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
        this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step2DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.Service.moveSteps('training_details', 'fee_details', this.headerSteps);
              // console.log(res);
            }else{
              this._toaster.warning(res['msg'], '');
            }
          })
      }
    }

    onSubmitStep4(ngForm4){
      this.Service.moveSteps('fee_details', 'authorization', this.headerSteps);
      if(ngForm4.form.valid) {
        this.publicTrainingForm = {};
        this.publicTrainingForm.step4 = {};
        this.publicTrainingForm.email = this.userEmail;
        this.publicTrainingForm.userType = this.userType;
        this.publicTrainingForm.saved_step = '4';
        this.step1Data.is_draft = false;

        this.publicTrainingForm.step4 = this.step1Data;

        console.log(this.publicTrainingForm);
        // this.step2DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
        // this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.healthcareForm,this.step2DataBodyFormFile)
        // .subscribe(
        //   res => {
        //   })
      }
    }

    onSubmitStep5(ngForm5){
      this.Service.moveSteps('authorization', 'proforma_invoice', this.headerSteps);
      if(ngForm5.form.valid) {
        this.publicTrainingForm = {};
        this.publicTrainingForm.step5 = {};
        this.publicTrainingForm.email = this.userEmail;
        this.publicTrainingForm.userType = this.userType;
        this.publicTrainingForm.saved_step = '5';
        this.step1Data.is_draft = false;

        this.publicTrainingForm.step5 = this.step1Data;

        console.log(this.publicTrainingForm);
        // this.step2DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
        // this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.healthcareForm,this.step2DataBodyFormFile)
        // .subscribe(
        //   res => {
        //   })
      }
    }

}


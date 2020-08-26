import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
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

  constructor(private _service: AppService, private http: HttpClient,
    public _toaster: ToastrService, private _router: Router, private _route: ActivatedRoute,
    private _trainerService: TrainerService, private _constant: Constants) { }

  ngOnInit() {
    this.participant_details =  [{}];
    this.publicTrainingForm.participant_details          = this.participant_details;
    this.amount1 = 1 * this.fee_day_pertime1 * this.publicTrainingForm.training_duration;
    this.amount2 = 0.5 * this.amount1;
    this.amount3 = 0 * 1;
    this.amount4 = 0 * 1;
    this.total = this.amount1 + this.amount2 + this.amount3 + this.amount4;

    // this._service.get(this._constant.API_ENDPOINT.public_training_form,'')
    // .subscribe(
    //   res =>{
    //     console.log(res, "Data Load..");
    //     //this.countryLists = res['countryList'];
    //     //this.eventLists = res['eventList'];
    //     // if(res['banner'].length>0){
    //     //   //console.log(res['banner'])
    //     //   this.bannerData = res['banner']
    //     //   this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
    //     //   this.loader = false;
    //     // }
    //   },
    //   error => {

    // });

    this.subscriptions.push(this._trainerService.getTrainerPublicCourse()
          .subscribe(
             result => {
               let data: any = result;
              console.log(">>>Get public course....", result);
              this.countryLists = data.countryList;
              this.eventLists   = data.eventData;
          }
      ))
    //this.selectCustomCourses.push({title: 'Custom Course', value: 'custom_course'})
    this.selectCustomCourses.push({title: 'Public Course', value: 'public'})
    //this.eventLists.push({name:'Test course', id:61});
    //this.publicTrainingForm.event_management_id = 61;
    this.publicTrainingForm.training_form_type = 'public' ;
    //Declare header steps
    this.headerSteps.push(
      {
      title:'course', desc:'1. Course <br> Information', icon:'icon-google-doc', activeStep:true, stepComp:false, active:'user-present', nextStep:'payment'
      },
      {
      title:'payment', desc:'2. Payment <br> Information', icon: 'icon-payment', activeStep:false, stepComp:false, active:'', nextStep:null
      }
    );    
  }

  selectEventCourse(theValue: any){
    //console.log("#Select Event: ", theValue);
    let findData = this.eventLists.find(item => item.id == theValue)
    //console.log("fibnd data: ", findData);
    if(findData){
      this.publicTrainingForm.training_duration = findData.course.training_days;
      this.onKeyCalculate();
    }
  }

  idToName(title,val) {
    if(title == 'country')
    {
      //this.country_name = val;
      this.publicTrainingForm.country_name = val;
    }else{
      this.publicTrainingForm.accredation_type_name = val;
    }
  }

  addRow(obj: any = [],type?: string){
    if(type != '' && type != undefined){
      let getIndex    =   obj.findIndex(rec => rec.type == type);
      this.newRow     =   {};
      obj[getIndex].data.push(this.newRow);
    }
    if(type === '' || type == undefined){
      this.newRow     =   {};
      obj.push(this.newRow);
    }
    //this.participant_trainee = obj.length;
    if(this.participant_trainee > 1)
    {
      //this.calculationFeeDetails();
    }
    return true;
  }
  removeRow(obj: any, index: number, type?:string){
    
    if(type === '' || type == undefined){
      obj.splice(index, 1);
    }    
    this.onKeyCalculate();
    //this.participant_trainee = obj.length;
    //this.calculationFeeDetails();
    return true;
  }

  onKeyCalculate(){
    var count = 0;
    this.publicTrainingForm.participant_details.forEach(val => {
      let innerCount = 0;
      Object.keys(val).forEach(key => {
        if(val[key]!=""){
          innerCount++;
        }
      })
      if(innerCount==4){
        count = count+1;

      }

    })
    //console.log('count');
    //console.log(count);
    //console.log('count');
    this.participant_trainee =count;
    this.calculationFeeDetails(count);
    // if(count>0){
    //   this.count =count;
    //   this.calculationFeeDetails(count);
    // }
;
  }
  calculationData(timeDurationValue)
  {
    console.log("#Calculation fees working......");
    this.publicTrainingForm.training_duration = timeDurationValue;
    this.onKeyCalculate();
  }
  calculationFeeDetails(count)
  {
    //console.log(count)
    this.amount1 = 1000 * count * this.publicTrainingForm.training_duration;
    this.amount2 = 0.5 * this.amount1;
    this.amount3 = 10 * count;
    this.amount4 = 10 * count;
    this.total = this.amount1 + this.amount2 + this.amount3 + this.amount4
  }

  onKeyUp(event)
  {
    this.first_programe_val = event.target.value;
  }

  onSubmit(ngForm){
    //this.publicTrainingForm.country_id = 4;
    //this.publicTrainingForm.event_management = 21;
    // if(this.publicTrainingForm.fax_no === ''){
    //   this.publicTrainingForm.fax_no = ' ';
    // }
    console.log(this.publicTrainingForm, ":: Submit Data:: ");
    if(ngForm.form.valid){
      //this.publicTrainingForm.training_form_type = 'public';

      //applyTrainerPublicCourse

      this.subscriptions.push(this._trainerService.applyTrainerPublicCourse(this.publicTrainingForm)
          .subscribe(
             result => {
               let data: any = result;
                console.log("Apply Course results: ", data);
                if(data != undefined && typeof data === 'object' && data.status == true){
                  //this._service.headerStepMove('payment',this.headerSteps,'course');
                  this._service.moveSteps('course','payment', this.headerSteps);
                  this._toaster.success(data.msg, '');
                  
                }
                if(data != undefined && typeof data === 'object' && data.status == false){
                  this._toaster.error(data.msg, '');
                }
             }
            )
          )
      /*
       this._service.post(this._constant.API_ENDPOINT.public_training_form,this.publicTrainingForm)
       .subscribe(
         res => {
           console.log("Submit application training form > ");
           if(res['status']==true){
             this._toaster.success(res['msg'], '');
             //this.loader = false;
             //this._router.navigate(['application-form/training-event']);
             console.log("@moving steps...");
             this._service.headerStepMove('payment',this.headerSteps,'course')
           }
           else{
             this._toaster.error(res['msg'],'')
           }
         },
         error => {
           this._toaster.error('Something went wrong','')
        })*/
     }
     else{
       this._toaster.warning('Please Fill all field','')
     }
  }

  onPaymentSubmit(){

  }

}

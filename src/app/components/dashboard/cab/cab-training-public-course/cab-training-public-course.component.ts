

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
    //, nextStep:'paymentCheck'
    this.headerSteps.push(
      {
      title:'course', desc:'1. Course <br> Information', icon:'icon-google-doc', activeStep:true, stepComp:false, activeClass:'user-present',
      },
      // {
      // title:'paymentCheck', desc:'2. Payment <br> Check', icon:'icon-wallet', activeStep:false, stepComp:false, activeClass:'',
      // },
      // {
      // title:'paymentReview', desc:'2. Payment <br> Review', icon:'icon-wallet', activeStep:false, stepComp:false, activeClass:'',
      // },
      {
      title:'payment', desc:'3. Payment <br> Information', icon: 'icon-payment', activeStep:false, stepComp:false, activeClass:'',
      }
    );    
  }

  //Paypal Button creation
  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script')
      scriptElement.src = scriptUrl
      scriptElement.onload = resolve
      //console.log("load script...");
      document.body.appendChild(scriptElement)
  })
}

  saveCourseAfterPayment(theData: any){
      console.log(">>> The Data: ", theData);
      this.subscriptions.push(this._trainerService.applyTrainerPublicCourse(theData)
      .subscribe(
        result => {
          let data: any = result;
            console.log("Apply Course results: ", data);
            if(data != undefined && typeof data === 'object' && data.status == true){
              //this._service.headerStepMove('payment',this.headerSteps,'course');
              this._service.moveSteps('course','payment', this.headerSteps);
              this.transactions = [];
              this._toaster.success(data.msg, ''); 
            }
            if(data != undefined && typeof data === 'object' && data.status == false){
              this._toaster.error(data.msg, '');
            }
        }
        )
      )

  }
  createPaymentButton(itemData: any, formObj?:any, compObj?:any){
    //console.log("creating....buttons...", this.paymentReview, " :: ", this.paymentReview.length, " -- ",this.transactionsItem, " --- ", this.transactions);
   //AQaHF_liOK0SQfGII9rnE1UFmesqFzoLVpFzdOEcOjLAyl4A6omCL6yeto0JLDGnOiQijjirk9tG9BAq = abhishek.navsoft@gmail.com
   //AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl = das.abhishek77@gmail.com
   //Get transaction ID - https://developer.paypal.com/docs/checkout/reference/server-integration/get-transaction/#on-the-server
    if(this.transactions.length){
      this.loadExternalScript("https://www.paypalobjects.com/api/checkout.js").then(() => {
      paypal.Button.render({
        env: 'sandbox',
        client: {
          sandbox: 'AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl'
        },
        commit: true,
        payment: function (data, actions) {
          console.log("@Paypal payment actionms: ", actions, " -- ", data, " --- ", itemData);        
          // const paymentId = actions.payment.create({
          //   transactions: [itemData]
          // })
          // paymentId.then((res) => {
          //   console.log("Payment Processed")
          // }).catch((err) => {
          //     console.error("Payment Error")
          // });
          // return paymentId;
  
          return actions.payment.create({
            payment: {
              transactions: [itemData]
            }
          })
        },
        onAuthorize: function(data, actions) {
          console.log("@Paypal onAuthorize actionms: ", actions, " -- ", data);
          return actions.payment.execute().then(function(payment) {
            console.log(">>>Success: ", payment);
            formObj.paypalReturn = payment;
            formObj.paypalStatus = 'success';
            console.log("<<<Review obj: ", formObj, " :: ", compObj);
            compObj.saveCourseAfterPayment(formObj);
          })
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
          //this.showCancel = true;
          formObj.paypalReturn = data;
          formObj.paypalStatus = 'cancel';
          //compObj.saveCourseAfterPayment(formObj);
          this._toaster.warning("You have cancelled payment, please success payment to continue next step", 'Payment Return'); 
  
      },
      onError: err => {
          console.log('OnError', err);
          formObj.paypalReturn = err;
          formObj.paypalStatus = 'error';
          //compObj.saveCourseAfterPayment(formObj);
          this._toaster.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
          //this.resetStatus();
      },
      }, '#paypalPayment');
    });
    }
  }


  onLoadFile(theEvt: any){
    if (theEvt.target.files && theEvt.target.files[0]) {
      let file = theEvt.target.files[0];
      //validation here then attribute the value to your model
      this.publicTrainingForm.paymentReceipt = file;
      console.log("Payment receipt: ", this.publicTrainingForm);
    }
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
  paymentReview(){
    this._service.moveSteps('paymentReview','payment', this.headerSteps);
  }
  paymentCheck(){
    this._service.moveSteps('paymentCheck','paymentReview', this.headerSteps);
  }
  onSubmitPass(){
    console.log('submit passss..........');
    this._service.moveSteps('course','paymentCheck',this.headerSteps)
  }

  onSubmit(ngForm){
    //this.publicTrainingForm.country_id = 4;
    //this.publicTrainingForm.event_management = 21;
    // if(this.publicTrainingForm.fax_no === ''){
    //   this.publicTrainingForm.fax_no = ' ';
    // }
    console.log(this.publicTrainingForm, ":: Submit Data:: ", " :: ", ngForm.form);
    if(ngForm.form.valid){
      //this.publicTrainingForm.training_form_type = 'public';

      //applyTrainerPublicCourse
      this.transactionsItem['amount']               = {};
      this.transactionsItem['amount']['total']      = 0.00;
      this.transactionsItem['amount']['currency']   = 'USD';
      this.transactionsItem['amount']['details']    = {};
      this.transactionsItem['amount']['details']['subtotal'] = 0.00;
      //declare Items data
      this.transactionsItem['item_list']            = {};
      this.transactionsItem['item_list']['items']   = [];

      let findData = this.eventLists.find(item => item.id == this.publicTrainingForm.event_management_id);
      if(findData){
        let custPrice: any = 0.01;
        this.transactionsItem['item_list']['items'].push({name: findData.course.name, quantity: 1, price: custPrice, currency: 'USD'});
          if(this.total > 0){
            //console.log("Calculate price: ", calcPrice);
            this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
            this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
            this.transactions.push(this.transactionsItem);
            //console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
          }
          setTimeout(() => {
            this.createPaymentButton(this.transactionsItem, this.publicTrainingForm, this);
          }, 100)
      }
      return;      
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

  isValidReceipt(){
    console.log("check upload...", this.publicTrainingForm.paymentReceipt);
    if(this.publicTrainingForm.paymentReceipt == undefined || this.publicTrainingForm.paymentReceipt === ''){
        return false;
    }
    return true;
  }

  onPaymentReceiptSubmit(ngForm: any){
    //console.log(this.publicTrainingForm, ":: Submit Receipt Data:: ", ngForm.form);
    if(this.isValidReceipt()){
        //upload payment
        console.log("@Enter uploading receipt....");
    }else{
      this._toaster.warning('Please Check the required fields','Validation Error')
    }
  }

}


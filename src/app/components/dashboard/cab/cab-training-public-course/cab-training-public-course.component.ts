

import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';

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
  modalOptions:NgbModalOptions;
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
  traningPublicId:any;
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
  closeResult: string;
  trainingPublicCourseid:any;
  tutionFees:any;
  taxVat:any;
  knowledgeFees:any;
  innovationFees:any;
  noofParticipants:any;
  subTotal:any;
  voucherFile:any = new FormData();
  paymentReceiptValidation:boolean;
  paymentFile:any;
  paymentDetailsChk:any;
  paymentFilePath:any;
  public errorLoader: boolean = false;
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  trainingDurationSelectbox:any;

  constructor(private Service: AppService, private http: HttpClient,
    public _toaster: ToastrService, private _router: Router, private _route: ActivatedRoute,
    private _trainerService: TrainerService, private _constant: Constants,public sanitizer:DomSanitizer,private modalService: NgbModal) { }

  ngOnInit() {
    this.traningPublicId = sessionStorage.getItem('publicFormId');

    var publicCourseid = sessionStorage.getItem('trainingPublicCourse');
    if(publicCourseid && publicCourseid != undefined) {
      var splitId = publicCourseid.split('=');
      this.trainingPublicCourseid = splitId[1];
      // console.log(this.trainingPublicCourseid,'trainingPublicCourseid');
      sessionStorage.setItem('publicFormId','');
    }

    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');

    // this.amount1 = 1 * this.fee_day_pertime1 * this.publicTrainingForm.training_duration;
    // this.amount2 = 0.5 * this.amount1;
    // this.amount3 = 0 * 1;
    // this.amount4 = 0 * 1;
    // this.total = this.amount1 + this.amount2 + this.amount3 + this.amount4;

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
        title:'authorization', desc:'5. Authorization of The Application', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
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
    this.traningPublicId != '' && this.traningPublicId != undefined ? '' : this.loadCourseDetailsPage();
    //this.trainingDuration = [{key:1,title:'1 Day'},{key:2,title:'2 Days'},{key:3,title:'3 Days'},{key:4,title:'4 Days'},{key:5,title:'5 Days'},{key:6,title:'6 Days'},{key:7,title:'7 Days'},{key:8,title:'8 Days'},{key:9,title:'9 Days'},{key:10,title:'10 Days'}];

    let durationAr: any =[];
    for(let k=0; k<100; k++){
        let tempObj: any ={};
        tempObj['key'] = (k+1);
        tempObj['title'] = (k+1) + ' Day';
        durationAr.push(tempObj);
    }
    //console.log('<<< Duratioh: ', durationAr);
    this.trainingDuration = durationAr;
    // console.log(this.participantTraineeDetails.length);
    // tutionFees:any;
    // taxVat:any;
    // knowledgeFees:any;
    // innovationFees:any;
    // noofParticipants:any;
    
  }

  addRow(obj) {
    var newObj = {};
    obj.push(newObj);
  }

  loadCourseDetailsPage() {
    if(this.trainingPublicCourseid != '' && this.trainingPublicCourseid != undefined) {
      this.Service.getwithoutData(this.Service.apiServerUrl+'/'+this._constant.API_ENDPOINT.course_details+this.trainingPublicCourseid+'?data=1')
        .subscribe(
          res => {
            var courseDetails = res['courseDetails'];
            this.step3Data.course_title = courseDetails.course;
            this.step3Data.training_duration = isNaN(parseInt(courseDetails.training_days)) ? courseDetails.training_days : parseInt(courseDetails.training_days);
            this.trainingDurationSelectbox = this.step3Data.training_duration != null && this.step3Data.training_duration != undefined ? true : false;
            // console.log(courseDetails.training_days,'training_days');
          });
    }
  }

  loadDetailsPage() {

    let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    this.Service.getwithoutData(url)
    .subscribe(
      res => {
        this.step1Data.organization_name = res['data']['step1'][0].cab_name;
        this.step1Data.mailing_address = res['data']['step1'][0].mailing_address;
        this.step1Data.zip_code = res['data']['step1'][0].po_box;

        var stateList =  this.Service.getState();
        var cityList =  this.Service.getCity();
        stateList.subscribe( result => {
          for(let key in result['states']) {
            if(result['states'][key]['name'] == res['data']['step1'][0].state )
            {
              this.allStateList.push(result['states'][key]);
            }
          }
        });

        cityList.subscribe( result => {
          for(let key in result['cities']) {
            if(result['cities'][key]['name'] == res['data']['step1'][0].city )
            {
              this.allCityList.push(result['cities'][key]);
            }
          }
        });

        this.step1Data.country = res['data']['step1'][0].country;
        this.step1Data.state = res['data']['step1'][0].state;
        this.step1Data.city = res['data']['step1'][0].city;
        this.step1Data.telephone_number = res['data']['step1'][0].tel_no;
        this.step1Data.fax_no = res['data']['step1'][0].applicant_fax_no;
        this.step1Data.official_email = res['data']['step1'][0].applicant_email;
        this.step1Data.official_website = res['data']['step1'][0].applicant_website;
        this.step1Data.authorized_contact_person = res['data']['step2']['cabOwnerData'][0].name;
        this.step1Data.designation = res['data']['step1'][0].designation;
        this.step1Data.mobile_phone_number = res['data']['step1'][0].applicant_tel_no;

        this.step5Data.organization_name = res['data']['step1'][0].cab_name;
      })
    

    if(this.traningPublicId != '' && this.traningPublicId != undefined) {
      let url2 = this.Service.apiServerUrl+"/"+'training-details-show/'+this.traningPublicId;
        this.Service.getwithoutData(url2)
        .subscribe(
          res => {
            if(res['data'].id != undefined && res['data'].id > 0){
              this.formApplicationId = res['data'].id;
            }

            let saveStep: number;
            //check steps
            if(res['data'].is_draft){

              saveStep = parseInt(res['data'].saved_step) - 1;
            }else{
              if(parseInt(res['data'].saved_step) == 7){
                
                saveStep = parseInt(res['data'].saved_step) - 1;
              }else{
                
              saveStep = parseInt(res['data'].saved_step);
              }
            }

            if(res['data'].saved_step  != null){
              //let saveStep = res['data'].saved_step;
              //open step
              this.headerSteps.forEach((item, key) => {
                    ///////console.log(item, " --- ", key);
                    if(key < saveStep){
                      //////console.log('moving steps....');
                      let curStep: any = item;
                      curStep.stepComp = true;
                      let nextStep: any = this.headerSteps[key+1];
                      this.Service.moveSteps(curStep.title, nextStep.title, this.headerSteps);
                    }
                    if(key == saveStep){
                      let curStep: any = this.headerSteps[key];
                      console.log('found steps....',curStep);
                      curStep.stepComp = true;
                      this.Service.headerStepMove(item.title, this.headerSteps,'menu')
                    }
              })
              //////console.log("#Step data: ", this.headerSteps);
            }

            var stateList =  this.Service.getState();
            var cityList =  this.Service.getCity();
            stateList.subscribe( result => {
              for(let key in result['states']) {
                if(result['states'][key]['name'] == res['data'].state )
                {
                  this.allStateList.push(result['states'][key]);
                }
              }
            });
    
            cityList.subscribe( result => {
              for(let key in result['cities']) {
                if(result['cities'][key]['name'] == res['data'].city )
                {
                  this.allCityList.push(result['cities'][key]);
                }
              }
            });

            // step1
            this.step1Data.organization_name = res['data'].organization_name;
            this.step1Data.mailing_address = res['data'].mailing_address;
            this.step1Data.zip_code = res['data'].zip_code;
            this.step1Data.country = res['data'].country;
            this.step1Data.state = res['data'].state;
            this.step1Data.city = res['data'].city;
            this.step1Data.telephone_number = res['data'].telephone_number;
            this.step1Data.fax_no = res['data'].fax_no;
            this.step1Data.official_email = res['data'].official_email;
            this.step1Data.official_website = res['data'].official_website;
            this.step1Data.authorized_contact_person = res['data'].authorized_contact_person;
            this.step1Data.designation = res['data'].designation;
            this.step1Data.mobile_phone_number = res['data'].mobile_phone_number;

            // step2
            if(res['data'].eventParticipant != null) {
              this.participantTraineeDetails = res['data'].eventParticipant;
            }

            // step3
            this.step3Data.course_title = res['data'].course_title;
            this.step3Data.training_duration = isNaN(parseInt(res['data'].training_duration)) ? res['data'].training_duration : parseInt(res['data'].training_duration);
            this.trainingDurationSelectbox = this.step3Data.training_duration != null && this.step3Data.training_duration != undefined ? true : false;

            // step5
            if(res['data'].onBehalfApplicantDetails != null) {
              this.step5Data.organization_name = res['data'].onBehalfApplicantDetails.organization_name;
              this.step5Data.representative_name = res['data'].onBehalfApplicantDetails.representative_name;
              this.step5Data.designation = res['data'].onBehalfApplicantDetails.designation;
              this.step5Data.digital_signature = res['data'].onBehalfApplicantDetails.digital_signature;
            }

            // step7
            if(res['data'].paymentDetails != null){
              // //console.log(">>>payment details...show");
                this.voucherSentData.voucher_code     = res['data'].paymentDetails.voucher_no;
                this.voucherSentData.payment_date     = new Date(res['data'].paymentDetails.voucher_date);
                this.voucherSentData.amount           = res['data'].paymentDetails.amount;
                // this.voucherSentData.transaction_no   = res['data'].paymentDetails.transaction_no;
                // this.voucherSentData.payment_method   = res['data'].paymentDetails.payment_method;
                // this.voucherSentData.payment_made_by  = res['data'].paymentDetails.payment_made_by;
                // this.voucherSentData.mobile_no        = res['data'].paymentDetails.mobile_no;
                this.voucherSentData.transaction_no   = (res['data'].paymentDetails.transaction_no != 'null') ? res['data'].paymentDetails.transaction_no : '';
                this.voucherSentData.payment_method   = (res['data'].paymentDetails.payment_method != 'null') ? res['data'].paymentDetails.payment_method : '';
                this.voucherSentData.payment_made_by  = (res['data'].paymentDetails.payment_made_by != 'null') ? res['data'].paymentDetails.payment_made_by : '';
                this.voucherSentData.mobile_no        = (res['data'].paymentDetails.mobile_no != 'null') ? res['data'].paymentDetails.mobile_no : '';

                this.paymentFile = res['data'].paymentDetails.payment_receipt && res['data'].paymentDetails.payment_receipt != null ? this._constant.mediaPath+'/media/'+res['data'].paymentDetails.payment_receipt : '';
                this.paymentReceiptValidation = true;
            }

            let pathData: any;
            let filePath: string;

            if(!this.Service.isObjectEmpty(res['data'].paymentDetails)){
              this.paymentDetailsChk = res['data'].paymentDetails;
              if(res['data'].paymentDetails.voucher_invoice != undefined && res['data'].paymentDetails.voucher_invoice != ''){
                filePath = this._constant.mediaPath + '/media/' + res['data'].paymentDetails.voucher_invoice;
                pathData = this.getSantizeUrl(filePath);
                this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
              }
            }

            var training_duration_current = this.step3Data.training_duration;
            this.noofParticipants = this.participantTraineeDetails.length;
            this.tutionFees = 1000 * parseInt(this.noofParticipants) * parseInt(training_duration_current);
            // console.log(this.noofParticipants);
            // console.log(training_duration_current);
            // console.log(this.tutionFees);
            this.taxVat = 0.5 * this.tutionFees;
            this.knowledgeFees = 10 * this.noofParticipants;
            this.innovationFees = 10 * this.noofParticipants;
            this.subTotal = this.tutionFees + this.taxVat + this.knowledgeFees + this.innovationFees;
            
          })
    }
  }

  removeRow(obj,index) {
    obj.splice(index,1);
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

  openView(content, type:string) {
    let pathData: any;
    ////console.log(">>>pop up...", content);
    // if(type != undefined && type == 'agreement'){
    //   pathData = this.getSantizeUrl(this.accredAgreemFile);
    //   this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
    // }
    // if(type != undefined && type == 'checklist'){
    //   pathData = this.getSantizeUrl(this.checklistDocFile);
    //   this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
    // }
  
    ////console.log(">>> open view", this.pathPDF, " -- ",  this.pathPDF);
  
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //////console.log("Closed: ", this.closeResult);
      //this.courseViewData['courseDuration'] = '';
      //this.courseViewData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //////console.log("Closed with ESC ");
      
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //////console.log("Closed with CLOSE ICON ");
     
      return 'by clicking on a backdrop';
    } else {
      //////console.log("Closed ",`with: ${reason}`);
      
      return  `with: ${reason}`;
    }
  }

  getSantizeUrl(url : string) { 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); 
  }

  closeChecklistDialog(){
    this.modalService.dismissAll();
  }

  onSubmitStep1(ngForm1){
    // this.Service.moveSteps('application_information', 'participant', this.headerSteps);
    if(ngForm1.form.valid) {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step1 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '1';
      this.step1Data.is_draft = false;
      this.step1Data.training_form_type = 'public_training';
      if(this.formApplicationId > 0){
        this.step1Data.application_id = this.formApplicationId;
      }

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
    }else {
      this._toaster.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitStep2(ngForm2){
    // this.Service.moveSteps('participant', 'training_details', this.headerSteps);
    if(ngForm2.form.valid) {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step2 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step2Data.is_draft = false;
      this.step2Data.training_form_type = 'public_training';

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
    }else {
      this._toaster.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitStep3(ngForm3){
    // this.Service.moveSteps('training_details', 'fees_details', this.headerSteps);
    if(ngForm3.form.valid) {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step3 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '3';
      this.step3Data.is_draft = false;

      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step3Data.training_form_type = 'public_training';
      this.publicTrainingForm.step3 = this.step3Data;

      var training_duration_current = this.step3Data.training_duration;
      this.noofParticipants = this.participantTraineeDetails.length;
      this.tutionFees = 1000 * parseInt(this.noofParticipants) * parseInt(training_duration_current);
      // console.log(this.noofParticipants);
      // console.log(training_duration_current);
      // console.log(this.tutionFees);
      this.taxVat = 0.05 * this.tutionFees;
      this.knowledgeFees = 10 * this.noofParticipants;
      this.innovationFees = 10 * this.noofParticipants;
      this.subTotal = this.tutionFees + this.taxVat + this.knowledgeFees + this.innovationFees;

      // console.log(this.publicTrainingForm);
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.Service.moveSteps('training_details', 'fees_details', this.headerSteps);
            // console.log(res);
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }else {
      this._toaster.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitStep4(ngForm4){
    // this.Service.moveSteps('fees_details', 'authorization', this.headerSteps);
    if(this.subTotal > 0) {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step4 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '4';
      this.step4Data.is_draft = false;

      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step4Data.training_form_type = 'public_training';
      this.step4Data.fees_to_pay = this.subTotal;

      this.publicTrainingForm.step4 = this.step4Data;

      this.step4DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.Service.moveSteps('fees_details', 'authorization', this.headerSteps);
            // console.log(res);
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    } else {
      this._toaster.warning('Sub total could be greater than zero', '');
    }
  }

  closeDialog(){
    this.modalService.dismissAll();
  }

  onError(error: any) {
    // do anything
    //////console.log('PDF Error: ', error)
    this.errorLoader = true;
  }
  
  completeLoadPDF(pdfLoad: PDFDocumentProxy){
    //////console.log("Completed Load PDF :: ", pdfLoad);
    this.loaderPdf = false;
    this.completeLoaded = true;
  }
  
  onProgress(progressData: PDFProgressData){
   //////console.log("Loding Pdf :: ", progressData);
    this.loaderPdf = true;
  }

  validateFile1(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf', 'PDF'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.paymentReceiptValidation = true;
      //if(type == undefined){
        this.voucherFile.append('payment_receipt',fileEvent.target.files[0]);
      //}
    }else{
      this.paymentReceiptValidation = false;
    }
  }

  onSubmitStep5(ngForm5){
    // this.Service.moveSteps('authorization', 'proforma_invoice', this.headerSteps);
    if(ngForm5.form.valid) {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step5 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '5';
      this.step5Data.is_draft = false;
      this.step5Data.training_form_type = 'public_training';

      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

      this.publicTrainingForm.step5 = this.step5Data;

      this.step5DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step5DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            // this.Service.moveSteps('fees_details', 'authorization', this.headerSteps);
            // console.log(this.paymentFilePath);
            if(this.paymentFilePath != '' && this.paymentFilePath != undefined){
              this.Service.moveSteps('authorization', 'proforma_invoice', this.headerSteps);
            }
            else{
              setTimeout(()=>{
                let elem = document.getElementById('openPayDialog');
                //////console.log("App dialog hash....", elem);
                if(elem){
                  elem.click();
                }
              }, 100)
              setTimeout(() => {                    
                // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                //this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);
              },1500)
            }
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }else {
      this._toaster.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitStep6(ngForm6) {
    // this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
    this.transactionsItem['amount']               = {};
    this.transactionsItem['amount']['total']      = 0.00;
    this.transactionsItem['amount']['currency']   = 'USD';
    this.transactionsItem['amount']['details']    = {};
    this.transactionsItem['amount']['details']['subtotal'] = 0.00;
    //declare Items data
    this.transactionsItem['item_list']            = {};
    this.transactionsItem['item_list']['items']   = [];
    // let custPrice: any = 0.01;
    // this.total = 0.05;
    let custPrice: any = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;
    this.total = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;//0.05;
    this.transactionsItem['item_list']['items'].push({name: 'Test Course', quantity: 1, price: custPrice, currency: 'USD'});
    // this.total = 1;
    // custPrice = 0.1;
      if(this.total > 0){
        ////console.log("Calculate price: ", calcPrice);
        this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
        this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
        this.transactions.push(this.transactionsItem);
        //console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
      }
      setTimeout(() => {
        this.createPaymentButton(this.transactionsItem, this.publicTrainingForm, this);
        let elem = document.getElementsByClassName('paypal-button-logo');
        //console.log("button creting...");
        if(elem){
          //console.log("button creted...");
        }else{
          //console.log("Loding button...");
        }
      }, 100)
  }

  createPaymentButton(itemData: any, formObj?:any, compObj?:any){
    ////console.log("creating....buttons...", this.paymentReview, " :: ", this.paymentReview.length, " -- ",this.transactionsItem, " --- ", this.transactions);
   //AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl = das.abhishek77@gmail.com
   //Get transaction ID - https://uateloper.paypal.com/docs/checkout/reference/server-integration/get-transaction/#on-the-server
    if(this.transactions.length){
      //console.log('Paypal');
      this.loadExternalScript("https://www.paypalobjects.com/api/checkout.js").then(() => {
      paypal.Button.render({
        env: 'sandbox',
        client: {
          sandbox: 'AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl'
        },
        commit: true,
        payment: function (data, actions) {
          //console.log("@Paypal payment actionms: ", actions, " -- ", data, " --- ", itemData);        
          return actions.payment.create({
            payment: {
              transactions: [itemData]
            }
          })
        },
        onAuthorize: function(data, actions) {
          //console.log("@Paypal onAuthorize actionms: ", actions, " -- ", data);
          return actions.payment.execute().then(function(payment) {
            //console.log(">>>Success: ", payment);
            formObj.paypalReturn = payment;
            formObj.paypalStatus = 'success';
            //console.log("<<<Review obj: ", formObj, " :: ", compObj);
            compObj.saveInspectopnAfterPayment(formObj);
          })
        },
        onCancel: (data, actions) => {
          //console.log('OnCancel', data, actions);
          //this.showCancel = true;
          formObj.paypalReturn = data;
          formObj.paypalStatus = 'cancel';
          this._toaster.warning("You have cancelled payment, Continue next step please complete payment process again.", 'Paypal>>',{timeOut:6500});
      },
      onError: err => {
          //console.log('OnError', err);
          formObj.paypalReturn = err;
          formObj.paypalStatus = 'error';
          //compObj.saveCourseAfterPayment(formObj);
          this._toaster.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
      },
      onClick: (data, actions) => {
          //console.log('onClick', data, actions);
          //this.resetStatus();
      }
      }, '#paypalPayment');
    });
    }
  }

  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script')
      scriptElement.src = scriptUrl
      scriptElement.onload = resolve
      ////console.log("load script...");
      document.body.appendChild(scriptElement)
    })
  }
  
  saveInspectopnAfterPayment(theData: any){
    ////console.log(">>> The Data: ", theData);
    this.transactions = [];
    this._toaster.success('Payment Success, Thank you.','Paypal>>',{timeOut:2000});
    setTimeout(()=> {
      // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //////console.log("moving...");
      this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
    }, 1000)      
    //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
  }

  onSubmitPaymentInformation(theForm: any, type?: any){
    //this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);

    let is_valid: boolean = false;

    let dtFormat: string = '';
    // if(this.voucherSentData['payment_date'] != undefined && 
    //   this.voucherSentData['payment_date']._i != undefined){
    //   var dtData = this.voucherSentData['payment_date']._i;
    //   var year = dtData.year;
    //   var month = dtData.month;
    //   var date = dtData.date;
    //   dtFormat = year + "-" + month + "-" + date;
    // }else{
    if(this.voucherSentData['payment_date'] != undefined){
      var nFdate = new Date(this.voucherSentData['payment_date']);
      var nMonth = nFdate.getMonth() + 1;
      var nDate = nFdate.getDate();
      var nYear = nFdate.getFullYear();
      dtFormat = nYear + "-" + nMonth + "-" + nDate;
    }

    // console.log(">>> Date: ", dtFormat, " -- ", this.voucherSentData);

      this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
      this.voucherFile.append('amount',this.voucherSentData['amount']);
      this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
      this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
      this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
      this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
      this.voucherFile.append('voucher_date', dtFormat);
      this.voucherFile.append('accreditation',this.formApplicationId);
      this.voucherFile.append('application_id',this.formApplicationId);
      this.voucherFile.append('saved_step', 7);
      if(!type){
        this.voucherFile.append('is_draft', false);
      }else{
        this.voucherFile.append('is_draft', true);
      }

      // console.log(">>> Data: ", this.voucherSentData);
      if(this.voucherSentData['transaction_no'] != '' && this.voucherSentData['payment_method'] != '' && this.voucherSentData['payment_made_by'] &&
        this.voucherSentData['mobile_no'] != ''){
          is_valid = true;
        }

        if(is_valid == true && type == undefined && this.paymentReceiptValidation != false) {
          //this.noObjectionBodyForm.saved_step = 8;      
          //this.noObjectionBodyForm.step8 = this.step6Data;
          //this.noObjectionBodyForm.step8.application_id = this.formApplicationId;
          //this.noObjectionBodyForm.step8.is_draft = false;
          // console.log(">> Submit Form: "," -- ", this.voucherSentData);

          this._trainerService.paymentVoucherSaveTrainers((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                ////////console.log("submit voucher: ", data);
                if(data.status){
                  //this.openView('appComp');
                  setTimeout(()=>{
                    let elem = document.getElementById('openAppDialog');
                    //////console.log("App dialog hash....", elem);
                    if(elem){
                      elem.click();
                    }
                  }, 100)
                  setTimeout(() => {                    
                    // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                    this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);
                  },3500)
                  
                }else{
                  this._toaster.warning(data.msg,'');
                }
          })   
    
        }else if(type != undefined && type == true){
          //this.noObjectionBodyForm.saved_step = 6;   
          //this.noObjectionBodyForm.step6 = this.step6Data;
         // this.noObjectionBodyForm.step8.is_draft = true;
          // console.log(">> Submit Save draft: ", " -- ", this.voucherSentData);

          this._trainerService.paymentVoucherSaveTrainers((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                // console.log("submit voucher draft: ", data);
                if(data.status){
                  this._toaster.success("Save Draft Successfully",'');                  
                }else{
                  this._toaster.warning(data.msg,'');
                }
          })    
        }else{
          this._toaster.warning('Please Fill required field','',{timeOut:5000});
        }
  }

  onSubmitPaymentInformation123(ngForm7: any, type?: boolean){
    ////console.log("payment submitting.....");
    this.publicTrainingForm = {};
    this.publicTrainingForm.step7 = {};
    
      let dtFormat: string = '';
      if(this.voucherSentData['payment_date'] != undefined && 
        this.voucherSentData['payment_date']._i != undefined){
        var dtData = this.voucherSentData['payment_date']._i;
        var year = dtData.year;
        var month = dtData.month;
        var date = dtData.date;
        dtFormat = year + "-" + month + "-" + date;
      }else{
        var nFdate = new Date(this.voucherSentData['payment_date']);
        var nMonth = nFdate.getMonth();
        var nDate = nFdate.getDate();
        var nYear = nFdate.getFullYear();
        dtFormat = nYear + "-" + nMonth + "-" + nDate;
      }
      //     
    
      this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
      this.voucherFile.append('amount',this.voucherSentData['amount']);
      this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
      this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
      this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
      this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
      this.voucherFile.append('voucher_date',dtFormat);
      this.voucherFile.append('application_id',this.formApplicationId);
      this.voucherFile.append('is_draft', false);
      // this.voucherFile.append('application_id',this.formApplicationId);
          
      this.loader = false;
      if(ngForm7.form.valid && this.paymentReceiptValidation != false) {
        // //console.log(this.voucherFile);
          this._trainerService.paymentVoucherSaveTrainers((this.voucherFile))
          .subscribe(
              result => {
                this.loader = true;
                let data: any = result;
                ////console.log("submit voucher: ", data);
                if(data.status){
                  //this.voucherFile = new FormData();
                  //this.voucherSentData = {};
                  //this.toastr.success("Your form has been successfully submitted and it is under review.We will update you shortly.",'THANK YOU');
                  setTimeout(()=>{
                    let elem = document.getElementById('openAppDialog');
                    //console.log("App dialog hash....", elem);
                    if(elem){
                      elem.click();
                    }
                  }, 100)
                  //this.openView('appComp','');
                  setTimeout(() => {                    
                    // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                    this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);
                  },3500)
                  
                }else{
                  this._toaster.warning(data.msg,'');
                }
              }
            )
      }else if(type != undefined && type == true && this.paymentReceiptValidation != false){
        
        this.publicTrainingForm = {};
        this.publicTrainingForm.step7 = {};
        
          let dtFormat: string = '';
          if(this.voucherSentData['payment_date'] != undefined && 
            this.voucherSentData['payment_date']._i != undefined){
            var dtData = this.voucherSentData['payment_date']._i;
            var year = dtData.year;
            var month = dtData.month;
            var date = dtData.date;
            dtFormat = year + "-" + month + "-" + date;
          }else{
            var nFdate = new Date(this.voucherSentData['payment_date']);
            var nMonth = nFdate.getMonth();
            var nDate = nFdate.getDate();
            var nYear = nFdate.getFullYear();
            dtFormat = nYear + "-" + nMonth + "-" + nDate;
          }
          //     
        
        this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
        this.voucherFile.append('amount',this.voucherSentData['amount']);
        this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
        this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
        this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
        this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
        this.voucherFile.append('voucher_date',dtFormat);
        this.voucherFile.append('application_id',this.formApplicationId);
        this.voucherFile.append('is_draft', true);
        // this.voucherFile.append('application_id',this.formApplicationId);
            
          // //console.log(this.voucherFile);
        this._trainerService.paymentVoucherSaveTrainers((this.voucherFile))
        .subscribe(
            result => {
              this.loader = true;
              let data: any = result;
              ////console.log("submit voucher: ", data);
              if(data.status){
                this._toaster.success('Save Draft Successfully', '');
              }
            }
          )
    }
    else {
      this._toaster.warning('Please Fill required field','');
    }
  }

  savedraftStep(steps) {
    if(steps == 'step1') {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step1 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '1';
      this.step1Data.is_draft = true;
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
            // this.Service.moveSteps('application_information', 'participant', this.headerSteps);
          // console.log(res);
          this._toaster.success('Save Draft Successfully', '');
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }else if(steps == 'step2') {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step2 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step2Data.is_draft = true;
      this.step2Data.training_form_type = 'public_training';

      this.publicTrainingForm.step2 = this.step2Data;

      this.publicTrainingForm.step2['trainee_details'] = [];
    
      // if(this.participantTraineeDetails) {
        this.publicTrainingForm.step2['trainee_details'] = this.participantTraineeDetails;
      // }
      // else{
      //   this.publicTrainingForm.step2['trainee_details'] = [{
      //     first_name:this.participantTraineeDetails.first_name,
      //     last_name:this.participantTraineeDetails.last_name,
      //     email_address:this.participantTraineeDetails.email_address,
      //     phone_number:this.participantTraineeDetails.phone_number,
      //   }];
      // }

      // console.log(this.publicTrainingForm);
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this._toaster.success('Save Draft Successfully', '');
            // console.log(res);
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }else if(steps == 'step3') {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step3 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '3';
      this.step3Data.is_draft = true;

      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step3Data.training_form_type = 'public_training';
      this.publicTrainingForm.step3 = this.step3Data;

      var training_duration_current = this.step3Data.training_duration;
      this.noofParticipants = this.participantTraineeDetails.length;
      this.tutionFees = 1000 * parseInt(this.noofParticipants) * parseInt(training_duration_current);
      // console.log(this.noofParticipants);
      // console.log(training_duration_current);
      // console.log(this.tutionFees);
      this.taxVat = 0.5 * this.tutionFees;
      this.knowledgeFees = 10 * this.noofParticipants;
      this.innovationFees = 10 * this.noofParticipants;
      this.subTotal = this.tutionFees + this.taxVat + this.knowledgeFees + this.innovationFees;

      // console.log(this.publicTrainingForm);
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this._toaster.success('Save Draft Successfully', '');
            // console.log(res);
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }else if(steps == 'step4') {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step4 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '4';
      this.step4Data.is_draft = true;

      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step4Data.training_form_type = 'public_training';
      this.step4Data.fees_to_pay = this.subTotal;

      this.publicTrainingForm.step4 = this.step4Data;

      this.step4DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this._toaster.success('Save Draft Successfully', '');
            // console.log(res);
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }else if(steps == 'step5') {
      this.publicTrainingForm = {};
      this.publicTrainingForm.step5 = {};
      this.publicTrainingForm.email = this.userEmail;
      this.publicTrainingForm.userType = this.userType;
      this.publicTrainingForm.saved_step = '5';
      this.step5Data.is_draft = true;
      this.step5Data.training_form_type = 'public_training';
      this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.publicTrainingForm.step5 = this.step5Data;

      this.step5DataBodyFormFile.append('data',JSON.stringify(this.publicTrainingForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this._constant.API_ENDPOINT.publicTrainingForm,this.step5DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this._toaster.success('Save Draft Successfully', '');
          }else{
            this._toaster.warning(res['msg'], '');
          }
        })
    }
  }
}


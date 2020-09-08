import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';
declare let paypal: any;

@Component({
  selector: 'app-pt-providers-form',
  templateUrl: './pt-providers-form.component.html',
  styleUrls: ['./pt-providers-form.component.scss']
})
export class PtProvidersFormComponent implements OnInit {

  public newRow: any = {};
  public ptProvidersForm: any = {};
  public ptProvidersFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [];
  public ownOrgMembInfo: Array<any> = [];
  public proficiencyTesting: Array<any> = [];
  public scopeForCalibration: Array<any> = [];
  public scopeForTesting: Array<any> = [];
  public scopeForMedical: Array<any> = [];

  public accreditationInfo: Array<any> = [];
  public technicalManager: any = {};
  public managementManager: any = {};
  public medicaMainlLabInfo:Array<any>=[];
  public countryList:Array<any>=[];
  public ptProvidertypeList:Array<any>=[];
  public ptProviderAccrediationTypeList:Array<any>=[];
  public authorizationList:any;
  accreditationCriteriasId:any;
  public authorizationStatus:boolean=true;
  public authorization_confirm3:Array<any>=[];
  public recommend_confirm:any = {};
  public mailing_address:boolean=true;
  public orgMembToggle: boolean = false;
  public is_bod: boolean = false;
  public is_agreement: boolean=false;
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public loader:boolean=true;
  public banner:any=[];
  public isSubmit: boolean = true;
  afterSubmit: boolean = false;
  public addMinutesToTime:any;
  public accreditationCriteria:any;
  selectedFood1: string;
  selectedFood2: string;
  public file_validation:boolean = true;
  public minDate;
  public maxDate = new Date();
  // ngx-google-places-autocomplete [options]='options' #placesRef="ngx-places"
  // version = VERSION;
  allCityByCountry: any = [];
  getCountryLists:any;
  authorization_confirm2:any;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;
  searchCountryLists:any;
  onbehalf_representative_date:boolean = false;
  recommendStatus:boolean = false

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  @ViewChild('mydiv', null) mydiv: ElementRef;
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;
  @HostListener('scroll', ['$event.target'])
  scrollHandler(elem) {
    if(elem != undefined){
      //console.debug("Scroll Event: ", elem.srcElement.scrollHeight, " == [ ",elem.srcElement.offsetHeight, " - ",elem.srcElement.scrollTop," ]"  );
      if(( elem.srcElement.offsetHeight + elem.srcElement.scrollTop) >=  elem.srcElement.scrollHeight) {
         ////console.log("Yo have reached!");
         this.authorizationList.authorization_confirm2 = true;
      }
    }        
  }
  public recommend:any;
  transactions: any[] =[];
  transactionsItem: any={};
  total: any = 0;
  allStateList: Array<any> = [];
  allCityList: Array<any> = [];
  step1Data:any = {};
  step2Data:any = {};
  step3Data:any = {};
  step4Data:any = {};
  step5Data:any = {};
  step6Data:any = {};
  step7Data:any = {};
  fileAny:any;
  tradeLicensedValidation:any = false;
  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  step4DataBodyFormFile:any = new FormData();
  step5DataBodyFormFile:any = new FormData();
  step6DataBodyFormFile:any = new FormData();
  step7DataBodyFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  isCompleteness:any;
  profileComplete:any;
  today = new Date();
  headerSteps:any[] = [];

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  getData(getVal: string){
    this.Service.mapboxToken = getVal;
   }

 ngOnInit() { 
   // this.minCurrentDate = new Date(2020, 0, 13);
  //  this.titleService.setTitle('EIAC - Proficiency Testing Providers');
   this.addMinutesToTime = this.Service.addMinutesToTime();
   this.loadData();
   this.loadFormDynamicTable();
   //this.checkCaptchaValidation = false;
   this.loader = false;
  //  this.setting();

  this.headerSteps.push(
    {
    title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
    },
    {
    title:'profciency_testing_participation', desc:'2. Profciency Testing Participation', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'personal_information', desc:'3. Personal Information', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'information_audit_management', desc:'4. Internal Audit & Management', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'perlim_visit', desc:'5. Perlim Visit', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'undertaking_applicant', desc:'6. Undertaking & Applicant Company', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'payment', desc:'7. Payment Information', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
    }
  );
 }

 resolvedSecurity(captchaResponse: string) {
   let captchaStatus   =  captchaResponse;
   if(captchaStatus != ''){
     this.checkSecurity = true;
     this.checkCaptchaValidation = true;
   }
 }
 bod_toggle(value){
   this.is_bod = value;
 }
 loadFormDynamicTable(){
   this.ownOrgBasicInfo  =   [{}];
   this.ownOrgMembInfo = [{}];
   this.accreditationInfo = [{}];
   this. proficiencyTesting =[{}];
   this.scopeForTesting   =[{}];
   this.scopeForMedical   =[{}];
   this.scopeForCalibration   =[{}];
   this.authorizationList = {undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false,authorization_confirm1:false,authorization_confirm2:false};
   this.recommend = {first:false,second:false,third:false,fourth:false}

   this.medicaMainlLabInfo=[{}];
   this.ptProvidersForm.organizationBasicInfo    = this.ownOrgBasicInfo;
   this.ptProvidersForm.organizationMemberInfo   = this.ownOrgMembInfo;
   this.ptProvidersForm.accreditationInfo        = this.accreditationInfo;
   this.ptProvidersForm.proficiencyTesting       = this.proficiencyTesting;
   this.ptProvidersForm.scopeForCalibration       = this.scopeForCalibration;
   this.ptProvidersForm.scopeForTesting          = this.scopeForTesting;
   this.ptProvidersForm.scopeForMedical          = this.scopeForMedical;
   this.ptProvidersForm.technicalManager         = this.technicalManager;
   this.ptProvidersForm.managementManager        = this.managementManager;

   this.accreditationCriteria = [{"title":'ACCREDITATION SCOPE FOR PT-CALIBRATION',"id":1},
                                 {"title":'ACCREDITATION SCOPE FOR PT-TESTING',"id":2},
                                 {"title":'ACCREDITATION SCOPE FOR PT-MEDICAL',"id":3},
                               ];
   
 }

 accreditationCriterias (title){
   this.accreditationCriteriasId = title;
 }
 loadData(){
   this.Service.get(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.pt_provider,'')
   .subscribe(
     res => {
       //console.log(res)
       this.countryList = res['allCountry'];
       this.ptProvidertypeList = res['ptProvidertypeList'];
       this.ptProviderAccrediationTypeList = res['ptProviderAccrediationTypeList'];
       if(res['banner'].length>0){
         this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
       }
     },
     error => {
     
 })

 }

validateFile(fileEvent: any) {
  var file_name = fileEvent.target.files[0].name;
  var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
  var ex_type = ['pdf','png','jpg','jpeg','JPEG'];
  var ex_check = this.Service.isInArray(file_exe,ex_type);
  if(ex_check){
    this.step1DataBodyFormFile.append('trade_license',fileEvent.target.files[0]);
    this.file_validation = true;
    this.tradeLicensedValidation = true;
    return true;
  }else{
    this.file_validation = false;
    this.tradeLicensedValidation = false;
  }
}

setexDate(date){
  let cdate = date;
  this.minDate = new Date(cdate  + (60*60*24*1000));
}

 emailValidation(email){
   // var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   // if(!regex.test(email)){
   //   this.mailing_address = true;
   // }
   // else{
   //   this.mailing_address = false;
   // }
   // this.mailing_address = true;
 }
 authorization(){

 }
 //organizationArray
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
     
   return true;
 }
 removeRow(obj: any, index: number, type?:string){

   if(type === '' || type == undefined){
     obj.splice(index, 1);
   }    
   return true;
 }
 showHideMembInfo(data){
   this.orgMembToggle  = data.checked;
 }

 onSubmit(ngForm){
   this.authorizationStatus = true;
   this.isSubmit = true;
   this.afterSubmit = true;
   
   Object.keys(this.authorizationList).forEach(key => {
     if(this.authorizationList[key]==false){
       this.authorizationStatus = false;
     }
   })
   //console.log(this.authorizationList);
   // if(!this.Service.checkInput('email',this.ptProvidersForm.mailing_address)){
   //   this.isSubmit = false;
   //   //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
   // }
   if(this.authorizationStatus != true){
     this.isSubmit = false;
     this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
   }
   else{
   
     this.isSubmit = true;
   }

   if(this.ptProvidersForm.duty_shift == '1' && typeof this.ptProvidersForm.duty_from1 == 'undefined' && typeof this.ptProvidersForm.duty_to1 == 'undefined')
   {
     ////console.log();
     this.dutyTime1 = false;
     this.isSubmit = false;
   }else{
     this.dutyTime1 = true;
   }
   if(this.ptProvidersForm.duty_shift == '2' && typeof this.ptProvidersForm.duty_from2 == 'undefined' && typeof this.ptProvidersForm.duty_to2 == 'undefined')
   {
     if(typeof this.ptProvidersForm.duty_from1 == 'undefined' || typeof this.ptProvidersForm.duty_to1 == 'undefined')
     {
       this.dutyTime1 = false;
     }else{
       this.dutyTime1 = true;
     }
     this.dutyTime2 = false;
     this.isSubmit = false;
   }else{
     this.dutyTime2 = true;
   }
   if(this.ptProvidersForm.duty_shift == '3' && typeof this.ptProvidersForm.duty_from3 == 'undefined' && typeof this.ptProvidersForm.duty_to3 == 'undefined')
   {
     if(typeof this.ptProvidersForm.duty_from1 == 'undefined' || typeof this.ptProvidersForm.duty_to1 == 'undefined')
     {
       this.dutyTime1 = false;
     }else{
       this.dutyTime1 = true;
     }
     if(typeof this.ptProvidersForm.duty_from2 == 'undefined' || typeof this.ptProvidersForm.duty_to2 == 'undefined')
     {
       this.dutyTime2 = false;
     }else{
       this.dutyTime2 = true;
     }
     ////console.log();
     this.dutyTime3 = false;
     this.isSubmit = false;
   }else{
     this.dutyTime3 = true;
   }
   
   // if(this.checkSecurity == true)
   // {
   //   this.checkCaptchaValidation = true;
   // }else{
   //   this.checkCaptchaValidation = false;
   // }

   if(ngForm.form.valid  && this.checkCaptchaValidation == true){
     this.ptProvidersForm.is_bod = this.is_bod;
     this.ptProvidersFormFile.append('data',JSON.stringify(this.ptProvidersForm));
       // this.loader = true;
       this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.pt_provider,this.ptProvidersFormFile)
       .subscribe(
         res => {
           if(res['status']==true){
             // this.loader = false;
             this.afterSubmit = false;
             this.captchaRef.reset();
             this.checkCaptchaValidation = false;
             this.toastr.success(res['msg'], '');
           //  this.router.navigate(['application-form/service/pt_providers']);

           }
           else{
             this.toastr.error(res['msg'],'')
           }
         },
         error => {
           this.toastr.error('Something went wrong','')
     })
     }
     else{
       this.toastr.warning('Please Fill required field','')
     }

  }

  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script')
      scriptElement.src = scriptUrl
      scriptElement.onload = resolve
      //console.log("load script...");
      document.body.appendChild(scriptElement)
    })
  }

  onSubmitApplication(ngForm1: any){
    if(this.step1Data.duty_shift == '1' && typeof this.step1Data.duty_from1 == 'undefined' && typeof this.step1Data.duty_to1 == 'undefined')
    {
      this.dutyTime1 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime1 = true;
    }
    if(this.step1Data.duty_shift == '2' && typeof this.step1Data.duty_from2 == 'undefined' && typeof this.step1Data.duty_to2 == 'undefined')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else{
        this.dutyTime1 = true;
      }
      this.dutyTime2 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime2 = true;
    }
    if(this.step1Data.duty_shift == '3' && typeof this.step1Data.duty_from3 == 'undefined' && typeof this.step1Data.duty_to3 == 'undefined')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else{
        this.dutyTime1 = true;
      }
      if(typeof this.step1Data.duty_from2 == 'undefined' || typeof this.step1Data.duty_to2 == 'undefined')
      {
        this.dutyTime2 = false;
      }else{
        this.dutyTime2 = true;
      }
      this.dutyTime3 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime3 = true;
    }
  
    if(typeof this.step1Data.duty_shift == 'undefined' || this.step1Data.duty_shift == '') {
      this.dutyTime1 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime1 = true;
    }
    this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
  
    if(ngForm1.form.valid && this.tradeLicensedValidation != false) {
      this.ptProvidersForm = {};
      this.ptProvidersForm.step1 = {};
      this.ptProvidersForm.email = this.userEmail;
      this.ptProvidersForm.userType = this.userType;
      this.ptProvidersForm.step1 = this.step1Data;
  
      this.ptProvidersForm.step1['ownOrgBasicInfo'] = [];
      this.ptProvidersForm.step1['ownOrgMembInfo'] = [];
      this.ptProvidersForm.step1['accreditationInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.ptProvidersForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.ptProvidersForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.accreditationInfo) {
        this.ptProvidersForm.step1['accreditationInfo'] = this.accreditationInfo;
      }
      
  
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(ngForm1.form.valid && this.tradeLicensedValidation == false) {
      this.file_validation = false;
      this.toastr.warning('Please Fill required field','');
    }
    else {
      this.toastr.warning('Please Fill required field','');
    }
  }
  
  onSubmitTestingParticipation(ngForm2: any){
    this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
  
    if(ngForm2.form.valid) {
      this.ptProvidersForm = {};
      this.ptProvidersForm.step2 = {};
      this.ptProvidersForm.email = this.userEmail;
      this.ptProvidersForm.userType = this.userType;
      this.ptProvidersForm.step2 = this.step2Data;
  
      this.ptProvidersForm.step2['proficiencyTesting'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.ptProvidersForm.step2['proficiencyTesting'] = this.proficiencyTesting;
      }
  
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }
  
  onSubmitPersonalInformation(ngForm3: any){
    this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
    if(ngForm3.form.valid) {
      this.ptProvidersForm = {};
      this.ptProvidersForm.step3 = {};
      this.ptProvidersForm.email = this.userEmail;
      this.ptProvidersForm.userType = this.userType;
      this.ptProvidersForm.step3 = this.step3Data;
  
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }
  
  onSubmitInformationAuditManagement(ngForm4: any){
  this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
    if(ngForm4.form.valid) {
      this.ptProvidersForm = {};
      this.ptProvidersForm.step4 = {};
      this.ptProvidersForm.email = this.userEmail;
      this.ptProvidersForm.userType = this.userType;
      this.ptProvidersForm.step4 = this.step4Data;
  
      this.step4DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }
  
  onSubmitPerlimVisit(ngForm5: any){
    this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    if(ngForm5.form.valid) {
      this.ptProvidersForm = {};
      this.ptProvidersForm.step5 = {};
      this.ptProvidersForm.email = this.userEmail;
      this.ptProvidersForm.userType = this.userType;
      this.ptProvidersForm.step5 = this.step5Data;
  
      this.step5DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step5DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }
  
  onSubmitUndertakingApplicant(ngForm6: any){
  for(let key in this.authorizationList) {
    if(this.authorizationList[key] == false) {
      this.authorizationStatus = false;
    }else {
      this.authorizationStatus = true;
    }
  }
  
  for(let key in this.recommend) {
    if(this.recommend[key] == true) {
      this.recommendStatus = true;
    }
  }
  if(this.authorizationStatus == false){
    this.isSubmit = false;
    this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
  }else if(this.recommendStatus != true){
    this.isSubmit = false;
    this.toastr.error('Please Check any recommend the visit ', '');
  }
  if(ngForm6.form.valid){
  
    // this.step6Data = this.recommend.first;
    // this.step6Data = this.recommend.second;
    // this.step6Data = this.recommend.first;
    // this.step6Data = this.recommend.first;
    // this.step6Data = this.recommend.first;
  
    this.ptProvidersForm = {};
    this.ptProvidersForm.step6 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.step6Data.authorizationList = this.authorizationList;
    this.step6Data.recommend = this.recommend;
  
    this.ptProvidersForm.step6 = this.step6Data;
    this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
  
    this.step6DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step6DataBodyFormFile)
    .subscribe(
      res => {
        console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success(res['msg'], '');
          this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  
    //Paypal config data
    //applyTrainerPublicCourse
    this.transactionsItem['amount']               = {};
    this.transactionsItem['amount']['total']      = 0.00;
    this.transactionsItem['amount']['currency']   = 'USD';
    this.transactionsItem['amount']['details']    = {};
    this.transactionsItem['amount']['details']['subtotal'] = 0.00;
    //declare Items data
    this.transactionsItem['item_list']            = {};
    this.transactionsItem['item_list']['items']   = [];
    let custPrice: any = 0.01;
    this.total = 0.05;
      this.transactionsItem['item_list']['items'].push({name: 'Test Course', quantity: 1, price: custPrice, currency: 'USD'});
        if(this.total > 0){
          //console.log("Calculate price: ", calcPrice);
          this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
          this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
          this.transactions.push(this.transactionsItem);
          //console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
        }
        setTimeout(() => {
          this.createPaymentButton(this.transactionsItem, this.ptProvidersForm, this);
          let elem = document.getElementsByClassName('paypal-button-logo');
          console.log("button creting...");
          if(elem){
            console.log("button creted...");
          }else{
            console.log("Loding button...");
          }
        }, 100)
  
    //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }    
  }

  saveInspectopnAfterPayment(theData: any){
    console.log(">>> The Data: ", theData);
    this.transactions = [];
    this.toastr.success('Payment Success, Please upload payment receipt, Thank you.','Paypal>>',{timeOut:5500});
    this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
 }
 createPaymentButton(itemData: any, formObj?:any, compObj?:any){
  //console.log("creating....buttons...", this.paymentReview, " :: ", this.paymentReview.length, " -- ",this.transactionsItem, " --- ", this.transactions);
 //AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl = das.abhishek77@gmail.com
 //Get transaction ID - https://uateloper.paypal.com/docs/checkout/reference/server-integration/get-transaction/#on-the-server
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
          compObj.saveInspectopnAfterPayment(formObj);
        })
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        //this.showCancel = true;
        formObj.paypalReturn = data;
        formObj.paypalStatus = 'cancel';
        this.toastr.warning("You have cancelled payment, Continue next step please complete payment process again.", 'Paypal>>',{timeOut:6500}); 

    },
    onError: err => {
        console.log('OnError', err);
        formObj.paypalReturn = err;
        formObj.paypalStatus = 'error';
        //compObj.saveCourseAfterPayment(formObj);
        this.toastr.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
    },
    onClick: (data, actions) => {
        console.log('onClick', data, actions);
        //this.resetStatus();
    }
    }, '#paypalPayment');
  });
  }
}

   getPlaceName()
   {
     if(typeof this.ptProvidersForm.search_location_name != 'undefined')
     {
       this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.ptProvidersForm.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
         .subscribe(res => {
             ////console.log(res['features']);
             this.searchCountryLists = res['features'];
           },
           error => {
           
       })
     }
   }

   getLatitudelongitude(longitude,latitude)
   {
     this.ptProvidersForm.location_longitude = longitude;
     this.ptProvidersForm.location_latitude = latitude;
   }

   dayTimeChange(event,dayTime)
   {
     ////console.log(dayTime);
     if(event.value != '' && dayTime == '1')
     {
       this.dutyTime1 = true;
     }
     if(event.value != '' && dayTime == '2')
     {
       this.dutyTime2 = true;
     }
     if(event.value != '' && dayTime == '3')
     {
       this.dutyTime3 = true;
     }
   }

}

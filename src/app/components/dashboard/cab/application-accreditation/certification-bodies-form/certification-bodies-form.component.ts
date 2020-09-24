import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-certification-bodies-form',
  templateUrl: './certification-bodies-form.component.html',
  styleUrls: ['./certification-bodies-form.component.scss']
})
export class CertificationBodiesFormComponent implements OnInit {

  public certificationBodiesForm: any = {};
  public organizationBasicInfo: Array<any> = [];
  public organizationMemberInfo: Array<any> = [];
  public accreditationInfo: Array<any> = []; 
  public summaryDetail: Array<any> = [];
  public auditorsExaminersFulltime: Array<any> = [];
  public auditorsExaminersParttime: Array<any> = [];
  public accreditationCriteria: Array<any> = [];
  public table_data: Array<any> = [];
  public otherActivityLocations: Array<any> = [];
  public expectedAssesment: Array<any> = [];
  public accr_cert_country_list: Array<any> = [];
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public loader:boolean=true;
  public criteriaDetails: any = {
    table_data : [],
    contact_person:'',
    email_address:'',
    phone_no:'',
    accreditation_criteria:'',
    accreditation_criteria_name:'',
  };
  
  public technicalManager: any = {};
  public managementSystemManager: any = {};
  public newRow: any = {};
  public accreditation_criteria: any = {};
  allCountry:any;
  accrediationTypeList:any;
  is_bod:any = 0;
  is_hold_current_accreditation:boolean = false;
  is_hold_other_accreditation:boolean = false;
  accreditationCriteriasId:any;
  accreditationCriteriasTitle:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = true;
  public authorizationList:any;
  public certificationBodiesFormTemp:any = new FormData();
  public banner:any=[];
  public file_validation:boolean = true;
  // version = VERSION;
  authorization_confirm2:any;
  public minDate;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;
  searchCountryLists: any;
  allCityByCountry: any = [];
  onbehalf_representative_date:boolean = true;
  getCountryLists:any;

  afterSubmit:boolean = false;
  today = new Date();

  //step wizard declaration
  headerSteps: any[] =[];
  allStateList: Array<any> = [];
  allCityList: Array<any> = [];
  step1Data:any = {};
  step2Data:any = {};
  step3Data:any = {};
  step4Data:any = {};
  step5Data:any = {};
  step6Data:any = {};
  step7Data:any = {};
  step8Data:any = {};
  step9Data:any = {};
  step10Data:any = {};
  fileAny:any;
  tradeLicensedValidation:any = false;
  userEmail:any;
  userType:any;
  isCompleteness:any;
  profileComplete:any;
  transactions: any[] =[];
  transactionsItem: any={};
  is_hold_other_accreditation_toggle: any = 0;
  getDutyTimeForm1IndexValue:number;
  recommendStatus:boolean = false
  total: any = 0;
  criteriaList:any[] = [];
  userId:any;
  selectTradeLicName :string = ''; 
  selectTradeLicPath :string = ''; 
  formApplicationId:any;
  formDraftsaved:any;
  formAccrStatus:any;
  voucherFile:any = new FormData();
  voucherSentData: any = {};
  ownOrgBasicInfo:any[] = [{}];
  ownOrgMembInfo:any[] = [{}];

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

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) {
    this.today.setDate(this.today.getDate());
  }

  getData(getVal){
    // console.log(">>>>Get MapBox Value: ", getVal);
    // this.Service.mapboxToken = getVal;
 }
ngOnInit() {
  this.headerSteps.push(
    {
    title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
    },
    {
    title:'personal_information', desc:'2. Personal Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
    },
    {
    title:'summary_number_ofpersonnel', desc:'3. Summary Of The Number Of Personnel', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'information_audit_management', desc:'4. Internal Audit & Management', activeStep:false, stepComp:false, icon:'icon-task', activeClass:''
    },
    {
      title:'scope_accreditation', desc:'5. Accreditation Scope', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
    },
    {
      title:'cbs_other_location', desc:'6. Cb’s Other Activity Location', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'perlim_visit', desc:'7. Prelim Visit', activeStep:false, stepComp:false, icon:'icon-paper', activeClass:''
    },
    {
    title:'undertaking_applicant', desc:'8. Authorization of the Application', activeStep:false, stepComp:false, icon:'icon-work', activeClass:''
    },
    {
      title:'proforma_invoice', desc:'9. Proforma Invoice', activeStep:false, stepComp:false, icon:'icon-file_invoice', activeClass:''
    },
    {
      title:'payment_update', desc:'10. Payment Update', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
    },
    {
      title:'application_complete', desc:'11. Application Complete', activeStep:false, stepComp:false, icon:'icon-document-pen', activeClass:''
    },
  );

  this.loadFormDynamicTable();
}

onSubmitStep1(ngForm1: any){
  // this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
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

  if(ngForm1.form.valid) {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step1 = {};
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.saved_step = '1';
    if(this.formApplicationId > 0){
      this.step1Data.application_id = this.formApplicationId;
    }
    this.certificationBodiesForm.step1.is_draft = false;
    this.certificationBodiesForm.step1.is_bod = this.step1Data.is_bod == '0' ? false : true;
    this.certificationBodiesForm.step1.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
    this.certificationBodiesForm.step1 = this.step1Data;

    this.certificationBodiesForm.step1['ownOrgBasicInfo'] = [];
    this.certificationBodiesForm.step1['ownOrgMembInfo'] = [];
    this.certificationBodiesForm.step1['accreditationInfo'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.certificationBodiesForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
    }
    if(this.ownOrgMembInfo) {
      this.certificationBodiesForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
    }
    if(this.accreditationInfo) {
      this.certificationBodiesForm.step1['accreditationInfo'] = this.accreditationInfo;
    }

    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.certificationBodiesForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['application_id']);
          this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else {
    this.toastr.warning('Please Fill required field','');
  }
}

is_toggle(type,value){
  if(type=="is_bod"){
    this.is_bod = value;
  }
  else if(type=="is_hold_current_accreditation"){
    this.is_hold_other_accreditation = value;
    this.certificationBodiesForm.is_hold_current_accreditation = ((this.is_hold_current_accreditation != true) ? true : false);
  }
}
loadFormDynamicTable() {
  this.organizationBasicInfo  =   [{}];
  this.organizationMemberInfo  =   [{}];
  this.accreditationInfo  =   [{}];
  this.auditorsExaminersFulltime  =   [{}];
  this.auditorsExaminersParttime  =   [{}];
  this.table_data  =   [{}];
  this.otherActivityLocations  =   [{}];
  this.expectedAssesment  =   [{}];
  this.accr_cert_country_list  =   [{}];
  //this.criteriaDetails  =   [];
  this.technicalManager  =   {};
  this.managementSystemManager  =   {};
  this.accreditation_criteria  =   {};
  this.summaryDetail = [{"position":'Managerial/Professional'},{'position':'Administrative'},{'position':'Marketing/Sales'}];
  this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,authorization_confirm3:false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false,undertaking_confirm8:false,undertaking_confirm9:false};

  this.certificationBodiesForm.organizationBasicInfo          = this.organizationBasicInfo;
  this.certificationBodiesForm.organizationMemberInfo         = this.organizationMemberInfo;
  this.certificationBodiesForm.accreditationInfo              = this.accreditationInfo;
  
  this.certificationBodiesForm.summaryDetail                  = this.summaryDetail;
  this.certificationBodiesForm.otherActivityLocations         = this.otherActivityLocations;
  this.certificationBodiesForm.expectedAssesment              = this.expectedAssesment;
  this.certificationBodiesForm.accr_cert_country_list              = this.accr_cert_country_list;

  this.certificationBodiesForm.technicalManager               = this.technicalManager;
  this.certificationBodiesForm.managementSystemManager        = this.managementSystemManager;
  this.loader= false;
}
setexDate(){
  let cdate =this.certificationBodiesForm.date_of_issue;
  this.minDate = new Date(cdate  + (60*60*24*1000));
}
accreditationCriterias (id,title){
  this.accreditationCriteriasId = id;
  if(this.accreditationCriteriasId == '1')
  {
    this.criteriaDetails['form_header'] = {'0':'Trade/Field/Job','1':'Certification Standard/Scheme'};
  }else if(this.accreditationCriteriasId == '2')
  {
    this.criteriaDetails['form_header'] = {'0':'Product Category','1':'Certification Type/Scheme','2':'Specific Type of Product','3':'Applicable Standard'};
  }else if(this.accreditationCriteriasId == '3')
  {
    this.criteriaDetails['form_header'] = {'0':'Description','1':'Standard','2':'Full/Limit Accreditation'};
  }else if(this.accreditationCriteriasId == '4')
  {
    this.criteriaDetails['form_header'] = {'0':'Cluster','1':'Scope Reference Category codes, ISO...','2':'Sub Category','3':'Full/Limited Accreditation'};
  }else if(this.accreditationCriteriasId == '5')
  {
    this.criteriaDetails['form_header'] = {'0':'Cluster','1':'Scope Reference Category codes, ISO...','2':'Sub Category','3':'Full/Limited Accreditation'};
  }else if(this.accreditationCriteriasId == '6')
  {
    this.criteriaDetails['form_header'] = {'Scope for ISO 45001 Occupational Health and Safety Management Systems Certification':{'0':'TECHNICAL CLUSTER','1':'IAF CODE	','2':'NACE CODE (REV. 02)','3':'DESCRIPTION','4':'CRITICAL CODE(S)'},'1':'Selected IAF Code(s)','2':'Selected NACE Code(s)'};
  }else if(this.accreditationCriteriasId == '7')
  {
    this.criteriaDetails['form_header'] = {'Scope for ISO 9001 Quality Management Systems Certification':{'0':'TECHNICAL CLUSTER','1':'IAF CODE	','2':'NACE CODE (REV. 02)','3':'DESCRIPTION','4':'CRITICAL CODE(S)'},'Next1':'Selected IAF Code(s)','Next2':'Selected NACE Code(s)'};
  }else if(this.accreditationCriteriasId == '8')
  {
    this.criteriaDetails['form_header'] = {'Scope for ISO 14001 Quality Management Systems Certification':{'0':'TECHNICAL CLUSTER','1':'IAF CODE	','2':'NACE CODE (REV. 02)','3':'DESCRIPTION','4':'CRITICAL CODE(S)'},'1':'Selected IAF Code(s)','2':'Selected NACE Code(s)'};
  }else if(this.accreditationCriteriasId == '9')
  {
    this.criteriaDetails['form_header'] = {'0':'IAF Code','1':'Scope Complexity based on ISO 27006','2':'Scheme'};
  }
  this.accreditationCriteriasTitle = title;
}

// idToName(title,val) {
//   if(title == 'country')
//   {
//     //this.country_name = val;
//     this.certificationBodiesForm.country_name = val;
//   }else{
//     this.certificationBodiesForm.accredation_type_name = val;
//   }
// }

validateFile(fileEvent: any,data?:any) {
  var file_name = fileEvent.target.files[0].name;
  var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
  var ex_type = ['doc','odt','pdf','rtf','docx','xlsx'];
  var ex_check = this.Service.isInArray(file_exe,ex_type);
  if(ex_check){
    this.certificationBodiesForm.trade_license_name = fileEvent.target.files[0].name;
    this.certificationBodiesFormTemp.append('trade_license_file',fileEvent.target.files[0]);
    this.file_validation = true;
    return true;
  }
  else{
    this.file_validation = false;
    return false;
  }
}
isInArray(value, array) {
return array.indexOf(value) > -1;
}

//organizationArray
addRow(obj: any = [],type?: string){
  if(type != '' && type != undefined){
    let getIndex    =   obj.findIndex(rec => rec.type == type);
    this.newRow     =   {};
    obj[getIndex].data.push(this.newRow);
  }
  if(type === '' || type == undefined){
    let objlength = obj.length+1;
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

resolvedSecurity(captchaResponse: string) {
  let captchaStatus   =  captchaResponse;
  if(captchaStatus != ''){
    this.checkSecurity = true;
    this.checkCaptchaValidation = true;
  }
  //console.log(`Resolved captcha with response: ${captchaResponse}`);
}

onSubmit(ngForm) {
  //console.log(this.certificationBodiesForm);
  this.certificationBodiesForm.is_bod = !this.is_bod ? 0 : 1;
  this.certificationBodiesForm.is_hold_current_accreditation = !this.certificationBodiesForm.is_hold_current_accreditation ? false : true;
  this.certificationBodiesForm.is_main_activity = !this.certificationBodiesForm.is_main_activity ? 0 : 1;

  this.authorizationStatus = true;
  this.isSubmit = true;
  this.afterSubmit = true;
  Object.keys(this.authorizationList).forEach(key => {
    if(this.authorizationList[key]==false){
      this.authorizationStatus = false;
    }
  })
  if(!this.authorizationStatus){
    this.isSubmit = false;
    this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
  }
  // if(!this.Service.checkInput('email',this.certificationBodiesForm.mailing_address)){
  //   this.isSubmit = false;
  //   //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
  // }
  if(this.certificationBodiesForm.duty_shift == '1' && typeof this.certificationBodiesForm.duty_from1 == 'undefined' && typeof this.certificationBodiesForm.duty_to1 == 'undefined')
  {
    ////console.log();
    this.dutyTime1 = false;
    this.isSubmit = false;
  }else{
    this.dutyTime1 = true;
  }
  if(this.certificationBodiesForm.duty_shift == '2' && typeof this.certificationBodiesForm.duty_from2 == 'undefined' && typeof this.certificationBodiesForm.duty_to2 == 'undefined')
  {
    if(typeof this.certificationBodiesForm.duty_from1 == 'undefined' || typeof this.certificationBodiesForm.duty_to1 == 'undefined')
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
  if(this.certificationBodiesForm.duty_shift == '3' && typeof this.certificationBodiesForm.duty_from3 == 'undefined' && typeof this.certificationBodiesForm.duty_to3 == 'undefined')
  {
    if(typeof this.certificationBodiesForm.duty_from1 == 'undefined' || typeof this.certificationBodiesForm.duty_to1 == 'undefined')
    {
      this.dutyTime1 = false;
    }else{
      this.dutyTime1 = true;
    }
    if(typeof this.certificationBodiesForm.duty_from2 == 'undefined' || typeof this.certificationBodiesForm.duty_to2 == 'undefined')
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
  if(this.checkSecurity == true)
  {
    this.checkCaptchaValidation = true;
  }else{
    this.checkCaptchaValidation = false;
  }
  if(ngForm.form.valid && this.isSubmit)
  {
    // this.criteriaDetails.push(this.accreditation_criteria);
    // //console.log('criteriaDetails');
    // //console.log(this.criteriaDetails);
    

    this.criteriaDetails.table_data = this.table_data;
    this.criteriaDetails.contact_person = this.accreditation_criteria.contact_person;
    this.criteriaDetails.email_address = this.accreditation_criteria.email_address;
    this.criteriaDetails.phone_no = this.accreditation_criteria.phone_no;
    this.criteriaDetails.accreditation_criteria = this.certificationBodiesForm.accreditation_criteria_id;
    this.criteriaDetails.accreditation_criteria_name = this.accreditationCriteriasTitle;

    this.summaryDetail.push({'position':'Auditors/Examiners for Each Standard','fulltime_emp_name':this.auditorsExaminersFulltime,'parttime_emp_name':this.auditorsExaminersParttime});

    this.certificationBodiesForm.criteriaDetails         = this.criteriaDetails;
    
    this.certificationBodiesFormTemp.append('data',JSON.stringify(this.certificationBodiesForm));
    this.loader = true;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.certificationBodiesFormTemp)
      .subscribe(
        res => {
        ////console.log(res)
        this.summaryDetail = [];
          this.summaryDetail = [{"position":'Managerial/Professional'},{'position':'Administrative'},{'position':'Marketing/Sales'}];
        if(res['status']==true){
          this.toastr.success(res['msg'], '');
          this.loader = false;
          this.captchaRef.reset();
          this.checkCaptchaValidation = false;
          this.afterSubmit = false;

          this.router.navigateByUrl('/application-form/service/certification_bodies');
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

getPlaceName()
{
  if(typeof this.certificationBodiesForm.search_location_name != 'undefined')
  {
    this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.certificationBodiesForm.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
      .subscribe(res => {
          // //console.log(res['features']);
          this.searchCountryLists = res['features'];
        },
        error => {
        
    })
  }
}

getLatitudelongitude(longitude,latitude)
{
  this.certificationBodiesForm.location_longitude = longitude;
  this.certificationBodiesForm.location_latitude = latitude;
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

// openDialog(obj: any, index: number) {
//   const dialogRef = this.dialog.open(DialogBoxComponent,{
//     data:{
//       message: 'Are you sure want to delete?',
//       buttonText: {
//         ok: 'Yes',
//         cancel: 'No'
//       },
//       obj:obj,
//       index:index,
//     }
//   });
// }

// openAuthorizationDialog() {
//   const dialogRef = this.dialog.open(DialogBoxComponent,{
//     data:{
//       message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//       buttonText: {
//         ok: 'Accept',
//         cancel: 'Cancel'
//       },
//       obj:'',
//       index:'',
//       authorization_checked:true,
//     },
//     height: '300px',
//     width: '600px',
//   });
//   dialogRef.afterClosed().pipe(
//     filter(name => name)
//   ).subscribe(name => {
//     this.authorization_confirm2 = name.authorization;
//     this.authorizationList.authorization_confirm2 = this.authorization_confirm2;
//   })
// }

}

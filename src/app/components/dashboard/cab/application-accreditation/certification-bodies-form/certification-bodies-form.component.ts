import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';
import { TrainerService } from '../../../../../services/trainer.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
declare let paypal: any;

@Component({
  selector: 'app-certification-bodies-form',
  templateUrl: './certification-bodies-form.component.html',
  styleUrls: ['./certification-bodies-form.component.scss']
})
export class CertificationBodiesFormComponent implements OnInit {

  public certificationBodiesForm: any = {};
  public organizationBasicInfo: Array<any> = [];
  public organizationMemberInfo: Array<any> = [];
  public summaryDetails: Array<any> = [{}];
  public auditorsExaminersFulltime: Array<any> = [{}];
  public auditorsExaminersParttime: Array<any> = [{}];
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
  accreditationInfo:any[] = [{}];
  urlVal:any;
  accredAgreemFile:any;
  checklistDocFile:any;
  pathPDF: any;
  closeResult: string;
  modalOptions:NgbModalOptions;
  paymentFile:any = false;
  paymentReceiptValidation:boolean
  readAccredAgreem: boolean = false;
  readReviewChecklist: boolean = false;
  readTermsCond: boolean = false;
  public errorLoader: boolean = false;
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  paymentFilePath: string = '';
  public recommend:any;
  auditorsExaminerJson:any = {};
  auditorsExaminerJsonParttime:any = {};
  staticPosition:any = {};
  summaryDetailsArr:any = {};
  addMinutesToTime:any;

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

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,public _trainerService:TrainerService,private modalService: NgbModal,public sanitizer: DomSanitizer) {
    this.today.setDate(this.today.getDate());
  }

  getData(getVal){
    // console.log(">>>>Get MapBox Value: ", getVal);
    // this.Service.mapboxToken = getVal;
 }
ngOnInit() {
  this.ownOrgMembInfo = [
    {
      name:'',
      bod_company:'',
      md_or_chief_executive:'',
      authorized_contact_person:'',
      designation:'',
      mobile_no:'',
      land_no:'',
      email_address:'',
    }
  ]

  this.addMinutesToTime = this.Service.addMinutesToTime();

  this.accredAgreemFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Accreditation%20Agreement.pdf');
  this.checklistDocFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Document%20review%20Checklist-%20ISO%2017020-%202012_Inspection%20Bodies.pdf');
  this.urlVal = this.Service.getValue() != '' ? this.Service.getValue() : '';
  this.userEmail = sessionStorage.getItem('email');
  this.userType = sessionStorage.getItem('type');
  this.isCompleteness = sessionStorage.getItem('isCompleteness');
  this.profileComplete = sessionStorage.getItem('profileComplete');
  this.userId = sessionStorage.getItem('userId');

  this.headerSteps.push(
    {
    title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
    },
    {
      title:'other_accreditation', desc:'2. Other Accreditation', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'personal_information', desc:'3. Personal Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
    },
    {
    title:'summary_number_ofpersonnel', desc:'4. Summary Of The Number Of Personnel', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
      title:'scope_accreditation', desc:'5. Accreditation Scope', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
    },
    {
    title:'perlim_visit', desc:'6. Prelim Visit', activeStep:false, stepComp:false, icon:'icon-paper', activeClass:''
    },
    {
    title:'undertaking_applicant', desc:'7. Authorization of the Application', activeStep:false, stepComp:false, icon:'icon-work', activeClass:''
    },
    {
      title:'proforma_invoice', desc:'8. Proforma Invoice', activeStep:false, stepComp:false, icon:'icon-file_invoice', activeClass:''
    },
    {
      title:'payment_update', desc:'9. Payment Update', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
    },
    {
      title:'application_complete', desc:'10. Application Complete', activeStep:false, stepComp:false, icon:'icon-document-pen', activeClass:''
    },
  );

  this.summaryDetails = [{"position":'Managerial/Professional'},{'position':'Administrative'},{'position':'Marketing/Sales'}];
  
  this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirmTop3: false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false};
  this.loadAppInfo()
  this.loadCountryStateCity();
}

getDutyTimeForm1Index(indexVal){
  //console.log('Get Index: ', indexVal.value, " -- ", indexVal);
    var keyVal;
    for(keyVal in this.addMinutesToTime){
        //console.log(keyVal);
        if(indexVal.value === this.addMinutesToTime[keyVal].val){
          //console.log("match ", this.addMinutesToTime[keyVal].val);
          this.getDutyTimeForm1IndexValue = keyVal;
          return;
        }
    }
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

loadCountryStateCity = async() => {
  let countryList =  this.Service.getCountry();
  await countryList.subscribe(record => {
    // console.log(record,'record');
    this.getCountryLists = record['countries'];
  });
  
}

loadAppInfo(){
  //let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
  let getUserdata = '';
  let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
  this.Service.getwithoutData(url)
  .subscribe(
    res => {
      let getData: any = res;
      let data: any;
      //, getData.data.step1, " -- ", getData.data.step2
      console.log(getData,"Profile info >>> ");

      if(getData.data.step1.length){
          data = getData.data['step1'][0];
          /////console.log('data enter...1', data);

          if(data){
            //console.log('data enter...2');
          if(getData.data.criteriaList != undefined && getData.data.criteriaList.length){
            //console.log(">>>Criteria list: ", getData.data.criteriaList);
            this.criteriaList = getData.data.criteriaList;
          }
        }

        var step2 = getData.data['step2'];

        var stateList =  this.Service.getState();
        var cityList =  this.Service.getCity();
        stateList.subscribe( result => {
          for(let key in result['states']) {
            if(result['states'][key]['name'] == data.state )
            {
              this.allStateList.push(result['states'][key]);
            }
          }
        });

        cityList.subscribe( result => {
          for(let key in result['cities']) {
            if(result['cities'][key]['name'] == data.city )
            {
              this.allCityList.push(result['cities'][key]);
            }
          }
        });
        
        // this.step1Data.accredation_criteria = '';
        // this.step1Data.accreditationInfo =  [{
        //   scheme_name: "", 
        //   acccreditation_body_name: "", 
        //   acccreditation_scope: "",
        //   certificate_expiry_date: "",
        // }];
        if(data.trade_license != ''){
          let getFile = data.trade_license.toString().split('/');
          if(getFile.length){
            this.selectTradeLicName = getFile[4].toString().split('.')[0];
            this.selectTradeLicPath = this.constant.mediaPath +  data.trade_license.toString();
          }
        }
        this.step1Data.city =  data.city;
        this.step1Data.country = data.country;
        this.step1Data.state = data.state;
        // this.step1Data.criteria_request = "";
        this.step1Data.date_of_establishment = new Date(data.date_of_establisment);
        this.step1Data.date_of_expiry = new Date(data.date_of_expiry);
        this.step1Data.date_of_issue = new Date(data.date_of_issue);
        this.step1Data.fax_no = data.applicant_fax_no;
        this.step1Data.is_bod = step2['cabBodData'] != '' ? "1" : "0";
        this.step1Data.is_hold_other_accreditation = "1";
        this.step1Data.is_main_activity = "";
        this.step1Data.is_main_activity_note = "";
        this.step1Data.mailing_address = data.applicant_address;
        this.step1Data.official_commercial_name = data.cab_name;
        this.step1Data.official_email = data.applicant_email;
        this.step1Data.official_website = data.applicant_website;
        this.ownOrgBasicInfo = step2['cabOwnerData'];
        this.ownOrgMembInfo = step2['cabBodData'];
        this.step1Data.physical_location_address = data.applicant_location;
        this.step1Data.po_box = data.po_box;
        
        this.step1Data.telephone = data.applicant_tel_no;
      }
    })

    if(this.urlVal && this.urlVal != '') {

      this.loader = false;
      let url2 = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+this.urlVal;
      this.Service.getwithoutData(url2)
      .subscribe(
        res => {
          console.log(res,'urlVal')
          this.loader = true;
          if(res['data'].id && res['data'].id != '') {
              let pathData: any;
              let filePath: string;

              if(!this.Service.isObjectEmpty(res['data'].paymentDetails)){
              
                if(res['data'].paymentDetails.voucher_invoice != undefined && res['data'].paymentDetails.voucher_invoice != ''){
                  filePath = this.constant.mediaPath + '/media/' + res['data'].paymentDetails.voucher_invoice;
                  pathData = this.getSantizeUrl(filePath);
                  this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
                }
                ////console.log(">>>> payment details upload: ", getData.data.paymentDetails, " -- ", this.paymentFilePath, " :: ", filePath);
              }
              
              if(res['data'].saved_step  != null){
                /////console.log("@saved step assign....");
                let saveStep = res['data'].saved_step;
                //open step
                this.headerSteps.forEach((item, key) => {
                      /////console.log(item, " --- ", key);
                      if(key < saveStep){
                        ////console.log('moving steps....');
                        let curStep: any = item;
                        curStep.stepComp = true;
                        let nextStep: any = this.headerSteps[key+1];
                        this.Service.moveSteps(curStep.title, nextStep.title, this.headerSteps);
                      }
                      if(key == saveStep){
                        let curStep: any = this.headerSteps[key];
                        /////console.log('found steps....',curStep);
                        curStep.stepComp = true;
                        this.Service.headerStepMove(item.title, this.headerSteps,'menu')
                      }
                })
                ////console.log("#Step data: ", this.headerSteps);
              }

              if(res['data'].id != undefined && res['data'].id > 0){
                this.formApplicationId = res['data'].id;
                this.formDraftsaved = res['data'].is_draft;
                this.formAccrStatus = res['data'].accr_status;
              }
              // console.log(this.formApplicationId);
              //step1

              // if(res['data'].cab_type == 'calibration_laboratories') {
              //   this.step1Data.cab_type = 
              // }else if(res['data'].cab_type == 'calibration_laboratories') {
              //   this.step1Data.cab_type = 
              // }
              this.step1Data.cab_type = res['data'].cab_type != '' ? res['data'].cab_type : '';
              console.log("@cab type: ", this.step1Data.cab_type);
              
              if(res['data'].accredation_criteria  != ''){
                this.step1Data.accredation_criteria = res['data'].accredation_criteria.toString();
              }
              if(res['data'].criteria_request  != ''){
                this.step1Data.criteria_request = res['data'].criteria_request;
              }

              if(res['data'].is_main_activity != undefined){
                  this.step1Data.is_main_activity = res['data'].is_main_activity.toString();
                  if(!res['data'].is_main_activity){
                    this.step1Data.is_main_activity_note = res['data'].is_main_activity_note.toString();
                  }
              }

              //step2
              if(res['data'].otherAccr != undefined && res['data'].otherAccr.length > 0){
                this.accreditationInfo = [];
                this.step2Data.is_hold_other_accreditation = "1";
                res['data'].otherAccr.forEach((item, key) => {
                    let data: any;
                    data = item['value'];
                    var obj1 = data.replace(/'/g, "\"");
                    let jparse = JSON.parse(obj1);
                    this.accreditationInfo.push(jparse);
                })
              }else{
                this.step2Data.is_hold_other_accreditation = "0";
              }

              //step3
              if(res['data'].technicalManager != undefined && res['data'].technicalManager.length > 0){
                let getTechData: any = res['data'].technicalManager[0];
                this.step3Data.name = getTechData.name;
                this.step3Data.designation = getTechData.designation;
                this.step3Data.mobile_no = getTechData.mobile_no;
                this.step3Data.email = getTechData.email;
                this.step3Data.relevent_experience = getTechData.relevent_experience;
                this.step3Data.duration_at_current_post = getTechData.duration_at_current_post;
              }
              if(res['data'].managementManager != undefined && res['data'].managementManager.length > 0){
                let getMangData: any = res['data'].managementManager[0];
                this.step3Data.management_name = getMangData.name;
                this.step3Data.management_designation = getMangData.designation;
                this.step3Data.management_mobile_no = getMangData.mobile_no;
                this.step3Data.management_email = getMangData.email;
                this.step3Data.management_relevent_experience = getMangData.relevent_experience;
                this.step3Data.duration_at_current_post_manager = getMangData.duration_at_current_post;
              }

              //step4
              if(res['data'].summaryOfPersonnel != undefined && res['data'].summaryOfPersonnel.length > 0) {
                this.summaryDetails = [];
                // var summaryDetailsArr = {};
                // res['data'].summaryOfPersonnel.forEach((res,key) => {
                //   if(res['position'] == 'Managerial/Professional' || res['position'] == 'Administrative' || res['position'] == 'Marketing/Sales') {
                //     // this.summaryDetails.position
                //     this.summaryDetailsArr.position = res['position'];
                //     this.summaryDetailsArr.fulltime_emp_name = res['fulltime_emp_name'];
                //     this.summaryDetailsArr.parttime_emp_name = res['parttime_emp_name'];
                //   }
                  
                // })

                res['data'].summaryOfPersonnel.find((res,key) => {
                  if(res['position'] == 'Managerial/Professional'){
                    var obj = {};
                    obj['position'] = res['position'];
                    obj['fulltime_emp_name'] = res['fulltime_emp_name'];
                    obj['parttime_emp_name'] = res['parttime_emp_name'];
                    this.summaryDetails.push(obj);
                  }else if(res['position'] == 'Administrative'){
                    var obj = {};
                    obj['position'] = res['position'];
                    obj['fulltime_emp_name'] = res['fulltime_emp_name'];
                    obj['parttime_emp_name'] = res['parttime_emp_name'];
                    this.summaryDetails.push(obj);
                  }else if(res['position'] == 'Marketing/Sales'){
                    var obj = {};
                    obj['position'] = res['position'];
                    obj['fulltime_emp_name'] = res['fulltime_emp_name'];
                    obj['parttime_emp_name'] = res['parttime_emp_name'];
                    this.summaryDetails.push(obj);
                  }else if(res['position'] == 'Auditors/Examiners for Each Standard'){
                    // var obj = {};
                    // var auditorsExaminersFulltimeArr = [];
                    // var auditorsExaminersParttimeArr = [];

                    // obj['position'] = res['position'];
                    
                    var obj1 = res['fulltime_emp_name'].replace(/'/g, "\"");
                    var obj2 = JSON.parse(obj1);

                    var obj3 = res['parttime_emp_name'].replace(/'/g, "\"");
                    var obj4 = JSON.parse(obj3);

                    this.auditorsExaminersFulltime = obj2;
                    this.auditorsExaminersParttime = obj4;
                  }
                });
                
                // console.log(this.summaryDetails,'summaryDetails');
                // console.log(this.auditorsExaminersFulltime,'auditorsExaminersFulltime');
                // console.log(this.auditorsExaminersParttime,'auditorsExaminersParttime');
              }
              // if(res['data'].audit_date != null){
              //   this.step4Data.audit_date = new Date(res['data'].audit_date);
              // }
              // if(res['data'].mrm_date != null){
              //   this.step4Data.mrm_date = new Date(res['data'].mrm_date);
              // }

              //Step 6
              if(res['data'].is_prelim_visit != null){
                this.step6Data.is_prelim_visit = (res['data'].is_prelim_visit) ? "1" : "0";
                this.step6Data.prelim_visit_date = res['data'].prelim_visit_date;
                this.step6Data.prelim_visit_time = res['data'].prelim_visit_time;
              }
              //Step 7
              if(res['data'].onBehalfApplicantDetails && res['data'].onBehalfApplicantDetails != null && res['data'].onBehalfApplicantDetails != undefined){
                let getAuthData = res['data'].onBehalfApplicantDetails;
                //console.log(">>> Auth data: ", getAuthData);
                this.step7Data.organization_name        = getAuthData.organization_name;
                this.step7Data.representative_name      = getAuthData.representative_name;
                this.step7Data.designation              = getAuthData.designation;
                this.step7Data.digital_signature        = getAuthData.digital_signature;
                this.step7Data.application_date         = getAuthData.application_date;

                Object.keys(this.authorizationList).forEach( key => { 
                  this.authorizationList[key] = true;
                })
                this.authorizationStatus = true;
                this.step7Data.recommend_visit = 'second';
              }

              //Step 9
              if(res['data'].paymentDetails != null && typeof res['data'].paymentDetails === 'object'){
                // console.log(">>>payment details...show");
                  this.voucherSentData.voucher_code     = res['data'].paymentDetails.voucher_no;
                  this.voucherSentData.payment_date     = new Date(res['data'].paymentDetails.voucher_date);
                  this.voucherSentData.amount           = res['data'].paymentDetails.amount;
                  this.voucherSentData.transaction_no   = res['data'].paymentDetails.transaction_no;
                  this.voucherSentData.payment_method   = res['data'].paymentDetails.payment_method;
                  this.voucherSentData.payment_made_by  = res['data'].paymentDetails.payment_made_by;
                  this.voucherSentData.mobile_no        = res['data'].paymentDetails.mobile_no;

                  this.paymentFile = res['data'].paymentDetails.payment_receipt && res['data'].paymentDetails.payment_receipt != null ? this.constant.mediaPath+'/media/'+res['data'].paymentDetails.payment_receipt : '';
                  this.paymentReceiptValidation = true;
              }
            }
        });
    }
}

savedraftStep(stepCount) {
  if(stepCount == 'step1') {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step1 = {};
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.saved_step = '1';
    if(this.formApplicationId > 0){
      this.step1Data.application_id = this.formApplicationId;
    }
    this.step1Data.is_draft = true;
    this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
    this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
    this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
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
    this.loader = false;
    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodiesForm,this.certificationBodiesForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = true;
        if(res['status'] == true) {
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step2') {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step2 = {};
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.saved_step = '2';
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step2Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    
    this.step2Data.is_draft = true;
    this.certificationBodiesForm.step2 = this.step2Data;

    this.certificationBodiesForm.step2['proficiencyTesting'] = [];
    
    // if(this.ownOrgBasicInfo) {
    //   this.certificationBodiesForm.step2['proficiencyTesting'] = this.proficiencyTesting;
    // }

    this.loader = false;
    // this.step2DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodiesForm,this.certificationBodiesForm)
    .subscribe(
      res => {
        this.loader = true;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step3') {
    this.certificationBodiesForm = {};
    // this.step3Data = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step3Data.is_draft = true;
    this.certificationBodiesForm.saved_step = '3';
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;

    this.step3Data.technicalManager = {};
    this.step3Data.technicalManager['name'] = (this.step3Data.name != '' && this.step3Data.name != undefined) ? this.step3Data.name : '';
    this.step3Data.technicalManager['designation'] = (this.step3Data.designation != '' && this.step3Data.designation != undefined) ? this.step3Data.designation : '';
    this.step3Data.technicalManager['mobile_no'] = (this.step3Data.mobile_no != '' && this.step3Data.mobile_no != undefined) ? this.step3Data.mobile_no : '';
    this.step3Data.technicalManager['email'] = (this.step3Data.email != '' && this.step3Data.email != undefined) ? this.step3Data.email : '';
    this.step3Data.technicalManager['relevent_experience'] = (this.step3Data.relevent_experience != '' && this.step3Data.relevent_experience != undefined) ? this.step3Data.relevent_experience : '';
    this.step3Data.technicalManager['duration_at_current_post'] = (this.step3Data.duration_at_current_post != '' && this.step3Data.duration_at_current_post != undefined) ? this.step3Data.duration_at_current_post : '';
    //}     relevent_experience

    this.step3Data.managementManager = {};
    this.step3Data.managementManager['name'] = (this.step3Data.management_name != '' && this.step3Data.management_name != undefined) ? this.step3Data.management_name : '';
    this.step3Data.managementManager['designation'] = (this.step3Data.management_designation != '' && this.step3Data.management_designation != undefined) ? this.step3Data.management_designation : '' ;
    this.step3Data.managementManager['mobile_no'] = (this.step3Data.management_mobile_no != '' && this.step3Data.management_mobile_no != undefined) ? this.step3Data.management_mobile_no : '';
    this.step3Data.managementManager['email'] = (this.step3Data.management_email != '' && this.step3Data.management_email != undefined) ? this.step3Data.management_email : '';
    this.step3Data.managementManager['relevent_experience'] = (this.step3Data.management_relevent_experience != '' && this.step3Data.management_relevent_experience != undefined) ? this.step3Data.management_relevent_experience : '';
    this.step3Data.managementManager['duration_at_current_post'] = (this.step3Data.duration_at_current_post_manager != '' && this.step3Data.duration_at_current_post_manager != undefined) ? this.step3Data.duration_at_current_post_manager : '';

    this.certificationBodiesForm.step3 = this.step3Data;
    this.loader = false;
    // this.step3DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodiesForm,this.certificationBodiesForm)
    .subscribe(
      res => {
        console.log(res,'res')
        if(res['status'] == true) {
          this.loader = true;
          // this.toastr.success(res['msg'], '');
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step4') {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step4 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step4Data.is_draft = true;
    this.certificationBodiesForm.saved_step = '4';
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.step4 = this.step4Data;
    this.loader = false;
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodiesForm,this.certificationBodiesForm)
    .subscribe(
      res => {
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.loader = true;
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }

  if(stepCount == 'step5') {
    
  }
  if(stepCount == 'step6') {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step6 = {};
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
    this.step6Data.is_draft = true;
    this.certificationBodiesForm.saved_step = '6';
    this.certificationBodiesForm.step6 = this.step6Data;

    // console.log(this.certificationBodiesForm);
    this.loader = false;
    // this.step5DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodiesForm,this.certificationBodiesForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = true;
        if(res['status'] == true) {
          this.toastr.success(res['msg'], '');
          this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step7') {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step7 = {};
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.step7Data.authorizationList = this.authorizationList;
    this.step7Data.recommend = this.recommend;
    this.step7Data.is_draft = true;
    this.certificationBodiesForm.saved_step = '7';

    this.certificationBodiesForm.step7 = this.step7Data;
    // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
    this.loader = false;
    // this.step6DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodiesForm,this.certificationBodiesForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = true;
        if(res['status'] == true) {
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }

  if(stepCount == 'step9') {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step9 = {};

    let dtFormat: string = '';
    if(this.voucherSentData['payment_date'] != undefined && 
        this.voucherSentData['payment_date']._i != undefined){
        var dtData = this.voucherSentData['payment_date']._i;
        var year = dtData.year;
      var month = dtData.month;
      var date = dtData.date;
      dtFormat = year + "-" + month + "-" + date;
    }
    //     

    this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
    this.voucherFile.append('amount',this.voucherSentData['amount']);
    this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
    this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
    this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
    this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
    this.voucherFile.append('voucher_date',dtFormat);
    this.voucherFile.append('accreditation',this.formApplicationId);
    // this.voucherFile.append('application_id',this.formApplicationId);
        
    this.loader = false;
    // console.log(this.voucherFile);
    this._trainerService.paymentVoucherSave((this.voucherFile))
    .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          //console.log("submit voucher: ", data);
          if(data.status){
            this.toastr.success('Save Draft Successfully', '');
          }else{
            this.toastr.warning(data.msg,'');
          }
        }
      )
  }
}

onSubmitStep1(ngForm1: any){
  // this.Service.moveSteps('application_information', 'other_accreditation', this.headerSteps);
  console.log(this.ownOrgMembInfo,'ownOrgMembInfo');
  if(ngForm1.form.valid) {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step1 = {};
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.saved_step = '1';
    this.step1Data.is_draft = false;
    if(this.formApplicationId > 0){
      this.step1Data.application_id = this.formApplicationId;
    }
    // this.certificationBodiesForm.step1.is_draft = false;
    this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
    // this.certificationBodiesForm.step1.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
    this.certificationBodiesForm.step1 = this.step1Data;

    this.certificationBodiesForm.step1['ownOrgBasicInfo'] = [];
    this.certificationBodiesForm.step1['ownOrgMembInfo'] = [];
    // this.certificationBodiesForm.step1['accreditationInfo'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.certificationBodiesForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
    }
    if(this.ownOrgMembInfo) {
      this.certificationBodiesForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
    }
    // if(this.accreditationInfo) {
    //   this.certificationBodiesForm.step1['accreditationInfo'] = this.accreditationInfo;
    // }

    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    console.log(this.certificationBodiesForm,'certificationBodiesForm');
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.certificationBodiesForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['application_id']);
          this.Service.moveSteps('application_information', 'other_accreditation', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else {
    this.toastr.warning('Please Fill required field','');
  }
}

onSubmitStep2(ngForm2:any) {
  this.Service.moveSteps('other_accreditation', 'personal_information', this.headerSteps);
  if(ngForm2.form.valid) {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step2 = {};
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.saved_step = '2';
    var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step2Data.is_draft = false;
    this.step2Data.is_hold_other_accreditation = this.step2Data.is_hold_other_accreditation == '0' ? false : true;
    this.certificationBodiesForm.step2 = this.step2Data;

    this.certificationBodiesForm.step2['accreditationInfo'] = [];
    if(this.accreditationInfo) {
      this.certificationBodiesForm.step2['accreditationInfo'] = this.accreditationInfo;
    }

    console.log(this.certificationBodiesForm,'certificationBodiesForm');
    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.certificationBodiesForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['application_id']);
          this.Service.moveSteps('other_accreditation', 'personal_information', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else {
    this.toastr.warning('Please Fill required field','');
  }
}

onSubmitStep3(ngForm3: any){
  this.Service.moveSteps('personal_information', 'summary_number_ofpersonnel', this.headerSteps);
  if(ngForm3.form.valid) {
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step3 = {};
    //this.certificationBodiesForm.email = this.userEmail;
    //this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.step3.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.certificationBodiesForm.step3.email = this.userEmail;
    this.certificationBodiesForm.step3.userType = this.userType;
    this.certificationBodiesForm.step3.application_id = this.formApplicationId;
    //this.certificationBodiesForm.step3 = this.step3Data;

    this.certificationBodiesForm.step3.technicalManager = {};

    this.certificationBodiesForm.step3.technicalManager['name'] = (this.step3Data.name != '' && this.step3Data.name != undefined) ? this.step3Data.name : '';
    this.certificationBodiesForm.step3.technicalManager['designation'] = (this.step3Data.designation != '' && this.step3Data.designation != undefined) ? this.step3Data.designation : '';
    this.certificationBodiesForm.step3.technicalManager['mobile_no'] = (this.step3Data.mobile_no != '' && this.step3Data.mobile_no != undefined) ? this.step3Data.mobile_no : '';
    this.certificationBodiesForm.step3.technicalManager['email'] = (this.step3Data.email != '' && this.step3Data.email != undefined) ? this.step3Data.email : '';
    this.certificationBodiesForm.step3.technicalManager['relevent_experience'] = (this.step3Data.relevent_experience != '' && this.step3Data.relevent_experience != undefined) ? this.step3Data.relevent_experience : '';
    this.certificationBodiesForm.step3.technicalManager['duration_at_current_post'] = (this.step3Data.duration_at_current_post != '' && this.step3Data.duration_at_current_post != undefined) ? this.step3Data.duration_at_current_post : '';

    this.certificationBodiesForm.step3.managementManager = {};

    this.certificationBodiesForm.step3.managementManager['name'] = (this.step3Data.management_name != '' && this.step3Data.management_name != undefined) ? this.step3Data.management_name : '';
    this.certificationBodiesForm.step3.managementManager['designation'] = (this.step3Data.management_designation != '' && this.step3Data.management_designation != undefined) ? this.step3Data.management_designation : '' ;
    this.certificationBodiesForm.step3.managementManager['mobile_no'] = (this.step3Data.management_mobile_no != '' && this.step3Data.management_mobile_no != undefined) ? this.step3Data.management_mobile_no : '';
    this.certificationBodiesForm.step3.managementManager['email'] = (this.step3Data.management_email != '' && this.step3Data.management_email != undefined) ? this.step3Data.management_email : '';
    this.certificationBodiesForm.step3.managementManager['relevent_experience'] = (this.step3Data.management_relevent_experience != '' && this.step3Data.management_relevent_experience != undefined) ? this.step3Data.management_relevent_experience : '';
    this.certificationBodiesForm.step3.managementManager['duration_at_current_post'] = (this.step3Data.duration_at_current_post_manager != '' && this.step3Data.duration_at_current_post_manager != undefined) ? this.step3Data.duration_at_current_post_manager : '';

    this.certificationBodiesForm.step3.is_draft = false;
    this.certificationBodiesForm.saved_step = 3;
    // this.certificationBodiesForm.step3 = this.step3Data;
    this.loader = false;
    console.log(this.certificationBodiesForm,'certificationBodiesForm');
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.certificationBodiesForm)
    .subscribe(
      res => {
        this.loader = true;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.Service.moveSteps('personal_information', 'summary_number_ofpersonnel', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }
}

onSubmitStep4(ngForm4:any) {
  // this.Service.moveSteps('summary_number_ofpersonnel', 'scope_accreditation', this.headerSteps);
  if(ngForm4.form.valid) {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step4 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step4Data.is_draft = false;
    this.certificationBodiesForm.saved_step = '4';
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    this.certificationBodiesForm.step4 = this.step4Data;

    this.certificationBodiesForm.step4['summaryDetail'] = [];
    // this.certificationBodiesForm.step4['auditorsExaminersFulltime'] = [];
    // this.certificationBodiesForm.step4['auditorsExaminersParttime'] = [];

    if(this.summaryDetails) {
      // this.certificationBodiesForm.step4['summaryDetail'] = this.summaryDetails;
      this.summaryDetails.forEach((res,key) => {
        // this.staticPosition.position = res['position'];
        // this.staticPosition.fulltime_emp_name = res['fulltime_emp_name'];
        // this.staticPosition.parttime_emp_name = res['parttime_emp_name'];

        this.certificationBodiesForm.step4['summaryDetail'].push(this.summaryDetails[key]);
      })
      
    }
    if(this.auditorsExaminersFulltime && this.auditorsExaminersParttime) {
      this.auditorsExaminerJson.fulltime_emp_name = [];
      for(let key in this.auditorsExaminersFulltime) {
        
        this.auditorsExaminerJson.position = 'Auditors/Examiners for Each Standard';
        this.auditorsExaminerJson.fulltime_emp_name.push(this.auditorsExaminersFulltime[key]);
      }

      this.auditorsExaminerJson.parttime_emp_name = [];
      // this.certificationBodiesForm.step4['auditorsExaminersParttime'] = this.auditorsExaminersParttime;
      // this.auditorsExaminerJsonParttime.parttime_emp_name = [];
      for(let key in this.auditorsExaminersParttime) {
        
        // this.auditorsExaminerJsonParttime.position = 'Auditors/Examiners for Each Standard';
        this.auditorsExaminerJson.parttime_emp_name.push(this.auditorsExaminersParttime[key]);
      }

      this.certificationBodiesForm.step4['summaryDetail'].push(this.auditorsExaminerJson);
      // this.certificationBodiesForm.step4['auditorsExaminersFulltime'] = this.auditorsExaminersFulltime;
    }
    // if(this.auditorsExaminersParttime) {
      
    //   this.certificationBodiesForm.step4['summaryDetail'].push(this.auditorsExaminerJson);
    // }
    
    this.loader = false;
    console.log(this.certificationBodiesForm,'certificationBodiesForm');
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.certificationBodiesForm)
    .subscribe(
      res => {
        this.loader = true;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.Service.moveSteps('summary_number_ofpersonnel', 'scope_accreditation', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }
}

onSubmitStep5(ngForm5: any) {
  this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
}

onSubmitStep6(ngForm6: any){
  this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
  if(ngForm6.form.valid) {
    this.certificationBodiesForm = {};
    this.certificationBodiesForm.step6 = {};
    this.certificationBodiesForm.saved_step = '6';
    this.certificationBodiesForm.email = this.userEmail;
    this.certificationBodiesForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
    this.step6Data.is_draft = false;
    this.certificationBodiesForm.step6 = this.step6Data;

    // console.log(this.certificationBodiesForm);
    // this.step5DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
    this.loader = false;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.certificationBodiesForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = true;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }
}

onSubmitUndertakingApplicant(ngForm7: any){
// this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);
for(let key in this.authorizationList) {
  if(this.authorizationList[key] == false) {
    this.authorizationStatus = false;
  }else {
    this.authorizationStatus = true;
  }
}

// for(let key in this.recommend) {
//   if(this.recommend[key] == true) {
//     this.recommendStatus = true;
//   }
// }
if(this.authorizationStatus == false){
  this.isSubmit = false;
  this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
}else if(this.step7Data.recommend_visit == ''){
  this.isSubmit = false;
  this.toastr.error('Please Check any recommend the visit ', '');
}
if(ngForm7.form.valid){

  this.certificationBodiesForm = {};
  this.certificationBodiesForm.step7 = {};
  this.certificationBodiesForm.email = this.userEmail;
  this.certificationBodiesForm.userType = this.userType;
  var applicationId = sessionStorage.getItem('applicationId');
  this.step7Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
  this.certificationBodiesForm.saved_step = '7';
  this.step7Data.authorizationList = this.authorizationList;
  this.step7Data.recommend = this.recommend;
  this.step7Data.is_draft = false;
  this.step7Data.application_date = new Date();

  this.certificationBodiesForm.step7 = this.step7Data;
  // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);

  // this.step6DataBodyFormFile.append('data',JSON.stringify(this.certificationBodiesForm));
  // console.log(this.certificationBodiesForm,'certificationBodiesForm');
  this.loader = false;
  this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.certificationBodiesForm)
  .subscribe(
    res => {
      // console.log(res,'res')
      this.loader = true;
      if(res['status'] == true) {
        // this.toastr.success(res['msg'], '');
        if(this.paymentFilePath != ''){
          this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);
        }
        else{
          // this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
          this.router.navigateByUrl('/dashboard/status/all');
        }
      }else{
        this.toastr.warning(res['msg'], '');
      }
    });
  //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
}else{
this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
}    
}


onSubmitStep8(ngForm8: any) {
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
    this.createPaymentButton(this.transactionsItem, this.certificationBodiesForm, this);
    let elem = document.getElementsByClassName('paypal-button-logo');
    console.log("button creting...");
    if(elem){
      console.log("button creted...");
    }else{
      console.log("Loding button...");
    }
  }, 100)
}

onSubmitPaymentInformation(ngForm9: any, type?: boolean){
//console.log("payment submitting.....");
this.certificationBodiesForm = {};
this.certificationBodiesForm.step9 = {};

  let dtFormat: string = '';
  if(this.voucherSentData['payment_date'] != undefined && 
    this.voucherSentData['payment_date']._i != undefined){
    var dtData = this.voucherSentData['payment_date']._i;
    var year = dtData.year;
    var month = dtData.month;
    var date = dtData.date;
    dtFormat = year + "-" + month + "-" + date;
  }
  //     

this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
this.voucherFile.append('amount',this.voucherSentData['amount']);
this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
this.voucherFile.append('voucher_date',dtFormat);
this.voucherFile.append('accreditation',this.formApplicationId);
// this.voucherFile.append('application_id',this.formApplicationId);
    
this.loader = false;
if(ngForm9.form.valid && this.paymentReceiptValidation != false) {
  // console.log(this.voucherFile);
    this._trainerService.paymentVoucherSave((this.voucherFile))
    .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          //console.log("submit voucher: ", data);
          if(data.status){
            //this.voucherFile = new FormData();
            //this.voucherSentData = {};
            //this.toastr.success("Your form has been successfully submitted and it is under review.We will update you shortly.",'THANK YOU');
            setTimeout(()=>{
              let elem = document.getElementById('openAppDialog');
              console.log("App dialog hash....", elem);
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
            this.toastr.warning(data.msg,'');
          }
        }
      )
}else if(type != undefined && type == true && this.paymentReceiptValidation != false){
  this.certificationBodiesForm.step9.is_draft = true;
  this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.certificationBodiesForm)
  .subscribe(
  res => {
    //console.log(res,'res')
    if(res['status'] == true) {
      this.toastr.success(res['msg'], '');
      //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
    }else{
      this.toastr.warning(res['msg'], '');
    }
  });
}
else{
  this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
}

}

agreeView(){
  this.modalService.dismissAll();
  this.authorizationList.undertaking_confirmTop2 = true;
  this.readAccredAgreem = true;
}
closeChecklistDialog(){
  this.modalService.dismissAll();
  this.authorizationList.undertaking_confirm2 = true;
  this.readReviewChecklist= true;
}

onError(error: any) {
  // do anything
  ////console.log('PDF Error: ', error)
  this.errorLoader = true;
}

completeLoadPDF(pdfLoad: PDFDocumentProxy){
  ////console.log("Completed Load PDF :: ", pdfLoad);
  this.loaderPdf = false;
  this.completeLoaded = true;
}

onProgress(progressData: PDFProgressData){
 ////console.log("Loding Pdf :: ", progressData);
  this.loaderPdf = true;
}

getSantizeUrl(url : string) { 
  return this.sanitizer.bypassSecurityTrustResourceUrl(url); 
}

openView(content, type:string) {
  let pathData: any;
  //console.log(">>>pop up...", content);
  if(type != undefined && type == 'agreement'){
    pathData = this.getSantizeUrl(this.accredAgreemFile);
    this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
  }
  if(type != undefined && type == 'checklist'){
    pathData = this.getSantizeUrl(this.checklistDocFile);
    this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
  }

  //console.log(">>> open view", this.pathPDF, " -- ",  this.pathPDF);

  this.modalService.open(content, this.modalOptions).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    ////console.log("Closed: ", this.closeResult);
    //this.courseViewData['courseDuration'] = '';
    //this.courseViewData['courseFees'] = '';
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    ////console.log("Closed with ESC ");
    
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    ////console.log("Closed with CLOSE ICON ");
   
    return 'by clicking on a backdrop';
  } else {
    ////console.log("Closed ",`with: ${reason}`);
    
    return  `with: ${reason}`;
  }
}

validateFileVoucher(fileEvent: any, type?: any) {
  var file_name = fileEvent.target.files[0].name;
  var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
  var ex_type = ['pdf'];
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

private loadExternalScript(scriptUrl: string) {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script')
    scriptElement.src = scriptUrl
    scriptElement.onload = resolve
    //console.log("load script...");
    document.body.appendChild(scriptElement)
  })
}

saveInspectopnAfterPayment(theData: any){
  //console.log(">>> The Data: ", theData);
  this.transactions = [];
  this.toastr.success('Payment Success, Thank you.','Paypal>>',{timeOut:2000});
  setTimeout(()=> {
    // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
    ////console.log("moving...");
    this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
  }, 1000)      
  //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
}

createPaymentButton(itemData: any, formObj?:any, compObj?:any){
  //console.log("creating....buttons...", this.paymentReview, " :: ", this.paymentReview.length, " -- ",this.transactionsItem, " --- ", this.transactions);
 //AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl = das.abhishek77@gmail.com
 //Get transaction ID - https://uateloper.paypal.com/docs/checkout/reference/server-integration/get-transaction/#on-the-server
  if(this.transactions.length){
    console.log('Paypal');
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

is_toggle(type,value){
  if(type=="is_bod"){
    this.is_bod = value;
  }
  else if(type=="is_hold_current_accreditation"){
    this.is_hold_other_accreditation = value;
    this.certificationBodiesForm.is_hold_current_accreditation = ((this.is_hold_current_accreditation != true) ? true : false);
  }
}

setexDate(){
  let cdate =this.certificationBodiesForm.date_of_issue;
  this.minDate = new Date(cdate  + (60*60*24*1000));
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

}

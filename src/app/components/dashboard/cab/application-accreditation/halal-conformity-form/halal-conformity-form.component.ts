import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from '../../../../utility/custom-modal/custom-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TrainerService } from '../../../../../services/trainer.service';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
declare let paypal: any;

@Component({
  selector: 'app-halal-conformity-form',
  templateUrl: './halal-conformity-form.component.html',
  styleUrls: ['./halal-conformity-form.component.scss'],
  providers: [CustomModalComponent]
})
export class HalalConformityFormComponent implements OnInit {

  public publicHalalConformityForm: any = {};
  public publicHalalConformityFormTemp:any = new FormData();
  public technicalManager: any = {};
  public islamicAffair: any = {};
  public qualityManager: any = {};
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public managing_director: Array<any> = [];
  public ownershipOfTheCompany: Array<any> = [];
  public boardOfDirector: Array<any> = [];
  public hcabLocationList: Array<any> = [];
  public hcabAccreditation: Array<any> = [];
  public halalConformityAssessment: Array<any> = [];
  public certifiedSlaughterhouse: Array<any> = [];
  public halalProductTesting: Array<any> = [];
  public scopeOfHalalConformity: Array<any> = [];
  public authorizedHalalCertificates: Array<any> = [];
  public is_bod:any=0;
  public is_cab_location:any=0;
  public is_cab_accdiations:any=0;
  public summaryDetail:Array<any> = [];
  public categoryDetail:Array<any> = [];
  public loader:boolean=true
  public newRow: any = {};
  public banner:any=[];
  allCountry:any;
  allService:any;
  file_validation:boolean = true;
  hcab_location:any;
  is_hold_other_accreditation:any;
  searchCountryLists:any;
  public file_validation2:boolean = true;
  public file_validation3:boolean = true;
  public file_validation4:boolean = true;
  
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = true;
  allCityByCountry: any = [];
  getCountryLists:any;
  // version = VERSION;
  public minDate;

  afterSubmit: boolean = false;


  headerSteps:any[] = [];
  public recommend:any;
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
  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  step4DataBodyFormFile:any = new FormData();
  step5DataBodyFormFile:any = new FormData();
  step6DataBodyFormFile:any = new FormData();
  step7DataBodyFormFile:any = new FormData();
  step8DataBodyFormFile:any = new FormData();
  step9DataBodyFormFile:any = new FormData();
  step10DataBodyFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  isCompleteness:any;
  profileComplete:any;
  today = new Date();
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
  pathPDF: any;
  closeResult: string;
  modalOptions:NgbModalOptions;
  accredAgreemFile: any;
  checklistDocFile: any;
  urlVal: any;
  paymentFile:any = false;
  isApplicationSubmitted:any = false;
  public isNoteSubmit:boolean = false;
  

  //Master scope form data declaration
  dynamicScopeModel:any         = {};   
  dynamicScopeFieldColumns:any  = {};  
  dynamicScopeFieldType:any  = {}; 
  criteriaMaster: any[] = [];
  fullScope:any[]=[];
  scopeDataLoad: boolean = false;
  editScopeData: any;
  getScopeData: any;
  selectDeleteID: number =0;
  selectDeleteKey: any;
  selectDeleteIndex: any;
  deleteEditScopeConfirm: boolean = false;
  deleteScopeConfirm: boolean = false;
  inspectionBodyForm: any = {};
  schemeRows: Array<any> = [{}];
  //Master scope form data declaration
  is_main_activity_note_entry: boolean = false;

  bannerURL: any = '';
  bannerImageTitle: string = '';
  bannerLinkTarget: string = '';
  addMinutesToTime:any;
  paymentReceiptValidation:boolean
  readAccredAgreem: boolean = false;
  readReviewChecklist: boolean = false;
  readTermsCond: boolean = false;
  public errorLoader: boolean = false;
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  paymentFilePath: string = '';
  auditorsExaminerJson:any = {};
  auditorsExaminerJsonParttime:any = {};
  staticPosition:any = {};
  summaryDetailsArr:any = {};
  // certificate_expiry_date_second:Date = new Date();
  onbehalf_representative_date:boolean = false;
  ownOrgBasicInfo:any[] = [{}];
  ownOrgMembInfo:any[] = [{}];
  accreditationInfo:any[] = [{}];
  managingDirector:any[] = [{}];
  hcabOtherLocation:any[] = [{}];
  summaryDetails:any[] = [{}];
  scopeofHalalConformity:any[] = [{}];
  authorizedPersonforSigning:any[] = [{}];
  hcabLogo1:any = {};
  hcabLogo2:any = {};
  hcabLogo3:any = {};
  
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;

  scrollHandler(elem) {
    if(elem != undefined){
      //console.debug("Scroll Event: ", elem.srcElement.scrollHeight, " == [ ",elem.srcElement.offsetHeight, " - ",elem.srcElement.scrollTop," ]"  );
      if((elem.srcElement.offsetHeight + elem.srcElement.scrollTop) >=  elem.srcElement.scrollHeight) {
         //console.log("Yo have reached!");
         this.authorizationList.authorization_confirm2 = true;
         this.readTermsCond = true;
         this.authorizeCheckCount(elem, 'read')
      }else{
        this.authorizeCheckCount(elem, 'read')
        //this.authorizationList.authorization_confirm2 = false;
        //this.readTermsCond = false;
      }
    }        
  }

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,private _customModal: CustomModalComponent,
    private modalService: NgbModal,public sanitizer:DomSanitizer,public _trainerService:TrainerService) { }

  getData(getVal){
    this.Service.mapboxToken = getVal;
  }

  ngOnInit() {
    // this.titleService.setTitle('EIAC - Halal Conformity Bodies');
    // this.loadCountryStateCity();

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
      title:'personal_information', desc:'2. Personnel Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
      },
      {
        title:'scope_accreditation', desc:'3. Accreditation Scope', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
      },
      {
      title:'other_hcab_details', desc:'4. Other HCAB Details', activeStep:false, stepComp:false, icon:'icon-paper', activeClass:''
      },
      {
        title:'perlim_visit', desc:'5. Prelim Visit', activeStep:false, stepComp:false, icon:'icon-paper', activeClass:''
      },
      {
      title:'undertaking_applicant', desc:'6. Authorization of the Application', activeStep:false, stepComp:false, icon:'icon-work', activeClass:''
      },
      {
        title:'proforma_invoice', desc:'7. Proforma Invoice', activeStep:false, stepComp:false, icon:'icon-file_invoice', activeClass:''
      },
      {
        title:'payment_update', desc:'8. Payment Update', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
      },
      {
        title:'application_complete', desc:'9. Application Complete', activeStep:false, stepComp:false, icon:'icon-document-pen', activeClass:''
      },
    );

    this.summaryDetails = [{"position":'Managerial/Professional'},{'position':'Decision Maker'},{'position':'Technical'},{'position':'Administrative'},{'position':'Auditors Name'},{'position':'Category Code'},{'position':'Technical Expert'},{'position':'Inspectors Name'},{'position':'Category Code'},{'position':'Islamic Affairs Expert'},{'position':'Others'}];

    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirmTop3: false,undertaking_confirm1:false,
    undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,
    undertaking_confirm7:false};
    this.loadAppInfo();
    this.loadCountryStateCity();
  }


  getDutyTimeForm1Index(indexVal){
    ////console.log('Get Index: ', indexVal.value, " -- ", indexVal);
      var keyVal;
      for(keyVal in this.addMinutesToTime){
          ////console.log(keyVal);
          if(indexVal.value === this.addMinutesToTime[keyVal].val){
            ////console.log("match ", this.addMinutesToTime[keyVal].val);
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
    // //console.log(this.allStateList);
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
        //console.log("Error: ", error);
    }
    
    );
  }
  
  loadCountryStateCity = async() => {
    let countryList =  this.Service.getCountry();
    await countryList.subscribe(record => {
      // //console.log(record,'record');
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
        //console.log(getData,"Profile info >>> ");
  
        if(getData.data.step1.length){
            data = getData.data['step1'][0];
            ///////console.log('data enter...1', data);
  
            if(data){
              ////console.log('data enter...2');
            if(getData.data.criteriaList != undefined && getData.data.criteriaList.length){
              ////console.log(">>>Criteria list: ", getData.data.criteriaList);
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
          this.step1Data.trade_license_number = data.trade_license_number;
          
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
          //console.log(this.ownOrgBasicInfo,'ownOrgBasicInfo');
          step2['cabBodData'].forEach((res,key) => {
            // //console.log(res," -- ",key);
            step2['cabBodData'][key].name = res.name;
            step2['cabBodData'][key].bod_company = res.bod_company,
            step2['cabBodData'][key].md_or_chief_executive = res.md_or_chief_executive != '' && res.md_or_chief_executive != undefined ? res.md_or_chief_executive : 'None';
            step2['cabBodData'][key].authorized_contact_person = res.authorized_contact_person;
            step2['cabBodData'][key].designation = res.designation;
            step2['cabBodData'][key].mobile_no = res.mobile_no;
            step2['cabBodData'][key].land_no = res.land_no != '' && res.land_no != undefined ? res.land_no : 'None';
            step2['cabBodData'][key].email_address = res.email != '' && res.email != undefined ?  res.email : 'None';
          });
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
            //console.log(res,'urlVal')
            this.loader = true;
            let getData: any = res;
            if(res['data'].id && res['data'].id != '') {
                let pathData: any;
                let filePath: string;
  
                if(!this.Service.isObjectEmpty(res['data'].paymentDetails)){
                
                  if(res['data'].paymentDetails.voucher_invoice != undefined && res['data'].paymentDetails.voucher_invoice != ''){
                    filePath = this.constant.mediaPath + '/media/' + res['data'].paymentDetails.voucher_invoice;
                    pathData = this.getSantizeUrl(filePath);
                    this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
                  }
                  //////console.log(">>>> payment details upload: ", getData.data.paymentDetails, " -- ", this.paymentFilePath, " :: ", filePath);
                }
                
                // //console.log(res['data'].saved_step,"@saved step assign....");
                if(res['data'].saved_step  != null){
                  let saveStep = res['data'].saved_step;
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
                          ///////console.log('found steps....',curStep);
                          curStep.stepComp = true;
                          this.Service.headerStepMove(item.title, this.headerSteps,'menu')
                        }
                  })
                  //////console.log("#Step data: ", this.headerSteps);
                }
  
                if(res['data'].id != undefined && res['data'].id > 0){
                  this.formApplicationId = res['data'].id;
                  this.formDraftsaved = res['data'].is_draft;
                  this.formAccrStatus = res['data'].accr_status;
                }
                // //console.log(this.formApplicationId);
                //step1
  
                // if(res['data'].cab_type == 'calibration_laboratories') {
                //   this.step1Data.cab_type = 
                // }else if(res['data'].cab_type == 'calibration_laboratories') {
                //   this.step1Data.cab_type = 
                // }
                this.step1Data.cab_type = res['data'].cab_type != '' ? res['data'].cab_type : '';
                //console.log("@cab type: ", res['data'].accredation_criteria);
                
                if(res['data'].accredation_criteria  != '' && res['data'].accredation_criteria  != null){
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
                  this.step2Data.name = getTechData.name;
                  this.step2Data.designation = getTechData.designation;
                  this.step2Data.mobile_no = getTechData.mobile_no;
                  this.step2Data.email = getTechData.email;
                  this.step2Data.relevent_experience = getTechData.relevent_experience;
                  this.step2Data.duration_at_current_post = getTechData.duration_at_current_post;
                }
                if(res['data'].managementManager != undefined && res['data'].managementManager.length > 0){
                  let getMangData: any = res['data'].managementManager[0];
                  this.step2Data.management_name = getMangData.name;
                  this.step2Data.management_designation = getMangData.designation;
                  this.step2Data.management_mobile_no = getMangData.mobile_no;
                  this.step2Data.management_email = getMangData.email;
                  this.step2Data.management_relevent_experience = getMangData.relevent_experience;
                  this.step2Data.duration_at_current_post_manager = getMangData.duration_at_current_post;
                }
  
                //step4
                
  
                //step5
                //
                
  
                //Step 6
                if(res['data'].is_prelim_visit != null){
                  this.step4Data.is_prelim_visit = (res['data'].is_prelim_visit) ? "1" : "0";
                  this.step4Data.prelim_visit_date = res['data'].prelim_visit_date;
                  this.step4Data.prelim_visit_time = res['data'].prelim_visit_time;
                }
                //Step 7
                if(res['data'].onBehalfApplicantDetails && res['data'].onBehalfApplicantDetails != null && res['data'].onBehalfApplicantDetails != undefined){
                  let getAuthData = res['data'].onBehalfApplicantDetails;
                  ////console.log(">>> Auth data: ", getAuthData);
                  this.step5Data.organization_name        = getAuthData.organization_name;
                  this.step5Data.representative_name      = getAuthData.representative_name;
                  this.step5Data.designation              = getAuthData.designation;
                  this.step5Data.digital_signature        = getAuthData.digital_signature;
                  this.step5Data.application_date         = getAuthData.application_date;
  
                  Object.keys(this.authorizationList).forEach( key => { 
                    this.authorizationList[key] = true;
                  })
                  this.authorizationStatus = true;
                  this.step5Data.recommend_visit = 'second';
                }
  
                //Step 9
                if(res['data'].paymentDetails != null && typeof res['data'].paymentDetails === 'object'){
                  // //console.log(">>>payment details...show");
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

  is_toggle(type,value){
    if(type=="is_bod"){
      this.is_bod = value;
    }
    else if(type=="is_cab_location"){
      this.is_cab_location = value;
    }
    else if(type=="is_cab_accdiations"){
      this.is_cab_accdiations = value;
    }
  }

  // idToName(title,val) {
  //   if(title == 'country')
  //   {
  //     this.publicHalalConformityForm.country_name = val;
  //   }else if(title == 'labour_type_name')
  //   {
  //     this.publicHalalConformityForm.labour_type_name = val;
  //   }
  // }

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }

  validateFile(fileEvent: any,type) {
   
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['jpg','JPEG','gif','png'];
    var ex_check = this.isInArray(file_exe,ex_type);
    var ex = (fileEvent.target.files[0].name).split('.');
  //  if(ex_check){
     if(type=="trade_license" && ex_check  == true){
       this.publicHalalConformityForm.trade_license_name = fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('trade_license',fileEvent.target.files[0]);
       this.file_validation = true;
     }else if(type=="trade_license" && ex_check  != true){
      this.file_validation = false;
    }
     else if(type=="recognized_logo3" && ex_check  == true){
       this.publicHalalConformityForm.recognized_logo3_name = fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('recognized_logo3',fileEvent.target.files[0]);
       this.file_validation4 = true;
     }else if(type=="recognized_logo3" && ex_check  != true){
      this.file_validation4 = false;
    }
     if(type=="recognized_logo2" && ex_check  == true){
       this.publicHalalConformityForm.recognized_logo2_name= fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('recognized_logo2',fileEvent.target.files[0]);
       this.file_validation3 = true;
     }else if(type=="recognized_logo2" && ex_check  != true){
      this.file_validation3 = false;
    }
     if(type=="recognized_logo1" && ex_check  == true){
       this.publicHalalConformityForm.recognized_logo1_name= fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('recognized_logo1',fileEvent.target.files[0]);
       this.file_validation2 = true;
     }else if(type=="recognized_logo1" && ex_check  != true){
      this.file_validation2 = false;
    }
 
     
  //  }
  //  else{
  //   this.file_validation = false;
  //    return false;
  //  }
 }
 isInArray(value, array) {
  return array.indexOf(value) > -1;
}
 
  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
  }

  authorizeCheckCount(theEvent: any, type?:any){
    //console.log(theEvent);
    let checkCount = 0;
    let readChecked = false;
  
    if(type != undefined && type == 'read'){
      //console.log(">>> readd...");
      readChecked = true;
    }
  
    if(theEvent.checked || readChecked == true){
      for(let key in this.authorizationList) {
        ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
        if(this.authorizationList[key]) {  
          this.authorizationStatus = true;       
          checkCount++;
        }    
      }
    }
        
  
    if(this.authorizationStatus && checkCount == 10){
      this.authorizationStatus = true;
    }else{
      this.authorizationStatus = false;
    }
    //console.log(">>> Check status count: ", checkCount);
  }

  agreeView(){
    this.modalService.dismissAll();
    this.authorizationList.undertaking_confirmTop2 = true;
    this.readAccredAgreem = true;
    this.authorizeCheckCount(event, 'read');
  
  }
  closeChecklistDialog(){
    this.modalService.dismissAll();
    this.authorizationList.undertaking_confirm2 = true;
    this.readReviewChecklist= true;
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
  
  getSantizeUrl(url : string) { 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); 
  }
  
  openView(content, type:string) {
    let pathData: any;
    ////console.log(">>>pop up...", content);
    if(type != undefined && type == 'agreement'){
      pathData = this.getSantizeUrl(this.accredAgreemFile);
      this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
    }
    if(type != undefined && type == 'checklist'){
      pathData = this.getSantizeUrl(this.checklistDocFile);
      this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
    }
  
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
      ////console.log("load script...");
      document.body.appendChild(scriptElement)
    })
  }
  
  saveInspectopnAfterPayment(theData: any){
    ////console.log(">>> The Data: ", theData);
    this.transactions = [];
    this.toastr.success('Payment Success, Thank you.','Paypal>>',{timeOut:2000});
    setTimeout(()=> {
      // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //////console.log("moving...");
      this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
    }, 1000)      
    //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
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
          this.toastr.warning("You have cancelled payment, Continue next step please complete payment process again.", 'Paypal>>',{timeOut:6500});
      },
      onError: err => {
          //console.log('OnError', err);
          formObj.paypalReturn = err;
          formObj.paypalStatus = 'error';
          //compObj.saveCourseAfterPayment(formObj);
          this.toastr.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
      },
      onClick: (data, actions) => {
          //console.log('onClick', data, actions);
          //this.resetStatus();
      }
      }, '#paypalPayment');
    });
    }
  }

  getPlaceName()
  {
    if(typeof this.publicHalalConformityForm.search_location_name != 'undefined')
    {
      this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.publicHalalConformityForm.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
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
    this.publicHalalConformityForm.location_longitude = longitude;
    this.publicHalalConformityForm.location_latitude = latitude;
  }

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

  onSubmitStep1(ngForm1: any){
    this.Service.moveSteps('application_information', 'personal_information', this.headerSteps);
    // //console.log(this.ownOrgMembInfo,'ownOrgMembInfo');
  
    this.isApplicationSubmitted = true;
  
    //Activity note check
    if(this.step1Data.is_main_activity_note == undefined){
      this.step1Data.is_main_activity_note = '';
    }
    
    let str = this.step1Data.is_main_activity_note; 
  
    ////console.log("nite enen: ", this.step1Data.is_main_activity_note, " -- ", this.step1Data.is_main_activity, " :: ", (!str || 0 === str.length));
    
    if(this.step1Data.is_main_activity == 'true' && this.step1Data.is_main_activity_note != ''){
      this.step1Data.is_main_activity_note = '';
    }
    if(this.step1Data.is_main_activity == 'true'){
      this.isNoteSubmit = true;
    }
  
    if((!str || 0 === str.length) && this.step1Data.is_main_activity == 'false'){
      ////console.log(">>> Note is required...");
      this.is_main_activity_note_entry = true;
      this.isNoteSubmit = false;
    }
    if(this.step1Data.is_main_activity == 'false' && this.step1Data.is_main_activity_note != ''){
      ////console.log(">>> Note is ebnterd.....");
      this.is_main_activity_note_entry = false;
      this.isNoteSubmit = true;
    }
  
    if(ngForm1.form.valid  && this.isNoteSubmit == true) {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step1 = {};
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      this.publicHalalConformityForm.saved_step = '1';
      this.step1Data.is_draft = false;
      if(this.formApplicationId > 0){
        this.step1Data.application_id = this.formApplicationId;
      }
      // this.publicHalalConformityForm.step1.is_draft = false;
      this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
      this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
      this.publicHalalConformityForm.step1 = this.step1Data;
  
      this.publicHalalConformityForm.step1['ownOrgBasicInfo'] = [];
      this.publicHalalConformityForm.step1['ownOrgMembInfo'] = [];
      this.publicHalalConformityForm.step1['accreditationInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.publicHalalConformityForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.publicHalalConformityForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.accreditationInfo) {
        this.publicHalalConformityForm.step1['accreditationInfo'] = this.accreditationInfo;
      }
  
      // this.step1DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      //console.log(this.publicHalalConformityForm,'publicHalalConformityForm');
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.publicHalalConformityForm)
      .subscribe(
        res => {
          // //console.log(res,'res')
          let data: any =res;
          if(res['status'] == true) {
            // this.toastr.success(res['msg'], '');
            this.formApplicationId =  this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['application_id']);
            if(data.application_id != undefined && data.application_id > 0){
              this.formApplicationId = data.application_id;
              ////console.log(this.formApplicationId,'App id assigned')
            }
            this.Service.moveSteps('application_information', 'personal_information', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else {
      this.toastr.warning('Please Fill required field','');
    }
  }
  
  onSubmitStep2(ngForm2: any){
    this.Service.moveSteps('personal_information','scope_accreditation',  this.headerSteps);
    if(ngForm2.form.valid) {
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step3Data.application_id = applicationId;
      
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step2 = {};
      //this.publicHalalConformityForm.email = this.userEmail;
      //this.publicHalalConformityForm.userType = this.userType;
     // this.publicHalalConformityForm.step3.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      ////this.publicHalalConformityForm.step3.email = this.userEmail;
      ////this.publicHalalConformityForm.step3.userType = this.userType;
      ///this.publicHalalConformityForm.step3.application_id = this.formApplicationId;
      //this.publicHalalConformityForm.step2.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.publicHalalConformityForm.step2.email = this.userEmail;
      this.publicHalalConformityForm.step2.userType = this.userType;
      this.publicHalalConformityForm.step2.application_id = this.formApplicationId;
      //this.publicHalalConformityForm.step3 = this.step3Data;
  
      this.publicHalalConformityForm.step2.technicalManager = {};
  
      this.publicHalalConformityForm.step2.technicalManager['name'] = (this.step2Data.name != '' && this.step2Data.name != undefined) ? this.step2Data.name : '';
      this.publicHalalConformityForm.step2.technicalManager['designation'] = (this.step2Data.designation != '' && this.step2Data.designation != undefined) ? this.step2Data.designation : '';
      this.publicHalalConformityForm.step2.technicalManager['mobile_no'] = (this.step2Data.mobile_no != '' && this.step2Data.mobile_no != undefined) ? this.step2Data.mobile_no : '';
      this.publicHalalConformityForm.step2.technicalManager['email'] = (this.step2Data.email != '' && this.step2Data.email != undefined) ? this.step2Data.email : '';
      this.publicHalalConformityForm.step2.technicalManager['relevent_experience'] = (this.step2Data.relevent_experience != '' && this.step2Data.relevent_experience != undefined) ? this.step2Data.relevent_experience : '';
      this.publicHalalConformityForm.step2.technicalManager['duration_at_current_post'] = (this.step2Data.duration_at_current_post != '' && this.step2Data.duration_at_current_post != undefined) ? this.step2Data.duration_at_current_post : '';
  
      this.publicHalalConformityForm.step2.managementManager = {};
  
      this.publicHalalConformityForm.step2.managementManager['name'] = (this.step2Data.management_name != '' && this.step2Data.management_name != undefined) ? this.step2Data.management_name : '';
      this.publicHalalConformityForm.step2.managementManager['designation'] = (this.step2Data.management_designation != '' && this.step2Data.management_designation != undefined) ? this.step2Data.management_designation : '' ;
      this.publicHalalConformityForm.step2.managementManager['mobile_no'] = (this.step2Data.management_mobile_no != '' && this.step2Data.management_mobile_no != undefined) ? this.step2Data.management_mobile_no : '';
      this.publicHalalConformityForm.step2.managementManager['email'] = (this.step2Data.management_email != '' && this.step2Data.management_email != undefined) ? this.step2Data.management_email : '';
      this.publicHalalConformityForm.step2.managementManager['relevent_experience'] = (this.step2Data.management_relevent_experience != '' && this.step2Data.management_relevent_experience != undefined) ? this.step2Data.management_relevent_experience : '';
      this.publicHalalConformityForm.step2.managementManager['duration_at_current_post'] = (this.step2Data.duration_at_current_post_manager != '' && this.step2Data.duration_at_current_post_manager != undefined) ? this.step2Data.duration_at_current_post_manager : '';
  
      this.publicHalalConformityForm.step2['summaryDetail'] = [];
  
      this.publicHalalConformityForm.step2.is_draft = false;
      this.publicHalalConformityForm.saved_step = 2;
      // this.publicHalalConformityForm.step3 = this.step3Data;
      this.loader = false;
      //console.log(this.publicHalalConformityForm,'publicHalalConformityForm');
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.publicHalalConformityForm)
      .subscribe(
        res => {
          this.loader = true;
          if(res['status'] == true) {
            // this.toastr.success(res['msg'], '');
            this.Service.moveSteps('personal_information','scope_accreditation',  this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitStep3(ngForm: any, type?:any) {
    
    this.Service.moveSteps('scope_accreditation','other_hcab_details',  this.headerSteps);
  }

  onSubmitStep4(ngForm4: any, type?:any) {
    
    this.Service.moveSteps('other_hcab_details','perlim_visit',  this.headerSteps);
  }

  onSubmitStep5(ngForm5: any){
    this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    if(ngForm5.form.valid) {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step4 = {};
      this.publicHalalConformityForm.saved_step = '4';
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      var applicationId = sessionStorage.getItem('applicationId');
      this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step5Data.is_prelim_visit = this.step5Data.is_prelim_visit == 0 ? false : true;
      this.step5Data.is_draft = false;
      this.publicHalalConformityForm.step4 = this.step5Data;
  
      //console.log(this.publicHalalConformityForm);
      // this.step5DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.publicHalalConformityForm)
      .subscribe(
        res => {
          // //console.log(res,'res')
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
  
  onSubmitUndertakingApplicant(ngForm6: any){
    this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);
    this.isApplicationSubmitted = true;
    let checkCount = 0;
      for(let key in this.authorizationList) {
        ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
        if(this.authorizationList[key]) {  
          this.authorizationStatus = true;       
          checkCount++;
        }    
      }
      if(this.authorizationStatus && checkCount == 10){
        this.authorizationStatus = true;
      }else{
        this.authorizationStatus = false;
      }
  
      //console.log(">>> Check status count: ", checkCount);
  
  if(ngForm6.form.valid && this.authorizationStatus == true){
  
    this.publicHalalConformityForm = {};
    this.publicHalalConformityForm.step5 = {};
    this.publicHalalConformityForm.email = this.userEmail;
    this.publicHalalConformityForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.publicHalalConformityForm.saved_step = '5';
    this.step6Data.authorizationList = this.authorizationList;
    this.step6Data.recommend = this.recommend;
    this.step6Data.is_draft = false;
    this.step6Data.application_date = new Date();
  
    this.publicHalalConformityForm.step5 = this.step6Data;
    // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
  
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
    // //console.log(this.publicHalalConformityForm,'publicHalalConformityForm');
    this.loader = false;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.certificationBodies,this.publicHalalConformityForm)
    .subscribe(
      res => {
        // //console.log(res,'res')
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
  
  
onSubmitStep7(ngForm7: any) {
  this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
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
      ////console.log("Calculate price: ", calcPrice);
      this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
      this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
      this.transactions.push(this.transactionsItem);
      ////console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
    }
    setTimeout(() => {
      this.createPaymentButton(this.transactionsItem, this.publicHalalConformityForm, this);
      let elem = document.getElementsByClassName('paypal-button-logo');
      //console.log("button creting...");
      if(elem){
        //console.log("button creted...");
      }else{
        //console.log("Loding button...");
      }
    }, 100)
  }
  
  onSubmitPaymentInformation(ngForm8: any, type?: boolean){
  ////console.log("payment submitting.....");
  this.publicHalalConformityForm = {};
  this.publicHalalConformityForm.step8 = {};
  
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
  if(ngForm8.form.valid && this.paymentReceiptValidation != false) {
    // //console.log(this.voucherFile);
      this._trainerService.paymentVoucherSave((this.voucherFile))
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
              this.toastr.warning(data.msg,'');
            }
          }
        )
  }else if(type != undefined && type == true && this.paymentReceiptValidation != false){
    this.publicHalalConformityForm.step9.is_draft = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.publicHalalConformityForm)
    .subscribe(
    res => {
      ////console.log(res,'res')
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

}

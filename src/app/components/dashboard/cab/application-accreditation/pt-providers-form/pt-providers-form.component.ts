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
import { DomSanitizer } from '@angular/platform-browser';
import { TrainerService } from '../../../../../services/trainer.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';

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
  readReviewChecklist: boolean = false;
  readTermsCond: boolean = false;
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
  public loader:boolean=false;
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
  termsGeneral: any;
  termsILA: any;
  isApplicationSubmitted:any = false;
  public isNoteSubmit:boolean = false;
  // ngx-google-places-autocomplete [options]='options' #placesRef="ngx-places"
  // version = VERSION;
  allCityByCountry: any = [];
  getCountryLists:any;
  authorization_confirm2:any;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;

  shift2_from: boolean = false;
  shift2_to: boolean = false;
  shift3_from: boolean = false;
  shift3_to: boolean = false;
  is_main_activity_note_entry: boolean = false;

  searchCountryLists:any;
  onbehalf_representative_date:boolean = false;
  recommendStatus:boolean = false;

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
         this.authorizationList.authorization_confirm2 = true;this.readTermsCond = true;
         this.authorizeCheckCount(elem, 'read')
      }else{
        this.authorizeCheckCount(elem, 'read')
      }
    }        
  }
  public recommend:any;
  transactions: any[] =[];
  transactionsItem: any={};
  total: any = 0;
  allStateList: Array<any> = [];
  allCityList: Array<any> = [];
  
  headerSteps:any[] = [];
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
  today = new Date();
  is_hold_other_accreditation_toggle: any = 0;
  getDutyTimeForm1IndexValue:number;
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
  paymentFilePath: string = '';
  paymentReceiptValidation:any;
  recommendYearValues: any[] = [];

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,private modalService: NgbModal,public sanitizer:DomSanitizer,public _trainerService:TrainerService) { }

  getData(getVal: string){
    this.Service.mapboxToken = getVal;
   }

   closeChecklistDialog(){
    this.modalService.dismissAll();
    this.authorizationList.undertaking_confirm2 = true;
    this.readReviewChecklist= true;
    }
    closeDialog(){
      this.modalService.dismissAll();
    }

   loadData(){
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.pt_provider)
      .subscribe( 
        res => {
          console.log("@Load Accreditation criteria....", res);
          //this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
          //this.countryList = res['allCountry'];
          // this.labTypeList = res['allLabtype'];
          // //this.fullScope   = res['fullScope'];
          //this.criteriaList = res['data']['criteriaList'];
          //this.schemes = res['data']['schemes'];
          // this.step1Data.criteria_request = this.criteriaList[0].code; 
          // this.criteriaMaster = res['data']['schemes'];
          ////////console.log("#Get criteria: ", this.criteriaMaster);
  
        },
        error => {
        
    })
  }

  loadTermsConditions(){
    let post: any = {};
    post['service_page_id'] = 10; // Medical / healthcare
    this.Service.post(this.Service.apiServerUrl+"/" + 'terms-and-conditions/', post)
      .subscribe(
        res => {
          console.log(res,'Terms data');
          let getData: any = res;
          if(getData){
            this.termsGeneral = getData.data[0];
           // this.termsILA     = getData.data[1];

            //console.log(">>> ", this.termsGeneral.content, " -- ", this.termsILA.content);
          }
          
        });
  }

 ngOnInit() { 
   // this.minCurrentDate = new Date(2020, 0, 13);
  //  this.titleService.setTitle('EIAC - Proficiency Testing Providers');
  this.urlVal = this.Service.getValue() != '' ? this.Service.getValue() : '';
   ////console.log(">>>Get URL value: ", this.urlVal);
   this.userEmail = sessionStorage.getItem('email');
   this.userType = sessionStorage.getItem('type');
   this.isCompleteness = sessionStorage.getItem('isCompleteness');
   this.profileComplete = sessionStorage.getItem('profileComplete');
   this.userId = sessionStorage.getItem('userId');

   this.addMinutesToTime = this.Service.addMinutesToTime();
   this.loadAppInfo();
   this.loadCountryStateCity();
   this.loadTermsConditions();
   //this.checkCaptchaValidation = false;
   this.loader = false;

   var d = new Date();
    var yr = d.getFullYear();
    for(var k=2010; k<=2030; k++){
      this.recommendYearValues.push({title: k.toString(), value: k});
    }
    this.step7Data.recommend_year = yr;
  //  this.setting();

  this.accredAgreemFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Accreditation%20Agreement.pdf');
    this.checklistDocFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Document%20review%20Checklist-%20ISO%2017020-%202012_Inspection%20Bodies.pdf');
    
    // this.loader = false;
    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
      },
      {
      title:'profciency_testing_participation', desc:'2. Profciency Testing Participation', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'personal_information', desc:'3. Personal Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
      },
      {
      title:'information_audit_management', desc:'4. Internal Audit & Management', activeStep:false, stepComp:false, icon:'icon-task', activeClass:''
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
    //undertaking_confirmTop3: false,
    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false};
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

accreditationCriterias (title){
  this.accreditationCriteriasId = title;
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

  moveShift(theVal: any){
    let val;
    //console.log(">>>change shift: ", theVal, " -- ",val);
    
    if(theVal == 1){
      if(this.step1Data.duty_from2 != undefined || this.step1Data.duty_to3 != undefined){
        this.step1Data.duty_from2 = val;
        this.step1Data.duty_to2 = val;
        
      }
      if(this.step1Data.duty_from3 != undefined || this.step1Data.duty_to3 != undefined){
        this.step1Data.duty_from3 = val;
        this.step1Data.duty_to3 = val;
        
      }
      if(this.step1Data.duty_from1 == undefined || this.step1Data.duty_to1 == undefined){
        this.dutyTime1 = false;        
      }
      this.shift2_from = true;
        this.shift2_to = true;
        this.shift3_from = true;
        this.shift3_to = true;
  
        this.dutyTime2 = true;
        this.dutyTime3 = true;
        //check from to input
        //this.dutyTime1 = false;
      //console.log(">>> shift 1 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
    }
    if(theVal == 2){      
      if(this.step1Data.duty_from3 != undefined || this.step1Data.duty_to3 != undefined){
        this.step1Data.duty_from3 = val;
        this.step1Data.duty_to3 = val;
        this.dutyTime3 = true;        
      }
      if(this.step1Data.duty_from1 != undefined || this.step1Data.duty_to1 != undefined){
        this.dutyTime1 = true;        
      }
      if(this.step1Data.duty_from1 == undefined || this.step1Data.duty_to1 == undefined){
        this.dutyTime1 = false;        
      }
      if(this.step1Data.duty_from2 == undefined || this.step1Data.duty_to2 == undefined){
        this.dutyTime2 = false;        
      }
      this.shift3_from = true;
      this.shift3_to = true;
      this.shift2_from = false;
      this.shift2_to = false;
     // this.dutyTime2 = false; 
  
        //this.dutyTime3 = true;
        //this.dutyTime1 = true;
  
      //console.log(">>> shift 2 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
    }
    if(theVal == 3){   
      
      if(this.step1Data.duty_from1 != undefined || this.step1Data.duty_to1 != undefined){
        this.dutyTime1 = true;        
      }
      if(this.step1Data.duty_from2 != undefined || this.step1Data.duty_to2 != undefined){
        this.dutyTime1 = true;        
      }
      if(this.step1Data.duty_from1 == undefined || this.step1Data.duty_to1 == undefined){
        this.dutyTime1 = false;        
      }
      if(this.step1Data.duty_from2 == undefined || this.step1Data.duty_to2 == undefined){
        this.dutyTime2 = false;        
      }
      if(this.step1Data.duty_from3 == undefined || this.step1Data.duty_to3 == undefined){
        this.dutyTime3 = false;        
      }
      
      this.shift3_from = false;
      this.shift3_to = false;
      this.shift2_from = false;
      this.shift2_to = false;
      //console.log(">>> shift 3 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
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

      if(getData.data.step1 && getData.data.step1.length){
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

      this.loader = true;
      let url2 = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+this.urlVal;
      this.Service.getwithoutData(url2)
      .subscribe(
        res => {
          console.log(res,'urlVal')
          this.loader = false;
          let getData: any;
          getData = res;
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

              this.step1Data.duty_shift = res['data'].duty_shift != '' || res['data'].duty_shift != null ? res['data'].duty_shift.toString() : '';

              if(res['data'].duty_from1 != null && res['data'].duty_to1 != null && res['data'].duty_shift != ''){
              
                // this.step1Data.duty_shift = res['data'].duty_shift == 1 ? res['data'].duty_shift.toString() : '';
                this.step1Data.duty_from1 = res['data'].duty_from1.toString();
                this.step1Data.duty_to1   = res['data'].duty_to1.toString();
              }
              if(res['data'].duty_from2 != null && res['data'].duty_to2 != null && res['data'].duty_shift != ''){
                
                // this.step1Data.duty_shift = res['data'].duty_shift.toString();
                this.step1Data.duty_from2 = res['data'].duty_from2.toString();
                this.step1Data.duty_to2   = res['data'].duty_to2.toString();
                //console.log(">>>Working time: 2 ", this.step1Data.duty_shift);
              }
              if(res['data'].duty_from3 != null && res['data'].duty_to3 != null && res['data'].duty_shift != ''){
                
                // this.step1Data.duty_shift = res['data'].duty_shift.toString();
                this.step1Data.duty_from3 = res['data'].duty_from3.toString();
                this.step1Data.duty_to3   = res['data'].duty_to3.toString();
                //console.log(">>>Working time: 3 ", this.step1Data.duty_shift);
              }
              if(res['data'].is_main_activity != undefined){
                  this.step1Data.is_main_activity = res['data'].is_main_activity.toString();
                  if(!res['data'].is_main_activity){
                    this.step1Data.is_main_activity_note = res['data'].is_main_activity_note.toString();
                  }
              }

              if(res['data'].otherAccr != undefined && res['data'].otherAccr.length > 0){
                //console.log('>>>Accr infor: ', getData.data.otherAccr);
                this.accreditationInfo = [];
                this.step1Data.is_hold_other_accreditation_select = "1";
                //this.accreditationInfo = '';
                res['data'].otherAccr.forEach((item, key) => {
                    ////console.log('>> ', item, " :: ", key);
                    let data: any;
                    data = item['value'];
                    var obj1 = data.replace(/'/g, "\"");
                    let jparse = JSON.parse(obj1);
                    this.accreditationInfo.push(jparse);
                })
              }else{
                //this.accreditationInfo = [{}];
                this.step1Data.is_hold_other_accreditation_select = "0";
              }

              //step2
              var ptProvider = res['data']['ptParticipation'];
              this.proficiencyTesting = ptProvider && ptProvider != '' ? ptProvider : [{}];

              //step3
              if(res['data'].technicalManager != undefined && res['data'].technicalManager.length > 0){
                let getTechData: any = res['data'].technicalManager[0];
                this.step3Data.name = getTechData.name;
                this.step3Data.designation = getTechData.designation;
                this.step3Data.mobile_no = getTechData.mobile_no;
                this.step3Data.email = getTechData.email;
                this.step3Data.relevent_experience = getTechData.relevent_experience;
              }
              if(res['data'].managementManager != undefined && res['data'].managementManager.length > 0){
                let getMangData: any = res['data'].managementManager[0];
                this.step3Data.management_name = getMangData.name;
                this.step3Data.management_designation = getMangData.designation;
                this.step3Data.management_mobile_no = getMangData.mobile_no;
                this.step3Data.management_email = getMangData.email;
                this.step3Data.management_relevent_experience = getMangData.relevent_experience;
              }

              //step4
              if(res['data'].audit_date != null){
                this.step4Data.audit_date = new Date(res['data'].audit_date);
              }
              if(res['data'].mrm_date != null){
                this.step4Data.mrm_date = new Date(res['data'].mrm_date);
              }

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
                this.readReviewChecklist = true;
                this.readTermsCond       = true;
                let visitRecomm = getData.data.recommend_visit.toString().replace(/["']/g, "");
                this.step7Data.recommend_visit = visitRecomm;//'second';
                this.step7Data.recommend_year = parseInt(getData.data.recommend_year);
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

onSubmitStep1(ngForm1: any){

  this.isApplicationSubmitted = true;
  //this.isSubmit = true;

  if(this.step1Data.duty_shift == '1')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
        this.isSubmit = false;
      }else{
        this.dutyTime1 = true;
        this.isSubmit = true;
      }
      // this.dutyTime1 = false;
      // this.isSubmit = false;
      
    }else if(this.step1Data.duty_shift == '2')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
        this.isSubmit = false;
      }else if(typeof this.step1Data.duty_from2 == 'undefined' || typeof this.step1Data.duty_to2 == 'undefined') {
        this.dutyTime2 = false;
        this.isSubmit = false;
      }else if(typeof this.step1Data.duty_from2 != 'undefined' || typeof this.step1Data.duty_to2 != 'undefined'){
        this.dutyTime2 = true;
        this.isSubmit = true;
      }
      // this.dutyTime2 = false;
      // this.isSubmit = false;
    }else if(this.step1Data.duty_shift == '3')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
        this.isSubmit = false;
      }
      else if(typeof this.step1Data.duty_from2 == 'undefined' || typeof this.step1Data.duty_to2 == 'undefined')
      {
        this.dutyTime2 = false;
        this.isSubmit = false;
      }
      else if(typeof typeof this.step1Data.duty_from3 == 'undefined' || typeof this.step1Data.duty_to3 == 'undefined') {
        this.dutyTime3 = false;
        this.isSubmit = false;
      }else if(typeof this.step1Data.duty_from3 != 'undefined' || typeof this.step1Data.duty_to3 != 'undefined') {
        this.dutyTime3 = true;
        this.isSubmit = true;
      }
      // this.dutyTime3 = false;
      // this.isSubmit = false;
    }else if(typeof this.step1Data.duty_shift == 'undefined' || this.step1Data.duty_shift == '') {
      this.dutyTime1 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime1 = true;
      this.dutyTime2 = true;
      this.dutyTime3 = true;
      this.isSubmit = true;
    }

  if(this.step1Data.duty_shift == '1' && !this.dutyTime2){
    this.dutyTime2 = true;
  }if(this.step1Data.duty_shift == '2' && !this.dutyTime3){
    this.dutyTime3 = true;
  }

  if(this.step1Data.is_main_activity_note == undefined){
    this.step1Data.is_main_activity_note = '';
  }
  
  let str = this.step1Data.is_main_activity_note; 

  // //console.log("nite enen: ", this.step1Data.is_main_activity_note, " -- ", this.step1Data.is_main_activity, " :: ", (!str || 0 === str.length));
  
  if(this.step1Data.is_main_activity == 'true' && this.step1Data.is_main_activity_note != ''){
    this.step1Data.is_main_activity_note = '';
  }
  if(this.step1Data.is_main_activity == 'true'){
    this.isNoteSubmit = true;
  }

  if((!str || 0 === str.length) && this.step1Data.is_main_activity == 'false'){
    // //console.log(">>> Note is required...");
    this.is_main_activity_note_entry = true;
    this.isNoteSubmit = false;
  }
  if(this.step1Data.is_main_activity == 'false' && this.step1Data.is_main_activity_note != ''){
    // //console.log(">>> Note is ebnterd.....");
    this.is_main_activity_note_entry = false;
    this.isNoteSubmit = true;
  }
   console.log(">>> form status: ", ngForm1.form.valid, " :: issubmit: ", this.isSubmit," : isNote subit: ",this.isNoteSubmit);
  // console.log(this.dutyTime3,'dutyTime3');


  
  if(ngForm1.form.valid && this.isSubmit == true  && this.isNoteSubmit == true) {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step1 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.saved_step = '1';
    this.step1Data.is_draft = false;
    if(this.formApplicationId > 0){
      this.step1Data.application_id = this.formApplicationId;
    }
    this.ptProvidersForm.step1.is_draft = false;
    this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
    this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
    this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
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

    this.loader = true;
    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        
        this.isApplicationSubmitted = false;
        // console.log(res,'res')
        if(res['status'] == true) {
          this.loader = false;
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

savedraftStep(stepCount) {
  if(stepCount == 'step1') {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step1 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.saved_step = '1';
    if(this.formApplicationId > 0){
      this.step1Data.application_id = this.formApplicationId;
    }
    this.step1Data.is_draft = true;
    this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
    this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
    this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
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
    this.loader = true;
    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = false;
        if(res['status'] == true) {
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step2') {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step2 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.saved_step = '2';
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step2Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    
    this.step2Data.is_draft = true;
    this.ptProvidersForm.step2 = this.step2Data;

    this.ptProvidersForm.step2['proficiencyTesting'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.ptProvidersForm.step2['proficiencyTesting'] = this.proficiencyTesting;
    }

    this.loader = true;
    // this.step2DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        this.loader = false;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step3') {
    this.ptProvidersForm = {};
    // this.step3Data = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step3Data.is_draft = true;
    this.ptProvidersForm.saved_step = '3';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;

    this.step3Data.technicalManager = {};
    this.step3Data.technicalManager['name'] = (this.step3Data.name != '' && this.step3Data.name != undefined) ? this.step3Data.name : '';
    this.step3Data.technicalManager['designation'] = (this.step3Data.designation != '' && this.step3Data.designation != undefined) ? this.step3Data.designation : '';
    this.step3Data.technicalManager['mobile_no'] = (this.step3Data.mobile_no != '' && this.step3Data.mobile_no != undefined) ? this.step3Data.mobile_no : '';
    this.step3Data.technicalManager['email'] = (this.step3Data.email != '' && this.step3Data.email != undefined) ? this.step3Data.email : '';
    this.step3Data.technicalManager['relevent_experience'] = (this.step3Data.relevent_experience != '' && this.step3Data.relevent_experience != undefined) ? this.step3Data.relevent_experience : '';
    //}     relevent_experience

    this.step3Data.managementManager = {};
    this.step3Data.managementManager['name'] = (this.step3Data.management_name != '' && this.step3Data.management_name != undefined) ? this.step3Data.management_name : '';
    this.step3Data.managementManager['designation'] = (this.step3Data.management_designation != '' && this.step3Data.management_designation != undefined) ? this.step3Data.management_designation : '' ;
    this.step3Data.managementManager['mobile_no'] = (this.step3Data.management_mobile_no != '' && this.step3Data.management_mobile_no != undefined) ? this.step3Data.management_mobile_no : '';
    this.step3Data.managementManager['email'] = (this.step3Data.management_email != '' && this.step3Data.management_email != undefined) ? this.step3Data.management_email : '';
    this.step3Data.managementManager['relevent_experience'] = (this.step3Data.management_relevent_experience != '' && this.step3Data.management_relevent_experience != undefined) ? this.step3Data.management_relevent_experience : '';

    this.ptProvidersForm.step3 = this.step3Data;
    this.loader = true;
    // this.step3DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        console.log(res,'res')
        if(res['status'] == true) {
          this.loader = false;
          // this.toastr.success(res['msg'], '');
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step4') {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step4 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step4Data.is_draft = true;
    this.ptProvidersForm.saved_step = '4';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.step4 = this.step4Data;
    this.loader = true;
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.loader = false;
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }

  if(stepCount == 'step5') {
    
  }
  if(stepCount == 'step6') {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step6 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
    this.step6Data.is_draft = true;
    this.ptProvidersForm.saved_step = '6';
    this.ptProvidersForm.step6 = this.step6Data;

    // console.log(this.ptProvidersForm);
    this.loader = true;
    // this.step5DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = false;
        if(res['status'] == true) {
          this.toastr.success('Save Draft Successfully', '');
          // this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step7') {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step7 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.step7Data.authorizationList = this.authorizationList;
    this.step7Data.recommend = this.recommend;
    this.step7Data.recommend = this.recommend;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step7Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step7Data.is_draft = true;
    this.ptProvidersForm.saved_step = '7';

    this.ptProvidersForm.step7 = this.step7Data;
    // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
    //this.loader = true;
    console.log(">>> submit: ", this.ptProvidersForm);
    // this.step6DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        //this.loader = false;
        if(res['status'] == true) {
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }

  if(stepCount == 'step9') {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step9 = {};

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
        
    this.loader = true;
    // console.log(this.voucherFile);
    this._trainerService.paymentVoucherSave((this.voucherFile))
    .subscribe(
        result => {
          this.loader = false;
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

onSubmitStep2(ngForm2: any){
  // this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);

  if(ngForm2.form.valid) {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step2 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.saved_step = '2';
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step2Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    
    this.step2Data.is_draft = false;
    this.ptProvidersForm.step2 = this.step2Data;

    this.ptProvidersForm.step2['proficiencyTesting'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.ptProvidersForm.step2['proficiencyTesting'] = this.proficiencyTesting;
    }

    // this.step2DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.loader = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = false;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }
}

onSubmitStep3(ngForm3: any){
  // this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
  if(ngForm3.form.valid) {
    this.ptProvidersForm = {};
    // this.step3Data = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step3Data.is_draft = false;
    this.ptProvidersForm.saved_step = '3';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;

    this.step3Data.technicalManager = {};
    //if(this.step3Data.name_technical != '' && this.step3Data.designation_technical != '' && this.step3Data.mobile_no_technical != ''
      // && this.step3Data.tech_email_technical != '' && this.step3Data.relevent_experience_technical != ''){
    this.step3Data.technicalManager['name'] = (this.step3Data.name != '' && this.step3Data.name != undefined) ? this.step3Data.name : '';
    this.step3Data.technicalManager['designation'] = (this.step3Data.designation != '' && this.step3Data.designation != undefined) ? this.step3Data.designation : '';
    this.step3Data.technicalManager['mobile_no'] = (this.step3Data.mobile_no != '' && this.step3Data.mobile_no != undefined) ? this.step3Data.mobile_no : '';
    this.step3Data.technicalManager['email'] = (this.step3Data.email != '' && this.step3Data.email != undefined) ? this.step3Data.email : '';
    this.step3Data.technicalManager['relevent_experience'] = (this.step3Data.relevent_experience != '' && this.step3Data.relevent_experience != undefined) ? this.step3Data.relevent_experience : '';
    //}     relevent_experience

    this.step3Data.managementManager = {};
    //if(this.step3Data.management_name != '' && this.step3Data.management_designation != '' && this.step3Data.management_mobile_no != ''
      // && this.step3Data.management_email != '' && this.step3Data.management_relevent_experience != ''){
    this.step3Data.managementManager['name'] = (this.step3Data.management_name != '' && this.step3Data.management_name != undefined) ? this.step3Data.management_name : '';
    this.step3Data.managementManager['designation'] = (this.step3Data.management_designation != '' && this.step3Data.management_designation != undefined) ? this.step3Data.management_designation : '' ;
    this.step3Data.managementManager['mobile_no'] = (this.step3Data.management_mobile_no != '' && this.step3Data.management_mobile_no != undefined) ? this.step3Data.management_mobile_no : '';
    this.step3Data.managementManager['email'] = (this.step3Data.management_email != '' && this.step3Data.management_email != undefined) ? this.step3Data.management_email : '';
    this.step3Data.managementManager['relevent_experience'] = (this.step3Data.management_relevent_experience != '' && this.step3Data.management_relevent_experience != undefined) ? this.step3Data.management_relevent_experience : '';

    this.ptProvidersForm.step3 = this.step3Data;
    // this.step3DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.loader = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = false;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }
}

onSubmitStep4(ngForm4: any){
// this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
  if(ngForm4.form.valid) {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step4 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step4Data.is_draft = false;
    this.ptProvidersForm.saved_step = '4';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.step4 = this.step4Data;
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.loader = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        this.loader = false;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);
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
    this.ptProvidersForm = {};
    this.ptProvidersForm.step6 = {};
    this.ptProvidersForm.saved_step = '6';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
    this.step6Data.is_draft = false;
    this.ptProvidersForm.step6 = this.step6Data;

    // console.log(this.ptProvidersForm);
    // this.step5DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.loader = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = false;
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
      

  if(this.authorizationStatus && checkCount == 9){
    this.authorizationStatus = true;
  }else{
    this.authorizationStatus = false;
  }
  //console.log(">>> Check status count: ", checkCount);
}

onSubmitUndertakingApplicant(ngForm7: any){
// this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);
this.isApplicationSubmitted = true;

// for(let key in this.authorizationList) {
//   if(this.authorizationList[key] == false) {
//     this.authorizationStatus = false;
//   }else {
//     this.authorizationStatus = true;
//   }
// }

// for(let key in this.recommend) {
//   if(this.recommend[key] == true) {
//     this.recommendStatus = true;
//   }
// }

let checkCount = 0;
for(let key in this.authorizationList) {
  ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
  if(this.authorizationList[key]) {  
    this.authorizationStatus = true;       
    checkCount++;
  }      
}  
if(this.authorizationStatus && checkCount == 9){  
  this.authorizationStatus = true;
}else{
  this.authorizationStatus = false;
}


if(this.authorizationStatus == false){
  this.isSubmit = false;
  this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
}else if(this.step7Data.recommend_visit == ''){
  this.isSubmit = false;
  this.toastr.error('Please Check any recommend the visit ', '');
}
if(ngForm7.form.valid){

  this.ptProvidersForm = {};
  this.ptProvidersForm.step7 = {};
  this.ptProvidersForm.email = this.userEmail;
  this.ptProvidersForm.userType = this.userType;
  var applicationId = sessionStorage.getItem('applicationId');
  this.step7Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
  this.ptProvidersForm.saved_step = '7';
  this.step7Data.authorizationList = this.authorizationList;
  this.step7Data.recommend = this.recommend;
  this.step7Data.is_draft = false;
  this.step7Data.application_date = new Date();

  this.ptProvidersForm.step7 = this.step7Data;
  // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);

  // this.step6DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
  // console.log(this.ptProvidersForm,'ptProvidersForm');
  this.loader = true;
  this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
  .subscribe(
    res => {
      // console.log(res,'res')
      this.loader = false;
      this.isApplicationSubmitted = false;
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
    this.createPaymentButton(this.transactionsItem, this.ptProvidersForm, this);
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
this.ptProvidersForm = {};
this.ptProvidersForm.step9 = {};

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
    
this.loader = true;
if(ngForm9.form.valid && this.paymentReceiptValidation != false) {
  // console.log(this.voucherFile);
    this._trainerService.paymentVoucherSave((this.voucherFile))
    .subscribe(
        result => {
          this.loader = false;
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
  this.ptProvidersForm.step9.is_draft = true;
  this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.ptProvidersForm)
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

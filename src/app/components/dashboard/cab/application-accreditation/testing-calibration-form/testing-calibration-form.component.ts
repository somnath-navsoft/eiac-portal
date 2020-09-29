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
import { TrainerService } from '../../../../../services/trainer.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-testing-calibration-form', 
  templateUrl: './testing-calibration-form.component.html',
  styleUrls: ['./testing-calibration-form.component.scss']
})
export class TestingCalibrationFormComponent implements OnInit {

  public newRow: any = {};
  public testingCalForm: any = {};
  public testingCalFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [];
  public ownOrgMembInfo: Array<any> = [];
  public proficiencyTesting: Array<any> = [];
  public accreditationInfo: Array<any> = [];
  public technicalManager: any = {};
  public managementManager: any = {};
  public testingLabInfo:any={part1:[],part2:[]};
  public calLabInfo:any={part1:[],part2:[]};
  public medicaMainlLabInfo:Array<any>=[];
  public testingLabScopeFields:Array<any>=[];
  public calLabScopeFields:Array<any>=[];
  public testingLabData:any={part1:[],part2:[]};
  public calLabData:any={part1:[],part2:[]};
  public testingLabFirstData:Array<any>=[];
  public calLabFirstData:Array<any>=[];
  public countryList:Array<any>=[];
  public labTypeList:Array<any>=[];

  public orgMembToggle: boolean = false;
  public is_bod: boolean = false;
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public banner:any=[];
  public loader:boolean=true;
  public selectedValuesTl1:Array<any>=[];
  public selectedValuesTl2:Array<any>=[];
  public selectedValuesCl1:Array<any>=[];
  public selectedValuesCl2:Array<any>=[];
  public selectedValuesData:any={common_data:{},testingLab:{part1:[],part2:[]},calLab:{part1:[],part2:[]}};
  public testingLabScopeData:any = {part1:{},part2:{}};
  public calLabScopeData:any = {part1:{},part2:{}};
  public testingCalLabScopeData:any = {};
  accreditationTypeId:any;
  selectedFood1: string;
  selectedFood2: string;
  testingLabRowCount1:number=1;
  testingLabRowCount2:number=1;
  calLabRowCount1:number=1;
  calLabRowCount2:number=1;
  field2:number=2;
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = false;
  public addMinutesToTime:any;
  public file_validation: boolean = true;
  public minDate;
  authorization_confirm2:any;
  searchCountryLists:any;
  allCityByCountry: any = [];
  getCountryLists:any;
  onbehalf_representative_date:boolean = false;

  afterSubmit:boolean = false;
  paymentReceiptValidation:boolean
  readAccredAgreem: boolean = false;
  readReviewChecklist: boolean = false;
  readTermsCond: boolean = false;
  public errorLoader: boolean = false;
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  paymentFilePath: string = '';

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  // version = VERSION;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;
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
  
  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,public _trainerService:TrainerService,private modalService: NgbModal,public sanitizer: DomSanitizer) { }

  getData(getVal){
    //  console.log(">>>>Get MapBox Value: ", getVal);
     this.Service.mapboxToken = getVal;
  }

  scrollForm(el: HTMLElement)
  {
    //this.vps.scrollToAnchor(el);
    el.scrollIntoView({behavior: 'smooth'});
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

  onChange(prevFieldId,row,curField,field,tableType,tableSection) {

      let ScopeData = 'ScopeData';
      let ScopeFields = 'ScopeFields';
      let Data = 'Data';
      if(tableType == 'testingLab'){
        var selectedValueObj = this['selectedValuesTl'+tableSection][row-1] ? this['selectedValuesTl'+tableSection][row-1] : {};
        var selectedValueObj2 = this.selectedValuesData[tableType]['part'+tableSection][row-1] ? this.selectedValuesData[tableType]['part'+tableSection][row-1] : {};
        selectedValueObj[curField] = prevFieldId.value;
      }
      else{
        var selectedValueObj = this['selectedValuesCl'+tableSection][row-1] ? this['selectedValuesCl'+tableSection][row-1] : {};
        var selectedValueObj2 = this.selectedValuesData[tableType]['part'+tableSection][row-1] ? this.selectedValuesData[tableType]['part'+tableSection][row-1] : {};
        selectedValueObj[curField] = prevFieldId.value;

      }

      let tempKey = ''

      if(curField=='field1'){
        tempKey = this[tableType+ScopeFields][0].id;
      }
      else if(curField=='field2'){
        tempKey = this[tableType+ScopeFields][1].id;
      }
      else if(curField=='field3'){
        tempKey = this[tableType+ScopeFields][2].id;
      }
      else if(curField=='field4'){
        tempKey = this[tableType+ScopeFields][3].id;
      }
      else if(curField=='field5'){
        tempKey = this[tableType+ScopeFields][4].id;
      }
      else if(curField=='field6'){
        tempKey = this[tableType+ScopeFields][5].id;
      }

      selectedValueObj2[tempKey] = prevFieldId.source.selected.viewValue;

      if(tableType == 'testingLab'){
        if(this['selectedValuesTl'+tableSection][row-1]){ 
          this['selectedValuesTl'+tableSection][row-1] = selectedValueObj;
          this.selectedValuesData['testingLab']['part'+tableSection][row-1] = selectedValueObj2;
        }
        else{ 
          this['selectedValuesTl'+tableSection].push(selectedValueObj);
          this.selectedValuesData['testingLab']['part'+tableSection].push(selectedValueObj2);
        }
      }
      else{

        if(this['selectedValuesCl'+tableSection][row-1]){
          this['selectedValuesCl'+tableSection][row-1] = selectedValueObj;
          this.selectedValuesData['calLab']['part'+tableSection][row-1] = selectedValueObj2;
        }
        else{
          this['selectedValuesCl'+tableSection].push(selectedValueObj);
          this.selectedValuesData['calLab']['part'+tableSection].push(selectedValueObj2);
        }

      }

      

      this[tableType+'RowCount'+tableSection] = row

      this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data,{'value_id':prevFieldId.value})
      .subscribe(
        res => {
          // if(res['banner'].length>0){
          //   this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
          // }
          
          if(field=='field2'){
            this[tableType+Data]['part'+tableSection][this[tableType+'RowCount'+tableSection]]['field2']=res['scopeValue']
          }
          else if(field=='field3'){
            //console.log('field3')
            this[tableType+Data]['part'+tableSection][row].field3=res['scopeValue']
          }
          else if(field=='field4'){
            this[tableType+Data]['part'+tableSection][row].field4=res['scopeValue']
          }
          else if(field=='field5'){
            this[tableType+Data]['part'+tableSection][row].field5=res['scopeValue']
          }
          else if(field=='field6'){
            this[tableType+Data]['part'+tableSection][row].field6=[{'field_value':'A','value':'A'},{'field_value':'B','value':'B'},{'field_value':'C','value':'C'}];
          }

          this.testingCalLabScopeData['testingCaldata'] = this.selectedValuesData;
          this.testingCalForm.testingCalLabScopeData = this.testingCalLabScopeData

          //console.log("LOggggg==>");
          //console.log(this.selectedValuesData);

        },
        error => {
        
    })
  }

  ngOnInit() { 
    // console.log(this.Service.getValue(),'ngOnInit')
    // this.Service.getDynamic().subscribe( res => {
    //   console.log(res,'sdsgdsg');
    // });
    this.urlVal = this.Service.getValue() != '' ? this.Service.getValue() : '';
    console.log(this.urlVal,'valofurl');
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');
    this.userId = sessionStorage.getItem('userId');
    // this.titleService.setTitle('EIAC - Testing and Calibration Laboratories');
    this.addMinutesToTime = this.Service.addMinutesToTime();
    this.loadAppInfo();
    this.loadFormDynamicTable();
    this.loadCountryStateCity();
    this.stepDefaultValue();
    // this.loadCountryStateCity();
    //this.checkCaptchaValidation = true;

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
      // {
      // title:'perlim_visit', desc:'5. Perlim Visit', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      // },
      // {
      // title:'undertaking_applicant', desc:'6. Undertaking & Applicant Company', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      // },
      // {
      // title:'payment', desc:'7. Payment Information', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
      // },
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
    
  }
  
  getPlaceName()
  {
    if(typeof this.step1Data.search_location_name != 'undefined')
    {
      this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step1Data.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
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
    this.testingCalForm.location_longitude = longitude;
    this.testingCalForm.location_latitude = latitude;
  }
  
  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  // bod_toggle(value){
  //   this.is_bod = value;
  // }

  bod_toggle(value,type){
    if(type == 'is_bod')
    {
      this.is_bod = value;
    }else if(type == "is_hold_other_accreditation_toggle")
    {
      this.is_hold_other_accreditation_toggle = value;
    }
  }

  loadFormDynamicTable(){
    this.ownOrgBasicInfo  =   [{}];
    this.ownOrgMembInfo = [{}];
    this.accreditationInfo = [{}];
    this. proficiencyTesting =[{}];
    this.testingLabInfo={part1:[{}],part2:[{}]};
    this.calLabInfo={part1:[{}],part2:[{}]};
    this.medicaMainlLabInfo=[{}];
    
    this.testingCalForm.organizationBasicInfo    = this.ownOrgBasicInfo;
    this.testingCalForm.organizationMemberInfo   = this.ownOrgMembInfo;
    this.testingCalForm.accreditationInfo        = this.accreditationInfo;
    this.testingCalForm.proficiencyTesting       = this.proficiencyTesting;
    this.testingCalForm.technicalManager         = this.technicalManager;
    this.testingCalForm.managementManager        = this.managementManager;
    this.testingCalForm.testingLabInfo           = this.testingLabInfo;
    this.testingCalForm.calLabInfo               = this.calLabInfo;
    this.testingCalForm.medicaMainlLabInfo        = this.medicaMainlLabInfo;
    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirmTop3: false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,
      undertaking_confirm7:false};

    // this.recommend = {first:false,second:false,third:false,fourth:false}
  }

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate);
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
  //organizationArray
  addRow(obj: any = [],type?: string){
    if(type != '' && type != undefined){
      //console.log('1st')
      let getIndex    =   obj.findIndex(rec => rec.type == type);
      this.newRow     =   {};
      obj[getIndex].data.push(this.newRow);
    }
    if(type === '' || type == undefined){
      let objlength = obj.length+1;
      this.testingLabData['part1']['row'+objlength]={};
      this.testingLabData['part1']['row'+objlength].field1 = this.testingLabFirstData;
      this.newRow     =   {};
      obj.push(this.newRow);
    }
      
    return true;
  }

  addMLRow(obj: any = [],type: string,tableType: string,tableSection: string){ 

    this[tableType+'RowCount'+tableSection]++;
    if(type === '' || type == undefined){
      let objlength = obj.length+1;
      this[tableType+'Data']['part'+tableSection][this[tableType+'RowCount'+tableSection]]=[];
      this[tableType+'Data']['part'+tableSection][this[tableType+'RowCount'+tableSection]].field1 = this[tableType+'FirstData'];
      this.newRow     =   {};
      obj.push(this.newRow);
    }
    return true;
  }

  
  showHideMembInfo(data){
    this.orgMembToggle  = data.checked;
  }

  accreditationType (id){
    this.accreditationTypeId = id;
    //this.testingCalForm.laboratory_type_name = title;
  }

  accreditationRequired(title) {
    this.testingCalForm.accredation_type_name = title;
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

  onSubmit(ngForm){
    ////console.log(this.testingCalForm);
    // if(this.checkSecurity == true)
    // {
    //   this.checkCaptchaValidation = true;
    // }else{
    //   this.checkCaptchaValidation = false;
    // }
    // if(!this.testingCalForm.authorization_confirm1){
    //   this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }
    // if(!this.testingCalForm.authorization_confirm2){
    //   this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }
    // if(!this.testingCalForm.authorization_confirm3){
    //   this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }
    // if(!this.testingCalForm.recommend_confirm){
    //   this.toastr.error('Please Check Recommend Confirm ', '');
    // }
    this.authorizationStatus = true;
    this.isSubmit = true;
    this.afterSubmit = true;
    Object.keys(this.authorizationList).forEach(key => {
      if(this.authorizationList[key]==false){
        //console.log(this.authorizationList[key])
        this.authorizationStatus = false;
      }
    })
    if(!this.authorizationStatus){
      this.isSubmit = false;
      this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    // if(!this.Service.checkInput('email',this.testingCalForm.mailing_address)){
    //   this.isSubmit = false;
    //   //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }

    if(this.testingCalForm.duty_shift == '1' && typeof this.testingCalForm.duty_from1 == 'undefined' && typeof this.testingCalForm.duty_to1 == 'undefined')
    {
      ////console.log();
      this.dutyTime1 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime1 = true;
    }
    if(this.testingCalForm.duty_shift == '2' && typeof this.testingCalForm.duty_from2 == 'undefined' && typeof this.testingCalForm.duty_to2 == 'undefined')
    {
      if(typeof this.testingCalForm.duty_from1 == 'undefined' || typeof this.testingCalForm.duty_to1 == 'undefined')
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
    if(this.testingCalForm.duty_shift == '3' && typeof this.testingCalForm.duty_from3 == 'undefined' && typeof this.testingCalForm.duty_to3 == 'undefined')
    {
      if(typeof this.testingCalForm.duty_from1 == 'undefined' || typeof this.testingCalForm.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else{
        this.dutyTime1 = true;
      }
      if(typeof this.testingCalForm.duty_from2 == 'undefined' || typeof this.testingCalForm.duty_to2 == 'undefined')
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

    if(ngForm.form.valid && this.checkCaptchaValidation == true){
      this.testingCalForm.is_bod = this.is_bod;
      this.testingCalFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.loader = false;
       this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data,this.testingCalFormFile)
       .subscribe(
         res => {
           if(res['status']==true){
            this.loader = true;
            this.captchaRef.reset();
            this.checkCaptchaValidation = false;
            this.afterSubmit = false;
             this.toastr.success(res['msg'], '');
             this.router.navigate(['application-form/service/testing_calibration']);
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

  stepDefaultValue() {
    this.step1Data.accredation_criteria = '';
    this.step1Data.accreditationInfo =  [{
      scheme_name: "", 
      acccreditation_body_name: "", 
      acccreditation_scope: "",
      certificate_expiry_date: "",
    }];
    this.step1Data.city =  "";
    this.step1Data.country = "";
    this.step1Data.criteria_request = "";
    this.step1Data.date_of_establishment = "";
    this.step1Data.date_of_expiry = "";
    this.step1Data.date_of_issue = "";
    // this.step1Data.duty_from1 = "";
    // this.step1Data.duty_from2 = "";
    // this.step1Data.duty_from3 = "";
    // this.step1Data.duty_shift = "";
    // this.step1Data.duty_to1 = "";
    // this.step1Data.duty_to2 = "";
    // this.step1Data.duty_to3 = "";
    this.step1Data.fax_no = "";
    this.step1Data.is_bod = "1";
    this.step1Data.is_hold_other_accreditation = "1";
    this.step1Data.is_main_activity = "";
    this.step1Data.is_main_activity_note = "";
    this.step1Data.mailing_address = "";
    this.step1Data.official_commercial_name = "";
    this.step1Data.official_email = "";
    this.step1Data.official_website = "";
    this.ownOrgBasicInfo = [{
      name: "", 
      designation: "", 
      email: "",
      phone_no: "",
      mobile_no: "",
    }];
    this.ownOrgMembInfo = [{
      name:'',
      bod_company:'',
      director:'',
      designation:'',
      authorized_contact_person:'',
      mobile_no:'',
      phone_no:'',
      email:'',
    }]
    this.step1Data.physical_location_address = "";
    this.step1Data.po_box = "";
    this.step1Data.state = "";
    this.step1Data.telephone = "";
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

      if(this.urlVal != 'all') {

        this.loader = false;
        let url2 = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+this.urlVal;
        this.Service.getwithoutData(url2)
        .subscribe(
          res => {
            // console.log(res,'urlVal')
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

  onSubmitStep1(ngForm1: any){
    // this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    if(this.step1Data.duty_shift == '1')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else{
        this.dutyTime1 = true;
        this.isSubmit = true;
      }
      this.dutyTime1 = false;
      this.isSubmit = false;
      
    }else if(this.step1Data.duty_shift == '2')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else if(typeof this.step1Data.duty_from2 == 'undefined' || typeof this.step1Data.duty_to2 == 'undefined') {
        this.dutyTime2 = false;
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
      }
      else if(typeof this.step1Data.duty_from2 == 'undefined' || typeof this.step1Data.duty_to2 == 'undefined')
      {
        this.dutyTime2 = false;
      }
      else if(typeof typeof this.step1Data.duty_from3 == 'undefined' || typeof this.step1Data.duty_to3 == 'undefined') {
        this.dutyTime3 = false;
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
    // console.log(this.dutyTime2,'dutyTime2');
    // console.log(this.dutyTime3,'dutyTime3');
    
    if(ngForm1.form.valid && this.isSubmit == true) {
      this.testingCalForm = {};
      this.testingCalForm.step1 = {};
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      this.testingCalForm.saved_step = '1';
      this.step1Data.is_draft = false;
      if(this.formApplicationId > 0){
        this.step1Data.application_id = this.formApplicationId;
      }
      this.testingCalForm.step1.is_draft = false;
      this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
      this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
      this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
      this.testingCalForm.step1 = this.step1Data;

      this.testingCalForm.step1['ownOrgBasicInfo'] = [];
      this.testingCalForm.step1['ownOrgMembInfo'] = [];
      this.testingCalForm.step1['accreditationInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.testingCalForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.testingCalForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.accreditationInfo) {
        this.testingCalForm.step1['accreditationInfo'] = this.accreditationInfo;
      }

      this.loader = false;
      // this.step1DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
      .subscribe(
        res => {
          this.loader = true;
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

  savedraftStep(stepCount) {
    if(stepCount == 'step1') {
      this.testingCalForm = {};
      this.testingCalForm.step1 = {};
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      this.testingCalForm.saved_step = '1';
      if(this.formApplicationId > 0){
        this.step1Data.application_id = this.formApplicationId;
      }
      this.step1Data.is_draft = true;
      this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
      this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
      this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
      this.testingCalForm.step1 = this.step1Data;

      this.testingCalForm.step1['ownOrgBasicInfo'] = [];
      this.testingCalForm.step1['ownOrgMembInfo'] = [];
      this.testingCalForm.step1['accreditationInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.testingCalForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.testingCalForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.accreditationInfo) {
        this.testingCalForm.step1['accreditationInfo'] = this.accreditationInfo;
      }
      this.loader = false;
      // this.step1DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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
      this.testingCalForm = {};
      this.testingCalForm.step2 = {};
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      this.testingCalForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      
      this.step2Data.is_draft = true;
      this.testingCalForm.step2 = this.step2Data;

      this.testingCalForm.step2['proficiencyTesting'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.testingCalForm.step2['proficiencyTesting'] = this.proficiencyTesting;
      }

      this.loader = false;
      // this.step2DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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
      this.testingCalForm = {};
      // this.step3Data = {};
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step3Data.application_id = applicationId;
      this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step3Data.is_draft = true;
      this.testingCalForm.saved_step = '3';
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;

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

      this.testingCalForm.step3 = this.step3Data;
      this.loader = false;
      // this.step3DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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
      this.testingCalForm = {};
      this.testingCalForm.step4 = {};
      var applicationId = sessionStorage.getItem('applicationId');
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step4Data.is_draft = true;
      this.testingCalForm.saved_step = '4';
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      this.testingCalForm.step4 = this.step4Data;
      this.loader = false;
      // this.step4DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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
      this.testingCalForm = {};
      this.testingCalForm.step6 = {};
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      var applicationId = sessionStorage.getItem('applicationId');
      this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
      this.step6Data.is_draft = true;
      this.testingCalForm.saved_step = '6';
      this.testingCalForm.step6 = this.step6Data;

      // console.log(this.testingCalForm);
      this.loader = false;
      // this.step5DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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
      this.testingCalForm = {};
      this.testingCalForm.step7 = {};
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      this.step7Data.authorizationList = this.authorizationList;
      this.step7Data.recommend = this.recommend;
      this.step7Data.is_draft = true;
      this.testingCalForm.saved_step = '7';

      this.testingCalForm.step7 = this.step7Data;
      // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
      this.loader = false;
      // this.step6DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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

    }
  }

  onSubmitStep2(ngForm2: any){
    // this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);

    if(ngForm2.form.valid) {
      this.testingCalForm = {};
      this.testingCalForm.step2 = {};
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      this.testingCalForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      
      this.step2Data.is_draft = false;
      this.testingCalForm.step2 = this.step2Data;

      this.testingCalForm.step2['proficiencyTesting'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.testingCalForm.step2['proficiencyTesting'] = this.proficiencyTesting;
      }

      // this.step2DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
      .subscribe(
        res => {
          // console.log(res,'res')
          this.loader = true;
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
      this.testingCalForm = {};
      // this.step3Data = {};
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step3Data.application_id = applicationId;
      this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step3Data.is_draft = false;
      this.testingCalForm.saved_step = '3';
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;

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

      this.testingCalForm.step3 = this.step3Data;
      // this.step3DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
      .subscribe(
        res => {
          // console.log(res,'res')
          this.loader = true;
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
      this.testingCalForm = {};
      this.testingCalForm.step4 = {};
      var applicationId = sessionStorage.getItem('applicationId');
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step4Data.is_draft = false;
      this.testingCalForm.saved_step = '4';
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      this.testingCalForm.step4 = this.step4Data;
      // this.step4DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
      .subscribe(
        res => {
          this.loader = true;
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
      this.testingCalForm = {};
      this.testingCalForm.step6 = {};
      this.testingCalForm.saved_step = '6';
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      var applicationId = sessionStorage.getItem('applicationId');
      this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
      this.step6Data.is_draft = false;
      this.testingCalForm.step6 = this.step6Data;

      // console.log(this.testingCalForm);
      // this.step5DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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

    this.testingCalForm = {};
    this.testingCalForm.step7 = {};
    this.testingCalForm.email = this.userEmail;
    this.testingCalForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step7Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.testingCalForm.saved_step = '7';
    this.step7Data.authorizationList = this.authorizationList;
    this.step7Data.recommend = this.recommend;
    this.step7Data.is_draft = false;
    this.step7Data.application_date = new Date();

    this.testingCalForm.step7 = this.step7Data;
    // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);

    // this.step6DataBodyFormFile.append('data',JSON.stringify(this.testingCalForm));
    // console.log(this.testingCalForm,'testingCalForm');
    this.loader = false;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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
      this.createPaymentButton(this.transactionsItem, this.testingCalForm, this);
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
  this.testingCalForm = {};
  this.testingCalForm.step9 = {};

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
              this.toastr.success("Your form has been successfully submitted and it is under review.We will update you shortly.",'THANK YOU');
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
    this.testingCalForm.step9.is_draft = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.testingCalForm)
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

  removeRow(obj: any, index: number, type?:string){

    if(type === '' || type == undefined){
      obj.splice(index, 1);
    }    
    return true;
  }

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

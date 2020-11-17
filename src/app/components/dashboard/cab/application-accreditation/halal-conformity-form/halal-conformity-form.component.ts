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
  termsILA: any;
  

  //Master scope form data declaration
  /*dynamicScopeModel:any         = {};   
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
  */
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
  file_validation_listAuditor:boolean = true;
  esma_fileAny:any;
  halal_certificate_fileAny:any;
  file_validation_halal_certificate:boolean = true;
  esma_file_validation:boolean = true;
  hcabLogo1_validation:boolean = true;
  hcabLogo2_validation:boolean = true;
  hcabLogo3_validation:boolean = true;
  bodMembInfo:any;

   //Master scope form data declaration
   dynamicScopeModel:any         = {};   
   dynamicScopeFieldColumns:any  = {};  
   dynamicScopeFieldType:any     = {}; 

   scopeCheckboxes: any[] =[];
   scope_options_others: string;;
   checkItemOthers: boolean = false;

   criteriaMaster: any[] = [];
   fullScope:any[]=[]; 
   authorizationListTerms1: any; //agreement
   authorizationListTerms2: any; // ILA/IAF

   //fullTypeScope:any={};
   fullTypeScope:any[]=[];

   scopeDataLoad: boolean = false;
   editScopeData: any;
   getScopeData: any;
   selectDeleteID: number =0;
   selectDeleteKey: any;
   selectDeleteTypeKey: any;
   selectDeleteIndex: any;
   selectDeleteTypeTitle: any;
   selectRowObj: any;
   deleteEditScopeConfirm: boolean = false;
   deleteScopeConfirm: boolean = false;
   deleteOthersConfirm: boolean = false;
   inspectionBodyForm: any = {};
   schemeRows: Array<any> = [{}];
   subTypeMaster: any[] = [];
   subTypeRows: Array<any> = [{}];
   cbsOtherActivity: any[] = [{}];
   nameOfCountry: any[] = [{}];

   //Other scope fixed table
   otherStandards: any[] = [{}];
   issuedEsmaPath:any;
   certificateStampPath:any;
   hcabLogo1Path:any;
   hcabLogo2Path:any;
   hcabLogo3Path:any;
   recomendVisit: any[] = [];
   //Master scope form data declaration
   recommendYearValues: any[] = [];
   id_issued_esma:any;
   halal_certificate_stamp:any;
   hcabLogo1:any;
   hcabLogo2:any;
   hcabLogo3:any;
   hcabLogon1:any;
   hcabLogon2:any;
   hcabLogon3:any;
   termsGeneral: any;
  
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

  checkItemClick(theEvt: any){
    if(theEvt.checked){
      this.checkItemOthers = false;
    }
  }
  checkOthersItemClick(theEvt: any){
    if(theEvt.checked){
        this.scopeCheckboxes.forEach(item => {
            if(item.checked){
              item.checked = false;
            }
        })      
    }
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

    var d = new Date();
    var yr = d.getFullYear();
    for(var k=2010; k<=2030; k++){
      this.recommendYearValues.push({title: k.toString(), value: k});
    }
    this.step6Data.recommend_year = yr;

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

    this.scopeCheckboxes.push({
      name: "UAE_S_2055_2_2016",
      checked: false,
      label: "UAE.S 2055 - 2:2016"
    },
    {
      name: "GSO_S_2055_2_2015",
      checked: false,
      label: "GSO.S 2055 - 2:2015"
    },
    {
      name: "OIS_SMIIC_2_2011",
      checked: false,
      label: "OIS/SMIIC - 2:2011"
    },
    {
      name: "Halal_Inspection_Bodies for providing Halal Products Market Surveillance",
      checked: false,
      label: "Halal Inspection Bodies for providing Halal Products Market Surveillance"
    },
    {
      name: "Halal_Inspection_Bodies_for_Slaughter_Houses_Inspection",
      checked: false,
      label: "Halal Inspection Bodies for Slaughter Houses Inspection"
    },
    {
      name: "Halal Products Testing Compliance",
      checked: false,
      label: "Halal Products Testing Compliance"
    }
    )


    this.summaryDetails = [{"position":'Managerial/Professional','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Decision Maker','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Technical','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Administrative','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Auditors Name','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Category Code','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Technical Expert','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Inspectors Name','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Category Code','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Islamic Affairs Expert','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''},{'position':'Others','total_no' : '','fulltime_emp_name' : '','parttime_emp_name' : ''}];

    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirmTop3: false,undertaking_confirm1:false,
    undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,
    undertaking_confirm7:false,undertaking_confirm8:false,undertaking_confirm9:false,undertaking_confirm10:false};
    this.loadAppInfo();
    this.loadCountryStateCity();

    this.loadScopeData();
    this.loadScopeCriteria();
    this.recomendVisit.push({
        checked: false,
        name: 'first',
        label: '1st',
      },{
        checked: false,
        name: 'second',
        label: '2nd',
      },{
        checked: false,
        name: 'third',
        label: '3rd',
      },{
        checked: false,
        name: 'fourth',
        label: '4th',
      }
    );
    this.loadTermsConditions();
  }


  /*******************************
  * Scope Funtions
  * @Abhishek
  ********************************/
 loadScopeCriteria(){
  console.log(">>>> Load scope Criteria List");
  this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halal_conformity_form_management)
   .subscribe( 
     res => {
       let record: any = res['data'];
       console.log("@Load scope criteria...", record);
       if(record){
        this.criteriaList = record.criteriaList;
         //console.log("@Load Type....", this.subTypeMaster);
       }
       //
       //this.criteriaMaster = res['data']['schemes'];
       //////console.log("#Get criteria: ", this.criteriaMaster);

     },
     error => {
     
 })

 }
 loadScopeData(){
  //
 this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity)
   .subscribe( 
     res => {
       let record: any = res['data'];
       console.log("@Load subtype Master....", record);
       if(record){
         this.subTypeMaster = record.serviceList;
         //console.log("@Load Type....", this.subTypeMaster);
       }
       //this.criteriaList = res['data']['criteriaList'];
       //this.criteriaMaster = res['data']['schemes'];
       //////console.log("#Get criteria: ", this.criteriaMaster);

     },
     error => {
     
 })
}
getCriteria(value, secInd: any, typeTitle: any){
 ////console.log("select Criteris: ", value, " -- ", secInd);
 this.scopeDataLoad = true;

 // this.dynamicScopeFieldColumns[typeIndex] = {};
 // this.dynamicScopeFieldType[typeIndex] = {};
 // this.dynamicScopeModel[typeIndex] = {};
 // this.fullScope[typeIndex] = [];

 if(value != undefined && value > 0){

   //get type title
    
    let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halal_conformity_form_management+"?scheme="+value;
    this.Service.getwithoutData(apiURL).subscribe(record => {
     //console.log('@Fullscope: ', record);
         let dataScope:any = [];
         let fieldTitleValue: any = [];
         dataScope = record['data'];
         this.scopeDataLoad = false;
         let customKey;
         console.log('Fullscope: ', dataScope);
         if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
           let firstColumValues = dataScope.firstColumnData[0];
         }

         let findType: any = this.fullTypeScope.find(item => item.title == typeTitle);
         //console.log("find Type: ", findType);

           let scopeName: string = '';
           let scopeTitle: string ='';
           let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == value);
           ////console.log(">>> Fined Scheme: ", getData);
           if(getData){
             scopeName   = getData.title;
             scopeTitle  = getData.title.toString().toLowerCase().split(" ").join('_');

             //check already existing scheme...
             if((findType.scopeRows.length)){
              //console.log("@Existing scheme....1");
              let dupdata: any = findType.scopeRows.find(item => item.title == scopeTitle);
              console.log(">>Dup Type schem found...", dupdata);
              if(dupdata != undefined){
                this.toastr.error("Duplicate  Scheme","Validation")
                return;
              }
            }
            //  for(var m in this.dynamicScopeModel){
            //      //console.log("mkey: ", m, " -- ", scopeTitle);
            //      if(m === scopeTitle){
            //        this.fullScope.splice(secInd, 1);
            //        this.toastr.error("Scheme should be unique, Please check.","Validation")
            //        return;
            //      }
            //  }
             // this.dynamicScopeFieldColumns[scopeTitle] = [];
             // this.dynamicScopeFieldType[scopeTitle] = [];
             // this.dynamicScopeModel[scopeTitle] = {};

             this.dynamicScopeFieldColumns[findType.id] = [];
             this.dynamicScopeFieldColumns[findType.id][scopeTitle] = [];
             this.dynamicScopeFieldType[findType.id] = [];
             this.dynamicScopeFieldType[findType.id][scopeTitle] = [];
             this.dynamicScopeModel[findType.id] = {};
             this.dynamicScopeModel[findType.id][scopeTitle] = {};

             //console.log("@Model struct: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);
             //return;

             if(findType.scopeRows.length){
                 //console.log("@Existing scheme....1");
                 let pushObj: any = {
                   title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                 }
                 
                 if(findType.scopeRows[secInd] != undefined && !this.Service.isObjectEmpty(findType.scopeRows[secInd])){
                   //console.log("@Existing scheme...found", findType.scopeRows[secInd]);
                   findType.scopeRows[secInd] = pushObj;
                 }else{
                   findType.scopeRows.push({
                       title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                     });
                 }
             }else{
               findType.scopeRows.push({
                 title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
               });
             }

           }

         if(dataScope.scopeValue.length){
           var counter = 0;let defLine = {};
           dataScope.scopeValue.forEach((rec, key) => {
             //console.log("--Scope ", rec, " :: ", key, " -- ", this.dynamicScopeFieldType[findType.id]);

             if(rec.scope != undefined && typeof rec.scope === 'object' && !this.Service.isObjectEmpty(rec.scope)){
                 let fieldType: any = {
                    id: rec.scope.id,
                    title: rec.title,
                    inputType: rec.scope.input_type,
                    defValue: rec.scope.default_value
                 }
                 this.dynamicScopeFieldType[findType.id][scopeTitle].push(fieldType);
             }
             
             customKey = rec.title.toString().toLowerCase().split(' ').join('_');
             this.dynamicScopeFieldColumns[findType.id][scopeTitle][key] = [];

             fieldTitleValue[key] = [];
             this.dynamicScopeModel[findType.id][scopeTitle]['fieldLines'] = [];

             if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
               defLine['firstFieldValues'] = dataScope.firstColumnData;
             }
             let fieldValues = rec.title.split(" ").join("")+"Values";
             let fieldTitle = rec.title.split(" ").join("_");
             let filedId = rec.id;

             let colObj: any ={};
             colObj = {title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId};
             this.dynamicScopeFieldColumns[findType.id][scopeTitle][key].push(colObj);
             defLine[fieldValues] = [];
             ////console.log(">>> Field values: ", fieldValues, " -- ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeModel.fieldLines);
             if(defLine['firstFieldValues'] != undefined && defLine['firstFieldValues'].length > 0  && key == 0){
               let getValue = defLine['firstFieldValues'][0].field_value.id;
               
               if(key === 0){
                 fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
               }
               //Default load next column 
               if(key == 0){
                 this.onChangeScopeOption(getValue,scopeTitle,findType.id,key,key,'initLoad');
               } 
               setTimeout(()=>{
                 if(getValue != undefined && getValue > 0){  
                   let fSelValues: any = {};
                   //fSelValues[]                    
                   this.dynamicScopeModel[findType.id][scopeTitle]['fieldLines'][0][this.dynamicScopeFieldColumns[findType.id][scopeTitle][0][0].values] = [defLine['firstFieldValues'][0]];
                   this.dynamicScopeModel[findType.id][scopeTitle].fieldLines[key][this.dynamicScopeFieldColumns[findType.id][scopeTitle][key][0].title] = getValue;
                 }
               },0)                                
               
             }              
             //Load first field value default by selecting first item
             this.dynamicScopeModel[findType.id][scopeTitle].fieldLines.push(defLine);
           });

           //console.log("@@@@Update Model: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);

         }
         //////console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns, " ::-> ",this.fullScope);
    })
 }
}

onChangeScopeOption(getValues: any,secIndex: any,typeTitle: any, lineIndex: number, columnIndex: number, type?:string) {
 //console.log('@GET Options: ', getValues, " :: ",  lineIndex, " -- ", type, " --colInd ", columnIndex, " --sec--  ", secIndex);

 let selectValue: any;
 if(type === undefined){
   selectValue = getValues.value;
 }
 if(type !== undefined && type === 'initLoad'){
   selectValue = getValues;
 }
 let url = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data;
 console.log("option change value: ", url, " :: ", getValues, " -- ", selectValue, " -- Type: ", typeof selectValue);
 let jsonReq: any = {};
 if(typeof selectValue === 'number'){
   jsonReq['value_id'] = [selectValue];
 }
 if(typeof selectValue === 'object'){
   for(var k in selectValue){
       //console.log(">>Loop value: ", selectValue[k], " :: ", k);
       if(typeof selectValue[k] === 'string'){
         return;
       }
   }
   jsonReq['value_id'] = selectValue;
 }
 this.Service.put(url,jsonReq)
 .subscribe(
   record => {
       //console.log("Load scope SErvice Data: ", secIndex, " -- ", this.dynamicScopeFieldType, " ::", this.dynamicScopeFieldColumns,  " - ", this.dynamicScopeModel);
       //get through array find key column
       if(typeof record['scopeValue'] === 'object' && record['scopeValue'].length == 0){
         //console.log(">>>emepty scope values.....1");
         record['scopeValue'] = [];
       }
       if(typeof record['scopeValue'] === 'object' && this.Service.isObjectEmpty(record['scopeValue']) == true){
         //console.log(">>>emepty scope values.....2");
         record['scopeValue'] = [];
       }
       let theColumnIndex  = columnIndex;
       let nextColumnIndex = theColumnIndex + 1;
       //console.log(">>>Column Data: ", theColumnIndex, " -- ", nextColumnIndex, " -- ", " -- ", this.dynamicScopeFieldColumns[typeTitle]);
       let totSecColumn    = this.dynamicScopeFieldColumns[typeTitle][secIndex].length;//
       ////console.log(">>>Column Data: ", theColumnIndex, " -- ", nextColumnIndex, " -- ", totSecColumn, " -- ", this.dynamicScopeFieldColumns[typeTitle][secIndex]);
       //console.log("select scope values: ", record['scopeValue'], " :: ", this.dynamicScopeFieldType[typeTitle][secIndex], " len: ", record['scopeValue'].length);
       //Auto selected for one item dropdown
       if(record['scopeValue'].length > 0 && record['scopeValue'].length == 1){
           //console.log(">>>dep scope data: ", record['scopeValue']);
           let getSelValue = 0; 
           if(typeof record['scopeValue'][0] === 'object'){                  
             getSelValue = record['scopeValue'][0].field_value.id;
             //console.log(">>assigning scope default value: ", getSelValue);
             this.dynamicScopeModel[typeTitle][secIndex].fieldLines[lineIndex][this.dynamicScopeFieldColumns[typeTitle][secIndex][nextColumnIndex][0].title] = getSelValue;
             this.onChangeScopeOption(getSelValue,secIndex,typeTitle,lineIndex,nextColumnIndex,'initLoad');
           }
       }
       if(nextColumnIndex > 0 && nextColumnIndex < totSecColumn){
           //Get ridge of the values
           ////console.log("field columns: ", this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][0].values] , " :: ");
           let colDef: string = this.dynamicScopeFieldType[typeTitle][secIndex][nextColumnIndex].defValue                                                       
           //console.log(">>> scope field def: ", colDef);
           if(colDef === "None" || colDef === null){
             //console.log("Def enter...1");
             this.dynamicScopeModel[typeTitle][secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[typeTitle][secIndex][nextColumnIndex][0].values] = record['scopeValue'];
           }
           else if(colDef != "None" && colDef != null && colDef != ""){
             //console.log("Def enter...2");
             let colValAr: any;                                                                                                                                                                                                                                    
             let colTempAr: any = [];
             colValAr = colDef.toString().split(',');                                                                                                                                                
             colValAr.forEach((item,key1) => {
               let tempObj: any = {};
               tempObj['field_value'] = {};
               tempObj['field_value']['id'] = item;//(key1+1);
               tempObj['value'] = item;
               //console.log("value obj: ", tempObj);
               colTempAr.push(tempObj);
             });
             //console.log("Def enter...3");
             this.dynamicScopeModel[typeTitle][secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[typeTitle][secIndex][nextColumnIndex][0].values] = colTempAr;
           }else{
             //console.log("Def enter...4");
             this.dynamicScopeModel[typeTitle][secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[typeTitle][secIndex][nextColumnIndex][0].values] = record['scopeValue'];
           }
       }
     //console.log("@@@Updated Model Values: ", this.dynamicScopeModel);
   });
}


getTypeScheme(typeId: number, secInd: number){
  let typeData: any = this.subTypeMaster;
  let findType: any = this.subTypeMaster.find(rec => rec.service_page.id == typeId);
  ////console.log(">>> get type scheme...", typeId, " :: ", typeData);
  ////console.log(">>> find type: ", findType, " -- ", typeof findType);
  if(findType){
     if(findType.scheme_list != undefined && findType.scheme_list.length > 0){
         let typeTitle: any = findType.title.toString().toLowerCase().split(" ").join('_');
         let typeName =  findType.title.toString();
         //this.fullTypeScope[typeTitle] = {};
         this.criteriaMaster = findType.scheme_list;
         //schme rows depends on type selected

         if(this.fullTypeScope.length){
           //console.log("@Existing scheme....1");
           let dupdata: any = this.fullTypeScope.find(item => item.title == typeTitle);
           //console.log(">>Dup found...", dupdata);
           if(dupdata != undefined){
             this.toastr.error("Duplicate Type","Validation")
             return;
           }

           let pushObj: any = {
             title: typeTitle, id:findType.service_page.id, name:typeName, schemeData:findType.scheme_list, scopeRows: [], schemeRows: [{}]
           }
           
           if(this.fullTypeScope[secInd] != undefined && !this.Service.isObjectEmpty(this.fullTypeScope[secInd])){
             ////console.log("@Existing scheme...found", this.fullScope[secInd]);
             this.fullTypeScope[secInd] = pushObj;
           }else{
               this.fullTypeScope.push({
                 title: typeTitle, id:findType.service_page.id, name:typeName, schemeData:findType.scheme_list, scopeRows: [], schemeRows: [{}]
               });
           }
       }else{
       this.fullTypeScope.push({
           title: typeTitle, id:findType.service_page.id, name:typeName, schemeData:findType.scheme_list, scopeRows: [], schemeRows: [{}]
         });
       }



         //console.log(">>>> typte schme ...",  this.fullTypeScope, " -- ",);
     }
  }
   
}

addSubTypeRow(obj: any = [],index: number){
 //console.log(">>> ", obj);
 this.newRow     =   {};
 obj.push(this.newRow);
 }
 removeSubTypeRow(obj: any = [],index: number){
   obj.splice(index, 1);
   this.fullTypeScope.splice(index, 1);
 }

addSchemeRow(obj: any = [],index: number){
 //console.log(">>> ", obj);
 this.newRow     =   {};
 obj.push(this.newRow);
 }
 removeSchemeRow(obj: any = [],index: number){
 obj.splice(index, 1);  //not deleting...
 ////console.log("compare object: 1 ", this.schemeRows, " ::: ",  this.step5Data.scheme_ids);
 //this.schemeRows.splice(index, 1);
 ////console.log("compare object: 2 ", this.schemeRows, " ::: ", this.fullScope, " -- index: ", index);
 let sectionTitle: string = '';
 let fullscopeData: any = this.fullScope[index];
 if(fullscopeData){
   sectionTitle = fullscopeData.title;
 }
 //console.log("find section...", sectionTitle);

 if(this.fullScope[index] != undefined && !this.Service.isObjectEmpty(this.fullScope[index])){
   ////console.log("removing ...fullscope....", index, " :: ", this.fullScope[index]);
   this.fullScope.splice(index, 1)
 }
 if(this.dynamicScopeFieldType[sectionTitle] != undefined && !this.Service.isObjectEmpty(this.dynamicScopeFieldType[sectionTitle])){
   //console.log("removing ...fieldType....1", index, " :: ", this.dynamicScopeFieldType);
   //this.dynamicScopeFieldType.splice(index, 1);
   delete this.dynamicScopeFieldType[sectionTitle];
   ////console.log("removing ...fieldType....2", this.schemeRows,  " --",this.fullScope, " :: ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);
 }
 if(this.dynamicScopeModel[sectionTitle] != undefined && !this.Service.isObjectEmpty(this.dynamicScopeModel[sectionTitle])){
   delete this.dynamicScopeModel[sectionTitle];
 }

 //console.log(">>>After delete scheme: ", "Full Scope: ", this.fullScope, " :FieldType: ", this.dynamicScopeFieldType, " :Model: ", this.dynamicScopeModel);

 }

 getFieldTooltip(modelValue, modelObj){
   ////console.log("Tooltip data value: ", modelValue, " :: ", modelObj);
   if(modelValue != undefined && modelObj.length > 0){
       let tnameAr = [];
       let findText: any;
       if(typeof modelValue === 'object'){
           if(modelValue.length){
             modelValue.forEach(item => {
                 let fval: any  = modelObj.find(rec => rec.field_value.id === item);
                 if(fval){
                   tnameAr.push(fval.value);
                 }
             })
           }
           if(tnameAr.length){
              findText = tnameAr.join(',');
              return findText;
           }
       }else{
          findText = modelObj.find(rec => rec.field_value.id === modelValue);
       }        
       //////////console.log('Text value: ', findText);
       if(typeof findText === 'object' && findText.value != ''){
         //////////console.log('Value find: ', findText.value);
           return findText.value;
       }
   }
 }

 removeScopeLine(lineIndex: number, secIndex: any, typeTitle: any){
     //console.log("deleting rows....1: ", this.dynamicScopeModel, " -- ", lineIndex, " :: ", secIndex);
     if(this.dynamicScopeModel[typeTitle][secIndex].fieldLines != undefined && this.dynamicScopeModel[typeTitle][secIndex].fieldLines.length > 0){
       //console.log("deleting rows....2");
       this.dynamicScopeModel[typeTitle][secIndex].fieldLines.splice(lineIndex, 1);
     }
     this._customModal.closeDialog();
 }
 getSubType(typeId: number){
     if(typeId){
       let typeData: any = this.subTypeMaster.find(rec => rec.service_page.id == typeId);
       if(typeData){
         return 'Accreditation SubType For: ' + typeData.title;
       }
     }
 }
 getSchme(sid: number, typeId: number){
   let typeData: any;
   let getSchemeData: any;
   if(typeId){
      typeData = this.subTypeMaster.find(rec => rec.service_page.id == typeId);
   }
   ////console.log(">>> Type data: ", typeData, " -- ", this.subTypeMaster);
   if(typeData && typeData.scheme_list != undefined){
     getSchemeData = typeData.scheme_list.find(item => item.scope_accridiation.id == sid);
   }
   //getSchemeData = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
   ////console.log("data: schem get ", getSchemeData);
   //return;
   if(getSchemeData){
     return 'Accreditation Scope for ' + getSchemeData.title;
   }
 }
 deleteScopeData(typeId: any, schemId: any, deleteIndex: number){
     //console.log("deleting...", schemId, " -- ", deleteIndex, " -- ", typeId);
     let savedData: any = this.editScopeData;
     let typeData: any;
     //console.log("saveData: ", savedData);

     for(var key in savedData){
         //console.log(">>> ", key, " :: ", savedData[key]);
         if(key == typeId){
           
           typeData = savedData[key];
           //console.log(">>> Type data found... ", typeData);
           if(typeData != undefined && typeof typeData == 'object'){
                 for(var type in typeData){
                   if(type === schemId){
                     let getvalues: any =  typeData[type].scope_value;
                     //console.log("<<< scheme Found: ", getvalues);
                     if(typeof getvalues === 'object'){
                       //console.log("deleting...");
                       getvalues.splice(deleteIndex, 1);
                     }
                   }
                 }
           }
         }          
     }
     //save to server at time 
          this.publicHalalConformityForm = {};
          this.publicHalalConformityForm.step3 = {};  
          var applicationId = sessionStorage.getItem('applicationId');
          this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
          this.publicHalalConformityForm.saved_step = 3;
          this.step3Data['scopeDetails']  = this.editScopeData;
          let scopeOptionsValues: any = {};
          scopeOptionsValues['checkItems'] = [];
          scopeOptionsValues['checkItemsOthers'] = [];
          this.scopeCheckboxes.forEach((item,index) => {
            let tempObj: any ={};
            if(item.checked == true){
              tempObj['value'] = item.label;
              scopeOptionsValues['checkItems'].push(tempObj);
            }
          })
          if(this.checkItemOthers){
            if(this.scope_options_others != '' && this.scope_options_others != undefined){
              scopeOptionsValues['checkItemsOthers'].push({value: this.scope_options_others});
            }            
          }
          this.step3Data.scopeOptionsCheckDetails = scopeOptionsValues;
          this.step3Data.is_draft = false;
          this.publicHalalConformityForm.step3 = this.step3Data;
          console.log(">>> Step3 submit step : ", this.publicHalalConformityForm)  
          this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
            this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step3DataBodyFormFile)
            .subscribe(
              res => {
                console.log(res,'@Submit Result: ')
                if(res['status'] == true) {
                  //this.toastr.success(res['msg'], '');
                  //this.Service.moveSteps('scope_accreditation', 'other_hcab_details', this.headerSteps);
                }else{
                  this.toastr.warning(res['msg'], '');
                }
              });
     this._customModal.closeDialog();
     //console.log(">>>Final Data: ", this.editScopeData);
 }
 openDeleteRowConfirm(delObj: any, delIndex: any){
   //console.log(">>>delete ", delObj, " -- ", delIndex);
   if(delObj){
     //console.log("assign delete id: ", delIndex, " -- ", delObj);
     this.selectDeleteIndex = delIndex;
     this.selectRowObj = delObj;
     this.deleteOthersConfirm = true;
   } 
 }

 openDeleteScopeConfirm(delIndex: any, delKey: any, typeTitle: any){
   //console.log(">>>delete ", delKey, " -- ", delIndex);
   if(delKey){
     //console.log("assign delete id: ", delIndex, " -- ", delKey);
     this.selectDeleteIndex = delIndex;
     this.selectDeleteKey = delKey;
     this.selectDeleteTypeTitle = typeTitle;
     this.deleteScopeConfirm = true;
   } 
 }

 openDeleteEditScopeConfirm(delIndex: number, delTypeKey: any, delKey: any){
   //console.log(">>>delete ", delKey, " -- ", delTypeKey);
   if(delKey){
     //console.log("assign delete id: ", delIndex, " -- ", delIndex);
     this.selectDeleteIndex = delIndex;
     this.selectDeleteKey = delKey;
     this.selectDeleteTypeKey = delTypeKey;
     this.deleteEditScopeConfirm = true;
   } 
 }
 
 //addScopeLine(secName:any, secIndex: number, lineIndex: number, lineData: any){
 addScopeLine(lineIndex: number,secIndex: any,typeTitle: any, lineData: any){
   let line     =   {};    
   ////console.log("@ADD ROW - Total line: ", lineData, " - ", lineIndex, " == ", lineData.length, " --Model: ", this.dynamicScopeModel);
   if(lineData != undefined && lineData.length > 0){
     lineIndex  = lineData.length;
   }
   for(var key in this.dynamicScopeModel[typeTitle][secIndex]){
       ////console.log("Key: ", key , " :: ", this.dynamicScopeModel[secIndex][key]);
       let getValue: any = 0;
       //if( key === secName ){
         if(this.dynamicScopeModel[typeTitle][secIndex].fieldLines != undefined){
           let fieldValues = this.dynamicScopeModel[typeTitle][secIndex].fieldLines[0].firstFieldValues;
           
           ////console.log("@ADD ROW - Fieldvalues:: ", fieldValues);
           line['firstFieldValues'] = fieldValues;
           this.dynamicScopeModel[typeTitle][secIndex].fieldLines.push(line);
           if(fieldValues.length > 0 && typeof fieldValues[0] === "object" && fieldValues[0].field_value != undefined){
             getValue = fieldValues[0].field_value.id;
           }
           ////console.log('@ADD ROW - Calling on change...', getValue, " -- ", secIndex, " Lineindex: ", lineIndex);
           
           this.dynamicScopeFieldColumns[typeTitle][secIndex].forEach((recCol, keyCol) => {
             //////////console.log(" > >>   ", keyCol)
             if(keyCol === 0){
               let getModelKey = recCol[0].title;
               ////console.log(" >>>>>ModelKey ",getModelKey, " --- FindValue:  ", getValue, " --- ");
               this.dynamicScopeModel[typeTitle][secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[typeTitle][secIndex][0][0].values] = fieldValues;
               if(getValue != undefined && getValue > 0){
                 this.dynamicScopeModel[typeTitle][secIndex].fieldLines[lineIndex][getModelKey] = getValue;
               }
               //this.onChangeScopeOption(getValue,secIndex,lineIndex,0,secName,'initLoad');
               this.onChangeScopeOption(getValue,secIndex,typeTitle,lineIndex,0,'initLoad');
             }
           });
         }
       //}
   }    
   //////console.log("Add Line status: ", this.dynamicScopeModel);
 }



 /*******************************
 * Scope Funtions
 * @Abhishek
 ********************************/

  listAuditorFile(fileEvent: any,key:any,id?: any) {
    // this.file_validation_listAuditor = ;
    if(id && id != ''){
      var file_name = fileEvent.target.files[0].name;
      var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
      var ex_type = ['pdf'];
      var ex_check = this.Service.isInArray(file_exe,ex_type);
      if(ex_check) {
        this.accreditationInfo[key].list_auditor_upload = fileEvent.target.files[0].name;
        this.step1DataBodyFormFile.append('scope_of_accr_exist_'+id,fileEvent.target.files[0]);
        this.file_validation_listAuditor = true;
      }else{
        this.file_validation_listAuditor = false;
      }
    }else{
      var file_name = fileEvent.target.files[0].name;
      var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
      var ex_type = ['pdf'];
      var ex_check = this.Service.isInArray(file_exe,ex_type);
      if(ex_check) {
        this.accreditationInfo[key].list_auditor_upload = fileEvent.target.files[0].name;
        this.step1DataBodyFormFile.append('scope_of_accr_'+key,fileEvent.target.files[0]);
        this.file_validation_listAuditor = true;
      }else{
        this.file_validation_listAuditor = false;
      }
    }
  }

  listAccreditationFile(fileEvent: any,key:any) { 
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check) {
      this.accreditationInfo[key].list_auditor_upload = fileEvent.target.files[0].name;
      // this.step3DataBodyFormFile.append('qualification_file_exist_'+id,fileEvent.target.files[0]);
      this.file_validation_listAuditor = true;
    }else{
      this.file_validation_listAuditor = false;
    }
  }

  halalCertificates(fileEvent: any,key:any,id?: any) {
    // this.file_validation_listAuditor = ;
    if(id && id != ''){
      var file_name = fileEvent.target.files[0].name;
      var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
      var ex_type = ['pdf'];
      var ex_check = this.Service.isInArray(file_exe,ex_type);
      if(ex_check) {
        this.authorizedPersonforSigning[key].authorized_personforSigning_upload = fileEvent.target.files[0].name;
        this.step4DataBodyFormFile.append('signature_exist_'+id,fileEvent.target.files[0]);
        this.file_validation_listAuditor = true;
      }else{
        this.file_validation_listAuditor = false;
      }
    }else{
      var file_name = fileEvent.target.files[0].name;
      var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
      var ex_type = ['pdf'];
      var ex_check = this.Service.isInArray(file_exe,ex_type);
      if(ex_check) {
        this.authorizedPersonforSigning[key].authorized_personforSigning_upload = fileEvent.target.files[0].name;
        this.step4DataBodyFormFile.append('signature_'+key,fileEvent.target.files[0]);
        this.file_validation_listAuditor = true;
      }else{
        this.file_validation_listAuditor = false;
      }
    }
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

  loadTermsConditions(){
    let post: any = {};
    post['service_page_id'] = 2; // IB
    this.Service.post(this.Service.apiServerUrl+"/" + 'terms-and-conditions/', post)
      .subscribe(
        res => {
          console.log(res,'Terms data');
          let getData: any = res;
          if(getData){
            
            this.termsGeneral = getData.data[0];
            this.termsILA     = getData.data[1];
            if(this.termsGeneral != undefined && this.termsGeneral != ''){
              this.authorizationListTerms1 = this.termsGeneral.term_id;
            }
            if(this.termsILA != undefined && this.termsILA != ''){
              this.authorizationListTerms2 = this.termsILA.term_id;
            }


            //console.log(">>> ", this.termsGeneral.content, " -- ", this.termsILA.content);
          }
          
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
          if(data.trade_license != '' && data.trade_license != null){
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
          // this.step1Data.is_bod = step2['cabBodData'] != '' ? "1" : "0";
          // this.step1Data.is_hold_other_accreditation = "1";
          // this.step1Data.is_main_activity = "";
          // this.step1Data.is_main_activity_note = "";
          this.step1Data.mailing_address = data.applicant_address;
          this.step1Data.official_commercial_name = data.cab_name;
          this.step1Data.official_email = data.applicant_email;
          this.step1Data.official_website = data.applicant_website;
          this.ownOrgBasicInfo = step2['cabOwnerData'];
          //console.log(this.ownOrgBasicInfo,'ownOrgBasicInfo');
          // step2['cabBodData'].forEach((res,key) => {
          //   // //console.log(res," -- ",key);
          //   step2['cabBodData'][key].name = res.name;
          //   step2['cabBodData'][key].bod_company = res.bod_company,
          //   step2['cabBodData'][key].md_or_chief_executive = res.md_or_chief_executive != '' && res.md_or_chief_executive != undefined ? res.md_or_chief_executive : 'None';
          //   step2['cabBodData'][key].authorized_contact_person = res.authorized_contact_person;
          //   step2['cabBodData'][key].designation = res.designation;
          //   step2['cabBodData'][key].mobile_no = res.mobile_no;
          //   step2['cabBodData'][key].land_no = res.land_no != '' && res.land_no != undefined ? res.land_no : 'None';
          //   step2['cabBodData'][key].email_address = res.email != '' && res.email != undefined ?  res.email : 'None';
          // });
          step2['cabBodData'].forEach((res,key) => {
            step2['cabBodData'][key].name = res.name;
            step2['cabBodData'][key].designation = res.designation;
            step2['cabBodData'][key].relationship = res.relationship && res.relationship != undefined ? res.relationship : 'None';
            step2['cabBodData'][key].current_occupation = res.current_occupation && res.current_occupation != undefined ? res.current_occupation : 'None';
            step2['cabBodData'][key].employment = res.employment && res.employment != undefined ? res.employment : 'None';
          });
          this.bodMembInfo = step2['cabBodData'];
          this.ownOrgMembInfo = this.bodMembInfo;
          
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
            let saveStep: number;
            if(res['status'] == true && res['data'].id && res['data'].id != '') {
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

                //check steps
              if(getData.data.is_draft){

                saveStep = parseInt(getData.data.saved_step) - 1;
              }else{
                if(parseInt(getData.data.saved_step) == 9){
                  
                  saveStep = parseInt(getData.data.saved_step) - 1;
                }else{
                  
                saveStep = parseInt(getData.data.saved_step);
                }
              }
                
                // //console.log(res['data'].saved_step,"@saved step assign....");
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

                if(res['data'].is_staff_ownership != undefined){
                  this.step1Data.is_staff_ownership = res['data'].is_staff_ownership.toString();
                  if(!res['data'].is_staff_ownership){
                    this.step1Data.is_staff_ownership_note = res['data'].is_staff_ownership_note != null ? res['data'].is_staff_ownership_note.toString() : '';
                  }
                }

                if(res['data'].reg_form_issued_esma != null){
                  let getFile = res['data'].reg_form_issued_esma.toString().split('/');
                  // if(getFile.length){
                    this.id_issued_esma = getFile[4].toString().split('.')[0];
                    this.issuedEsmaPath = this.constant.mediaPath +  res['data'].reg_form_issued_esma.toString();
                    this.id_issued_esma = getFile[4];
                  // }
                }

                if(res['data'].certificate_stamp != null){
                  let getFile = res['data'].certificate_stamp.toString().split('/');
                  // if(getFile.length){
                    this.halal_certificate_stamp = getFile[4].toString().split('.')[0];
                    this.certificateStampPath = this.constant.mediaPath +  res['data'].certificate_stamp.toString();
                    this.halal_certificate_stamp = getFile[4];

                  // }
                }

                if(res['data'].legal_status != ''){
                  this.step1Data.legal_status = res['data'].legal_status;
                }
                
                // if(res['data'].ownershipOfOrg != ''){
                //   this.ownOrgBasicInfo = res['data'].ownershipOfOrg;
                // }
                
                if(res['data'].bodMember != null){
                  this.ownOrgMembInfo = res['data'].bodMember;
                }else{
                  this.ownOrgMembInfo = this.bodMembInfo;
                }

                if(res['data'].accrFormDirector != null){
                  this.managingDirector = res['data'].accrFormDirector;
                }
                
                if(res['data'].otherActivityLocations != null){
                  this.step1Data.hcab_other_loc = '1';
                  var hcab_location = res['data'].otherActivityLocations
                  var newLoaction = [];
                  for(let key in hcab_location) {
                    // console.log(hcab_location[key].value);
                    if(hcab_location[key].value.location_type) {
                      newLoaction.push(hcab_location[key].value);
                    }
                  }

                  this.hcabOtherLocation = newLoaction;

                }else{
                  this.step1Data.hcab_other_loc = '0';
                }
                
                if(res['data'].hcabOtherAccreditation != null){
                  this.accreditationInfo = res['data'].hcabOtherAccreditation;
                  this.step1Data.is_hold_other_accr = '1';
                  // is_hold_other_accreditation
                }else{
                  this.step1Data.is_hold_other_accr = '0';
                }
  
                //step2
                if(res['data'].technicalManager != undefined && res['data'].technicalManager.length > 0){
                  let getTechData: any = res['data'].technicalManager[0];
                  this.step2Data.name = getTechData.name;
                  this.step2Data.designation = getTechData.designation;
                  this.step2Data.mobile_no = getTechData.mobile_no;
                  this.step2Data.email = getTechData.email;
                  this.step2Data.relevent_experience = getTechData.relevent_experience;
                  // this.step2Data.duration_at_current_post = getTechData.duration_at_current_post;
                }

                if(res['data'].islamicAffairExpert != undefined && res['data'].islamicAffairExpert.length > 0){
                  let getMangData: any = res['data'].islamicAffairExpert[0];
                  this.step2Data.islamic_name = getMangData.name;
                  this.step2Data.islamic_designation = getMangData.designation;
                  this.step2Data.islamic_mobile_no = getMangData.mobile_no;
                  this.step2Data.islamic_email = getMangData.email;
                  this.step2Data.islamic_relevent_experience = getMangData.relevent_experience;
                  // this.step2Data.islamic_duration_at_current_post = getMangData.duration_at_current_post;
                }

                if(res['data'].qualityManager != undefined && res['data'].qualityManager.length > 0){
                  let getMangData: any = res['data'].qualityManager[0];
                  this.step2Data.management_name = getMangData.name;
                  this.step2Data.management_designation = getMangData.designation;
                  this.step2Data.management_mobile_no = getMangData.mobile_no;
                  this.step2Data.management_email = getMangData.email;
                  this.step2Data.management_relevent_experience = getMangData.relevent_experience;
                  // this.step2Data.duration_at_current_post_manager = getMangData.duration_at_current_post;
                }

                if(res['data'].summaryOfPersonnel != undefined && res['data'].summaryOfPersonnel.length > 0){
                  this.summaryDetails = res['data'].summaryOfPersonnel;
                }
  
                //step3
                //scope type options
                let cabTypeData: any = JSON.parse(getData.data.cab_type);
                //scopeCheckboxes  | checkItemOthers: boolean
                if(cabTypeData){
                  console.log(">>> Cab type: ", cabTypeData)
                    if(cabTypeData.checkItems.length){
                      this.scopeCheckboxes.forEach(rec => {
                           console.log("val: ", rec);
                           cabTypeData.checkItems.forEach(item => {
                              if(item.value == rec.label){
                                console.log(">>> Match label: ", rec.label, " :: ", item.value);
                                rec.checked = true;
                              }
                          })
                      })
                     
                    }
                    if(cabTypeData.checkItemsOthers.length){
                      this.checkItemOthers = true;
                      this.scope_options_others = cabTypeData.checkItemsOthers[0].value;
                    }
                }
                if(getData.data.scopeDetails != undefined && !this.Service.isObjectEmpty(getData.data.scopeDetails)){                 
                  let jsonObject = getData.data.scopeDetails;
                  this.editScopeData = jsonObject; 
                  console.log(">>> Saved scope: ", getData.data.scopeDetails);                 

                }
  
                //step4
                
                if(res['data'].scopeOfHalalConformity != null){
                  var halalScope = res['data'].scopeOfHalalConformity;
                  // this.ownOrgBasicInfo = res['data'].scopeOfHalalConformity;
                  for(let key in halalScope) {
                    var arr = [];
                    var value_obj = JSON.parse(halalScope[key].value);
                    arr.push(value_obj);
                  }
                  this.scopeofHalalConformity = arr;
                }

                if(res['data'].singningHalalCertificate != null){
                  this.authorizedPersonforSigning = res['data'].singningHalalCertificate;
                }


                if(res['data'].recognized_logo1 && res['data'].recognized_logo1 != ''){
                  let getFile = res['data'].recognized_logo1.toString().split('/');
                  
                  this.hcabLogo1 = getFile[4].toString().split('.')[0];
                  this.hcabLogo1Path = this.constant.mediaPath +  res['data'].recognized_logo1.toString();
                }

                if(res['data'].recognized_logo2 && res['data'].recognized_logo2 != ''){
                  let getFile = res['data'].recognized_logo2.toString().split('/');
                    this.hcabLogo2 = getFile[4].toString().split('.')[0];
                    this.hcabLogo2Path = this.constant.mediaPath +  res['data'].recognized_logo2.toString();
                }

                if(res['data'].recognized_logo3 && res['data'].recognized_logo3 != ''){
                  let getFile = res['data'].recognized_logo3.toString().split('/');
                  
                  this.hcabLogo3 = getFile[4].toString().split('.')[0];
                  this.hcabLogo2Path = this.constant.mediaPath +  res['data'].recognized_logo3.toString();
                  
                }

                //step5
                if(res['data'].is_prelim_visit != null){
                  this.step5Data.is_prelim_visit = (res['data'].is_prelim_visit) ? "1" : "0";
                  this.step5Data.prelim_visit_date = res['data'].prelim_visit_date;
                  this.step5Data.prelim_visit_time = res['data'].prelim_visit_time;
                }
                //Step 6
                if(res['data'].onBehalfApplicantDetails && res['data'].onBehalfApplicantDetails != null && res['data'].onBehalfApplicantDetails != undefined){
                  let getAuthData = res['data'].onBehalfApplicantDetails;
                  ////console.log(">>> Auth data: ", getAuthData);
                  this.step6Data.organization_name        = getAuthData.organization_name;
                  this.step6Data.representative_name      = getAuthData.representative_name;
                  this.step6Data.designation              = getAuthData.designation;
                  this.step6Data.digital_signature        = getAuthData.digital_signature;
                  this.step6Data.application_date         = getAuthData.application_date;
  
                  // Object.keys(this.authorizationList).forEach( key => { 
                  //   this.authorizationList[key] = true;
                  // })
                  // this.authorizationStatus = true;
                  // this.step5Data.recommend_visit = 'second';
                  let authList: any;
                  authList = getData.data.authorization_list;
                  // console.log("@ Auth checked status: ", authList);
                  this.authorizationList = JSON.parse(authList);
                  // console.log("# Auth checked status: ", this.authorizationList);

                  //check read ters check
                  if(this.authorizationList.authorization_confirm2){
                    this.readTermsCond       = true;
                  }
                  //check review checklist checked
                  if(this.authorizationList.undertaking_confirm2){
                    this.readReviewChecklist  = true;
                  }

                  this.recomendVisit.forEach((item, index) => {
                
                   let replace1 =  JSON.parse(getData.data.recommend_visit);//{first: false, second: true, third: true, fourth: false}; //fixed data
                    let findVsit: any = (replace1);
                    for(let key in findVsit){
                    //  console.log('>>> ', key);
                       if(key === item.name){
                        //  console.log(">>>> found: ", item, " == ", replace1[key]);
                         item.checked = findVsit[key];
                       }
                    }
                  })
                  this.step6Data.recommend_visit = this.recomendVisit;// (getData.data.recommend_visit);
                  
                  this.step6Data.recommend_year = parseInt(getData.data.recommend_year);
                }
  
                //Step 7
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

  validateFile(fileEvent: any,fileName?:any) {
    // console.log(fileName,'fileName')
    var file_name = fileEvent.target.files[0].name;
    console.log(file_name,'file_name')
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['doc','odt','pdf','rtf','docx','xlsx'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check && fileName == 'halal_certificate_stamp'){
      this.halal_certificate_stamp = fileEvent.target.files[0].name;
      this.step1DataBodyFormFile.append('certificate_stamp_file',fileEvent.target.files[0]);
      this.file_validation_halal_certificate = true;
      return true;
    }else if(!ex_check && fileName == 'halal_certificate_stamp') {
      this.file_validation_halal_certificate = false;
      return false;
    }else if(ex_check && fileName == 'id_issued_esma'){
      this.id_issued_esma = fileEvent.target.files[0].name;
      this.step1DataBodyFormFile.append('reg_form_issued_esma_file',fileEvent.target.files[0]);
      this.esma_file_validation = true;
      return true;
    }else if(!ex_check && fileName == 'id_issued_esma') {
      this.esma_file_validation = false;
      return false;
    }else if(ex_check && fileName == 'hcabLogo1'){
      this.hcabLogo1 = fileEvent.target.files[0].name;
      this.step4DataBodyFormFile.append('hcabLogo1_file',fileEvent.target.files[0]);
      this.hcabLogo1_validation = true;
      return true;
    }else if(!ex_check && fileName == 'hcabLogo1') {
      this.hcabLogo1_validation = false;
      return false;
    }else if(ex_check && fileName == 'hcabLogo2'){
      this.hcabLogo2 = fileEvent.target.files[0].name;
      this.step4DataBodyFormFile.append('hcabLogo2_file',fileEvent.target.files[0]);
      this.hcabLogo2_validation = true;
      return true;
    }else if(!ex_check && fileName == 'hcabLogo2') {
      this.hcabLogo2_validation = false;
      return false;
    }else if(ex_check && fileName == 'hcabLogo3'){
      this.hcabLogo3 = fileEvent.target.files[0].name;
      this.step4DataBodyFormFile.append('hcabLogo3_file',fileEvent.target.files[0]);
      this.hcabLogo3_validation = true;
      return true;
    }else if(!ex_check && fileName == 'hcabLogo3') {
      this.hcabLogo3_validation = false;
      return false; 
    }
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
        
  
    if(this.authorizationStatus && checkCount == 13){
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

  getPlaceName(i)
  {
    // console.log(this.scopeofHalalConformity[i].location);
    if(typeof this.scopeofHalalConformity[i].location != 'undefined')
    {
      this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.scopeofHalalConformity[i].location+'.json?access_token='+this.Service.mapboxToken+'','')
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

  filePathVreateDynamics(filePath) {
    return this.constant.mediaPath+'/media/'+filePath;
  }


  savedraftStep(stepCount) {
    if(stepCount == 'step1') {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step1 = {};
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      this.publicHalalConformityForm.saved_step = '1';
      if(this.formApplicationId > 0){
        this.step1Data.application_id = this.formApplicationId;
      }
      this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
      this.step1Data.phone_no = '';
      this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accr == '0' ? false : true;
      this.step1Data.hcab_other_location = this.step1Data.hcab_other_loc == '0' ? false : true;
      
      this.step1Data.is_draft = true;
      this.publicHalalConformityForm.step1 = this.step1Data;
  
      this.publicHalalConformityForm.step1['ownOrgBasicInfo'] = [];
      this.publicHalalConformityForm.step1['managingDirector'] = [];
      this.publicHalalConformityForm.step1['ownOrgMembInfo'] = [];
      this.publicHalalConformityForm.step1['otherActivityLocations'] = [];
      this.publicHalalConformityForm.step1['accreditationInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.publicHalalConformityForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.managingDirector) {
        this.publicHalalConformityForm.step1['managingDirector'] = this.managingDirector;
      }
      if(this.ownOrgMembInfo) {
        this.publicHalalConformityForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.hcabOtherLocation) {
        this.publicHalalConformityForm.step1['otherActivityLocations'] = this.hcabOtherLocation;
      }
      if(this.accreditationInfo) {
        this.publicHalalConformityForm.step1['accreditationInfo'] = this.accreditationInfo;
      }
      this.loader = false;
      // this.step1DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          // //console.log(res,'res')
          this.loader = true;
          if(res['status'] == true) {
            this.toastr.success('Save Draft Successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }
    if(stepCount == 'step2') {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step2 = {};
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      this.publicHalalConformityForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      
      this.step2Data.is_draft = true;
      this.publicHalalConformityForm.step2 = this.step2Data;

      this.publicHalalConformityForm.step2.technicalManager = {};
  
      this.publicHalalConformityForm.step2.technicalManager['name'] = (this.step2Data.name != '' && this.step2Data.name != undefined) ? this.step2Data.name : '';
      this.publicHalalConformityForm.step2.technicalManager['designation'] = (this.step2Data.designation != '' && this.step2Data.designation != undefined) ? this.step2Data.designation : '';
      this.publicHalalConformityForm.step2.technicalManager['mobile_no'] = (this.step2Data.mobile_no != '' && this.step2Data.mobile_no != undefined) ? this.step2Data.mobile_no : '';
      this.publicHalalConformityForm.step2.technicalManager['email'] = (this.step2Data.email != '' && this.step2Data.email != undefined) ? this.step2Data.email : '';
      this.publicHalalConformityForm.step2.technicalManager['relevent_experience'] = (this.step2Data.relevent_experience != '' && this.step2Data.relevent_experience != undefined) ? this.step2Data.relevent_experience : '';
      this.publicHalalConformityForm.step2.technicalManager['duration_at_current_post'] = (this.step2Data.duration_at_current_post != '' && this.step2Data.duration_at_current_post != undefined) ? this.step2Data.duration_at_current_post : '';
  
      this.publicHalalConformityForm.step2.qualityManager = {};
  
      this.publicHalalConformityForm.step2.qualityManager['name'] = (this.step2Data.management_name != '' && this.step2Data.management_name != undefined) ? this.step2Data.management_name : '';
      this.publicHalalConformityForm.step2.qualityManager['designation'] = (this.step2Data.management_designation != '' && this.step2Data.management_designation != undefined) ? this.step2Data.management_designation : '' ;
      this.publicHalalConformityForm.step2.qualityManager['mobile_no'] = (this.step2Data.management_mobile_no != '' && this.step2Data.management_mobile_no != undefined) ? this.step2Data.management_mobile_no : '';
      this.publicHalalConformityForm.step2.qualityManager['email'] = (this.step2Data.management_email != '' && this.step2Data.management_email != undefined) ? this.step2Data.management_email : '';
      this.publicHalalConformityForm.step2.qualityManager['relevent_experience'] = (this.step2Data.management_relevent_experience != '' && this.step2Data.management_relevent_experience != undefined) ? this.step2Data.management_relevent_experience : '';
      this.publicHalalConformityForm.step2.qualityManager['duration_at_current_post'] = (this.step2Data.duration_at_current_post_manager != '' && this.step2Data.duration_at_current_post_manager != undefined) ? this.step2Data.duration_at_current_post_manager : '';


      this.publicHalalConformityForm.step2.islamicAffair = {};
  
      this.publicHalalConformityForm.step2.islamicAffair['name'] = (this.step2Data.islamic_name != '' && this.step2Data.islamic_name != undefined) ? this.step2Data.islamic_name : '';
      this.publicHalalConformityForm.step2.islamicAffair['designation'] = (this.step2Data.islamic_designation != '' && this.step2Data.islamic_designation != undefined) ? this.step2Data.islamic_designation : '' ;
      this.publicHalalConformityForm.step2.islamicAffair['mobile_no'] = (this.step2Data.islamic_mobile_no != '' && this.step2Data.islamic_mobile_no != undefined) ? this.step2Data.islamic_mobile_no : '';
      this.publicHalalConformityForm.step2.islamicAffair['email'] = (this.step2Data.islamic_email != '' && this.step2Data.islamic_email != undefined) ? this.step2Data.islamic_email : '';
      this.publicHalalConformityForm.step2.islamicAffair['relevent_experience'] = (this.step2Data.islamic_relevent_experience != '' && this.step2Data.islamic_relevent_experience != undefined) ? this.step2Data.islamic_relevent_experience : '';
      this.publicHalalConformityForm.step2.islamicAffair['duration_at_current_post'] = (this.step2Data.islamic_duration_at_current_post != '' && this.step2Data.islamic_duration_at_current_post != undefined) ? this.step2Data.islamic_duration_at_current_post : '';
  
      this.publicHalalConformityForm.step2['summaryDetail'] = this.summaryDetails;
      
      this.loader = false;
      // this.step1DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          // //console.log(res,'res')
          this.loader = true;
          if(res['status'] == true) {
            this.toastr.success('Save Draft Successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }
    if(stepCount == 'step3') {

    }

    if(stepCount == 'step4') {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step2 = {};
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      this.publicHalalConformityForm.saved_step = '4';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      
      this.step4Data.is_draft = true;
      this.publicHalalConformityForm.step4 = this.step4Data;

      this.publicHalalConformityForm.step4['scopeOfHalalConformity'] = [];
      this.publicHalalConformityForm.step4['authorizedPersonforSigning'] = [];
      
      if(this.scopeofHalalConformity) {
        this.publicHalalConformityForm.step4['scopeOfHalalConformity'] = this.scopeofHalalConformity;
      }
      if(this.ownOrgMembInfo) {
        this.publicHalalConformityForm.step4['authorizedPersonforSigning'] = this.authorizedPersonforSigning;
      }
  
      this.step4DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      // console.log(this.step1DataBodyFormFile,'publicHalalConformityForm');
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          // //console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success('Save Draft Successfully', '');
            // this.Service.moveSteps('other_hcab_details','perlim_visit',  this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }

    if(stepCount == 'step5') {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step5 = {};
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      var applicationId = sessionStorage.getItem('applicationId');
      this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step5Data.is_prelim_visit = this.step5Data.prelim_visit_val == 0 ? false : true;
      this.step5Data.is_draft = true;
      this.publicHalalConformityForm.saved_step = '5';
      this.publicHalalConformityForm.step5 = this.step5Data;

      // //console.log(this.healthCareForm);
      this.loader = false;
      this.step5DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step5DataBodyFormFile)
      .subscribe(
        res => {
          // //console.log(res,'res')
          this.loader = true;
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }

    if(stepCount == 'step6') {
        this.publicHalalConformityForm = {};
        this.publicHalalConformityForm.step6 = {};
        this.publicHalalConformityForm.email = this.userEmail;
        this.publicHalalConformityForm.userType = this.userType;
        var applicationId = sessionStorage.getItem('applicationId');
        this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
        this.publicHalalConformityForm.saved_step = '6';
        // this.step6Data.authorizationList = this.authorizationList;
        this.step6Data.authorization_list_json = this.authorizationList;
        this.step6Data.recommend = this.recommend;
        this.step6Data.is_draft = false;
        this.step6Data.application_date = new Date();
      
        let recomVisit: any = {
          'first':false,'second':false, 'third': false, 'fourth':false
        };
        let recomCheckCount = 0;
            this.recomendVisit.forEach((item,index) => {
              if(item.checked == true){
                recomCheckCount++;
              }
          recomVisit[item.name.toString()] = item.checked;
        })
        this.step6Data.recommend = recomVisit;//this.recomendVisit;
    
        this.publicHalalConformityForm.step6 = this.step6Data;
        // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
      
        // this.step4DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
        // //console.log(this.publicHalalConformityForm,'publicHalalConformityForm');
        this.loader = false;
        this.step6DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step6DataBodyFormFile)
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
                this.toastr.success("Application Submitted Successfully");
                    setTimeout(() => {
                      this.router.navigateByUrl('/dashboard/status/all');
                    }, 5000)
              }
            }else{
              this.toastr.warning(res['msg'], '');
            }
          });
        //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
    }
  }

  onSubmitStep1(ngForm1: any){
    //this.Service.moveSteps('application_information', 'personal_information', this.headerSteps);
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
      this.step1Data.phone_no = '';
      this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
      this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accr == '0' ? false : true;
      this.step1Data.hcab_other_location = this.step1Data.hcab_other_loc == '0' ? false : true;
      
      this.publicHalalConformityForm.step1 = this.step1Data;
  
      this.publicHalalConformityForm.step1['ownOrgBasicInfo'] = [];
      this.publicHalalConformityForm.step1['managingDirector'] = [];
      this.publicHalalConformityForm.step1['ownOrgMembInfo'] = [];
      this.publicHalalConformityForm.step1['otherActivityLocations'] = [];
      this.publicHalalConformityForm.step1['accreditationInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.publicHalalConformityForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.publicHalalConformityForm.step1['managingDirector'] = this.managingDirector;
      }
      if(this.ownOrgMembInfo) {
        this.publicHalalConformityForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.hcabOtherLocation) {
        this.publicHalalConformityForm.step1['otherActivityLocations'] = this.hcabOtherLocation;
      }
      if(this.accreditationInfo) {
        this.publicHalalConformityForm.step1['accreditationInfo'] = this.accreditationInfo;
      }
      this.loader = false;
  
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      // console.log(this.step1DataBodyFormFile,'publicHalalConformityForm');
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          // //console.log(res,'res')
          this.loader = true;
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
    //this.Service.moveSteps('personal_information','scope_accreditation',  this.headerSteps);
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
  
      this.publicHalalConformityForm.step2.qualityManager = {};
  
      this.publicHalalConformityForm.step2.qualityManager['name'] = (this.step2Data.management_name != '' && this.step2Data.management_name != undefined) ? this.step2Data.management_name : '';
      this.publicHalalConformityForm.step2.qualityManager['designation'] = (this.step2Data.management_designation != '' && this.step2Data.management_designation != undefined) ? this.step2Data.management_designation : '' ;
      this.publicHalalConformityForm.step2.qualityManager['mobile_no'] = (this.step2Data.management_mobile_no != '' && this.step2Data.management_mobile_no != undefined) ? this.step2Data.management_mobile_no : '';
      this.publicHalalConformityForm.step2.qualityManager['email'] = (this.step2Data.management_email != '' && this.step2Data.management_email != undefined) ? this.step2Data.management_email : '';
      this.publicHalalConformityForm.step2.qualityManager['relevent_experience'] = (this.step2Data.management_relevent_experience != '' && this.step2Data.management_relevent_experience != undefined) ? this.step2Data.management_relevent_experience : '';
      this.publicHalalConformityForm.step2.qualityManager['duration_at_current_post'] = (this.step2Data.duration_at_current_post_manager != '' && this.step2Data.duration_at_current_post_manager != undefined) ? this.step2Data.duration_at_current_post_manager : '';


      this.publicHalalConformityForm.step2.islamicAffair = {};
  
      this.publicHalalConformityForm.step2.islamicAffair['name'] = (this.step2Data.islamic_name != '' && this.step2Data.islamic_name != undefined) ? this.step2Data.islamic_name : '';
      this.publicHalalConformityForm.step2.islamicAffair['designation'] = (this.step2Data.islamic_designation != '' && this.step2Data.islamic_designation != undefined) ? this.step2Data.islamic_designation : '' ;
      this.publicHalalConformityForm.step2.islamicAffair['mobile_no'] = (this.step2Data.islamic_mobile_no != '' && this.step2Data.islamic_mobile_no != undefined) ? this.step2Data.islamic_mobile_no : '';
      this.publicHalalConformityForm.step2.islamicAffair['email'] = (this.step2Data.islamic_email != '' && this.step2Data.islamic_email != undefined) ? this.step2Data.islamic_email : '';
      this.publicHalalConformityForm.step2.islamicAffair['relevent_experience'] = (this.step2Data.islamic_relevent_experience != '' && this.step2Data.islamic_relevent_experience != undefined) ? this.step2Data.islamic_relevent_experience : '';
      this.publicHalalConformityForm.step2.islamicAffair['duration_at_current_post'] = (this.step2Data.islamic_duration_at_current_post != '' && this.step2Data.islamic_duration_at_current_post != undefined) ? this.step2Data.islamic_duration_at_current_post : '';
  
      this.publicHalalConformityForm.step2['summaryDetail'] = this.summaryDetails;
  
      this.publicHalalConformityForm.step2.is_draft = false;
      this.publicHalalConformityForm.saved_step = 2;
      // this.publicHalalConformityForm.step3 = this.step3Data;
      this.loader = false;
      //console.log(this.publicHalalConformityForm,'publicHalalConformityForm');
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step2DataBodyFormFile)
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

  //Scope Save functions

  updateScopeData = async() => {
    let getId= (this.formApplicationId);
    let url = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+getId;
    console.log(">>>Get url and ID: ", url, " :: ", getId, " -- ");
    this.Service.getwithoutData(url)
    .subscribe(
    res => {
        let getData: any  =res;
        console.log(">>>. Data: ", getData);
        if(getData.data.scopeDetails != undefined && !this.Service.isObjectEmpty(getData.data.scopeDetails)){
          let jsonObject: any = getData.data.scopeDetails;
          this.editScopeData = jsonObject;
        }
    });
  }  
  
  continueScopeAccreditation(){
  //Reset all model data 
  this.dynamicScopeFieldColumns = {};
  this.dynamicScopeFieldType = {};
  this.dynamicScopeModel = {};
  this.fullTypeScope = [];
  this.subTypeRows = [{}];
  
  //Action for others scope data saving
    let getId= (this.formApplicationId);
    let OtherHeaders: any[] = ['category', 'standard', 'scopeScheme'];
    let url = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+getId;
    console.log(">>>Get url and ID: ", url, " :: ", getId, " -- ");
    this.Service.getwithoutData(url)
    .subscribe(
    res => {
        let getData: any  =res;
        console.log(">>>. Data: ", getData);
        let scopeOptionsCheckCount: number = 0;
          let scopeOptionsValues: any = {};
          scopeOptionsValues['checkItems'] = [];
          scopeOptionsValues['checkItemsOthers'] = [];
          this.scopeCheckboxes.forEach((item,index) => {
            let tempObj: any ={};
            if(item.checked == true){
              tempObj['value'] = item.label;
              scopeOptionsValues['checkItems'].push(tempObj);
              scopeOptionsCheckCount++;
            }
          })
          if(this.checkItemOthers){
            if(this.scope_options_others != '' && this.scope_options_others != undefined){
              scopeOptionsValues['checkItemsOthers'].push({value: this.scope_options_others});
              scopeOptionsCheckCount++;
            }            
          }
          this.step3Data.scopeOptionsCheckDetails = scopeOptionsValues;
        if(getData.data.scopeDetails != undefined && !this.Service.isObjectEmpty(getData.data.scopeDetails)){
          let jsonObject: any = getData.data.scopeDetails;
          //this.editScopeData = jsonObject;
          console.log(jsonObject);
          // let scopeOptionsCheckCount: number = 0;
          // let scopeOptionsValues: any = {};
          // scopeOptionsValues['checkItems'] = [];
          // scopeOptionsValues['checkItemsOthers'] = [];
          // this.scopeCheckboxes.forEach((item,index) => {
          //   let tempObj: any ={};
          //   if(item.checked == true){
          //     tempObj['value'] = item.label;
          //     scopeOptionsValues['checkItems'].push(tempObj);
          //     scopeOptionsCheckCount++;
          //   }
          // })
          // if(this.checkItemOthers){
          //   if(this.scope_options_others != ''){
          //     scopeOptionsValues['checkItemsOthers'].push({value: this.scope_options_others});
          //   }
          //   scopeOptionsCheckCount++;
          // }
          // this.step3Data.scopeOptionsCheckDetails = scopeOptionsValues;
          this.step3Data['scopeDetails'] = jsonObject;
  
          //saving
          this.publicHalalConformityForm = {};
          this.publicHalalConformityForm.step3 = {};  
          var applicationId = sessionStorage.getItem('applicationId');
          this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
          this.publicHalalConformityForm.step3 = this.step3Data;
         // this.publicHalalConformityForm.step3['otherActivityLocations'] = [];
          //this.publicHalalConformityForm.step3['countriesForCertification'] = [];
          this.publicHalalConformityForm.saved_step = 3;
          this.publicHalalConformityForm.step3.is_draft = false;
          
  
          console.log(">>> Step3 submit step : ", this.publicHalalConformityForm);
  
          //this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.publicHalalConformityForm,this.publicHalalConformityForm)
          this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
          //return;
          //this.step5Data = {};
          //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
          if(scopeOptionsCheckCount > 0){
            this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step3DataBodyFormFile)
            .subscribe(
              res => {
                console.log(res,'@Submit Result: ')
                if(res['status'] == true) {
                  //this.toastr.success(res['msg'], '');
                  this.Service.moveSteps('scope_accreditation', 'other_hcab_details', this.headerSteps);
                }else{
                  this.toastr.warning(res['msg'], '');
                }
              });
          }else{
            this.toastr.warning('Please Fill required field','Validation Error');
            return false; 
          }
        }else{
          this.publicHalalConformityForm = {};
          this.publicHalalConformityForm.step3 = {};  
          var applicationId = sessionStorage.getItem('applicationId');
          this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
          this.step3Data['scopeDetails'] = {};
          this.publicHalalConformityForm.step3 = this.step3Data;
          this.publicHalalConformityForm.saved_step = 3;
          this.publicHalalConformityForm.step3.is_draft = false;
          
  
          console.log(">>> Step3 submit step : ", this.publicHalalConformityForm);
  
          //this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.publicHalalConformityForm,this.publicHalalConformityForm)
          this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
          if(scopeOptionsCheckCount > 0){
            this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step3DataBodyFormFile)
            .subscribe(
              res => {
                console.log(res,'@Submit Result: ')
                if(res['status'] == true) {
                  //this.toastr.success(res['msg'], '');
                  this.Service.moveSteps('scope_accreditation', 'other_hcab_details', this.headerSteps);
                }else{
                  this.toastr.warning(res['msg'], '');
                }
              });
          }else{
            this.toastr.warning('Please Fill required field','Validation Error');
            return false; 
          }

          //this.Service.moveSteps('scope_accreditation', 'other_hcab_details', this.headerSteps);
        }
    });
  
  //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
  }
  
  backScopeAccreditation(){
  //Reset all model data 
  this.dynamicScopeFieldColumns = {};
  this.dynamicScopeFieldType = {};
  this.dynamicScopeModel = {};
  this.fullTypeScope = [];
  this.subTypeRows = [{}];
  this.Service.moveSteps('scope_accreditation', 'personal_information', this.headerSteps);
  }

  scrollPage(pageId: any){
    const el = document.getElementById(pageId);
            console.log("@Elem: ",el);
            if(el){
              el.scrollIntoView(true);    //arguement true bypass the non-exist element or undefined
            }
  }
saveScope(rowInd:  number,typeScopeId: number){
    
  let scopeValues: any =[];
  let scopeIds:any =[];
  let scopeSelValues:any =[];
  let OtherHeaders: any[] = ['category', 'standard', 'scopeScheme'];
  //console.log("dynamic ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns, " -- ", this.schemeRows, " -- ", this.formApplicationId);
  var key = '';
  var key2 = '';
  let resultAr: any={};
  let scopeCollections: any={};
  let selectScheme          = '';//this.schemeRows[0].id;
  
  //Create Heading
  //check other certifications
  // if(this.otherStandards.length > 0){
  //   scopeCollections['others'] = {};
  //   scopeCollections['others']['others'] = {};
  //   scopeCollections['others']['others']['scope_heading'] = {};
  //   scopeCollections['others']['others']['scope_value'] = [];
  // }
  if(this.fullTypeScope.length){
    this.fullTypeScope.forEach(typeScope => {
        //console.log(">>>>Type scope: ", typeScope);

      if(typeScope.id == typeScopeId){
          for(var t=rowInd;t<=rowInd; t++){

            //console.log("Scheme Sec: ", t," -- ", scopeCollections);
            selectScheme = typeScope.scopeRows[t].id;
            if(selectScheme == undefined){
              //console.log(">>Heading scheme notfff....exit", selectScheme);
              break;
            }
            let getData = typeScope.schemeData.find(rec => rec.scope_accridiation.id == selectScheme);
            //console.log("@Scheme Data: ", getData);
            let scopeTitle: string ='';
            //scopeTitle  = getData.title.toString().toLowerCase().split(" ").join('_');
            if(getData){
              scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
            }
            scopeCollections[typeScope.id] = {};
            
            scopeCollections[typeScope.id][selectScheme] = {};
            scopeCollections[typeScope.id][selectScheme]['scope_heading'] = {};
                  for(var key in this.dynamicScopeFieldColumns[typeScope.id][scopeTitle]){
                        ////console.log(">>> ", key, " :: ", this.dynamicScopeFieldColumns[key]);
                        let tempData: any = this.dynamicScopeFieldColumns[typeScope.id][scopeTitle];
                        if(typeof tempData === 'object'){
                          tempData.forEach((item,key) => {
                                ////console.log(">>>> Col items: ",item);
                                let keyIds = item[0].idVal;
                                let name = item[0].name;
                                let tempObj = {};
                                tempObj[keyIds] = name;
                                scopeCollections[typeScope.id][selectScheme]['scope_heading'][keyIds] = name;
                            });
                        }
                  }
          }
      }
    })   

  }
  //console.log(">>> build scope: ", scopeCollections, " -- ", this.dynamicScopeModel, " -> Scheme: ", this.schemeRows);
  //return;

  let secInd: number = 0;
  let resultTempAr: any = [];
  let tempDataObj: any = {};
  let tempDataRow: any = {};

  //Loop through sub type

  if(this.fullTypeScope.length){
    this.fullTypeScope.forEach(typeScope => {
      if(typeScope.id == typeScopeId){

        if(typeScope.scopeRows.length){
          
          for(var t=rowInd;t<=rowInd; t++){

              //console.log("Scheme Sec: ", t);
              secInd = t;
              selectScheme = typeScope.scopeRows[t].id;
              //let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
              let getData = typeScope.schemeData.find(rec => rec.scope_accridiation.id == selectScheme);
              //console.log("@Scheme Data: ", getData);
              if(getData == undefined){
                //console.log("scheme not selecting...exit...", selectScheme, " -- ", getData);
                break;
              }
              let scopeTitle: string ='';
              if(getData){
                scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
              }
              //scopeCollections[typeScope.id][selectScheme]   = {};
              scopeCollections[typeScope.id][selectScheme]['scope_value']     = [];
              tempDataObj[typeScope.id] = {};
              tempDataObj[typeScope.id][selectScheme] = [];
              tempDataRow = {};

              //Scope data population
              for(var key in this.dynamicScopeModel[typeScope.id][scopeTitle]){
                if(key == 'fieldLines'){
                  let rowLen = this.dynamicScopeModel[typeScope.id][scopeTitle][key].length;
                  // Browse rows
                  let getDataValues: any;
                  let getSelectValues: any;
                  //console.log("Section: ", scopeTitle, " -- ", rowLen)
                  
                  //let tempObj: any = {};
                  //let tempData: any = {};
                  let rstAr: any=[];
                  for(var k=0; k<rowLen; k++){
                    scopeIds = [];
                    scopeSelValues = [];
                    
                    //resultTempAr[k] = [];
                    let scopeRows: any = {};
                    //tempObj[selectScheme] = [];
                    //tempDataRow[k] = {};
                    tempDataRow = {};
                    //resultTempAr[k] = {};

                    this.dynamicScopeFieldColumns[typeScope.id][scopeTitle].forEach((colItem,colIndex) => {
                        //console.log("...Col>>> ",colIndex, " :: ", colItem[0], " -- ", this.dynamicScopeModel[typeScope.id][scopeTitle][key][k])
                        let colData: any = colItem[0];
                        let optionNameAr: any = [];
                        let optionName: any;
                        if(colIndex == 0){
                          //first coloumn row values - firstFieldValues
                          //console.log(">>>> First column: ");
                          let selTitle: any       = colItem[0].title;
                          let selTitleValues: any = this.dynamicScopeModel[typeScope.id][scopeTitle][key][k]['firstFieldValues'];
                          let fvalue: any         = this.dynamicScopeModel[typeScope.id][scopeTitle][key][k][selTitle];
                          let getVal: any         = selTitleValues.find(data => data.field_value.id == fvalue)
                          //console.log("<><><><> ", getVal);
                          if(getVal){                  
                            getVal = getVal.value;
                          }
                          //console.log("First field data: ", selTitleValues, " -- ", fvalue, " -- ", getVal);
                          //tempObj[selectScheme][colData.idVal] = getVal;
                          tempDataRow[colData.idVal] = getVal;
                          
                        }else{
                            //Map column key to row key values
                            
                          let selTitle: any       = colItem[0].title;
                          let selTitleVal: any    = colItem[0].values;
                          let selTitleValues: any = this.dynamicScopeModel[typeScope.id][scopeTitle][key][k][selTitleVal];
                          //console.log("@fetching col index Data: ", colIndex, " -- ", selTitle, " -- ", selTitleVal, " -- ", selTitleValues);
                          let fvalue: any         = this.dynamicScopeModel[typeScope.id][scopeTitle][key][k][selTitle];
                          //console.log(">>>Type of FVAL: ", typeof fvalue);
                          if(typeof fvalue === 'object'){
                            if(fvalue.length){
                              fvalue.forEach(dataRec => {
                                  let fval = selTitleValues.find(itemF => itemF.field_value.id == dataRec);
                                  if(fval){
                                    optionNameAr.push(fval.value);
                                  }
                              })
                            }
                            optionName = optionNameAr.join(',');
                          }else if(typeof fvalue === 'string'){
                            optionName = fvalue;
                          }
                          else if(fvalue == undefined){
                            optionName = '';
                          }
                          else{
                            let getVal: any         = selTitleValues.find(data => data.field_value.id == fvalue)
                            if(getVal){                  
                              optionName = getVal.value;
                            }
                          }
                          //console.log("Column field data: ",colIndex, " -- ", selTitleValues, " -- ", fvalue, " -- ", optionName);
                          //let tempData: any = {};
                          tempDataRow[colData.idVal] = optionName;
                          //tempObj[selectScheme].push(tempData);
                          //tempObj[selectScheme][colData.idVal] = optionName;                      
                        }                    
                    })
                    //
                    tempDataObj[typeScope.id][selectScheme].push(tempDataRow);
                  } 
                  //console.log("@updated Temp object: ", tempDataObj); 
                  // for(var p in tempDataObj){
                  //     //console.log(tempDataObj[p], " -- ", p);
                  //     resultTempAr.push(tempDataObj[p]);
                  // }
                  scopeCollections[typeScope.id][selectScheme]['scope_value'] =  tempDataObj[typeScope.id][selectScheme];//resultTempAr[0];
                  //console.log(">>>> Result Ar: ", scopeCollections);
                }
              }
          }
        }
      }
    })

    

  }

  //Update scope data
  if(this.editScopeData != undefined && this.editScopeData != null){
      //console.log("update edit scope: ", this.editScopeData, " -- ", scopeCollections)
      let tempScopeDetails: any={};
      let checkMatch: boolean = false;
      let checkTypeMatch: boolean = false;  

            for(var key in this.editScopeData){
              //console.log(">>> ", key, " :: ", this.editScopeData[key]);

              checkTypeMatch = this.getMatchSubType(key, scopeCollections);
              //console.log("@@@ Finding sub type status...", key, " -- ", checkTypeMatch, " -- ", scopeCollections[key], " -- ", this.editScopeData[key]);
              if(checkTypeMatch){
                //Match Type
                if(this.editScopeData[key] != undefined &&  typeof this.editScopeData[key] == 'object'){
                      //Loop through scheme data
                      for(var keySchme in this.editScopeData[key]){
                        checkMatch = this.getMatchScheme(keySchme, scopeCollections[key]);    //Scheme Mathch
                        //console.log("@@@ Finding schme status...", keySchme, " :: ", checkMatch);
                        if(checkMatch){
                          //console.log("#>>> Find scheme in edit scope and update/marge...");
                          this.editScopeData[key][keySchme]['scope_value'].forEach((item, p) => {
                            scopeCollections[key][keySchme]['scope_value'].push(this.editScopeData[key][keySchme]['scope_value'][p])
                          })
                          //scopeCollections[key]['scope_value'].push(this.editScopeData[key]['scope_value']);
                        }else{
                          //console.log("@>>> Not Found scheme in edit scope and update and marge...");
                          scopeCollections[key][keySchme] = {};
                          scopeCollections[key][keySchme]['scope_heading']  = {};
                          scopeCollections[key][keySchme]['scope_heading']  = this.editScopeData[key][keySchme]['scope_heading'];
                          scopeCollections[key][keySchme]['scope_value']    = [];
                          scopeCollections[key][keySchme]['scope_value']    = this.editScopeData[key][keySchme]['scope_value']
                        }
                      }
                }
              }else{
                //New Type added
                //console.log("<><><>>>>>> not match adding: ", this.editScopeData[key]);
                if(key != null && key != 'null' && key != undefined){
                  //console.log(">>>>> Enetr cond..............");
                  scopeCollections[key] = {};
               scopeCollections[key] = this.editScopeData[key];
                }
                
              }

            }
      //filter scope collections
      //console.log(">> Fileter collection...", scopeCollections);
      var type: any;
      for(type in scopeCollections){
        //console.log(">>> browse Type: ", type, " :: ", scopeCollections[type]);
          if(type > 0){
            for(var p in scopeCollections[type]){
              if(scopeCollections[type][p]){
                  let getDetails: any = scopeCollections[type][p]['scope_value'];
                  //console.log(">>>Value: ", p, " -- ", getDetails, " -- ", getDetails.length);
                  if(getDetails.length == 0){
                    //console.log(">>>Empty values: ", p, " deleting");
                    delete scopeCollections[type][p];
                  }
              }
            }
          }
      }                
  }


  //console.log("#Updated Scope after edit: ", scopeCollections, " -- ", this.editScopeData);
  this.step3Data['scopeDetails']    = scopeCollections;
  //return;
}
//scopeCollections[selectScheme]['scope_heading'][keyIds]  //assign scope heading
//scopeCollections[selectScheme]['scope_value'] //assign unmatch scope value
getMatchSubType(typeId: any, scopeData: any){
  //console.log("@@@ Finding sub type...");
  for(var key in scopeData){
    //console.log("# Finding type...", key, " -- ", typeId);
      if(key == typeId){
        return true;
      }
  }
  return false;
}

getMatchScheme(scId: any, scopeData: any){
  //console.log("@@@ Finding schme...");
  for(var key in scopeData){
    //console.log("# Finding schme...", key, " -- ", scId);
      if(key == scId){
        return true;
      }
  }
  return false;
}

  onSubmitStep3(ngForm: any, type?:any, rowInd?: any, typeScopeId?: number) {
    
    //this.Service.moveSteps('scope_accreditation','other_hcab_details',  this.headerSteps);

    
    //this.saveScope();
    //console.log(">>>Enter....1:  ", type)
    this.publicHalalConformityForm = {};
    this.publicHalalConformityForm.step3 = {};  
    var applicationId = sessionStorage.getItem('applicationId');
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    //this.publicHalalConformityForm.step5.application_id = this.formApplicationId;
    //alert(">>>> calling.....1");
    //validation s for other checkboxes
    let scopeOptionsCheckCount: number = 0;
    let scopeOptionsValues: any = {};
    scopeOptionsValues['checkItems'] = [];
    scopeOptionsValues['checkItemsOthers'] = [];
    this.scopeCheckboxes.forEach((item,index) => {
      let tempObj: any ={};
      if(item.checked == true){
        tempObj['value'] = item.label;
        scopeOptionsValues['checkItems'].push(tempObj);
        scopeOptionsCheckCount++;
      }
    })
    if(this.checkItemOthers){
      if(this.scope_options_others != ''){
        scopeOptionsValues['checkItemsOthers'].push({value: this.scope_options_others});
      }
      scopeOptionsCheckCount++;
    }
    this.step3Data.scopeOptionsCheckDetails = scopeOptionsValues;
    //alert(">>>> calling.....2");

    this.publicHalalConformityForm.step3 = this.step3Data;
    //this.publicHalalConformityForm.step5['cbsOtherActivity'] = [];
    // this.publicHalalConformityForm.step3['otherActivityLocations'] = [];
    // this.publicHalalConformityForm.step3['countriesForCertification'] = [];
    // this.publicHalalConformityForm.step3['otherActivityLocations'] = [];
    // this.publicHalalConformityForm.step3['countriesForCertification'] = [];
    
    // if(this.cbsOtherActivity) {
    //   this.publicHalalConformityForm.step3['otherActivityLocations'] = this.cbsOtherActivity;
    // }
    // if(this.nameOfCountry) {
    //   this.publicHalalConformityForm.step3['countriesForCertification'] = this.nameOfCountry;
    // }

    this.publicHalalConformityForm.step3['scheme_id'] = 1;//this.schemeRows[0].id;
    
    //Check dynamic model column fields validation
    let secInd: number;
    let selectScheme: any;
    let errorScope: boolean = false;
    if(this.fullTypeScope.length){
      this.fullTypeScope.forEach(typeScope => {
  
        if(typeScope.id == typeScopeId){
          console.log("@.....field dynamic validation.........");
          for(var t=rowInd;t<=rowInd; t++){
          secInd = t;
          selectScheme = typeScope.scopeRows[t].id;;//this.schemeRows[t].id;
         // let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
         let getData = typeScope.schemeData.find(rec => rec.scope_accridiation.id == selectScheme);
          ////console.log("@Scheme Data: ", getData);
            let scopeTitle: string ='';
              if(getData){
                scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
              }
              for(var key in this.dynamicScopeModel[typeScope.id][scopeTitle]){
                if(key == 'fieldLines'){
                  let rowLen = this.dynamicScopeModel[typeScope.id][scopeTitle][key].length;
                  // Browse rows
                  ////console.log("Section: ", scopeTitle, " -- ", rowLen)                
                  for(var k=0; k<rowLen; k++){
                      this.dynamicScopeFieldColumns[typeScope.id][scopeTitle].forEach((colItem,colIndex) => {
                            let fieldSelValue: any;
                            let selTitle: any       = colItem[0].title;
                            fieldSelValue         = this.dynamicScopeModel[typeScope.id][scopeTitle][key][k][selTitle];
                            ////console.log(">>> ", scopeTitle, " :: ", selTitle, " -- ", fieldSelValue);
                            if(fieldSelValue === undefined || fieldSelValue == ''){
                              errorScope = true;
                            }
                      })
                  }
                }
              }
            }
          }
        });
    }
    //}
    if(errorScope){
      this.toastr.warning('Please Fill required field','Validation Error');
      return false;    
    }
    //Check dynamic model column fields validation

    //alert(">>>> calling.....3");
    ////console.log("scheme Rows: ", this.schemeRows,  " -- ", this.schemeRows.length, " :: ", this.editScopeData, " :: ", this.getScopeData);

    ////console.log(">>>Form Submit: ", ngForm, " -- ",ngForm.form, " -- ", this.schemeRows); 
    
    //ngForm.form.valid &&
    //&& this.schemeRows.length == 1   && this.schemeRows[0].id === undefined
    if(!ngForm.form.valid && type == undefined  && this.subTypeRows.length == 1   && this.subTypeRows[0].id === undefined
        && this.editScopeData != undefined && this.editScopeData != null) {
      //console.log(">>>Bypass saving...");
      //console.log(">>>Enter....2")
      this.saveScope(rowInd, typeScopeId);
      //console.log(">>> step5 submit...", this.step3Data, " -- ", this.publicHalalConformityForm);
      this.publicHalalConformityForm.step3.is_draft = false;
      this.publicHalalConformityForm.saved_step = 3;
      this.step5Data = {};
      //alert(">>>> calling.....5");
      console.log(">>> step3 submit...", this.step3Data, " -- ", this.publicHalalConformityForm);
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
    //return;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          //////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('scope_accreditation', 'other_hcab_details', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }//&& scopeOptionsCheckCount > 0
    else if(ngForm.form.valid && type == undefined ) {
      console.log(">>>Scope saving...");
      console.log(">>>Enter....3")
      this.saveScope(rowInd, typeScopeId);
      //console.log(">>> step5 submit...", this.step3Data, " -- ", this.publicHalalConformityForm);
      this.publicHalalConformityForm.step3.is_draft = false;
      this.publicHalalConformityForm.saved_step = 3;
      console.log(">>> step3 submit...5", this.step3Data, " -- ", this.publicHalalConformityForm);
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      //return;
      //this.step5Data = {};
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step3DataBodyFormFile)
      .subscribe(
        async res => {
          //////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');

            await this.updateScopeData();

            //this.Service.moveSteps('scope_accreditation', 'other_hcab_details', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }
    else if( type != undefined && type == true){
      //console.log(">>>Enter....4")
      this.publicHalalConformityForm.step3.is_draft = true;
      this.publicHalalConformityForm.saved_step = 5;
      this.saveScope(rowInd, typeScopeId);
      console.log(">>> save a draft step3 submit...6", this.step3Data, " -- ", this.publicHalalConformityForm);
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.publicHalalConformityForm)
      .subscribe(
        res => {
          //////console.log(res,'res')
          this.step5Data = {};
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.toastr.success('Save Draft Successfully', '');
            //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
            // setTimeout(()=> {
            //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
            // },2000) 
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      //console.log(">>>...");
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitStep4(ngForm4: any, type?:any) {
    
    //this.Service.moveSteps('other_hcab_details','perlim_visit',  this.headerSteps);

    if(ngForm4.form.valid) {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step4 = {};
      this.publicHalalConformityForm.saved_step = '4';
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      var applicationId = sessionStorage.getItem('applicationId');
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step4Data.is_draft = false;
      this.publicHalalConformityForm.step4 = this.step4Data;
  
      this.publicHalalConformityForm.step4['scopeOfHalalConformity'] = [];
      this.publicHalalConformityForm.step4['authorizedPersonforSigning'] = [];
      
      if(this.scopeofHalalConformity) {
        this.publicHalalConformityForm.step4['scopeOfHalalConformity'] = this.scopeofHalalConformity;
      }
      if(this.ownOrgMembInfo) {
        this.publicHalalConformityForm.step4['authorizedPersonforSigning'] = this.authorizedPersonforSigning;
      }
  
      this.loader = false;
      this.step4DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      // console.log(this.step1DataBodyFormFile,'publicHalalConformityForm');
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          // //console.log(res,'res')
          this.loader = true;
          if(res['status'] == true) {
            // this.toastr.success(res['msg'], '');
            this.Service.moveSteps('other_hcab_details','perlim_visit',  this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else {
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep5(ngForm5: any){
    //this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    if(ngForm5.form.valid) {
      this.publicHalalConformityForm = {};
      this.publicHalalConformityForm.step5 = {};
      this.publicHalalConformityForm.saved_step = '5';
      this.publicHalalConformityForm.email = this.userEmail;
      this.publicHalalConformityForm.userType = this.userType;
      var applicationId = sessionStorage.getItem('applicationId');
      this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step5Data.is_prelim_visit = this.step5Data.is_prelim_visit == 0 ? false : true;
      this.step5Data.is_draft = false;
      this.publicHalalConformityForm.step5 = this.step5Data;
  
      //console.log(this.publicHalalConformityForm);
      // this.step5DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.loader = false;
      this.step5DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step5DataBodyFormFile)
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
    //this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);
    this.isApplicationSubmitted = true;
    let checkCount = 0;
      for(let key in this.authorizationList) {
        ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
        if(this.authorizationList[key]) {  
          this.authorizationStatus = true;       
          checkCount++;
        }    
      }
      if(this.authorizationStatus && checkCount == 13){
        this.authorizationStatus = true;
      }else{
        this.authorizationStatus = false;
      }
  
      //console.log(">>> Check status count: ", checkCount);
  
  if(ngForm6.form.valid && this.authorizationStatus == true){
  
    this.publicHalalConformityForm = {};
    this.publicHalalConformityForm.step6 = {};
    this.publicHalalConformityForm.email = this.userEmail;
    this.publicHalalConformityForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.publicHalalConformityForm.saved_step = '6';
    this.publicHalalConformityForm.step6.terms1 = this.authorizationListTerms1;
    this.publicHalalConformityForm.step6.terms2 = this.authorizationListTerms2;
    // this.step6Data.authorizationList = this.authorizationList;
    this.step6Data.authorization_list_json = this.authorizationList;
    this.step6Data.recommend = this.recommend;
    this.step6Data.is_draft = false;
    this.step6Data.application_date = new Date();
  
    let recomVisit: any = {
      'first':false,'second':false, 'third': false, 'fourth':false
    };
    let recomCheckCount = 0;
        this.recomendVisit.forEach((item,index) => {
          if(item.checked == true){
            recomCheckCount++;
          }
      recomVisit[item.name.toString()] = item.checked;
    })
    this.step6Data.recommend = recomVisit;//this.recomendVisit;

    this.publicHalalConformityForm.step6 = this.step6Data;
    // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
  
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
    // //console.log(this.publicHalalConformityForm,'publicHalalConformityForm');
    this.loader = false;
    this.step6DataBodyFormFile.append('data',JSON.stringify(this.publicHalalConformityForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.halalConfirmity,this.step6DataBodyFormFile)
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
            this.toastr.success("Application Submitted Successfully");
                setTimeout(() => {
                  this.router.navigateByUrl('/dashboard/status/all');
                }, 5000)
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
  // this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
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
  this.voucherFile.append('is_draft', false);
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

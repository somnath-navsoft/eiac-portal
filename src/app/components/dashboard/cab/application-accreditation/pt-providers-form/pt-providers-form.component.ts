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
import {CustomModalComponent} from '../../../../utility/custom-modal/custom-modal.component';

@Component({
  selector: 'app-pt-providers-form',
  templateUrl: './pt-providers-form.component.html',
  styleUrls: ['./pt-providers-form.component.scss'],
  providers: [CustomModalComponent]
})
export class PtProvidersFormComponent implements OnInit {

  public newRow: any = {};
  public ptProvidersForm: any = {};
  public ptProvidersFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [];
  public ownOrgMembInfo: Array<any> = [];
  public proficiencyTesting: Array<any> = [{}];
  public scopeForCalibration: Array<any> = [];
  public scopeForTesting: Array<any> = [];
  public scopeForMedical: Array<any> = [];

  isPrelimSubmitted: boolean = false;

  public accreditationInfo: Array<any> = [{}];
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

  authorizationListTerms1: any;
  authorizationListTerms2: any;

  recomendVisit: any[] = [];
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
  paymentReceiptValidation:boolean = false;
  recommendYearValues: any[] = [];

  paymentStepComp: boolean = false;

  //Scope data declarations
  dynamicScopeModel:any         = {};   //Master form data object
  dynamicScopeFieldColumns:any  = {};  
  dynamicScopeFieldType:any     = {}; 
  criteriaMaster: any[]         = [];
  fullScope:any[]=[];
  schemeRows: Array<any> = [{}];
  editScopeData: any;
  selectDeleteID: number =0;
  selectDeleteKey: any;
  selectDeleteIndex: any;
  deleteEditScopeConfirm: boolean = false;
  deleteScopeConfirm: boolean = false;
  deleteRowConfirm: boolean = false;
  aboutSubContractors:Array<any> = [{}];

  constructor(public Service: AppService, public constant:Constants, private _customModal: CustomModalComponent,
    public router: Router,public toastr: ToastrService,private modalService: NgbModal,public sanitizer:DomSanitizer,public _trainerService:TrainerService) { }

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
          this.criteriaMaster = res['data']['schemes'];
          this.criteriaList = res['data']['criteriaList'];
          console.log("#Get criteria: ", this.criteriaMaster);
          if(this.criteriaList.length == 1){
            this.step1Data.criteria_request = this.criteriaList[0].code;
            }
  
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
            // if(getData.data[0] != undefined && getData.data[0].title == "Accreditation Agreement"){
            //   this.termsGeneral = getData.data[0];
            // }
            getData.data.forEach(item =>{
              if(item.title != undefined && item.title == "Accreditation Agreement"){
                this.termsGeneral = item;
              }
            })
            
            //this.termsILA     = getData.data[1];
             

            if(this.termsGeneral != undefined && this.termsGeneral != ''){
              this.authorizationListTerms1 = this.termsGeneral.term_id;
            }
            // if(this.termsILA != undefined && this.termsILA != ''){
            //   this.authorizationListTerms2 = this.termsILA.term_id;
            // }
 
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
   window.scrollTo(0,0);
   this.loadData();
   this.loadAppInfo();
   this.loadCountryStateCity();
   this.loadTermsConditions();
   //this.checkCaptchaValidation = false;
   this.loader = false;

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
      title:'personal_information', desc:'2. Personnel Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
      },
      {
      title:'information_audit_management', desc:'3. Internal Audit & MRM Date', activeStep:false, stepComp:false, icon:'icon-task', activeClass:''
      },
      {
        title:'scope_accreditation', desc:'4. Accreditation Scope', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
      },
      {
      title:'about_subcontractors', desc:'5. About Subcontractors', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
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
    //
    //undertaking_confirmTop3: false
    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  
      undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,
      undertaking_confirm8: false,undertaking_confirm9: false,
      undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false};
 }

 openDialog(delKey: any, delIndex: any){
  ////console.log(">>>delete ", delKey, " -- ", delIndex);
  if(delKey){
    ////console.log("assign delete id: ", delIndex, " -- ", delKey);
    this.selectDeleteIndex = delIndex;
    this.selectDeleteKey = delKey;
    this.deleteRowConfirm = true;
  } 
}


/**************************
 * 
 * SCOPE FUNCTIONS
 * 
 * ***********************/ 
getSchme(sid: number){
  let getSchemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
  //////console.log("data: ", getSchemeData);
  if(getSchemeData){
    return getSchemeData.title;
  }
}
deleteScopeData(schemId: any, deleteIndex: number){
  ////console.log("deleting...", schemId, " -- ", deleteIndex);
  let savedData: any = this.editScopeData;
  ////console.log("saveData: ", savedData);

  for(var key in savedData){
      ////console.log(">>> ", key, " :: ", savedData[key]);
      if(key === schemId){
        let getvalues: any =  savedData[key].scope_value;
        ////console.log("<<< Found: ", getvalues);
        if(typeof getvalues === 'object'){
          ////console.log("deleting...");
          getvalues.splice(deleteIndex, 1);
        }
      }
  }
  let scopeCollections: any = this.editScopeData;
  for(var p in scopeCollections){
    if(scopeCollections[p]){
        let getDetails: any = scopeCollections[p]['scope_value'];
        console.log(">>>Value: ", p, " -- ", getDetails, " -- ");
        if(getDetails != undefined && getDetails.length == 0){
          //////console.log(">>>Empty values: ", p, " deleting");
          delete scopeCollections[p];
        }
    }
  }
      
      //save to server at time
      this.step5Data = {};
      this.step5Data['scopeDetails']    = this.editScopeData;
      this.ptProvidersForm = {};
      this.ptProvidersForm.step5 = {};
      this.ptProvidersForm.step5 = this.step5Data;
      this.ptProvidersForm.step5.is_draft = false;
      this.ptProvidersForm.saved_step = 5;
      this.ptProvidersForm.step5.application_id = this.formApplicationId;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
      .subscribe(
        res => {
          if(res['status'] == true) {
            //this.toastr.success("Saved scope updated...", '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });


  this._customModal.closeDialog();
}
openDeleteScopeConfirm(delIndex: any, delKey: any){
  ////console.log(">>>delete ", delKey, " -- ", delIndex);
  if(delKey){
    ////console.log("assign delete id: ", delIndex, " -- ", delKey);
    this.selectDeleteIndex = delIndex;
    this.selectDeleteKey = delKey;
    this.deleteScopeConfirm = true;
  } 
}

openDeleteEditScopeConfirm(delIndex: number, delKey: any){
  ////console.log(">>>delete ", delKey);
  if(delKey){
    ////console.log("assign delete id: ", delIndex, " -- ", delIndex);
    this.selectDeleteIndex = delIndex;
    this.selectDeleteKey = delKey;
    this.deleteEditScopeConfirm = true;
  } 
}
removeScopeLine(lineIndex: number, secIndex: any){
  //////console.log("deleting rows....1: ", this.dynamicScopeModel, " -- ", lineIndex, " :: ", secIndex);
  if(this.dynamicScopeModel[secIndex].fieldLines != undefined && this.dynamicScopeModel[secIndex].fieldLines.length > 0){
    //////console.log("deleting rows....2");
    this.dynamicScopeModel[secIndex].fieldLines.splice(lineIndex, 1);
  }
  this._customModal.closeDialog();
}

//addScopeLine(secName:any, secIndex: number, lineIndex: number, lineData: any){
addScopeLine(lineIndex: number,secIndex: any, lineData: any){
let line     =   {};    
console.log("@ADD ROW - Total line: ", lineData, " - ", lineIndex, " == ", lineData.length, " --Model: ", this.dynamicScopeModel);
if(lineData != undefined && lineData.length > 0){
  lineIndex  = lineData.length;
}
for(var key in this.dynamicScopeModel[secIndex]){
    console.log("Key: ", key , " :: ", this.dynamicScopeModel[secIndex][key]);
    let getValue: any = 0;
    //if( key === secName ){
      if(this.dynamicScopeModel[secIndex].fieldLines != undefined){
        let fieldValues = this.dynamicScopeModel[secIndex].fieldLines[0].firstFieldValues;
        
        console.log("@ADD ROW - Fieldvalues:: ", fieldValues);
        if(fieldValues != undefined){
          line['firstFieldValues'] = fieldValues;
        }        
        this.dynamicScopeModel[secIndex].fieldLines.push(line);
        if(fieldValues != undefined && fieldValues.length > 0 && typeof fieldValues[0] === "object" && fieldValues[0].field_value != undefined){
          getValue = fieldValues[0].field_value.id;
        }
        console.log('@ADD ROW - Calling on change...', getValue, " -- ", secIndex, " Lineindex: ", lineIndex);
        
        this.dynamicScopeFieldColumns[secIndex].forEach((recCol, keyCol) => {
          ////////////console.log(" > >>   ", keyCol)
          if(keyCol === 0 && getValue != undefined && getValue > 0){
            let getModelKey = recCol[0].title;
            console.log(" >>>>>ModelKey ",getModelKey, " --- FindValue:  ", getValue, " --- ");
            this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][0][0].values] = fieldValues;
            if(getValue != undefined && getValue > 0){
              this.dynamicScopeModel[secIndex].fieldLines[lineIndex][getModelKey] = getValue;
            }
            this.onChangeScopeOption(getValue,secIndex,lineIndex,0,'initLoad');
          }
        });
      }
    //}
}    
////////console.log("Add Line status: ", this.dynamicScopeModel);
}
addSchemeRow(obj: any = [],index: number){
  ////console.log(">>> ", obj);
  this.newRow     =   {};
  obj.push(this.newRow);
  //this.getCriteria(this.step5Data.scheme_ids[index], index);
}
removeSchemeRow(obj: any = [],index: number){
  obj.splice(index, 1);  //not deleting...
  //////console.log("compare object: 1 ", this.schemeRows, " ::: ",  this.step5Data.scheme_ids);
  //this.schemeRows.splice(index, 1);
  //////console.log("compare object: 2 ", this.schemeRows, " ::: ", this.fullScope, " -- index: ", index);
  let sectionTitle: string = '';
  let fullscopeData: any = this.fullScope[index];
  if(fullscopeData){
    sectionTitle = fullscopeData.title;
  }
  ////console.log("find section...", sectionTitle);

  if(this.fullScope[index] != undefined && !this.Service.isObjectEmpty(this.fullScope[index])){
    //////console.log("removing ...fullscope....", index, " :: ", this.fullScope[index]);
    this.fullScope.splice(index, 1)
  }
  if(this.dynamicScopeFieldType[sectionTitle] != undefined && !this.Service.isObjectEmpty(this.dynamicScopeFieldType[sectionTitle])){
    ////console.log("removing ...fieldType....1", index, " :: ", this.dynamicScopeFieldType);
    //this.dynamicScopeFieldType.splice(index, 1);
    delete this.dynamicScopeFieldType[sectionTitle];
    //////console.log("removing ...fieldType....2", this.schemeRows,  " --",this.fullScope, " :: ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);
  }
  if(this.dynamicScopeModel[sectionTitle] != undefined && !this.Service.isObjectEmpty(this.dynamicScopeModel[sectionTitle])){
    delete this.dynamicScopeModel[sectionTitle];
  }

  ////console.log(">>>After delete scheme: ", "Full Scope: ", this.fullScope, " :FieldType: ", this.dynamicScopeFieldType, " :Model: ", this.dynamicScopeModel);

}
onChangeScopeOption(getValues: any,secIndex: any, lineIndex: number, columnIndex: number, type?:string) {
  //////console.log('@GET Options: ', getValues, " :: ",  lineIndex, " -- ", type, " -- ", columnIndex, " --sec--  ", secIndex);

  let selectValue: any;
  if(type === undefined){
    selectValue = getValues.value;
  }
  if(type !== undefined && type === 'initLoad'){
    selectValue = getValues;
  }
  let url = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data;
  ////console.log("option change value: ", url, " :: ", getValues, " -- ", selectValue, " -- Type: ", typeof selectValue);
  //this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,
  let jsonReq: any = {};
  if(typeof selectValue === 'number'){
    jsonReq['value_id'] = [selectValue];
  }
  if(typeof selectValue === 'object'){
    for(var k in selectValue){
        ////console.log(">>Loop value: ", selectValue[k], " :: ", k);
        if(typeof selectValue[k] === 'string'){
          return;
        }
    }
    jsonReq['value_id'] = selectValue;
  }
  this.Service.put(url,jsonReq)
  .subscribe(
    record => {
        //////console.log("Load scope SErvice Data: ", record, " -- ", this.dynamicScopeFieldColumns[secIndex],  " - ", this.dynamicScopeModel);
        //get through array find key column
        if(record['scopeValue'].length == undefined){
          record['scopeValue'] = [];
        }
        let theColumnIndex  = columnIndex;
        let nextColumnIndex = theColumnIndex + 1;
        let totSecColumn    = this.dynamicScopeFieldColumns[secIndex].length;//this.dynamicScopeFieldColumns[secIndex].length;
        //////console.log(">>>Column Data: ", theColumnIndex, " -- ", nextColumnIndex, " -- ", totSecColumn, " -- ", );
        ////console.log("select scope values: ", record['scopeValue'], " :: ", this.dynamicScopeFieldType[secIndex], " len: ", record['scopeValue'].length);

        // if(this.dynamicScopeFieldType[secIndex].length && typeof this.dynamicScopeFieldType[secIndex][theColumnIndex] === 'object'){
        //       let colDef: string = this.dynamicScopeFieldType[secIndex][nextColumnIndex].defValue
        //       ////console.log("column values: ",theColumnIndex, " :: ",  colDef);
        // } 

        //Auto selected for one item dropdown
        if(record['scopeValue'].length > 0 && record['scopeValue'].length == 1){
            ////console.log(">>>dep scope data: ", record['scopeValue']);
            let getSelValue = 0;
            if(typeof record['scopeValue'][0] === 'object'){                  
              getSelValue = record['scopeValue'][0].field_value.id;
              ////console.log(">>assigning scope default value: ", getSelValue);
              this.dynamicScopeModel[secIndex].fieldLines[lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex][0].title] = getSelValue;
              this.onChangeScopeOption(getSelValue,secIndex,lineIndex,nextColumnIndex,'initLoad');
            }
        }

        //
        //unique value set
        // let tempFilter = record['scopeValue'];
        // let uniqueSet: any = [...new Set(tempFilter.map(item => (item.value != '') ? item.value : ''))];
        // uniqueSet.sort((a, b) => (a > b) ? 1 : -1);
        // record['scopeValue'] = uniqueSet;
        if(nextColumnIndex > 0 && nextColumnIndex < totSecColumn){
            //Get ridge of the values
            //////console.log("field columns: ", this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][0].values] , " :: ");
            let colDef: string = this.dynamicScopeFieldType[secIndex][nextColumnIndex].defValue                                                       

            if(colDef === "None" || colDef === null){
              ////console.log("#Get value....1: ", record['scopeValue'])
              //check duplicate scope values
              let scopValues: any = record['scopeValue'];
              var resultUniq = scopValues.reduce((unique, o) => {
                if(!unique.some(obj => obj.value === o.value)) {
                  unique.push(o);
                }
                return unique;
            },[]);
              //console.log(">>> Filter results:1 ",resultUniq);
              this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex][0].values] = resultUniq;//record['scopeValue'];
            }
            if(colDef != "None" && colDef != null){
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
              //console.log("@get value: ", colTempAr);
              this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex][0].values] = colTempAr;
            }
            //this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
            //this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
            //this.dynamicScopeModel[secName].fieldLines[lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
            ////////console.log(">>>>Model column: ", this.dynamicScopeModel);
        }
      //console.log("@@@Updated Model Values: ", this.dynamicScopeModel);
    });
}
getCriteria(value, secInd: any){
  //////console.log("select Criteris: ", value, " -- ", secInd);
  //this.scopeDataLoad = true;
  let duplicateScheme: boolean = false;
  if(value != undefined && value > 0){
     //Get fullscope
     //let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.criteriaIdByScope + value;
     //this.Service.apiServerUrl+"/"
     //value =18;
     let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data+"?scheme="+value;
     //this.constant.API_ENDPOINT.criteriaScope + value;
     ////////console.log("API: ", apiURL);

     //this.fullScope = [];
     //this.dynamicScopeModel = [];
     //this.dynamicScopeFieldColumns = [];

    //  this.dynamicScopeFieldColumns[secInd] = [];
    //  this.dynamicScopeFieldType[secInd] = [];
    //  this.dynamicScopeModel[secInd] = {};

     this.Service.getwithoutData(apiURL).subscribe(record => {
          //////console.log('Fullscope: ', record);
          let dataScope:any = [];
          let fieldTitleValue: any = [];
          dataScope = record['data'];
          //this.scopeDataLoad = false;
          let customKey;
          if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
            let firstColumValues = dataScope.firstColumnData[0];
            ////////console.log(">>Firstcolumn: ", firstColumValues);
            //this.fullScope.push(dataScope.scopeValue);              
            //title: "lifting_equipment", id:1, name:"Lifting Equipment"
            // this.fullScope = [{
            //   title: scopeTitle, id:1, name:scopeName
            // }];//dataScope.schemes;
            //////console.log(">>> Fined Scope Section: ", this.fullScope, " -- ", this.step5Data.scheme_ids);
          }
          let scopeName: string = '';
            let scopeTitle: string ='';
            let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == value);
            //////console.log(">>> Fined Scheme: ", getData);
            if(getData){
              scopeName   = getData.title;
              scopeTitle  = getData.title.toString().toLowerCase().split(" ").join('_');

              //check already existing scheme...
              this.fullScope.forEach((item, index) => {
                console.log(item.title, " :: ", scopeTitle);
                if(item.title == scopeTitle){
                  duplicateScheme = true;
                  this.toastr.warning("Duplicate Scheme!","Validation")
                  return;
                }
            })
              // for(var m in this.dynamicScopeModel){
              //   ////console.log("mkey: ", m, " -- ", scopeTitle);
              //     //let fobj: any = this.fullScope;
              //     if(m === scopeTitle){
              //       this.fullScope.splice(secInd, 1);
              //       this.toastr.error("Scheme should be unique, Please check.","Validation")
              //       return;
              //     }
              // }

            if(!duplicateScheme){
                    this.dynamicScopeFieldColumns[scopeTitle] = [];
                    this.dynamicScopeFieldType[scopeTitle] = [];
                    this.dynamicScopeModel[scopeTitle] = {};

                    if(this.fullScope.length){
                        //////console.log("@Existing scheme....1");
                        //let findSchme = this.fullScope.find(item => item.id == value);
                        ////////console.log("@Existing scheme....2", findSchme);
                        let pushObj: any = {
                          title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                        }
                        
                        if(this.fullScope[secInd] != undefined && !this.Service.isObjectEmpty(this.fullScope[secInd])){
                          //////console.log("@Existing scheme...found", this.fullScope[secInd]);
                          this.fullScope[secInd] = pushObj;
                        }else{
                            this.fullScope.push({
                              title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                            });
                        }
                    }else{
                    this.fullScope.push({
                        title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                      });
                    }

              }
            }

          if(dataScope.scopeValue.length){
            var counter = 0;let defLine = {};
            dataScope.scopeValue.forEach((rec, key) => {
              console.log("--Scope ", rec, " :: ", key);

              if(rec.scope != undefined && typeof rec.scope === 'object' && !this.Service.isObjectEmpty(rec.scope)){
                  let fieldType: any = {
                     id: rec.scope.id,
                     title: rec.title,
                     inputType: rec.scope.input_type,
                     defValue: rec.scope.default_value
                  }
                  this.dynamicScopeFieldType[scopeTitle].push(fieldType);
              }

              
              //this.fullScope[0].title
               customKey = rec.title.toString().toLowerCase().split(' ').join('_');//rec.accr_title[0];
              //this.dynamicScopeModel[customKey] = [];
              this.dynamicScopeFieldColumns[scopeTitle][key] = [];
              //this.dynamicScopeFieldColumns[key] = [];

              fieldTitleValue[key] = [];
              //this.dynamicScopeModel[customKey].fieldLines = [];
              this.dynamicScopeModel[scopeTitle]['fieldLines'] = [];

              if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
                ////////////console.log("first value length: ", rec.firstFieldValues.length);
                defLine['firstFieldValues'] = dataScope.firstColumnData;
              }
              let fieldValues = rec.title.split(" ").join("")+"Values";
              let fieldTitle = rec.title.split(" ").join("_");
              let filedId = rec.id;

              let colObj: any ={};
              colObj = {title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId};
              //////console.log(">>col: ",colObj);
              this.dynamicScopeFieldColumns[scopeTitle][key].push(colObj);
              //this.dynamicScopeFieldColumns[secInd][key].push({title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId});
              defLine[fieldValues] = [];

              ////console.log(">>> Field values: ", fieldValues, " -- ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeModel.fieldLines);

              if(defLine['firstFieldValues'] != undefined && defLine['firstFieldValues'].length > 0  && key == 0){
                //////////console.log("calling.....default...1");
                let getValue = defLine['firstFieldValues'][0].field_value.id;
                
                //////console.log("calling.....default...1: ", getValue, " -- ", defLine['firstFieldValues']);
                if(key === 0){
                  //////console.log("calling.....default...1.1 GEt Value:  ", getValue);
                  //this.dynamicScopeModel['fieldLines'][0][this.dynamicScopeFieldColumns[0][0].values] = [defLine['firstFieldValues'][0]];
                  fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
                }
                //////////console.log("calling.....default...1.2");
                //Default load next column 
                if(key == 0){
                  this.onChangeScopeOption(getValue,scopeTitle,key,key,'initLoad');
                } 
                setTimeout(()=>{
                  if(getValue != undefined && getValue > 0){  
                    let fSelValues: any = {};
                    //fSelValues[]                    
                    this.dynamicScopeModel[scopeTitle]['fieldLines'][0][this.dynamicScopeFieldColumns[scopeTitle][0][0].values] = [defLine['firstFieldValues'][0]];
                    this.dynamicScopeModel[scopeTitle].fieldLines[key][this.dynamicScopeFieldColumns[scopeTitle][key][0].title] = getValue;
                  }
                },0)                                
                
              }
              //Load first field value default by selecting first item
              this.dynamicScopeModel[scopeTitle].fieldLines.push(defLine);
              //this.dynamicScopeModel[customKey].fieldLines.push(defLine);
            });

            console.log("@@@@Update Model: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);

          }

     })
  }
}

 /**************************
 * 
 * SCOPE FUNCTIONS
 * 
 * *************************/ 

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
   this._customModal.closeDialog();
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
            //this.criteriaList = getData.data.criteriaList;
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
        //this.step1Data.is_main_activity = "";
        //this.step1Data.is_main_activity_note = "";
        this.step1Data.mailing_address = data.mailing_address; //data.applicant_address;
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
          let saveStep: number;
          
          sessionStorage.setItem("userData", JSON.stringify(getData));

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

              //check steps
              if(getData.data.is_draft){
                saveStep = parseInt(getData.data.saved_step) - 1;
              }else{
                if(parseInt(getData.data.saved_step) == 9){
                  saveStep = parseInt(getData.data.saved_step) - 1;
                  this.paymentStepComp = true;
                }else if(parseInt(getData.data.saved_step) == 8){
                  saveStep = parseInt(getData.data.saved_step);
                  this.paymentStepComp = true;
                }else{
                  saveStep = parseInt(getData.data.saved_step);
                }
              }

              if(getData.data.accredation_criteria == 2 && saveStep == 2){
                saveStep = 3;
              }
              
              if(res['data'].saved_step  != null){
                /////console.log("@saved step assign....");
                //let saveStep = res['data'].saved_step;
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
                if(getData.data.accredation_criteria == 2){
                  let stepData: any = this.headerSteps.find(item => item.title == 'information_audit_management');
                    console.log(">>step select: 1 ", stepData);
                    if(stepData){
                      stepData.activeClass = '';
                      stepData.stepComp = true;
                    }
                }
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
                  console.log(this.step1Data.is_main_activity,'is_main_activity');
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
                    if(this.accreditationInfo[0].scheme_name){
                      this.step1Data.is_hold_other_accreditation_select = "1";
                    }else{
                      this.step1Data.is_hold_other_accreditation_select = "0";
                      return;
                    }
                })
              }else{
                this.step1Data.is_hold_other_accreditation_select = "0";
              }

              //step2
              
              if(res['data'].technicalManager != undefined && res['data'].technicalManager.length > 0){
                let getTechData: any = res['data'].technicalManager[0];
                this.step2Data.name = getTechData.name;
                this.step2Data.designation = getTechData.designation;
                this.step2Data.mobile_no = getTechData.mobile_no;
                this.step2Data.email = getTechData.email;
                this.step2Data.relevent_experience = getTechData.relevent_experience;
              }
              if(res['data'].managementManager != undefined && res['data'].managementManager.length > 0){
                let getMangData: any = res['data'].managementManager[0];
                this.step2Data.management_name = getMangData.name;
                this.step2Data.management_designation = getMangData.designation;
                this.step2Data.management_mobile_no = getMangData.mobile_no;
                this.step2Data.management_email = getMangData.email;
                this.step2Data.management_relevent_experience = getMangData.relevent_experience;
              }

              //step3
              if(res['data'].audit_date != null){
                this.step3Data.audit_date = new Date(res['data'].audit_date);
              }
              if(res['data'].mrm_date != null){
                this.step3Data.mrm_date = new Date(res['data'].mrm_date);
              }

              //step 4
              if(getData.data.scopeDetails != undefined && !this.Service.isObjectEmpty(getData.data.scopeDetails)){
                ////console.log(">>> ", getData.data.scopeDetails);
                
                let jsonObject = getData.data.scopeDetails;
                this.Service.oldScopeData = jsonObject;
                this.editScopeData = jsonObject; 
              }

              //step 5
              var subcontractors = res['data']['aboutSubContractors'];
              this.aboutSubContractors = subcontractors && subcontractors != '' ? subcontractors : [{}];

              //Step 6
              if(res['data'].is_prelim_visit != null){
                //alert(">>"+res['data'].is_prelim_visit);
                this.step6Data.prelim_visit_val = (res['data'].is_prelim_visit) ? "1" : "0";
                //alert(">>"+this.step6Data.is_prelim_visit);
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

                // Object.keys(this.authorizationList).forEach( key => { 
                //   this.authorizationList[key] = true;
                // })
                // this.authorizationStatus = true;
                // this.readReviewChecklist = true;
                // this.readTermsCond       = true;
                // let visitRecomm = getData.data.recommend_visit.toString().replace(/["']/g, "");
                // this.step7Data.recommend_visit = visitRecomm;//'second';
                // this.step7Data.recommend_year = parseInt(getData.data.recommend_year);
                this.step7Data.recommend_year = parseInt(getData.data.recommend_year);
                 this.recomendVisit.forEach((item, index) => {
                  //let replace:  any = getData.data.recommend_visit.replaceAll("\\", "");
                  //console.log(">>> replace: ", getData.data.recommend_visit, " :: ", replace);
                  let cpjson: any = getData.data.recommend_visit ;//'{"first": false, "second": true, "third": false, "fourth": true}';

                  let findVsit: any = JSON.parse(cpjson); 
                  console.log(">>> ", findVsit);
                  for(let key in findVsit){
                     if(key === item.name){
                       console.log(">>>> found: ", item, " == ", findVsit[key]);
                       item.checked = findVsit[key];
                     }
                  }
                  })
                console.log("@recommend visit: ", this.recomendVisit, " -- ", getData.data.recommend_visit);
                this.step7Data.recommend_visit = this.recomendVisit;//(getData.data.recommend_visit);
                let authList: any;
                authList = getData.data.authorization_list;
                console.log("@ Auth checked status: ", authList);
                this.authorizationList = JSON.parse(authList);
                console.log("# Auth checked status: ", this.authorizationList);

                //check read ters check
                if(this.authorizationList.authorization_confirm2){
                  this.readTermsCond       = true;
                }
                //check review checklist checked
                if(this.authorizationList.undertaking_confirm2){
                  this.readReviewChecklist       = true;


              }

              //Step 9
              if(res['data'].paymentDetails != null && typeof res['data'].paymentDetails === 'object'){
                // console.log(">>>payment details...show");
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

                  this.paymentFile = res['data'].paymentDetails.payment_receipt && res['data'].paymentDetails.payment_receipt != null ? this.constant.mediaPath+'/media/'+res['data'].paymentDetails.payment_receipt : '';
                  if(this.paymentFile != undefined && this.paymentFile != ''){
                    this.paymentReceiptValidation = true;
                  }
              }
            }
          }
        });
    }
}

onSubmitStep1(ngForm1: any){

  //this.Service.moveSteps('application_information', 'personal_information', this.headerSteps);
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
    this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation_select == '0' ? false : true;
   // this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
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
    //if(this.accreditationInfo) {
    if(this.accreditationInfo.length > 0 && !this.Service.isObjectEmpty(this.accreditationInfo[0]) && this.step1Data.is_hold_other_accreditation_select == '1') {
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
          let data: any = {};
            data = res;
             ////////console.log(res,'Data')
            if(data.application_id != undefined && data.application_id > 0){
              this.formApplicationId = data.application_id;
              sessionStorage.setItem('applicationId',data.application_id);
              ////////console.log(this.formApplicationId,'App id assigned')
            }
          
            //this.formApplicationId = (this.formApplicationId && this.formApplicationId != '') ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['application_id']);
          this.Service.moveSteps('application_information', 'personal_information', this.headerSteps);
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
    //if(this.accreditationInfo) {
      if(this.accreditationInfo.length > 0 && !this.Service.isObjectEmpty(this.accreditationInfo[0]) && this.step1Data.is_hold_other_accreditation_select == '1') {
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
    // this.step3Data = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step2Data.is_draft = true;
    this.ptProvidersForm.saved_step = '2';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;

    this.step2Data.technicalManager = {};
    this.step2Data.technicalManager['name'] = (this.step2Data.name != '' && this.step2Data.name != undefined) ? this.step2Data.name : '';
    this.step2Data.technicalManager['designation'] = (this.step2Data.designation != '' && this.step2Data.designation != undefined) ? this.step2Data.designation : '';
    this.step2Data.technicalManager['mobile_no'] = (this.step2Data.mobile_no != '' && this.step2Data.mobile_no != undefined) ? this.step2Data.mobile_no : '';
    this.step2Data.technicalManager['email'] = (this.step2Data.email != '' && this.step2Data.email != undefined) ? this.step2Data.email : '';
    this.step2Data.technicalManager['relevent_experience'] = (this.step2Data.relevent_experience != '' && this.step2Data.relevent_experience != undefined) ? this.step2Data.relevent_experience : '';
    //}     relevent_experience

    this.step2Data.managementManager = {};
    this.step2Data.managementManager['name'] = (this.step2Data.management_name != '' && this.step2Data.management_name != undefined) ? this.step2Data.management_name : '';
    this.step2Data.managementManager['designation'] = (this.step2Data.management_designation != '' && this.step2Data.management_designation != undefined) ? this.step2Data.management_designation : '' ;
    this.step2Data.managementManager['mobile_no'] = (this.step2Data.management_mobile_no != '' && this.step2Data.management_mobile_no != undefined) ? this.step2Data.management_mobile_no : '';
    this.step2Data.managementManager['email'] = (this.step2Data.management_email != '' && this.step2Data.management_email != undefined) ? this.step2Data.management_email : '';
    this.step2Data.managementManager['relevent_experience'] = (this.step2Data.management_relevent_experience != '' && this.step2Data.management_relevent_experience != undefined) ? this.step2Data.management_relevent_experience : '';

    this.ptProvidersForm.step2 = this.step2Data;
    this.loader = true;
    // this.step3DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        if(res['status'] == true) {
          this.loader = false;
          // this.toastr.success(res['msg'], '');
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
  if(stepCount == 'step3') {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step3 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step3Data.is_draft = true;
    this.ptProvidersForm.saved_step = '3';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.step3 = this.step3Data;
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
    this.ptProvidersForm = {};
    this.ptProvidersForm.step5 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.saved_step = '5';
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step2Data.application_id = applicationId;
    this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    
    this.step5Data.is_draft = true;
    this.ptProvidersForm.step5 = this.step5Data;

    this.ptProvidersForm.step5['aboutSubContractors'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.ptProvidersForm.step5['aboutSubContractors'] = this.aboutSubContractors;
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
          this.toastr.success('Save Draft Successfully', '');
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
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
    this.step7Data.authorization_list_json = this.authorizationList;
    //this.step7Data.recommend = this.recommend;
    //this.step7Data.recommend = this.recommend;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step7Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step7Data.is_draft = true;
    this.ptProvidersForm.saved_step = '7';

    let recomVisit: any = {
      'first':false,'second':false, 'third': false, 'fourth':false
    };
    console.log(recomVisit);
    this.recomendVisit.forEach((item,index) => {
      recomVisit[item.name.toString()] = item.checked;
    })
    this.step7Data.recommend = recomVisit;

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
    this.voucherFile.append('is_draft', true);
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
  // this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);

  if(ngForm2.form.valid) {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step2 = {};
    // this.step3Data = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step2Data.is_draft = false;
    this.ptProvidersForm.saved_step = '2';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;

    this.step2Data.technicalManager = {};
    //if(this.step3Data.name_technical != '' && this.step3Data.designation_technical != '' && this.step3Data.mobile_no_technical != ''
      // && this.step3Data.tech_email_technical != '' && this.step3Data.relevent_experience_technical != ''){
    this.step2Data.technicalManager['name'] = (this.step2Data.name != '' && this.step2Data.name != undefined) ? this.step2Data.name : '';
    this.step2Data.technicalManager['designation'] = (this.step2Data.designation != '' && this.step2Data.designation != undefined) ? this.step2Data.designation : '';
    this.step2Data.technicalManager['mobile_no'] = (this.step2Data.mobile_no != '' && this.step2Data.mobile_no != undefined) ? this.step2Data.mobile_no : '';
    this.step2Data.technicalManager['email'] = (this.step2Data.email != '' && this.step2Data.email != undefined) ? this.step2Data.email : '';
    this.step2Data.technicalManager['relevent_experience'] = (this.step2Data.relevent_experience != '' && this.step2Data.relevent_experience != undefined) ? this.step2Data.relevent_experience : '';
    //}     relevent_experience

    this.step2Data.managementManager = {};
    //if(this.step3Data.management_name != '' && this.step3Data.management_designation != '' && this.step3Data.management_mobile_no != ''
      // && this.step3Data.management_email != '' && this.step3Data.management_relevent_experience != ''){
    this.step2Data.managementManager['name'] = (this.step2Data.management_name != '' && this.step2Data.management_name != undefined) ? this.step2Data.management_name : '';
    this.step2Data.managementManager['designation'] = (this.step2Data.management_designation != '' && this.step2Data.management_designation != undefined) ? this.step2Data.management_designation : '' ;
    this.step2Data.managementManager['mobile_no'] = (this.step2Data.management_mobile_no != '' && this.step2Data.management_mobile_no != undefined) ? this.step2Data.management_mobile_no : '';
    this.step2Data.managementManager['email'] = (this.step2Data.management_email != '' && this.step2Data.management_email != undefined) ? this.step2Data.management_email : '';
    this.step2Data.managementManager['relevent_experience'] = (this.step2Data.management_relevent_experience != '' && this.step2Data.management_relevent_experience != undefined) ? this.step2Data.management_relevent_experience : '';

    this.ptProvidersForm.step2 = this.step2Data;
    // this.step3DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    this.loader = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = false;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          if(this.step1Data.accredation_criteria == 1){
            //Intial
            this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
          }
          if(this.step1Data.accredation_criteria == 2){
            //Extension
            //alert(this.step1Data.accredation_criteria);
            let stepData: any = this.headerSteps.find(item => item.title == 'information_audit_management');
            console.log(">>step select: 1 ", stepData);
            if(stepData){
              stepData.activeClass = '';
              stepData.stepComp = true;
            }
            console.log(">>step select: 2 ", this.headerSteps);
            this.Service.moveSteps('personal_information', 'scope_accreditation', this.headerSteps);
          }
          //this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }
}

onSubmitStep3(ngForm3: any){
// this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
// this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);
  if(ngForm3.form.valid) {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step3 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step3Data.is_draft = false;
    this.ptProvidersForm.saved_step = '3';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.step3 = this.step3Data;
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));

    //console.log(">>> data: ", this.step3Data, " :: ", this.ptProvidersForm)
    //return;
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

// Scope saving
saveScope(rowInd: any){
    
  let scopeValues: any =[];
  let scopeIds:any =[];
  let scopeSelValues:any =[];
  ////console.log("dynamic ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns, " -- ", this.schemeRows, " -- ", this.formApplicationId);
  var key = '';
  var key2 = '';
  let resultAr: any={};
  let scopeCollections: any={};
  let selectScheme          = '';//this.schemeRows[0].id;
  
  //for(var t=0;t<this.schemeRows.length; t++){
  for(let t=rowInd;t<=rowInd; t++){

    ////console.log("Scheme Sec: ", t," -- ", scopeCollections);
    selectScheme = this.schemeRows[t].id;
    if(selectScheme == undefined){
      ////console.log(">>Heading scheme notfff....exit", selectScheme);
      break;
    }
    let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
    ////console.log("@Scheme Data: ", getData);
    let scopeTitle: string ='';
    //scopeTitle  = getData.title.toString().toLowerCase().split(" ").join('_');
    if(getData){
      scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
    }

    scopeCollections[selectScheme] = {};
    scopeCollections[selectScheme]['scope_heading'] = {};
          for(var key in this.dynamicScopeFieldColumns[scopeTitle]){
                //////console.log(">>> ", key, " :: ", this.dynamicScopeFieldColumns[key], " -- ", typeof this.dynamicScopeFieldColumns[key]);
                let tempData: any = this.dynamicScopeFieldColumns[scopeTitle];
                if(typeof tempData === 'object'){
                  tempData.forEach((item,key) => {
                        //////console.log(item);
                        let keyIds = item[0].idVal;
                        let name = item[0].name;
                        let tempObj = {};
                        tempObj[keyIds] = name;
                        scopeCollections[selectScheme]['scope_heading'][keyIds] = name;
                    });
                }
          }
  }
  ////console.log(">>> build scope: ", scopeCollections, " -- ", this.dynamicScopeModel, " -> Scheme: ", this.schemeRows);
  //return;

  let secInd: number = 0;
  let resultTempAr: any = [];
  let tempDataObj: any = {};  
  let tempDataRow: any = {};
  if(this.schemeRows.length){
      for(let t=rowInd;t<=rowInd; t++){
      //for(var t=0;t<this.schemeRows.length; t++){

          ////console.log("Scheme Sec: ", t);
          secInd = t;
          selectScheme = this.schemeRows[t].id;
          let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
          ////console.log("@Scheme Data: ", getData);
          if(getData == undefined){
            ////console.log("scheme not selecting...exit...", selectScheme, " -- ", getData);
            break;
          }
          let scopeTitle: string ='';
          if(getData){
            scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
          }
          scopeCollections[selectScheme]['scope_value']   = [];
          tempDataObj[selectScheme] = [];
          tempDataRow = {};

          //Scope data population
          for(var key in this.dynamicScopeModel[scopeTitle]){
            if(key == 'fieldLines'){
              let rowLen = this.dynamicScopeModel[scopeTitle][key].length;
              // Browse rows
              let getDataValues: any;
              let getSelectValues: any;
              ////console.log("Section: ", scopeTitle, " -- ", rowLen)
              
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

                this.dynamicScopeFieldColumns[scopeTitle].forEach((colItem,colIndex) => {
                    ////console.log("...Col>>> ",colIndex, " :: ", colItem[0], " -- ", this.dynamicScopeModel[scopeTitle][key][k])
                    let colData: any = colItem[0];
                    let optionNameAr: any = [];
                    let optionName: any;
                    if(colIndex == 0 && this.dynamicScopeModel[scopeTitle][key][k]['firstFieldValues'] != undefined && 
                    this.dynamicScopeModel[scopeTitle][key][k]['firstFieldValues'].length > 0){
                      //first coloumn row values - firstFieldValues
                      ////console.log(">>>> First column: ");
                      let selTitle: any       = colItem[0].title;
                      let selTitleValues: any = this.dynamicScopeModel[scopeTitle][key][k]['firstFieldValues'];
                      let fvalue: any         = this.dynamicScopeModel[scopeTitle][key][k][selTitle];
                      let getVal: any         = selTitleValues.find(data => data.field_value.id == fvalue)
                      ////console.log("<><><><> ", getVal);
                      if(getVal){                  
                        getVal = getVal.value;
                      }
                      ////console.log("First field data: ", selTitleValues, " -- ", fvalue, " -- ", getVal);
                      //tempObj[selectScheme][colData.idVal] = getVal;
                      tempDataRow[colData.idVal] = getVal;
                      
                    }else{
                        //Map column key to row key values
                        
                      let selTitle: any       = colItem[0].title;
                      let selTitleVal: any    = colItem[0].values;
                      let selTitleValues: any = this.dynamicScopeModel[scopeTitle][key][k][selTitleVal];
                      ////console.log("@fetching col index Data: ", colIndex, " -- ", selTitle, " -- ", selTitleVal, " -- ", selTitleValues);
                      let fvalue: any         = this.dynamicScopeModel[scopeTitle][key][k][selTitle];
                      ////console.log(">>>Type of FVAL: ", typeof fvalue);
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
                      ////console.log("Column field data: ",colIndex, " -- ", selTitleValues, " -- ", fvalue, " -- ", optionName);
                      //let tempData: any = {};
                      tempDataRow[colData.idVal] = optionName;
                      //tempObj[selectScheme].push(tempData);
                      //tempObj[selectScheme][colData.idVal] = optionName;                      
                    }                    
                })
                //
                tempDataObj[selectScheme].push(tempDataRow);
              } 
              ////console.log("@updated Temp object: ", tempDataObj); 
              // for(var p in tempDataObj){
              //     ////console.log(tempDataObj[p], " -- ", p);
              //     resultTempAr.push(tempDataObj[p]);
              // }
              scopeCollections[selectScheme]['scope_value'] =  tempDataObj[selectScheme];//resultTempAr[0];
              ////console.log(">>>> Result Ar: ", resultTempAr, " -- ", " -- ", tempDataObj, " -- ", scopeCollections);
            }
          }
      }
  }

  //Update scope data
  if(this.editScopeData != undefined && this.editScopeData != null){
      ////console.log("update scope: ", this.editScopeData, " -- ", scopeCollections)
      let tempScopeDetails: any={};
      let checkMatch: boolean = false;
      for(var key in this.editScopeData){
        tempScopeDetails[key] = {};
        tempScopeDetails[key]['scope_value'] = [];
        ////console.log(">>> ", key, " :: ", this.editScopeData[key]);
        checkMatch = this.getMatchScheme(key, scopeCollections);
        ////console.log("@@@ Finding schme status...", key);
            if(checkMatch){
              ////console.log("#>>> Find scheme in edit scope and update/marge...");
              this.editScopeData[key]['scope_value'].forEach((item, p) => {
                scopeCollections[key]['scope_value'].push(this.editScopeData[key]['scope_value'][p])
              })
              //scopeCollections[key]['scope_value'].push(this.editScopeData[key]['scope_value']);
            }else{
              ////console.log("@>>> Not Found scheme in edit scope and update and marge...");
              scopeCollections[key] = {};
              scopeCollections[key]['scope_heading']  = {};
              scopeCollections[key]['scope_heading']  = this.editScopeData[key]['scope_heading'];
              scopeCollections[key]['scope_value']    = [];
              scopeCollections[key]['scope_value']    = this.editScopeData[key]['scope_value']
            }
      }      
  }
  //filter scope collections
  //////console.log(">> Fileter collection...", scopeCollections);
  // for(var p in scopeCollections){
  //   if(scopeCollections[p]){
  //       let getDetails: any = scopeCollections[p]['scope_value'];
  //       console.log(">>>Value: ", p, " -- ", getDetails, " -- ");
  //       if(getDetails != undefined && getDetails.length == 0){
  //         //////console.log(">>>Empty values: ", p, " deleting");
  //         delete scopeCollections[p];
  //       }
  //   }
  // }
  console.log("#Updated Scope after edit: ", scopeCollections, " -- ", this.editScopeData);
  this.step4Data['scopeDetails']    = scopeCollections;
}
//scopeCollections[selectScheme]['scope_heading'][keyIds]  //assign scope heading
//scopeCollections[selectScheme]['scope_value'] //assign unmatch scope value

getMatchScheme(scId: any, scopeData: any){
  ////console.log("@@@ Finding schme...");
  for(var key in scopeData){
    ////console.log("# Finding schme...", key, " -- ", scId);
      if(key == scId){
        return true;
      }
  }
  return false;
}

updateScopeData = async(rowInd: number) => {
  let getId= (this.formApplicationId);
  console.log(this.formApplicationId);
  let url = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+getId;
  let getScheme: any  = this.schemeRows[rowInd].id;

  console.log(">>>Get url and ID: ", url, " :: ", getId, " -- ", getScheme);
  this.Service.getwithoutData(url)
  .subscribe(
  res => {
      let getData: any  =res;
      console.log(">>>. Data: ", getData);
      if(getData.data.scopeDetails != undefined && !this.Service.isObjectEmpty(getData.data.scopeDetails)){
        let jsonObject: any = getData.data.scopeDetails;
        if(jsonObject[getScheme]['scope_value'] != undefined){
          jsonObject[getScheme]['scope_value'].reverse();
        }
        this.toastr.success('Scope Data added successfully!','Success',{timeOut:2300});
        this.editScopeData = jsonObject;  
      }
  });
}


continueScopeAccreditation(){
//Reset all model data 
this.dynamicScopeFieldColumns = {}; 
this.dynamicScopeFieldType = {};
this.dynamicScopeModel = {};
this.fullScope = [];
this.schemeRows = [{}];
this.Service.moveSteps('scope_accreditation', 'about_subcontractors', this.headerSteps);
}
backScopeAccreditation(){
//Reset all model data 
console.log("@back scope....1: ", this.step1Data.accredation_criteria);
this.dynamicScopeFieldColumns = {};
this.dynamicScopeFieldType = {};
this.dynamicScopeModel = {};
this.fullScope = [];
this.schemeRows = [{}];
//this.Service.moveSteps('scope_accreditation', 'information_audit_management', this.headerSteps);
  if(this.step1Data.accredation_criteria == 1){
    console.log("@back scope....1.1");
  this.Service.moveSteps('scope_accreditation', 'information_audit_management', this.headerSteps);
  }
  if(this.step1Data.accredation_criteria == 2){
    console.log("@back scope....1.2");
  this.Service.moveSteps('scope_accreditation', 'personal_information', this.headerSteps);
  }
}

onSubmitStep4(ngForm: any, type?: any , rowInd?:any) {
  //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);

  this.ptProvidersForm = {};
  this.ptProvidersForm.step4 = {};
  this.ptProvidersForm.step4 = this.step4Data;
  var applicationId = sessionStorage.getItem('applicationId');
  this.ptProvidersForm.step4.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
  this.ptProvidersForm.step4['scheme_id'] = 1;//this.schemeRows[0].id;
  // if(this.step5Data.criteria_request != undefined){
  //   let schemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id);
  //   ////////console.log("scheme data: ", schemeData);
  //     if(schemeData){
  //     this.step5Data.criteria_request = schemeData.title;
  //     this.ptProvidersForm.step5['scheme_id'] = schemeData.scope_accridiation.id;
  //     }
  //   }

  //Check dynamic model column fields validation
  let secInd: number;
  let selectScheme: any;
  let errorScope: boolean = false;
  if(this.schemeRows.length){
    for(let t=rowInd;t<=rowInd; t++){
        secInd = t;
        selectScheme = this.schemeRows[t].id;
        let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
        //////console.log("@Scheme Data: ", getData);
        let scopeTitle: string ='';
        if(getData){
          scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
        }
            for(var key in this.dynamicScopeModel[scopeTitle]){
              if(key == 'fieldLines'){
                let rowLen = this.dynamicScopeModel[scopeTitle][key].length;
                // Browse rows
                //////console.log("Section: ", scopeTitle, " -- ", rowLen)                
                for(var k=0; k<rowLen; k++){
                    this.dynamicScopeFieldColumns[scopeTitle].forEach((colItem,colIndex) => {
                          let fieldSelValue: any;
                          let selTitle: any       = colItem[0].title;
                          fieldSelValue         = this.dynamicScopeModel[scopeTitle][key][k][selTitle];
                          //////console.log(">>> ", scopeTitle, " :: ", selTitle, " -- ", fieldSelValue);
                          if(fieldSelValue === undefined || fieldSelValue == ''){
                            errorScope = true;
                          }
                    })
                }
              }
            }
      }
  }
  if(errorScope){
    this.toastr.warning('Please Fill required field','Validation Error');
    return false;    
  }
  //Check dynamic model column fields validation


    ////console.log("scheme Rows: ", this.schemeRows,  " -- ", this.schemeRows.length, " :: ", this.editScopeData, " :: ", this.getScopeData);

    //console.log(">>> step4 submit...", this.step4Data, " -- ", this.ptProvidersForm); 
   
    //return;
    //ngForm.form.valid &&
    if(!ngForm.form.valid && type == undefined && this.schemeRows.length == 1 
        && this.schemeRows[0].id === undefined && this.editScopeData != undefined && this.editScopeData != null) {
      ////console.log(">>>Bypass saving...");
      ////console.log(">>>Enter....2")
      this.saveScope(rowInd);
      ////console.log(">>> step5 submit...", this.step5Data, " -- ", this.ptProvidersForm);
      this.ptProvidersForm.step5.is_draft = false;
      this.ptProvidersForm.saved_step = 5;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('scope_accreditation', 'about_subcontractors', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }
    else if(ngForm.form.valid && type == undefined) {
      console.log(">>>Scope saving...");
      console.log(">>>Enter....3")
      this.saveScope(rowInd);
      
      this.ptProvidersForm.step4.is_draft = false;
      this.ptProvidersForm.saved_step = 4;
      console.log(">>> step5 submit...", this.step5Data, " -- ", this.ptProvidersForm);
      //return;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
      .subscribe(
       async res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            console.log("Saved....arow....");
            await this.updateScopeData(rowInd);
            //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }
    else if( type != undefined && type == true){
      ////console.log(">>>Enter....4")
      this.ptProvidersForm.step5.is_draft = true;
      this.ptProvidersForm.saved_step = 5;
      this.saveScope(rowInd);
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
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
      ////console.log(">>>...");
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }

}

onSubmitStep5(ngForm5: any){
  // this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
  // this.Service.moveSteps('scope_accreditation', 'about_subcontractors', this.headerSteps);
  if(ngForm5.form.valid) {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step5 = {};
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    this.ptProvidersForm.saved_step = '5';
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step2Data.application_id = applicationId;
    this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    
    this.step5Data.is_draft = false;
    this.ptProvidersForm.step5 = this.step5Data;

    this.ptProvidersForm.step5['aboutSubContractors'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.ptProvidersForm.step5['aboutSubContractors'] = this.aboutSubContractors;
    }

    // this.step2DataBodyFormFile.append('data',JSON.stringify(this.ptProvidersForm));
    console.log(this.ptProvidersForm);
    this.loader = true;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.ptProviderForm,this.ptProvidersForm)
    .subscribe(
      res => {
        // console.log(res,'res')
        this.loader = false;
        if(res['status'] == true) {
          // this.toastr.success(res['msg'], '');
          this.Service.moveSteps('about_subcontractors', 'perlim_visit', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }
}

onSubmitStep6(ngForm6: any){
  //this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
  this.isPrelimSubmitted = true;
  if(ngForm6.form.valid) {
    this.ptProvidersForm = {};
    this.ptProvidersForm.step6 = {};
    this.ptProvidersForm.saved_step = '6';
    this.ptProvidersForm.email = this.userEmail;
    this.ptProvidersForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    //this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
    this.step6Data.is_prelim_visit = this.step6Data.prelim_visit_val == 0 ? false : true;
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
        this.isPrelimSubmitted = false;
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
      

  if(this.authorizationStatus && checkCount == 11){
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
if(this.authorizationStatus && checkCount == 11){  
  this.authorizationStatus = true;
}else{
  this.authorizationStatus = false;
}


// if(this.authorizationStatus == false){
//   this.isSubmit = false;
//   this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
// }
// else if(this.step7Data.recommend_visit == ''){
//   this.isSubmit = false;
//   this.toastr.error('Please Check any recommend the visit ', '');
// }
//make visit 
let recomVisit: any = {
  'first':false,'second':false, 'third': false, 'fourth':false
};
console.log(recomVisit);
let recomCheckCount = 0;
    this.recomendVisit.forEach((item,index) => {
      if(item.checked == true){
        recomCheckCount++;
      }
  recomVisit[item.name.toString()] = item.checked;
})
this.step7Data.recommend = recomVisit;//this.recomendVisit;

//this.ptProvidersForm.step7 = this.step7Data;

if(ngForm7.form.valid && recomCheckCount > 0 && this.authorizationStatus == true){

  this.ptProvidersForm = {};
  this.ptProvidersForm.step7 = {};
  this.ptProvidersForm.email = this.userEmail;
  this.ptProvidersForm.userType = this.userType;
  var applicationId = sessionStorage.getItem('applicationId');
  this.step7Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
  this.ptProvidersForm.saved_step = '7';
  this.step7Data.authorization_list_json = this.authorizationList;
  //this.step7Data.recommend = this.recommend;
  this.step7Data.is_draft = false;
  this.step7Data.application_date = new Date();

  this.ptProvidersForm.step7 = this.step7Data;
  this.ptProvidersForm.step7.terms1 = this.authorizationListTerms1;
  this.ptProvidersForm.step7.terms2 = this.authorizationListTerms2;
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
          this.toastr.success("Application Submitted Successfully");
              setTimeout(() => {
                this.router.navigateByUrl('/dashboard/status/all');
              }, 3000)
          // this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
          //this.router.navigateByUrl('/dashboard/status/all');
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
// let custPrice: any = 0.01;
// this.total = 0.05;
let custPrice: any = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;//0.01;
this.total = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;//0.05;
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
  let is_valid: boolean = false;
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
if(this.voucherSentData['transaction_no'] != '' && this.voucherSentData['payment_method'] != '' && this.voucherSentData['payment_made_by'] &&
this.voucherSentData['mobile_no'] != ''){
  is_valid = true;
}
    
this.loader = true;
console.log(">>> File: ", this.paymentReceiptValidation);
//if(ngForm9.form.valid && this.paymentReceiptValidation != false) {
  //return;
if(is_valid == true &&  this.paymentReceiptValidation != false) {
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
  this.loader = false;
  this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
}

}

  getPlaceName()
   {
     if(typeof this.step1Data.physical_location_address != 'undefined')
     {
       this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step1Data.physical_location_address+'.json?access_token='+this.Service.mapboxToken+'','')
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
  //proforma save
  let postData: any = new FormData();
  postData.append('accreditation', this.formApplicationId);
  this._trainerService.proformaAccrSave(postData)
  .subscribe(
    result => {
        let data: any = result;
        if(data.status){
          this.paymentStepComp = true;
          this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
        }
        //console.log(">>> Save resultts: ", result);
    });
  // setTimeout(()=> {
  //   // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
  //   ////console.log("moving...");
  //   this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
  // }, 1000)      
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

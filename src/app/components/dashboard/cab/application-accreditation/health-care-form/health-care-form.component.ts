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
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
declare let paypal: any;
import { DomSanitizer } from '@angular/platform-browser';
import { TrainerService } from '../../../../../services/trainer.service';
import {CustomModalComponent} from '../../../../utility/custom-modal/custom-modal.component';

@Component({
  selector: 'app-health-care-form',
  templateUrl: './health-care-form.component.html',
  styleUrls: ['./health-care-form.component.scss'],
  providers: [CustomModalComponent]
})
export class HealthCareFormComponent implements OnInit {

  public newRow: any = {};
  public healthCareForm: any = {};
  public healthCareFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [{}];
  public ownOrgMembInfo: Array<any> = [{}];
  public proficiencyTesting: Array<any> = [{}];
  public accreditationInfo: Array<any> = [{}];
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
  shift2_from: boolean = false;
  shift2_to: boolean = false;
  shift3_from: boolean = false;
  shift3_to: boolean = false;
  convertedDate:any;
  half_representative_date:boolean = false;

  public radiologyAccreditationCenter:Array<any>=[];
  public radiologyAccreditation:any={};

  public dayCareSurgeryCenter:Array<any>=[];
  public dayCareSurgery:any={};

  public neurophysiologyAccreditationCenter:Array<any>=[];
  public neurophysiologyAccreditation:any={};

  bannerURL: any = '';
  bannerImageTitle: string = '';
  bannerLinkTarget: string = '';

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

  @ViewChild('mydiv', null) mydiv: ElementRef;
  @HostListener('scroll', ['$event.target'])
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;
  scrollHandler(elem) {
    if(elem != undefined){
      //console.debug("Scroll Event: ", elem.srcElement.scrollHeight, " == [ ",elem.srcElement.offsetHeight, " - ",elem.srcElement.scrollTop," ]"  );
      if(( elem.srcElement.offsetHeight + elem.srcElement.scrollTop) >=  elem.srcElement.scrollHeight) {
         ////console.log("Yo have reached!");
         this.authorizationList.authorization_confirm2 = true;
      }
    }        
  }

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,
    private _customModal: CustomModalComponent,
    private modalService: NgbModal,public sanitizer:DomSanitizer,public _trainerService:TrainerService) { }


  /*******************************
  * Scope Funtions
  * @Abhishek
  ********************************/
 getCriteria(value, secInd: any){
  //console.log("select Criteris: ", value, " -- ", secInd);
  this.scopeDataLoad = true;
  if(value != undefined && value > 0){
     
     let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcare_form_basic_data+"?scheme="+value;
     this.Service.getwithoutData(apiURL).subscribe(record => {
      console.log('@Fullscope: ', record);
          let dataScope:any = [];
          let fieldTitleValue: any = [];
          dataScope = record['data'];
          this.scopeDataLoad = false;
          let customKey;
          console.log('Fullscope: ', dataScope);
          if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
            let firstColumValues = dataScope.firstColumnData[0];
          }
          let scopeName: string = '';
            let scopeTitle: string ='';
            let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == value);
            //console.log(">>> Fined Scheme: ", getData);
            if(getData){
              scopeName   = getData.title;
              scopeTitle  = getData.title.toString().toLowerCase().split(" ").join('_');

              //check already existing scheme...
              for(var m in this.dynamicScopeModel){
                  console.log("mkey: ", m, " -- ", scopeTitle);
                  if(m === scopeTitle){
                    this.fullScope.splice(secInd, 1);
                    this.toastr.error("Scheme should be unique, Please check.","Validation")
                    return;
                  }
              }
              this.dynamicScopeFieldColumns[scopeTitle] = [];
              this.dynamicScopeFieldType[scopeTitle] = [];
              this.dynamicScopeModel[scopeTitle] = {};

              if(this.fullScope.length){
                  console.log("@Existing scheme....1");
                  let pushObj: any = {
                    title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                  }
                  
                  if(this.fullScope[secInd] != undefined && !this.Service.isObjectEmpty(this.fullScope[secInd])){
                    //console.log("@Existing scheme...found", this.fullScope[secInd]);
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
              
              customKey = rec.title.toString().toLowerCase().split(' ').join('_');
              this.dynamicScopeFieldColumns[scopeTitle][key] = [];

              fieldTitleValue[key] = [];
              this.dynamicScopeModel[scopeTitle]['fieldLines'] = [];

              if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
                defLine['firstFieldValues'] = dataScope.firstColumnData;
              }
              let fieldValues = rec.title.split(" ").join("")+"Values";
              let fieldTitle = rec.title.split(" ").join("_");
              let filedId = rec.id;

              let colObj: any ={};
              colObj = {title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId};
              this.dynamicScopeFieldColumns[scopeTitle][key].push(colObj);
              defLine[fieldValues] = [];
              console.log(">>> Field values: ", fieldValues, " -- ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeModel.fieldLines);
              if(defLine['firstFieldValues'].length > 0  && key == 0){
                let getValue = defLine['firstFieldValues'][0].field_value.id;
                
                if(key === 0){
                  fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
                }
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
            });

            console.log("@@@@Update Model: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);

          }
          ////console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns, " ::-> ",this.fullScope);
     })
  }
 }

 onChangeScopeOption(getValues: any,secIndex: any, lineIndex: number, columnIndex: number, type?:string) {
  //console.log('@GET Options: ', getValues, " :: ",  lineIndex, " -- ", type, " -- ", columnIndex, " --sec--  ", secIndex);

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
        console.log(">>Loop value: ", selectValue[k], " :: ", k);
        if(typeof selectValue[k] === 'string'){
          return;
        }
    }
    jsonReq['value_id'] = selectValue;
  }
  this.Service.put(url,jsonReq)
  .subscribe(
    record => {
        console.log("Load scope SErvice Data: ", record, " -- ", this.dynamicScopeFieldType, " ::", this.dynamicScopeFieldColumns[secIndex],  " - ", this.dynamicScopeModel);
        //get through array find key column
        if(typeof record['scopeValue'] === 'object' && record['scopeValue'].length == 0){
          console.log(">>>emepty scope values.....1");
          record['scopeValue'] = [];
        }
        if(typeof record['scopeValue'] === 'object' && this.Service.isObjectEmpty(record['scopeValue']) == true){
          console.log(">>>emepty scope values.....2");
          record['scopeValue'] = [];
        }
        let theColumnIndex  = columnIndex;
        let nextColumnIndex = theColumnIndex + 1;
        let totSecColumn    = this.dynamicScopeFieldColumns[secIndex].length;//this.dynamicScopeFieldColumns[secIndex].length;
        //console.log(">>>Column Data: ", theColumnIndex, " -- ", nextColumnIndex, " -- ", totSecColumn, " -- ", );
        console.log("select scope values: ", record['scopeValue'], " :: ", this.dynamicScopeFieldType[secIndex], " len: ", record['scopeValue'].length);
        //Auto selected for one item dropdown
        if(record['scopeValue'].length > 0 && record['scopeValue'].length == 1){
            console.log(">>>dep scope data: ", record['scopeValue']);
            let getSelValue = 0; 
            if(typeof record['scopeValue'][0] === 'object'){                  
              getSelValue = record['scopeValue'][0].field_value.id;
              console.log(">>assigning scope default value: ", getSelValue);
              this.dynamicScopeModel[secIndex].fieldLines[lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex][0].title] = getSelValue;
              this.onChangeScopeOption(getSelValue,secIndex,lineIndex,nextColumnIndex,'initLoad');
            }
        }
        if(nextColumnIndex > 0 && nextColumnIndex < totSecColumn){
            //Get ridge of the values
            //console.log("field columns: ", this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][0].values] , " :: ");
            let colDef: string = this.dynamicScopeFieldType[secIndex][nextColumnIndex].defValue                                                       
            console.log(">>> scope field def: ", colDef);
            if(colDef === "None" || colDef === null){
              console.log("Def enter...1");
                  let scopValues: any = record['scopeValue'];
                  var resultUniq = scopValues.reduce((unique, o) => {
                      if(!unique.some(obj => obj.value === o.value)) {
                        unique.push(o);
                      }
                      return unique;
                  },[]);
                  console.log(">>> Filter results:1 ",resultUniq);
              this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex][0].values] = resultUniq;//record['scopeValue'];
            }
            else if(colDef != "None" && colDef != null && colDef != ""){
              console.log("Def enter...2");
              let colValAr: any;                                                                                                                                                                                                                                    
              let colTempAr: any = [];
              colValAr = colDef.toString().split(',');                                                                                                                                                
              colValAr.forEach((item,key1) => {
                let tempObj: any = {};
                tempObj['field_value'] = {};
                tempObj['field_value']['id'] = item;//(key1+1);
                tempObj['value'] = item;
                console.log("value obj: ", tempObj);
                colTempAr.push(tempObj);
              });
              console.log("Def enter...3");
              this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex][0].values] = colTempAr;
            }else{
              console.log("Def enter...4");
              this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex][0].values] = record['scopeValue'];
            }
        }
      console.log("@@@Updated Model Values: ", this.dynamicScopeModel);
    });
 }

 addSchemeRow(obj: any = [],index: number){
  console.log(">>> ", obj);
  this.newRow     =   {};
  obj.push(this.newRow);
  //this.getCriteria(this.step5Data.scheme_ids[index], index);
  }
  removeSchemeRow(obj: any = [],index: number){
  obj.splice(index, 1);  //not deleting...
  //console.log("compare object: 1 ", this.schemeRows, " ::: ",  this.step5Data.scheme_ids);
  //this.schemeRows.splice(index, 1);
  //console.log("compare object: 2 ", this.schemeRows, " ::: ", this.fullScope, " -- index: ", index);
  let sectionTitle: string = '';
  let fullscopeData: any = this.fullScope[index];
  if(fullscopeData){
    sectionTitle = fullscopeData.title;
  }
  console.log("find section...", sectionTitle);

  if(this.fullScope[index] != undefined && !this.Service.isObjectEmpty(this.fullScope[index])){
    //console.log("removing ...fullscope....", index, " :: ", this.fullScope[index]);
    this.fullScope.splice(index, 1)
  }
  if(this.dynamicScopeFieldType[sectionTitle] != undefined && !this.Service.isObjectEmpty(this.dynamicScopeFieldType[sectionTitle])){
    console.log("removing ...fieldType....1", index, " :: ", this.dynamicScopeFieldType);
    //this.dynamicScopeFieldType.splice(index, 1);
    delete this.dynamicScopeFieldType[sectionTitle];
    //console.log("removing ...fieldType....2", this.schemeRows,  " --",this.fullScope, " :: ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);
  }
  if(this.dynamicScopeModel[sectionTitle] != undefined && !this.Service.isObjectEmpty(this.dynamicScopeModel[sectionTitle])){
    delete this.dynamicScopeModel[sectionTitle];
  }

  console.log(">>>After delete scheme: ", "Full Scope: ", this.fullScope, " :FieldType: ", this.dynamicScopeFieldType, " :Model: ", this.dynamicScopeModel);

  }

  getFieldTooltip(modelValue, modelObj){
    //console.log("Tooltip data value: ", modelValue, " :: ", modelObj);
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
        ////////console.log('Text value: ', findText);
        if(typeof findText === 'object' && findText.value != ''){
          ////////console.log('Value find: ', findText.value);
            return findText.value;
        }
    }
  }

  removeScopeLine(lineIndex: number, secIndex: any){
      //console.log("deleting rows....1: ", this.dynamicScopeModel, " -- ", lineIndex, " :: ", secIndex);
      if(this.dynamicScopeModel[secIndex].fieldLines != undefined && this.dynamicScopeModel[secIndex].fieldLines.length > 0){
        //console.log("deleting rows....2");
        this.dynamicScopeModel[secIndex].fieldLines.splice(lineIndex, 1);
      }
      this._customModal.closeDialog();
  }
  getSchme(sid: number){
    let getSchemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
    //console.log("data: ", getSchemeData);
    if(getSchemeData){
      return 'Accreditation Scope for ' + getSchemeData.title;
    }
  }
  deleteScopeData(schemId: any, deleteIndex: number){
      console.log("deleting...", schemId, " -- ", deleteIndex);
      let savedData: any = this.editScopeData;
      console.log("saveData: ", savedData);

      for(var key in savedData){
          console.log(">>> ", key, " :: ", savedData[key]);
          if(key === schemId){
            let getvalues: any =  savedData[key].scope_value;
            console.log("<<< Found: ", getvalues);
            if(typeof getvalues === 'object'){
              console.log("deleting...");
              getvalues.splice(deleteIndex, 1);
            }
          }
      }
      this._customModal.closeDialog();
      console.log(">>>Final Data: ", this.editScopeData);
  }
  openDeleteScopeConfirm(delIndex: any, delKey: any){
    console.log(">>>delete ", delKey, " -- ", delIndex);
    if(delKey){
      console.log("assign delete id: ", delIndex, " -- ", delKey);
      this.selectDeleteIndex = delIndex;
      this.selectDeleteKey = delKey;
      this.deleteScopeConfirm = true;
    } 
  }

  openDeleteEditScopeConfirm(delIndex: number, delKey: any){
    console.log(">>>delete ", delKey);
    if(delKey){
      console.log("assign delete id: ", delIndex, " -- ", delIndex);
      this.selectDeleteIndex = delIndex;
      this.selectDeleteKey = delKey;
      this.deleteEditScopeConfirm = true;
    } 
  }
  
  //addScopeLine(secName:any, secIndex: number, lineIndex: number, lineData: any){
  addScopeLine(lineIndex: number,secIndex: any, lineData: any){
    let line     =   {};    
    //console.log("@ADD ROW - Total line: ", lineData, " - ", lineIndex, " == ", lineData.length, " --Model: ", this.dynamicScopeModel);
    if(lineData != undefined && lineData.length > 0){
      lineIndex  = lineData.length;
    }
    for(var key in this.dynamicScopeModel[secIndex]){
        //console.log("Key: ", key , " :: ", this.dynamicScopeModel[secIndex][key]);
        let getValue: any = 0;
        //if( key === secName ){
          if(this.dynamicScopeModel[secIndex].fieldLines != undefined){
            let fieldValues = this.dynamicScopeModel[secIndex].fieldLines[0].firstFieldValues;
            
            //console.log("@ADD ROW - Fieldvalues:: ", fieldValues);
            line['firstFieldValues'] = fieldValues;
            this.dynamicScopeModel[secIndex].fieldLines.push(line);
            if(fieldValues.length > 0 && typeof fieldValues[0] === "object" && fieldValues[0].field_value != undefined){
              getValue = fieldValues[0].field_value.id;
            }
            //console.log('@ADD ROW - Calling on change...', getValue, " -- ", secIndex, " Lineindex: ", lineIndex);
            
            this.dynamicScopeFieldColumns[secIndex].forEach((recCol, keyCol) => {
              ////////console.log(" > >>   ", keyCol)
              if(keyCol === 0){
                let getModelKey = recCol[0].title;
                //console.log(" >>>>>ModelKey ",getModelKey, " --- FindValue:  ", getValue, " --- ");
                this.dynamicScopeModel[secIndex]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][0][0].values] = fieldValues;
                if(getValue != undefined && getValue > 0){
                  this.dynamicScopeModel[secIndex].fieldLines[lineIndex][getModelKey] = getValue;
                }
                //this.onChangeScopeOption(getValue,secIndex,lineIndex,0,secName,'initLoad');
                this.onChangeScopeOption(getValue,secIndex,lineIndex,0,'initLoad');
              }
            });
          }
        //}
    }    
    ////console.log("Add Line status: ", this.dynamicScopeModel);
  }



  /*******************************
  * Scope Funtions
  * @Abhishek
  ********************************/

  // getFieldTooltip(){
  //   let getval = this.healthCareForm.official_website;
  //   let urlReg = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
  //   console.log('>>> ', getval, " --- ", urlReg.test(getval));
  //   if(!urlReg.test(getval)){
  //     return 'Enter URL properly';
  //   }
  // }

scrollForm(data?:any){
 
}

 //Get MapBoc Dynamic Values
 getData(getVal){
   //console.log(">>>>Get MapBox Value: ", getVal);
   this.Service.mapboxToken = getVal;
  }
 ngOnInit() { 
   ////console.log(this.Service.dutyTime());
  //  this.titleService.setTitle('EIAC - Healthcare Laboratories');
  this.accredAgreemFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Accreditation%20Agreement.pdf');
  this.checklistDocFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Document%20review%20Checklist-%20ISO%2017020-%202012_Inspection%20Bodies.pdf');
  this.urlVal = this.Service.getValue() != '' ? this.Service.getValue() : '';
  this.userEmail = sessionStorage.getItem('email');
  this.userType = sessionStorage.getItem('type');
  this.isCompleteness = sessionStorage.getItem('isCompleteness');
  this.profileComplete = sessionStorage.getItem('profileComplete');
  this.userId = sessionStorage.getItem('userId');
  // this.titleService.setTitle('EIAC - Testing and Calibration Laboratories');
  this.addMinutesToTime = this.Service.addMinutesToTime();
   //console.log( this.addMinutesToTime);
  this.loadSchemeData();
  //  this.loadFormDynamicTable();
   this.loadCountryStateCity();
   this.loadAppInfo();

   this.loadData();
   //console.log('ddd');
   //this.getPlaceName();
   //this.checkCaptchaValidation = true;

   //this.customUrlPattern = { '0' : {pattern: new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?') }};
   this.headerSteps.push(
    {
    title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
    },
    {
    title:'profciency_testing_participation', desc:'2. Profciency Testing Participation', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
    },
    {
    title:'personal_information', desc:'3. Personnel Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
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


 loadSchemeData(){
  this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcare_form_basic_data)
  .subscribe( 
    res => {
      console.log("@Load scope....", res);
      //this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
      //this.countryList = res['allCountry'];
      //this.labTypeList = res['allLabtype'];
      //this.fullScope   = res['fullScope'];
      //this.criteriaMaster = res['criteriaMaster'];
      this.criteriaMaster = res['data']['schemes'];
      ////console.log("#Get criteria: ", this.criteriaMaster);

    },
    error => {
    })
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
//  loadFormDynamicTable(){
//    this.ownOrgBasicInfo  =   [{}];
//    this.ownOrgMembInfo = [{}];
//    this.accreditationInfo = [{}];
//    this.proficiencyTesting =[{}];
//    this.medicalLabInfo=[{}];
//    this.sampleCollectionCenter=[{}];
//    this.pointOfCareInfo=[{}];
//    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,authorization_confirm3:false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false,undertaking_confirm8:false,undertaking_confirm9:false};
//    this.recommend = {first:false,second:false,third:false,fourth:false}
//    this.healthCareForm.organizationBasicInfo    = this.ownOrgBasicInfo;
//    this.healthCareForm.organizationMemberInfo   = this.ownOrgMembInfo;
//    this.healthCareForm.accreditationInfo        = this.accreditationInfo;
//    this.healthCareForm.proficiencyTesting       = this.proficiencyTesting;
//    this.healthCareForm.technicalManager         = this.technicalManager;
//    this.healthCareForm.managementManager        = this.managementManager;
//    this.healthCareForm.medicalLabInfo           = this.medicalLabInfo;
//    this.healthCareForm.pointOfCareInfo          = this.pointOfCareInfo;
   

//    this.healthCareForm.sampleCollectionCenter        = this.sampleCollectionCenter;
//    this.sampleCollection['sampleCollectionData']    = this.healthCareForm.sampleCollectionCenter
//    this.healthCareForm.sampleCollection         = this.sampleCollection;

//    this.radiologyAccreditationCenter = [{}];
//    this.healthCareForm.radiologyAccreditationCenter        = this.radiologyAccreditationCenter;
//    this.radiologyAccreditation['radiologyAccreditationData']    = this.healthCareForm.radiologyAccreditationCenter
//    this.healthCareForm.radiologyAccreditation         = this.radiologyAccreditation;

//    this.dayCareSurgeryCenter = [{}];
//    this.healthCareForm.dayCareSurgeryCenter        = this.dayCareSurgeryCenter;
//    this.dayCareSurgery['dayCareSurgeryData']    = this.healthCareForm.dayCareSurgeryCenter
//    this.healthCareForm.dayCareSurgery         = this.dayCareSurgery;

//    this.neurophysiologyAccreditationCenter = [{}];
//    this.healthCareForm.neurophysiologyAccreditationCenter        = this.neurophysiologyAccreditationCenter;
//    this.neurophysiologyAccreditation['neurophysiologyAccreditationData']    = this.healthCareForm.neurophysiologyAccreditationCenter
//    this.healthCareForm.neurophysiologyAccreditation         = this.neurophysiologyAccreditation;

//  }

moveShift(theVal: any){
  let val;
  console.log(">>>change shift: ", theVal, " -- ",val);
  
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
    console.log(">>> shift 1 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
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

    console.log(">>> shift 2 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
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
    console.log(">>> shift 3 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
  }
}
 
 setexDate(date){
  let cdate = date;
  this.minDate = new Date(cdate  + (60*60*24*1000));
}

 

 getPlaceName()
 {
   console.log(">>>callibng place...", this.step1Data.physical_location_address);
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
   this.healthCareForm.location_longitude = longitude;
   this.healthCareForm.location_latitude = latitude;
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
 showHideMembInfo(data){
   this.orgMembToggle  = data.checked;
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

loadData(){
  this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcare_form_basic_data)
    .subscribe( 
      res => {
        console.log("@Load scope....", res);
        //this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
        //this.countryList = res['allCountry'];
        // this.labTypeList = res['allLabtype'];
        // //this.fullScope   = res['fullScope'];
        this.criteriaList = res['data']['criteriaList'];
        // this.step1Data.criteria_request = this.criteriaList[0].code; 
        // this.criteriaMaster = res['data']['schemes'];
        //////console.log("#Get criteria: ", this.criteriaMaster);

      },
      error => {
      
  })
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
      // console.log(getData,"Profile info >>> ");

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
        // this.step1Data.is_hold_other_accreditation = "1";
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
          // console.log(res,'urlVal')
          this.loader = true;
          if(res['data'].id && res['data'].id != '') {
              let pathData: any;
              let filePath: string;
              let getData: any = res;
              let saveStep: number;
              if(!this.Service.isObjectEmpty(res['data'].paymentDetails)){
              
                if(res['data'].paymentDetails.voucher_invoice != undefined && res['data'].paymentDetails.voucher_invoice != ''){
                  filePath = this.constant.mediaPath + '/media/' + res['data'].paymentDetails.voucher_invoice;
                  pathData = this.getSantizeUrl(filePath);
                  this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
                  saveStep = 8;
                }
                ////console.log(">>>> payment details upload: ", getData.data.paymentDetails, " -- ", this.paymentFilePath, " :: ", filePath);
              }else{
                saveStep = parseInt(getData.data.saved_step) - 1;
              }

              var cityList =  this.Service.getCity();

              this.step1Data.country = getData.data.country;
              //console.log(">>> country data: ", this.getCountryLists);
              if(this.getCountryLists.length){
                //console.log(">>> 11c country data: ", this.getCountryLists);
                let cdata: any = this.getCountryLists.find(rec => rec.name == getData.data.country)
                  //console.log("Fnd country: ", cdata);  
                  if(cdata){
                    let cid = cdata.id;
                    this.statelistById(cid) 
                  }
              }
              cityList.subscribe( result => {
                for(let key in result['cities']) {
                  //console.log(">> cities: ", result['cities'][key]);
                   ////if(result['cities'][key]['state_id'] == data.city )
                   //{
                    this.allCityList.push(result['cities'][key]);
                  //}
                }
              });
              this.step1Data.state = getData.data.state;  
      
              this.step1Data.city = getData.data.city;
              
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
                this.step1Data.is_hold_other_accreditation = "1";
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
                this.step1Data.is_hold_other_accreditation = "0";
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

              //step 5
              if(res['data'].scopeDetails != undefined && !this.Service.isObjectEmpty(res['data'].scopeDetails)){
                console.log(">>> ", res['data'].scopeDetails);
                //let jsonStrting = '{"18":{"scope_heading":{"43":"Inspection Category","45":"Inspection field","47":"Range of inspection","49":"Stage of the inspection","51":"Inspection criteria","53":"Inspection Activity Type"},"scope_value":[{"43":"Product","45":"Mechanical Engineering of Lifting Equipment","47":"Lever hoist","49":"In-service","51":"BS EN 13157","53":"A"},{"43":"Product","45":"Mechanical, Electrical and Structural Engineering of Lifting Equipment","47":"Mobile crane","49":"In-service","51":"BS 7121-2-1,BS 7121-2-3","53":"B,C"},{"43":"Product","45":"Mechanical Engineering of Lifting Equipment – Earth Moving","47":"Backhoe Loader","49":"In-service","51":"BS EN 474-4","53":"A,B"}]},"105":{"scope_heading":{"55":"Inspection Category","57":"Inspection field","59":"Range of inspection","61":"Stage of the inspection","63":"Inspection criteria","65":"Inspection Activity Type"},"scope_value":[{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Hook","61":"In-service","63":"Welcome","65":"Hello"},{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Chain sling","61":"In-service","63":"bbb","65":"aaa"}]}}';
                //let jsonStrting = getData.data.scopeDetails.toString();
                let jsonObject = res['data'].scopeDetails;//JSON.parse(jsonStrting);
                this.Service.oldScopeData = jsonObject;
                this.editScopeData = jsonObject; 
                this.getScopeData = jsonObject;
                
                // this.Service.jsonToArray(jsonObject);
                console.log(">>>Saved details: ", jsonObject, " -- ", this.editScopeData);

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

    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirmTop3: false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false};
} 


onSubmitStep1(ngForm1: any){
  // this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
  this.isApplicationSubmitted = true;
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

  // console.log("nite enen: ", this.step1Data.is_main_activity_note, " -- ", this.step1Data.is_main_activity, " :: ", (!str || 0 === str.length));
  
  if(this.step1Data.is_main_activity == 'true' && this.step1Data.is_main_activity_note != ''){
    this.step1Data.is_main_activity_note = '';
  }
  if(this.step1Data.is_main_activity == 'true'){
    this.isNoteSubmit = true;
  }

  if((!str || 0 === str.length) && this.step1Data.is_main_activity == 'false'){
    // console.log(">>> Note is required...");
    this.is_main_activity_note_entry = true;
    this.isNoteSubmit = false;
  }
  if(this.step1Data.is_main_activity == 'false' && this.step1Data.is_main_activity_note != ''){
    // console.log(">>> Note is ebnterd.....");
    this.is_main_activity_note_entry = false;
    this.isNoteSubmit = true;
  }
  // console.log(this.dutyTime2,'dutyTime2');
  // console.log(this.dutyTime3,'dutyTime3');
  
  if(ngForm1.form.valid && this.isSubmit == true  && this.isNoteSubmit == true) {
    this.healthCareForm = {};
    this.healthCareForm.step1 = {};
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    this.healthCareForm.saved_step = '1';
    this.step1Data.is_draft = false;
    if(this.formApplicationId > 0){
      this.step1Data.application_id = this.formApplicationId;
    }
    this.healthCareForm.step1.is_draft = false;
    this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
    this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
    this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
    this.healthCareForm.step1 = this.step1Data;

    this.healthCareForm.step1['ownOrgBasicInfo'] = [];
    this.healthCareForm.step1['ownOrgMembInfo'] = [];
    this.healthCareForm.step1['accreditationInfo'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.healthCareForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
    }
    if(this.ownOrgMembInfo) {
      this.healthCareForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
    }
    if(this.accreditationInfo) {
      this.healthCareForm.step1['accreditationInfo'] = this.accreditationInfo;
    }

    this.loader = false;
    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
    .subscribe(
      res => {
        this.loader = true;
        // console.log(res,'res')
        this.isApplicationSubmitted = false;
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
    this.healthCareForm = {};
    this.healthCareForm.step1 = {};
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    this.healthCareForm.saved_step = '1';
    if(this.formApplicationId > 0){
      this.step1Data.application_id = this.formApplicationId;
    }
    this.step1Data.is_draft = true;
    this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
    this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
    this.step1Data.is_main_activity = this.step1Data.is_main_activity == "true" ? true : false;
    this.healthCareForm.step1 = this.step1Data;

    this.healthCareForm.step1['ownOrgBasicInfo'] = [];
    this.healthCareForm.step1['ownOrgMembInfo'] = [];
    this.healthCareForm.step1['accreditationInfo'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.healthCareForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
    }
    if(this.ownOrgMembInfo) {
      this.healthCareForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
    }
    if(this.accreditationInfo) {
      this.healthCareForm.step1['accreditationInfo'] = this.accreditationInfo;
    }
    this.loader = false;
    // this.step1DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
    this.healthCareForm = {};
    this.healthCareForm.step2 = {};
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    this.healthCareForm.saved_step = '2';
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step2Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    
    this.step2Data.is_draft = true;
    this.healthCareForm.step2 = this.step2Data;

    this.healthCareForm.step2['proficiencyTesting'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.healthCareForm.step2['proficiencyTesting'] = this.proficiencyTesting;
    }

    this.loader = false;
    // this.step2DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
    this.healthCareForm = {};
    // this.step3Data = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step3Data.is_draft = true;
    this.healthCareForm.saved_step = '3';
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;

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

    this.healthCareForm.step3 = this.step3Data;
    this.loader = false;
    // this.step3DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
    this.healthCareForm = {};
    this.healthCareForm.step4 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step4Data.is_draft = true;
    this.healthCareForm.saved_step = '4';
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    this.healthCareForm.step4 = this.step4Data;
    this.loader = false;
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
    this.healthCareForm = {};
    this.healthCareForm.step6 = {};
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
    this.step6Data.is_draft = true;
    this.healthCareForm.saved_step = '6';
    this.healthCareForm.step6 = this.step6Data;

    // console.log(this.healthCareForm);
    this.loader = false;
    // this.step5DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
    this.healthCareForm = {};
    this.healthCareForm.step7 = {};
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    this.step7Data.authorizationList = this.authorizationList;
    this.step7Data.recommend = this.recommend;
    this.step7Data.is_draft = true;
    this.healthCareForm.saved_step = '7';

    this.healthCareForm.step7 = this.step7Data;
    // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
    this.loader = false;
    // this.step6DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
  if(stepCount == 'step8') {
    this.toastr.success('Save Draft Successfully', '');
  }
  if(stepCount == 'step9') {
    this.healthCareForm = {};
    this.healthCareForm.step9 = {};

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

onSubmitStep2(ngForm2: any){
  // this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);

  if(ngForm2.form.valid) {
    this.healthCareForm = {};
    this.healthCareForm.step2 = {};
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    this.healthCareForm.saved_step = '2';
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step2Data.application_id = applicationId;
    this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    
    this.step2Data.is_draft = false;
    this.healthCareForm.step2 = this.step2Data;

    this.healthCareForm.step2['proficiencyTesting'] = [];
    
    if(this.ownOrgBasicInfo) {
      this.healthCareForm.step2['proficiencyTesting'] = this.proficiencyTesting;
    }

    // this.step2DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.loader = false;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
    this.healthCareForm = {};
    // this.step3Data = {};
    var applicationId = sessionStorage.getItem('applicationId');
    // this.step3Data.application_id = applicationId;
    this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step3Data.is_draft = false;
    this.healthCareForm.saved_step = '3';
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;

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

    this.healthCareForm.step3 = this.step3Data;
    // this.step3DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.loader = false;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
// this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);
  if(ngForm4.form.valid) {
    this.healthCareForm = {};
    this.healthCareForm.step4 = {};
    var applicationId = sessionStorage.getItem('applicationId');
    this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step4Data.is_draft = false;
    this.healthCareForm.saved_step = '4';
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    this.healthCareForm.step4 = this.step4Data;
    // this.step4DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.loader = false;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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

//Scope Save functions
saveScope(){
    
  let scopeValues: any =[];
  let scopeIds:any =[];
  let scopeSelValues:any =[];
  console.log("dynamic ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns, " -- ", this.schemeRows, " -- ", this.formApplicationId);
  var key = '';
  var key2 = '';
  let resultAr: any={};
  let scopeCollections: any={};
  let selectScheme          = '';//this.schemeRows[0].id;
  
  for(var t=0;t<this.schemeRows.length; t++){

    console.log("Scheme Sec: ", t," -- ", scopeCollections);
    selectScheme = this.schemeRows[t].id;
    if(selectScheme == undefined){
      console.log(">>Heading scheme notfff....exit", selectScheme);
      break;
    }
    let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
    console.log("@Scheme Data: ", getData);
    let scopeTitle: string ='';
    //scopeTitle  = getData.title.toString().toLowerCase().split(" ").join('_');
    if(getData){
      scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
    }

    scopeCollections[selectScheme] = {};
    scopeCollections[selectScheme]['scope_heading'] = {};
          for(var key in this.dynamicScopeFieldColumns[scopeTitle]){
                //console.log(">>> ", key, " :: ", this.dynamicScopeFieldColumns[key], " -- ", typeof this.dynamicScopeFieldColumns[key]);
                let tempData: any = this.dynamicScopeFieldColumns[scopeTitle];
                if(typeof tempData === 'object'){
                  tempData.forEach((item,key) => {
                        //console.log(item);
                        let keyIds = item[0].idVal;
                        let name = item[0].name;
                        let tempObj = {};
                        tempObj[keyIds] = name;
                        scopeCollections[selectScheme]['scope_heading'][keyIds] = name;
                    });
                }
          }
  }
  console.log(">>> build scope: ", scopeCollections, " -- ", this.dynamicScopeModel, " -> Scheme: ", this.schemeRows);
  //return;

  let secInd: number = 0;
  let resultTempAr: any = [];
  let tempDataObj: any = {};
  let tempDataRow: any = {};
  if(this.schemeRows.length){
      for(var t=0;t<this.schemeRows.length; t++){

          console.log("Scheme Sec: ", t);
          secInd = t;
          selectScheme = this.schemeRows[t].id;
          let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
          console.log("@Scheme Data: ", getData);
          if(getData == undefined){
            console.log("scheme not selecting...exit...", selectScheme, " -- ", getData);
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
              console.log("Section: ", scopeTitle, " -- ", rowLen)
              
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
                    console.log("...Col>>> ",colIndex, " :: ", colItem[0], " -- ", this.dynamicScopeModel[scopeTitle][key][k])
                    let colData: any = colItem[0];
                    let optionNameAr: any = [];
                    let optionName: any;
                    if(colIndex == 0){
                      //first coloumn row values - firstFieldValues
                      console.log(">>>> First column: ");
                      let selTitle: any       = colItem[0].title;
                      let selTitleValues: any = this.dynamicScopeModel[scopeTitle][key][k]['firstFieldValues'];
                      let fvalue: any         = this.dynamicScopeModel[scopeTitle][key][k][selTitle];
                      let getVal: any         = selTitleValues.find(data => data.field_value.id == fvalue)
                      console.log("<><><><> ", getVal);
                      if(getVal){                  
                        getVal = getVal.value;
                      }
                      console.log("First field data: ", selTitleValues, " -- ", fvalue, " -- ", getVal);
                      //tempObj[selectScheme][colData.idVal] = getVal;
                      tempDataRow[colData.idVal] = getVal;
                      
                    }else{
                        //Map column key to row key values
                        
                      let selTitle: any       = colItem[0].title;
                      let selTitleVal: any    = colItem[0].values;
                      let selTitleValues: any = this.dynamicScopeModel[scopeTitle][key][k][selTitleVal];
                      console.log("@fetching col index Data: ", colIndex, " -- ", selTitle, " -- ", selTitleVal, " -- ", selTitleValues);
                      let fvalue: any         = this.dynamicScopeModel[scopeTitle][key][k][selTitle];
                      console.log(">>>Type of FVAL: ", typeof fvalue);
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
                      console.log("Column field data: ",colIndex, " -- ", selTitleValues, " -- ", fvalue, " -- ", optionName);
                      //let tempData: any = {};
                      tempDataRow[colData.idVal] = optionName;
                      //tempObj[selectScheme].push(tempData);
                      //tempObj[selectScheme][colData.idVal] = optionName;                      
                    }                    
                })
                //
                tempDataObj[selectScheme].push(tempDataRow);
              } 
              console.log("@updated Temp object: ", tempDataObj); 
              // for(var p in tempDataObj){
              //     console.log(tempDataObj[p], " -- ", p);
              //     resultTempAr.push(tempDataObj[p]);
              // }
              scopeCollections[selectScheme]['scope_value'] =  tempDataObj[selectScheme];//resultTempAr[0];
              console.log(">>>> Result Ar: ", resultTempAr, " -- ", " -- ", tempDataObj, " -- ", scopeCollections);
            }
          }
      }
  }

  //Update scope data
  if(this.editScopeData != undefined && this.editScopeData != null){
      console.log("update scope: ", this.editScopeData, " -- ", scopeCollections)
      let tempScopeDetails: any={};
      let checkMatch: boolean = false;
      for(var key in this.editScopeData){
        tempScopeDetails[key] = {};
        tempScopeDetails[key]['scope_value'] = [];
        console.log(">>> ", key, " :: ", this.editScopeData[key]);
        checkMatch = this.getMatchScheme(key, scopeCollections);
        console.log("@@@ Finding schme status...", key);
            if(checkMatch){
              console.log("#>>> Find scheme in edit scope and update/marge...");
              this.editScopeData[key]['scope_value'].forEach((item, p) => {
                scopeCollections[key]['scope_value'].push(this.editScopeData[key]['scope_value'][p])
              })
              //scopeCollections[key]['scope_value'].push(this.editScopeData[key]['scope_value']);
            }else{
              console.log("@>>> Not Found scheme in edit scope and update and marge...");
              scopeCollections[key] = {};
              scopeCollections[key]['scope_heading']  = {};
              scopeCollections[key]['scope_heading']  = this.editScopeData[key]['scope_heading'];
              scopeCollections[key]['scope_value']    = [];
              scopeCollections[key]['scope_value']    = this.editScopeData[key]['scope_value']
            }
      }      
  }

  //filter scope collections
  console.log(">> Fileter collection...", scopeCollections);
  for(var p in scopeCollections){
    if(scopeCollections[p]){
        let getDetails: any = scopeCollections[p]['scope_value'];
        console.log(">>>Value: ", p, " -- ", getDetails, " -- ", getDetails.length);
        if(getDetails.length == 0){
          console.log(">>>Empty values: ", p, " deleting");
          delete scopeCollections[p];
        }
    }
  }


  console.log("#Updated Scope after edit: ", scopeCollections, " -- ", this.editScopeData);
  this.step5Data['scopeDetails']    = scopeCollections;
}
//scopeCollections[selectScheme]['scope_heading'][keyIds]  //assign scope heading
//scopeCollections[selectScheme]['scope_value'] //assign unmatch scope value

getMatchScheme(scId: any, scopeData: any){
  console.log("@@@ Finding schme...");
  for(var key in scopeData){
    console.log("# Finding schme...", key, " -- ", scId);
      if(key == scId){
        return true;
      }
  }
  return false;
}


//Scope Save functions

onSubmitStep5(ngForm: any, type?:any) {
  //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);

  
  //this.saveScope();
  console.log(">>>Enter....1:  ", type)
  this.healthCareForm = {};
  this.healthCareForm.step5 = {};  
  var applicationId = sessionStorage.getItem('applicationId');
  this.step5Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
  //this.healthCareForm.step5.application_id = this.formApplicationId;
  this.healthCareForm.step5 = this.step5Data;
  this.healthCareForm.step5['scheme_id'] = 1;//this.schemeRows[0].id;
  
  //Check dynamic model column fields validation
  let secInd: number;
  let selectScheme: any;
  let errorScope: boolean = false;
  if(this.schemeRows.length){
    for(var t=0;t<this.schemeRows.length; t++){
        secInd = t;
        selectScheme = this.schemeRows[t].id;
        let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
        //console.log("@Scheme Data: ", getData);
        let scopeTitle: string ='';
        if(getData){
          scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
        }
            for(var key in this.dynamicScopeModel[scopeTitle]){
              if(key == 'fieldLines'){
                let rowLen = this.dynamicScopeModel[scopeTitle][key].length;
                // Browse rows
                //console.log("Section: ", scopeTitle, " -- ", rowLen)                
                for(var k=0; k<rowLen; k++){
                    this.dynamicScopeFieldColumns[scopeTitle].forEach((colItem,colIndex) => {
                          let fieldSelValue: any;
                          let selTitle: any       = colItem[0].title;
                          fieldSelValue         = this.dynamicScopeModel[scopeTitle][key][k][selTitle];
                          //console.log(">>> ", scopeTitle, " :: ", selTitle, " -- ", fieldSelValue);
                          if(fieldSelValue === undefined){
                            errorScope = true;
                          }
                    })
                }
              }
            }
      }
  }
  if(errorScope && type === undefined){
    this.toastr.warning('Please Fill required field','Validation Error');
    return false;    
  }
  //Check dynamic model column fields validation 


    console.log("scheme Rows: ", this.schemeRows,  " -- ", this.schemeRows.length, " :: ", this.editScopeData, " :: ", this.getScopeData);

    //console.log(">>>Form Submit: ", ngForm, " -- ",ngForm.form, " -- ", this.schemeRows); 
   
   //return;
    //ngForm.form.valid &&
    if(!ngForm.form.valid && type == undefined && this.schemeRows.length == 1 
        && this.schemeRows[0].id === undefined && this.editScopeData != undefined && this.editScopeData != null) {
      console.log(">>>Bypass saving...");
      console.log(">>>Enter....2")
      this.saveScope();
      console.log(">>> step5 submit...", this.step5Data, " -- ", this.healthCareForm);
      this.healthCareForm.step5.is_draft = false;
      this.healthCareForm.saved_step = 5;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
      .subscribe(
        res => {
          ////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }
    else if(ngForm.form.valid && type == undefined) {
      console.log(">>>Scope saving...");
      console.log(">>>Enter....3")
      this.saveScope();
      console.log(">>> step5 submit...", this.step5Data, " -- ", this.healthCareForm);
      this.healthCareForm.step5.is_draft = false;
      this.healthCareForm.saved_step = 5;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
      .subscribe(
        res => {
          ////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }
    else if( type != undefined && type == true){
      console.log(">>>Enter....4")
      this.healthCareForm.step5.is_draft = true;
      this.healthCareForm.saved_step = 5;
      this.saveScope();
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
      .subscribe(
        res => {
          ////console.log(res,'res')
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
      console.log(">>>...");
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }

}

onSubmitStep6(ngForm6: any){
  // this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
  if(ngForm6.form.valid) {
    this.healthCareForm = {};
    this.healthCareForm.step6 = {};
    this.healthCareForm.saved_step = '6';
    this.healthCareForm.email = this.userEmail;
    this.healthCareForm.userType = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step6Data.is_prelim_visit = this.step6Data.is_prelim_visit == 0 ? false : true;
    this.step6Data.is_draft = false;
    this.healthCareForm.step6 = this.step6Data;

    console.log(this.healthCareForm);
    // this.step5DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
    this.loader = false;
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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

  this.healthCareForm = {};
  this.healthCareForm.step7 = {};
  this.healthCareForm.email = this.userEmail;
  this.healthCareForm.userType = this.userType;
  var applicationId = sessionStorage.getItem('applicationId');
  this.step7Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
  this.healthCareForm.saved_step = '7';
  this.step7Data.authorizationList = this.authorizationList;
  this.step7Data.recommend = this.recommend;
  this.step7Data.is_draft = false;
  this.step7Data.application_date = new Date();

  this.healthCareForm.step7 = this.step7Data;
  // this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);

  // this.step6DataBodyFormFile.append('data',JSON.stringify(this.healthCareForm));
  // console.log(this.healthCareForm,'healthCareForm');
  this.loader = false;
  this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.healthCareForm)
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
    this.createPaymentButton(this.transactionsItem, this.healthCareForm, this);
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
this.healthCareForm = {};
this.healthCareForm.step9 = {};

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
            setTimeout(()=>{
              let elem = document.getElementById('openAppDialog');
              // console.log("App dialog hash....", elem);
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
  this.healthCareForm.step9.is_draft = true;
  this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.healthCareForm)
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

}

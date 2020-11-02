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
import {CustomModalComponent} from '../../../../utility/custom-modal/custom-modal.component';
import { find } from 'rxjs/operators';

@Component({
  selector: 'app-testing-calibration-form', 
  templateUrl: './testing-calibration-form.component.html',
  styleUrls: ['./testing-calibration-form.component.scss'],
  providers:[CustomModalComponent]
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

  isPrelimSubmitted: boolean = false;

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
  public isNoteSubmit:boolean = false;
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

  is_main_activity_note_entry: boolean = false;
  recommendYearValues: any[] =[];

  paymentStepComp: boolean = false;


  shift2_from: boolean = false;
  shift2_to: boolean = false;
  shift3_from: boolean = false;
  shift3_to: boolean = false;

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
         this.readTermsCond = true;
         this.authorizeCheckCount(elem, 'read')
      }else{
        this.authorizeCheckCount(elem, 'read')
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

  schemeMaster: any;
  criteriaMaster: any[] =[];

  isApplicationSubmitted: boolean = false;
  termsGeneral: any;
  termsILA: any;

  //declare scope type
  scopeFamilyNull: boolean = false;
   schemeRows: Array<any> = [{}];
   scopeFamilyRows: Array<any> = [{}];
   fullTypeFamily:any[]=[];

  dynamicScopeModel:any         = {};   //Master form data object
  dynamicScopeFieldColumns:any  = {};  
  dynamicScopeFieldType:any     = {};
  fullScope:any[]=[];
  scopeDataLoad: boolean = false;
  scopeDataError: boolean = false;
  scopeDataset: any =[];
  editScopeData: any;
  selectDeleteID: number =0;
  selectDeleteKey: any;
  selectDeleteIndex: any;
  deleteEditScopeConfirm: boolean = false;
  deleteScopeConfirm: boolean = false;
  
  constructor(public Service: AppService, public constant:Constants,public router: Router,
    public toastr: ToastrService,public _trainerService:TrainerService,
    private _customModal: CustomModalComponent,
    private modalService: NgbModal,public sanitizer: DomSanitizer) { }


  /**********************
   * Scope Functions
   * 
   * 
   */

   //Family rows
   addFamilyRow(obj: any, scopeTitle: string, index: number){
    this.newRow     =   {};
    console.log(">>> get title: ", scopeTitle)
    let findRows: any = this.fullTypeFamily.find(rec => rec.title == scopeTitle);
    console.log(">>> fanilt: ", findRows);
    if(findRows){
      if(findRows.scopeFamilyRows != undefined && typeof findRows.scopeFamilyRows == 'object'){
        findRows.scopeFamilyRows.push(this.newRow);
      }
    }
    
    //obj.push(this.newRow);
   }
   removeFamilyRow(obj: any, scopeTitle: string, index: number){
    obj.splice(index, 1);
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
  getFieldTooltip(modelValue, modelObj){
    //////console.log("Tooltip data value: ", modelValue, " :: ", modelObj);
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
        ////////////console.log('Text value: ', findText);
        if(typeof findText === 'object' && findText.value != ''){
          ////////////console.log('Value find: ', findText.value);
            return findText.value;
        }
    }
  }
  getSchme(sid: number){
    let getSchemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
    //////console.log("data: ", getSchemeData);
    if(getSchemeData){
      return getSchemeData.title;
    }
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
      this._customModal.closeDialog();
      //
  }
  removeScopeLine(lineIndex: number, secIndex: number){
    //console.log("deleting rows....1: ", this.dynamicScopeModel, " -- ", lineIndex, " :: ", secIndex);
    if(this.dynamicScopeModel[secIndex].fieldLines != undefined && this.dynamicScopeModel[secIndex].fieldLines.length > 0){
      //console.log("deleting rows....2");
      this.dynamicScopeModel[secIndex].fieldLines.splice(lineIndex, 1);
    }
    this._customModal.closeDialog();
}

//addScopeLine(secName:any, secIndex: number, lineIndex: number, lineData: any){
  addScopeLine(lineIndex: number,secIndex: number, lineData: any){
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
              this.onChangeScopeOption(getValue,secIndex,0,lineIndex,0,'initLoad');
            }
          });
        }
      //}
  }    
  ////console.log("Add Line status: ", this.dynamicScopeModel);
}

onChangeScopeOption(getValues: any,secIndex: any,familyId: any, lineIndex: number, columnIndex: number, type?:string) {
  console.log('@GET Options: ', getValues, " :: ",  lineIndex, " -- ", type, " -- ", columnIndex, " --sec--  ", secIndex);

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
        console.log("Load scope SErvice Data: ", record, " -- ", this.dynamicScopeFieldColumns[secIndex],  " - ", this.dynamicScopeModel);
        //get through array find key column
        if(record['scopeValue'].length == undefined){
          record['scopeValue'] = [];
        }
        let theColumnIndex  = columnIndex;
        let nextColumnIndex = theColumnIndex + 1;
        let totSecColumn    = this.dynamicScopeFieldColumns[secIndex][familyId].length;//this.dynamicScopeFieldColumns[secIndex].length;
        //////console.log(">>>Column Data: ", theColumnIndex, " -- ", nextColumnIndex, " -- ", totSecColumn, " -- ", );
        ////console.log("select scope values: ", record['scopeValue'], " :: ", this.dynamicScopeFieldType[secIndex], " len: ", record['scopeValue'].length);

        //Auto selected for one item dropdown
        if(record['scopeValue'].length > 0 && record['scopeValue'].length == 1){
            ////console.log(">>>dep scope data: ", record['scopeValue']);
            let getSelValue = 0;
            if(typeof record['scopeValue'][0] === 'object'){                  
              getSelValue = record['scopeValue'][0].field_value.id;
              ////console.log(">>assigning scope default value: ", getSelValue);
              this.dynamicScopeModel[secIndex][familyId].fieldLines[lineIndex][this.dynamicScopeFieldColumns[secIndex][familyId][nextColumnIndex][0].title] = getSelValue;
              this.onChangeScopeOption(getSelValue,secIndex,familyId,lineIndex,nextColumnIndex,'initLoad');
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
            let colDef: string = this.dynamicScopeFieldType[secIndex][familyId][nextColumnIndex].defValue                                                       

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
              this.dynamicScopeModel[secIndex][familyId]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][familyId][nextColumnIndex][0].values] = resultUniq;//record['scopeValue'];
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
              this.dynamicScopeModel[secIndex][familyId]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][familyId][nextColumnIndex][0].values] = colTempAr;
            }
        }
      console.log("@@@Updated Model Values: ", this.dynamicScopeModel);
    });
}

getCriteria(value, secInd: any, typeFamily?: any, typeTitle?: any){
  console.log("select Criteris: ", value, " -- ", secInd, " == ", typeFamily, " -- TypeTitle: ", typeTitle);
  this.scopeDataLoad = true;
  if(value != undefined && value > 0){
     //Get fullscope
     //let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.criteriaIdByScope + value;
     //this.Service.apiServerUrl+"/"
     //value =18;
     //let apiURL = this.Service.apiUatServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data+"?scheme="+value;
     let apiURL: string = '';
     if(typeFamily == undefined){
      apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data+"?scheme="+value;
     }
     if(typeFamily != undefined && typeFamily != ''){
      apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data+"?scheme="+value+"&family="+typeFamily;
     }
     //this.constant.API_ENDPOINT.criteriaScope + value;
     console.log("API: ", apiURL);

     this.Service.getwithoutData(apiURL).subscribe(record => {
          console.log('Fullscope: ', record, " -- ", typeFamily);
          let dataScope:any = [];
          let fieldTitleValue: any = [];
          dataScope = record['data'];
          this.scopeDataLoad = false;
          let customKey;
          let familyId: any;
          let isFamilyData: boolean = false;
          let familyData: any[]=[];
          

          if(typeFamily == undefined){
            console.log(">>>> type  nor found: ", dataScope.scopeFamily);
              //if(dataScope.scopeFamily == 'null'){
                console.log(">>>> type  nor found....1");
                let schemeId: number;
                  if(dataScope.scopeFamily == null){
                    this.scopeFamilyNull = true;
                    isFamilyData = false;
                  }else{
                    this.scopeFamilyNull = false;
                    isFamilyData = true;
                    familyData = dataScope.scopeFamily;
                  }                  

                  if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
                    let firstColumValues = dataScope.firstColumnData[0];
                  }
                  let scopeName: string = '';
                  let scopeTitle: string ='';
                  let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == value);
                  console.log(">>> Fined Scheme: ", getData);
                  if(getData){
                    scopeName   = getData.title;
                    scopeTitle  = getData.title.toString().toLowerCase().split(" ").join('_'); 
                    schemeId    = getData.scope_accridiation.id;

                    //check already existing scheme...
                    // for(var m in this.dynamicScopeModel){
                    //   console.log("mkey: ", m, " -- ", scopeTitle);
                    //     //let fobj: any = this.fullScope;
                    //     if(m === scopeTitle){
                    //       this.fullScope.splice(secInd, 1);
                    //       this.toastr.error("Scheme should be unique, Please check.","Validation")
                    //       return;
                    //     }
                    // }
                    familyId = 0;
                    if(dataScope.scopeFamily == null){
                      this.dynamicScopeFieldColumns[schemeId] = [];
                      this.dynamicScopeFieldColumns[schemeId][familyId.toString()] = [];
                      this.dynamicScopeFieldType[schemeId] = [];
                      this.dynamicScopeFieldType[schemeId][familyId.toString()] = [];
                      this.dynamicScopeModel[schemeId] = {};
                      this.dynamicScopeModel[schemeId][familyId.toString()] = {};
                    }
                      //scopeFamilyRows
                      if(this.fullTypeFamily.length){
                          let pushObj: any = {
                            title: scopeTitle, id: getData.scope_accridiation.id, name: scopeName,familyId: familyId, familyData: familyData, scopeFamilyRows: [{}], scopeRows: [], isFamily: isFamilyData
                          }
                          
                          if(this.fullTypeFamily[secInd] != undefined && !this.Service.isObjectEmpty(this.fullTypeFamily[secInd])){
                            console.log("@Existing scheme...found", this.fullTypeFamily[secInd]);
                            this.fullTypeFamily[secInd] = pushObj;
                          }else{
                              this.fullTypeFamily.push({
                                title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName, familyData: familyData, scopeFamilyRows: [{}], scopeRows: [], isFamily: isFamilyData
                              });
                          }
                      }else{
                          this.fullTypeFamily.push({
                              title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName, familyData: familyData, scopeFamilyRows: [{}], scopeRows: [], isFamily: isFamilyData
                            });
                      }

                      //scope rows
                     let getTypeData: any = this.fullTypeFamily.find(item => item.title == scopeTitle);
                     console.log(">>> get type: ", getTypeData);
                      if(getTypeData.scopeRows.length){
                        //console.log("@Existing scheme....1");
                        let pushObj: any = {
                          SchemeTitle: typeTitle, id: getTypeData.id, name:getTypeData.name, familyId: familyId, familyName: ''
                        }
                        
                        if(getTypeData.scopeRows[secInd] != undefined && !this.Service.isObjectEmpty(getTypeData.scopeRows[secInd])){
                          //console.log("@Existing scheme...found", findType.scopeRows[secInd]);
                          getTypeData.scopeRows[secInd] = pushObj;
                        }else{
                          getTypeData.scopeRows.push({
                            SchemeTitle: typeTitle, id: getTypeData.id, name:getTypeData.name, familyId: familyId, 
                          });
                        }
                    }else{
                      getTypeData.scopeRows.push({
                        SchemeTitle: typeTitle, id: getTypeData.id, name:getTypeData.name,  familyId: familyId, 
                      });
                    }

                      

                    // if(this.fullScope.length){
                    //     let pushObj: any = {
                    //       title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                    //     }
                        
                    //     if(this.fullScope[secInd] != undefined && !this.Service.isObjectEmpty(this.fullScope[secInd])){
                    //       //////console.log("@Existing scheme...found", this.fullScope[secInd]);
                    //       this.fullScope[secInd] = pushObj;
                    //     }else{
                    //         this.fullScope.push({
                    //           title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                    //         });
                    //     }
                    // }else{
                    // this.fullScope.push({
                    //     title: scopeTitle, id:getData.scope_accridiation.id, name:scopeName
                    //   });
                    // }
                  }

                  console.log("Full Type family datastructure: ", this.fullTypeFamily);

                  if(dataScope.scopeValue.length){
                    var counter = 0;let defLine = {};
                    dataScope.scopeValue.forEach((rec, key) => {
                      ////console.log("--Scope ", rec, " :: ", key);

                      if(rec.scope != undefined && typeof rec.scope === 'object' && !this.Service.isObjectEmpty(rec.scope)){
                          let fieldType: any = {
                            id: rec.scope.id,
                            title: rec.title,
                            inputType: rec.scope.input_type,
                            defValue: rec.scope.default_value
                          }
                          this.dynamicScopeFieldType[schemeId][familyId.toString()].push(fieldType);
                      }

                      
                      //this.fullScope[0].title
                      customKey = rec.title.toString().toLowerCase().split(' ').join('_');//rec.accr_title[0];
                      //this.dynamicScopeModel[customKey] = [];
                      this.dynamicScopeFieldColumns[schemeId][familyId.toString()][key] = [];
                      //this.dynamicScopeFieldColumns[key] = [];

                      fieldTitleValue[key] = [];
                      //this.dynamicScopeModel[customKey].fieldLines = [];
                      this.dynamicScopeModel[schemeId][familyId.toString()]['fieldLines'] = [];

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
                      this.dynamicScopeFieldColumns[schemeId][familyId.toString()][key].push(colObj);
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
                          this.onChangeScopeOption(getValue,schemeId,familyId.toString(),key,key,'initLoad');
                        } 
                        setTimeout(()=>{
                          if(getValue != undefined && getValue > 0){  
                            let fSelValues: any = {};
                            //fSelValues[]                    
                            this.dynamicScopeModel[schemeId][familyId.toString()]['fieldLines'][0][this.dynamicScopeFieldColumns[schemeId][familyId.toString()][0][0].values] = [defLine['firstFieldValues'][0]];
                            this.dynamicScopeModel[schemeId][familyId.toString()].fieldLines[key][this.dynamicScopeFieldColumns[schemeId][familyId.toString()][key][0].title] = getValue;
                          }
                        },0)                                
                        
                      }
                      //Load first field value default by selecting first item
                      this.dynamicScopeModel[schemeId][familyId.toString()].fieldLines.push(defLine);
                      //this.dynamicScopeModel[customKey].fieldLines.push(defLine);
                    });
                    console.log("@@@@Update Model: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);

                  }
              //}
              // else{
              //   this.scopeFamilyNull = false;
              // }
          }else{
            console.log(">>>> type found");
            // type found
            let getTypeData: any;
            let familyTitle: string = '';
            let familyName: string = '';
            let familyData: any;

            let schemeId: number;
            let familyId: number;

            if(typeTitle != undefined){
              getTypeData = this.fullTypeFamily.find(item => item.title == typeTitle);
              console.log("Type data: ", getTypeData);
              schemeId = getTypeData.id;
            }
            if(getTypeData){

                  familyData  = getTypeData.familyData.find(rec => rec.scope_family == typeFamily)
                  if(familyData){
                    familyName = familyData.title.toString();
                    familyTitle = familyData.title.toString().toLowerCase().split(" ").join('_'); ;
                    familyId = typeFamily;
                  }

                  if(getTypeData.scopeRows.length){
                    //console.log("@Existing scheme....1");
                    let pushObj: any = {
                      SchemeTitle: typeTitle, id: getTypeData.id, name:getTypeData.name, familyTitle: familyTitle, familyId: familyId, familyName: familyName
                    }
                    
                    if(getTypeData.scopeRows[secInd] != undefined && !this.Service.isObjectEmpty(getTypeData.scopeRows[secInd])){
                      //console.log("@Existing scheme...found", findType.scopeRows[secInd]);
                      getTypeData.scopeRows[secInd] = pushObj;
                    }else{
                      getTypeData.scopeRows.push({
                        SchemeTitle: typeTitle, id: getTypeData.id, name:getTypeData.name, familyTitle: familyTitle, familyId: familyId, familyName: familyName
                      });
                    }
                }else{
                  getTypeData.scopeRows.push({
                    SchemeTitle: typeTitle, id: getTypeData.id, name:getTypeData.name, familyTitle: familyTitle, familyId: familyId, familyName: familyName
                  });
                }
            }

            console.log("@Updated Type data: ", getTypeData);
              this.dynamicScopeFieldColumns[schemeId] = [];
              this.dynamicScopeFieldColumns[schemeId][familyId] = [];

              this.dynamicScopeFieldType[schemeId] = [];
              this.dynamicScopeFieldType[schemeId][familyId] = [];

              this.dynamicScopeModel[schemeId] = {};
              this.dynamicScopeModel[schemeId][familyId] = {};

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
                      this.dynamicScopeFieldType[schemeId][familyId].push(fieldType);
                  }

                  
                  //this.fullScope[0].title
                  customKey = rec.title.toString().toLowerCase().split(' ').join('_');//rec.accr_title[0];
                  //this.dynamicScopeModel[customKey] = [];
                  this.dynamicScopeFieldColumns[schemeId][familyId][key] = [];
                  //this.dynamicScopeFieldColumns[key] = [];

                  fieldTitleValue[key] = [];
                  //this.dynamicScopeModel[customKey].fieldLines = [];
                  this.dynamicScopeModel[schemeId][familyId]['fieldLines'] = [];

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
                  this.dynamicScopeFieldColumns[schemeId][familyId][key].push(colObj);
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
                      this.onChangeScopeOption(getValue,schemeId,familyId,key,key,'initLoad');
                    } 
                    setTimeout(()=>{
                      if(getValue != undefined && getValue > 0){  
                        let fSelValues: any = {};
                        //fSelValues[]                    
                        this.dynamicScopeModel[schemeId][familyId]['fieldLines'][0][this.dynamicScopeFieldColumns[schemeId][familyId][0][0].values] = [defLine['firstFieldValues'][0]];
                        this.dynamicScopeModel[schemeId][familyId].fieldLines[key][this.dynamicScopeFieldColumns[schemeId][familyId][key][0].title] = getValue;
                      }
                    },0)                                
                    
                  }
                  //Load first field value default by selecting first item
                  this.dynamicScopeModel[schemeId][familyId].fieldLines.push(defLine);
                  //this.dynamicScopeModel[customKey].fieldLines.push(defLine);
                });
                console.log("@@@@Update Model: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);

              }
            

          }
                    
      ////////console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns, " ::-> ",this.fullScope);
     })
  }
}
/*
//make scope rows
                      if(this.fullTypeFamily){
                        //get scope rows key
                        

                      }
getCriteria(value, secInd: any){
  //console.log("select Criteris: ", value, " -- ", secInd);
  this.scopeDataLoad = true;
  this.scopeDataError = false;
  if(value != undefined && value > 0){
     //Get fullscope
     //let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.criteriaIdByScope + value;
     //this.Service.apiServerUrl+"/"
     //value =18;
     let apiURL = this.Service.apiUatServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data+"?scheme="+value;
     //this.constant.API_ENDPOINT.criteriaScope + value;
     ////console.log("API: ", apiURL);

     //this.fullScope = [];
     //this.dynamicScopeModel = [];
     //this.dynamicScopeFieldColumns = [];
     this.dynamicScopeFieldColumns[secInd] = [];
     this.dynamicScopeFieldType[secInd] = [];
     this.dynamicScopeModel[secInd] = {};

     this.Service.getwithoutData(apiURL).subscribe(record => {
          //console.log('Fullscope: ', record);
          let dataScope:any = [];
          let fieldTitleValue: any = [];
          dataScope = record['data'];
          this.scopeDataset= dataScope;
          this.scopeDataLoad = false;
          let customKey;
          if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
            let firstColumValues = dataScope.firstColumnData[0];
            ////console.log(">>Firstcolumn: ", firstColumValues);
            //this.fullScope.push(dataScope.scopeValue);              
            //title: "lifting_equipment", id:1, name:"Lifting Equipment"
            // this.fullScope = [{
            //   title: scopeTitle, id:1, name:scopeName
            // }];//dataScope.schemes;
            //console.log(">>> Fined Scope Section: ", this.fullScope, " -- ", this.step5Data.scheme_ids);
          }
          let scopeName: string = '';
            let scopeTitle: string ='';
            let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == value);
            //console.log(">>> Fined Scheme: ", getData);
            if(getData){
              scopeName = getData.title;
              scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');



              if(this.fullScope.length){
                  //console.log("@Existing scheme....1");
                  //let findSchme = this.fullScope.find(item => item.id == value);
                  ////console.log("@Existing scheme....2", findSchme);
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
                  this.dynamicScopeFieldType[secInd].push(fieldType);
              }

              
              //this.fullScope[0].title
               customKey = rec.title.toString().toLowerCase().split(' ').join('_');//rec.accr_title[0];
              //this.dynamicScopeModel[customKey] = [];
              this.dynamicScopeFieldColumns[secInd][key] = [];
              //this.dynamicScopeFieldColumns[key] = [];

              fieldTitleValue[key] = [];
              //this.dynamicScopeModel[customKey].fieldLines = [];
              this.dynamicScopeModel[secInd]['fieldLines'] = [];

              if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
                ////////console.log("first value length: ", rec.firstFieldValues.length);
                defLine['firstFieldValues'] = dataScope.firstColumnData;
              }
              let fieldValues = rec.title.split(" ").join("")+"Values";
              let fieldTitle = rec.title.split(" ").join("_");
              let filedId = rec.id;

              let colObj: any ={};
              colObj = {title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId};
              //console.log(">>col: ",colObj);
              this.dynamicScopeFieldColumns[secInd][key].push(colObj);
              //this.dynamicScopeFieldColumns[secInd][key].push({title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId});
              defLine[fieldValues] = [];

              console.log(">>> Field values: ", fieldValues, " -- ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeModel[secInd]);

              if(defLine['firstFieldValues'].length > 0  && key == 0){
                //////console.log("calling.....default...1");
                let getValue = defLine['firstFieldValues'][0].field_value.id;
                
                //console.log("calling.....default...1: ", getValue, " -- ", defLine['firstFieldValues']);
                if(key === 0){
                  //console.log("calling.....default...1.1 GEt Value:  ", getValue);
                  //this.dynamicScopeModel['fieldLines'][0][this.dynamicScopeFieldColumns[secInd][0][0].values] = [defLine['firstFieldValues'][0]];
                  fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
                }
                //////console.log("calling.....default...1.2");
                //Default load next column 
                if(key == 0){
                  this.onChangeScopeOption(getValue,secInd,key,key,'initLoad');
                } 
                setTimeout(()=>{
                  if(getValue != undefined && getValue > 0){  
                    let fSelValues: any = {};
                    //fSelValues[]                    
                    this.dynamicScopeModel[secInd]['fieldLines'][0][this.dynamicScopeFieldColumns[secInd][0][0].values] = [defLine['firstFieldValues'][0]];
                    this.dynamicScopeModel[secInd].fieldLines[key][this.dynamicScopeFieldColumns[secInd][key][0].title] = getValue;
                  }
                },0)                                
                
              }
              // let arr = [];  
              // let columnsDyna: any= {};
              // columnsDyna = this.dynamicScopeFieldColumns;
              // Object.keys(columnsDyna).map(function(key){  
              //     arr.push({[key]:columnsDyna[key]})  
              //     return arr;  
              // });  


              
              //Load first field value default by selecting first item
              this.dynamicScopeModel[secInd].fieldLines.push(defLine);
              //this.dynamicScopeModel[customKey].fieldLines.push(defLine);
            });

            console.log("@@@@Update Model: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);

          }
          //Load first field value default by selecting first item
          //////console.log("calling.....default...1.4", this.dynamicScopeModel[customKey].fieldLines);
          ////console.log("@Loading Model.........", this.dynamicScopeModel);
          //this.loadDefaultColumnValues(this.dynamicScopeModel);

       
      ////console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns, " ::-> ",this.fullScope);
     },
     error => {
         console.log('no data..error....');
         this.scopeDataError = true;
     }
     )
  }
}
*/

  /**********************
   * Scope Functions
   * 
   * 
   */ 






  getData(getVal){
    //  console.log(">>>>Get MapBox Value: ", getVal);
     this.Service.mapboxToken = getVal;
  }

  scrollForm(el: HTMLElement)
  {
    //this.vps.scrollToAnchor(el);
    el.scrollIntoView({behavior: 'smooth'});
  }

  moveShift(theVal: any){
    let val;
    ////console.log(">>>change shift: ", theVal, " -- ",val);
    
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
      ////console.log(">>> shift 1 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
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

      ////console.log(">>> shift 2 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
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
      ////console.log(">>> shift 3 ", this.step1Data.duty_from2, " -- ",this.step1Data.duty_to2)
    }
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


  loadSchemeMaster(){
    /*
    structure
    scheme
    scope family
    scope table

    */
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration)
    .subscribe(
      res => {
        console.log("@Load scheme....", res);
        //console.log(">>sele schme Type: ", this.step1Data.cab_type);

        let schemeData: any = res['data']['schemes']
        if(typeof schemeData === 'object'){
            this.schemeMaster = schemeData;
            console.log(">>>schemee ", this.schemeMaster);
            if(this.step1Data.cab_type != undefined && this.step1Data.cab_type === 'testing_laboratory'){
              this.criteriaMaster = this.schemeMaster['testing_laboratory'];
            }
            if(this.step1Data.cab_type != undefined && this.step1Data.cab_type === 'calibration_laboratories'){
              this.criteriaMaster = this.schemeMaster['calibration_laboratory'];
            }

            //create type family data storage
            
        }
        console.log(">>>schcriteria master ", this.criteriaMaster);
      },
      error => {      
  })
  }

  loadTermsConditions(){
    let post: any = {};
    post['service_page_id'] = 3; // Testing/Calibration
    console.log(">>> Load terms....");
    this.Service.post(this.Service.apiServerUrl+"/" + 'terms-and-conditions/', post)
      .subscribe(
        res => {
          console.log(res,'Terms data');
          let getData: any = res;
          if(getData){
            this.termsGeneral = getData.data[0];
            this.termsILA     = getData.data[1];

           // console.log(">>> ", this.termsGeneral.content, " -- ", this.termsILA.content);
          }
          
        });
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

    var d = new Date();
    var yr = d.getFullYear();
    for(var k=2010; k<=2030; k++){
      this.recommendYearValues.push({title: k.toString(), value: k});
    }
    this.step7Data.recommend_year = yr;

    this.loadData();
    this.loadAppInfo();
    this.loadFormDynamicTable();
    this.loadCountryStateCity();
    this.stepDefaultValue();
    this.loadSchemeMaster();
    this.loadTermsConditions();
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
    if(typeof this.step1Data.physical_location_address != 'undefined')
    {
      this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step1Data.physical_location_address+'.json?access_token='+this.Service.mapboxToken+'','')
        .subscribe(res => {
          //console.log(res['features']);
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
    this.step1Data.is_hold_other_accreditation = "";
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

  loadData(){
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data)
      .subscribe( 
        res => {
          console.log("@Load scope....", res);
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
          this.step1Data.is_hold_other_accreditation = "";
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
            let saveStep: number;
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
                  ////console.log(">>>> payment details upload: ", getData.data.paymentDetails, " -- ", this.paymentFilePath, " :: ", filePath);
                }

                // if(getData.data.is_draft){
                //   saveStep = parseInt(getData.data.saved_step) - 1;
                // }else{
                //   if(parseInt(getData.data.saved_step) == 9){
        
                //     saveStep = parseInt(getData.data.saved_step) - 1;
                //   }else{
                //   saveStep = parseInt(getData.data.saved_step);
                //   }
                // }

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
                   // alert('...'+this.step1Data.is_main_activity+" -- "+res['data'].is_main_activity);
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

                //Step 5
                if(getData.data.scopeDetails != undefined && !this.Service.isObjectEmpty(getData.data.scopeDetails)){
                  console.log(">>> ", getData.data.scopeDetails);
                  //let jsonStrting = '{"18":{"scope_heading":{"43":"Inspection Category","45":"Inspection field","47":"Range of inspection","49":"Stage of the inspection","51":"Inspection criteria","53":"Inspection Activity Type"},"scope_value":[{"43":"Product","45":"Mechanical Engineering of Lifting Equipment","47":"Lever hoist","49":"In-service","51":"BS EN 13157","53":"A"},{"43":"Product","45":"Mechanical, Electrical and Structural Engineering of Lifting Equipment","47":"Mobile crane","49":"In-service","51":"BS 7121-2-1,BS 7121-2-3","53":"B,C"},{"43":"Product","45":"Mechanical Engineering of Lifting Equipment – Earth Moving","47":"Backhoe Loader","49":"In-service","51":"BS EN 474-4","53":"A,B"}]},"105":{"scope_heading":{"55":"Inspection Category","57":"Inspection field","59":"Range of inspection","61":"Stage of the inspection","63":"Inspection criteria","65":"Inspection Activity Type"},"scope_value":[{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Hook","61":"In-service","63":"Welcome","65":"Hello"},{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Chain sling","61":"In-service","63":"bbb","65":"aaa"}]}}';
                  //let jsonStrting = getData.data.scopeDetails.toString();
                  let jsonObject = getData.data.scopeDetails;//JSON.parse(jsonStrting);
                  //this.Service.oldScopeData = jsonObject;
                  this.editScopeData = jsonObject; 
                  //this.getScopeData = jsonObject;

                }

                //Step 6
                if(res['data'].is_prelim_visit != null){
                  //this.step6Data.is_prelim_visit = (res['data'].is_prelim_visit) ? "1" : "0";
                  this.step6Data.prelim_visit_val = (res['data'].is_prelim_visit) ? "1" : "0";
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
                  this.readReviewChecklist= true;
                  //this.step7Data.recommend_visit = 'second';
                  let visitRecomm = getData.data.recommend_visit.toString().replace(/["']/g, "");
                  this.step7Data.recommend_visit = visitRecomm;
                  this.step7Data.recommend_year = parseInt(getData.data.recommend_year);

                }

                //Step 9
                if(res['data'].paymentDetails != null && typeof res['data'].paymentDetails === 'object'){
                  // console.log(">>>payment details...show");
                    this.voucherSentData.voucher_code     = res['data'].paymentDetails.voucher_no;
                    this.voucherSentData.payment_date     = new Date(res['data'].paymentDetails.voucher_date);
                    this.voucherSentData.amount           = res['data'].paymentDetails.amount;

                    this.voucherSentData.transaction_no   = (getData.data.paymentDetails.transaction_no != 'null') ? getData.data.paymentDetails.transaction_no : '';
                    this.voucherSentData.payment_method   = (getData.data.paymentDetails.payment_method != 'null') ? getData.data.paymentDetails.payment_method : '' ;
                    this.voucherSentData.payment_made_by  = (getData.data.paymentDetails.payment_made_by != 'null') ? getData.data.paymentDetails.payment_made_by  : '';
                    this.voucherSentData.mobile_no        =  (getData.data.paymentDetails.mobile_no != 'null') ? getData.data.paymentDetails.mobile_no : '';

                    // this.voucherSentData.transaction_no   = res['data'].paymentDetails.transaction_no;
                    // this.voucherSentData.payment_method   = res['data'].paymentDetails.payment_method;
                    // this.voucherSentData.payment_made_by  = res['data'].paymentDetails.payment_made_by;
                    // this.voucherSentData.mobile_no        = res['data'].paymentDetails.mobile_no;

                    this.paymentFile = res['data'].paymentDetails.payment_receipt && res['data'].paymentDetails.payment_receipt != null ? this.constant.mediaPath+'/media/'+res['data'].paymentDetails.payment_receipt : '';
                    this.paymentReceiptValidation = true;
                }
              }
          });
      }
  }

  onSubmitStep1(ngForm1: any){
    // this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    setTimeout(() => {
      this.loadSchemeMaster();
    },1)
    
    //console.log(">>>schcriteria master ", this.criteriaMaster);
    this.isApplicationSubmitted = true;

    if(this.step1Data.duty_shift == '1')
    {
      if(typeof this.step1Data.duty_from1 == 'undefined' || typeof this.step1Data.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
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


    
    if(ngForm1.form.valid && this.isSubmit == true && this.isNoteSubmit == true) {
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
      //this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
      if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 1){
        this.step1Data.is_hold_other_accreditation = true;
      }
      if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 0){
        this.step1Data.is_hold_other_accreditation = false;
      }
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
          this.isApplicationSubmitted = false;
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
      //this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accreditation == '0' ? false : true;
      if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 1){
        this.step1Data.is_hold_other_accreditation = true;
      }
      if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 0){
        this.step1Data.is_hold_other_accreditation = false;
      }
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
            this.toastr.success('Save Draft Successfully', '');
            // this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
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
            this.toastr.success('Save Draft Successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }

    if(stepCount == 'step9') {
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
      this.voucherFile.append('is_draft',true);
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



  /*
  saveScope(){
    
    let scopeValues: any =[];
    let scopeIds:any =[];
    let scopeSelValues:any =[];
    console.log("dynamic ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns, " -- ", this.schemeRows, " -- ", this.formApplicationId);
    var key = '';
    var key2 = '';
    let resultAr: any={};
    let scopeCollections: any={};
    scopeCollections['scope_heading'] = {};
    scopeCollections['scope_value'] = [];


    let selectScheme = this.schemeRows[0].id;
    this.step5Data.scheme_id = selectScheme;

    //let scopeSaveData: any = {};
    // scopeSaveData['scheme'] = {};
    // scopeSaveData['scheme']['heading'] = {};
    // scopeSaveData['scheme']['details'] = {};

    // console.log(">>>>> scope Data: ", scopeSaveData);
    // this.schemeRows.forEach((rec,row) => {
    //     console.log('>>> scheme row...', rec, " -- ", row);
    // })
          
    
      for(var key in this.dynamicScopeFieldColumns){
            console.log(">>> ", key, " :: ", this.dynamicScopeFieldColumns[key], " -- ", typeof this.dynamicScopeFieldColumns[key]);
            let tempData: any = this.dynamicScopeFieldColumns[key] ;
            if(typeof tempData === 'object'){
              tempData.forEach((item,key) => {
                    console.log(item);
                    let keyIds = item[0].idVal;
                    let name = item[0].name;
                    console.log("...", name);
                    let tempObj = {};
                    tempObj[keyIds] = name;
                    console.log("...", tempObj);
                    scopeCollections['scope_heading'][keyIds] = name;
                });
            }
      }
    
          // this.dynamicScopeFieldColumns.forEach((item,key) => {
          //     //////console.log(item);
          //     let keyIds = item[0].idVal;
          //     let name = item[0].name;
          //     //////console.log("...", name);
          //     let tempObj = {};
          //     tempObj[keyIds] = name;
          //     //////console.log("...", tempObj);
          //     scopeCollections['scope_heading'][keyIds] = name;
          // });
    console.log(">>> build scope: ", scopeCollections);
    //return;

    let secInd: number = 0;
    for(key in this.dynamicScopeModel[secInd]){
        if(key == 'fieldLines'){
          this.dynamicScopeModel[secInd].fieldLines.forEach((rec,key1) => {
                console.log("browse Model: ",rec, " -- ", key1);
                //resultAr[key1] = [];
                scopeIds = [];
                scopeSelValues = [];
                let columnObject: any = this.dynamicScopeFieldColumns[secInd];
                let getDataValues: any;
                let getSelectValues: any;
                for(key2 in rec){
                  let selectVal;
                  let selectId;
                  
                  let findValues: any = key2.toString().search('Values');
                  //console.log("@key: ", key2, " Find: ", findValues);
                  if(findValues >= 0){ 
                    getDataValues = this.dynamicScopeFieldColumns[secInd].find(item => item[0].values == key2)
                    //console.log("@find values: ", key2, "--", getDataValues, " #Values: ", rec[key2]);
                    if(getDataValues){
                        let fdata: any = getDataValues[0];
                        //console.log("#Data Values: ",getDataValues, " -- ", fdata)                      
                        if(fdata.values == key2){
                          selectId = fdata.idVal;//rec[key2][0].id;
                          scopeIds.push({id: selectId, rowValues:fdata.values})
                        }
                      }

                  }else{
                    getSelectValues = this.dynamicScopeFieldColumns[secInd].find(item => item[0].title == key2)
                    //console.log("#find select values: ", key2, "--", getSelectValues);
                    if(getSelectValues){
                        let fdata: any = getSelectValues[0];
                        //console.log("#Select Data Values: ",getDataValues, " -- ", fdata)                      
                        if(fdata.title == key2){
                          selectVal = rec[key2];
                          scopeSelValues.push({value: selectVal})
                        }
                      }                      
                  }
                  scopeValues.push({id:selectId , value: selectVal});
                }



                console.log("@###Scope Values: ", scopeValues, " -- ", scopeIds, " :: ", scopeSelValues, ": Kye: ", key1);
                resultAr[key1] = [];
                
                for(var k=0; k<scopeIds.length; k++){
                  let idKey = scopeIds[k].id;
                  let keyValues = scopeIds[k].rowValues;
                  let valueKey = scopeSelValues[k].value;
                  let tempObj = {};
                  tempObj[idKey] = valueKey;
                  resultAr[key1].push({id: idKey, value: valueKey, valueSrc: keyValues});
               }
               //resultAr[key1] = tempObj;
               console.log('scope object: ', " -- ", resultAr);
          })
        }
    }

    //return;
    
    if(scopeCollections){
      let resultTempAr: any =[];
      let tempObj: any = {};
      let rstAr: any=[];
      //var p;
      let scopeRows: any = {};
      //this.dynamicScopeModel
      if(this.dynamicScopeModel[secInd].fieldLines != undefined && this.dynamicScopeModel[secInd].fieldLines.length > 0){
        scopeRows = this.dynamicScopeModel[secInd].fieldLines;
      }
      console.log("@Total rows: ", scopeRows);
      for(var p in resultAr){
        //resultTempAr[p] = [];
        console.log("@resultAr ",p, " -- ", resultAr[p], " --- ", scopeRows[p])
        if(resultAr[p].length){
          tempObj = {};
          resultAr[p].forEach(item =>{
            console.log(">>>Loop: ", p, " :: ", item," -- ", typeof scopeRows[p]);
            var optionName = '';
            //tempObj[item.id] = item.value;
            //console.log("@Values: ", scopeRows[p]);
            if(typeof scopeRows[p] === 'object'){
               //console.log("Enter: ", p);
               for(var k1 in scopeRows[p]){
                 //console.log('Enter >>>> ', k1, " -- ", item.valueSrc);
                 //var optionName = '';
                 if(k1 === item.valueSrc){
                   let tempAr = scopeRows[p][k1];
                   let findVal = tempAr.find(itemF => itemF.field_value.id == item.value);
                    if(findVal == undefined){
                      findVal = item.value;
                      optionName = findVal;
                    }
                   if(findVal != undefined && typeof findVal == 'object'){
                    optionName = findVal.value;
                   }

                   console.log("found...", k1," :: ", scopeRows[p][k1], " -- ",optionName, " --- ", findVal);
                 }
               }
               //resultTempAr[item.id] = optionName;
            }
            tempObj[item.id] = optionName;
            //resultTempAr[item.id] = optionName;
          })
          resultTempAr.push(tempObj);
          //resultTempAr[p] = tempObj;
          //resultTempAr[p].push(tempObj);
        }
        //rstAr.push(resultTempAr);
      }

      console.log('<<>>>> ', resultTempAr, " -- ", rstAr);
      scopeCollections['scope_value'] = resultTempAr;
    }
    //return;

    // }
    /////console.log("@selected scope values: ", scopeCollections);
    //return;
    ////console.log("#Scope result: ", resultAr, " -- ", scopeCollections);
    // this.dynamicScopeModel.forEach(rec => {
    //      if(rec.fieldLines){
    //       ////console.log("field rows: ", rec.fieldLines);
    //      }
    // })
    if(scopeCollections != undefined){
      //this.inspectionBodyForm.step5['scope_heading'] = scopeCollections['scope_heading'];
      //this.inspectionBodyForm.step5['scope_value'] = scopeCollections['scope_value'];
      this.step5Data['scope_heading']   = scopeCollections['scope_heading'];
      this.step5Data['scope_value']     = scopeCollections['scope_value'];
      
    }
    console.log("@step5 Data: ", this.step5Data);
  }
  */

 saveScope(){
    
  let scopeValues: any =[];
  let scopeIds:any =[];
  let scopeSelValues:any =[];
  ////console.log("dynamic ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns, " -- ", this.schemeRows, " -- ", this.formApplicationId);
  var key = '';
  var key2 = '';
  let resultAr: any={};
  let scopeCollections: any={};
  let selectScheme          = '';//this.schemeRows[0].id;
  
  for(var t=0;t<this.schemeRows.length; t++){

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
      for(var t=0;t<this.schemeRows.length; t++){

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
                    if(colIndex == 0){
                      //first coloumn row values - firstFieldValues
                      ////console.log(">>>> First column: ");
                      let selTitle: any       = colItem[0].title;
                      let selTitleValues: any = this.dynamicScopeModel[scopeTitle][key][k]['firstFieldValues'];
                      let fvalue: any         = this.dynamicScopeModel[scopeTitle][key][k][selTitle];
                      let getVal: any;
                      if(selTitleValues != undefined && selTitleValues.length > 0){
                        getVal       = selTitleValues.find(data => data.field_value.id == fvalue)
                      }                      
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
  for(var p in scopeCollections){
    if(scopeCollections[p]){
        let getDetails: any = scopeCollections[p]['scope_value'];
        //////console.log(">>>Value: ", p, " -- ", getDetails, " -- ", getDetails.length);
        if(getDetails.length == 0){
          //////console.log(">>>Empty values: ", p, " deleting");
          delete scopeCollections[p];
        }
    }
  }
  ////console.log("#Updated Scope after edit: ", scopeCollections, " -- ", this.editScopeData);
  this.step5Data['scopeDetails']    = scopeCollections;
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
  
onSubmitStep5(ngForm: any, type: any) {
    //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);

    //Check dynamic model column fields validation
  let secInd: number;
  let selectScheme: any;
  let errorScope: boolean = false;
  if(this.schemeRows.length){
    for(var t=0;t<this.schemeRows.length; t++){
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
  if(errorScope && type === undefined){
    this.toastr.warning('Please Fill required field','Validation Error');
    return false;    
  }
    //this.saveScope();
    this.testingCalForm = {};
    this.testingCalForm.step5 = {};
    this.testingCalForm.saved_step  = 5;
    this.testingCalForm.email       = this.userEmail;
    this.testingCalForm.userType    = this.userType;
    var applicationId = sessionStorage.getItem('applicationId');
    this.step5Data.application_id   = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
    this.step5Data.is_draft         = false;
    this.testingCalForm.step5       = this.step5Data;

    console.log("@####step5 submit Data: ", this.step5Data, " :: ", this.testingCalForm);

    //if(ngForm5.form.valid) {
    if(!ngForm.form.valid && type == undefined && this.schemeRows.length == 1 
        && this.schemeRows[0].id === undefined && this.editScopeData != undefined && this.editScopeData != null) {
      this.loader = false;
      this.saveScope();
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
    }else if(ngForm.form.valid && type == undefined) {
      ////console.log(">>>Scope saving...");
      ////console.log(">>>Enter....3")
      this.saveScope();
      ////console.log(">>> step5 submit...", this.step5Data, " -- ", this.inspectionBodyForm);
      this.testingCalForm.step5.is_draft = false;
      this.testingCalForm.saved_step = 5;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }
    else if( type != undefined && type == true){
      ////console.log(">>>Enter....4")
      this.testingCalForm.step5.is_draft = true;
      this.testingCalForm.saved_step = 5;
      this.saveScope();
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testingCalibration,this.testingCalForm)
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
    }
    
    else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }


  }

  onSubmitStep6(ngForm6: any){
    //this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    this.isPrelimSubmitted = true;
    if(ngForm6.form.valid) {
      this.testingCalForm = {};
      this.testingCalForm.step6 = {};
      this.testingCalForm.saved_step = '6';
      this.testingCalForm.email = this.userEmail;
      this.testingCalForm.userType = this.userType;
      var applicationId = sessionStorage.getItem('applicationId');
      this.step6Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;
      this.step6Data.is_prelim_visit = this.step6Data.prelim_visit_val == 0 ? false : true;
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
      

  if(this.authorizationStatus && checkCount == 10){
    this.authorizationStatus = true;
  }else{
    this.authorizationStatus = false;
  }
  //console.log(">>> Check status count: ", checkCount);
}

 onSubmitUndertakingApplicant(ngForm7: any){
  // this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);
  // for(let key in this.authorizationList) {
  //   if(this.authorizationList[key] == false) {
  //     this.authorizationStatus = false;
  //   }else {
  //     this.authorizationStatus = true;
  //   }
  // }

  this.isApplicationSubmitted = true;

  let checkCount = 0;
    for(let key in this.authorizationList) {
      ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
      if(this.authorizationList[key]) {  
        this.authorizationStatus = true;       
        checkCount++;
      } 
      // if(this.authorizationList[key]) {
      //   this.authorizationStatus = true;
      // }     
    }  
    if(this.authorizationStatus && checkCount == 10){  
      this.authorizationStatus = true;
    }else{
      this.authorizationStatus = false;
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
    let is_valid = false;
  this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
  this.voucherFile.append('amount',this.voucherSentData['amount']);
  this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
  this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
  this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
  this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
  this.voucherFile.append('voucher_date',dtFormat);
  this.voucherFile.append('accreditation',this.formApplicationId);
  this.voucherFile.append('is_draft',false);
  // this.voucherFile.append('application_id',this.formApplicationId); 
      //console.log(">>> form status: ", ngForm9.form.valid, " -- ", this.voucherSentData['mobile_no']);
      //return false;
      console.log(">>> Data: ", this.voucherSentData);

    if(this.voucherSentData['transaction_no'] != '' && this.voucherSentData['payment_method'] != '' && this.voucherSentData['payment_made_by'] &&
    this.voucherSentData['mobile_no'] != ''){
      is_valid = true;
    }
    //ngForm9.form.valid 
  
  if(is_valid == true && this.paymentReceiptValidation != false) {
    this.loader = false;
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
  }
  else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  }

  /*

else if(type != undefined && type == true && this.paymentReceiptValidation != false){
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
  */

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
closeDialog(){
  this.modalService.dismissAll();
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
          console.log(">>> Save resultts: ", result);
      });

    // setTimeout(()=> {
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

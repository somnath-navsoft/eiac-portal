import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import  { UiDialogService } from  '../../../../../services/uiDialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
import { TrainerService } from '../../../../../services/trainer.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { AnyFn } from '@ngrx/store/src/selector';
import {CustomModalComponent} from '../../../../utility/custom-modal/custom-modal.component';
import { iif } from 'rxjs';

declare let paypal: any; 
@Component({
  selector: 'app-inspection-bodies-form',
  templateUrl: './inspection-bodies-form.component.html',
  styleUrls: ['./inspection-bodies-form.component.scss'],
  providers: [Constants, AppService, CustomModalComponent, ToastrService, Overlay, OverlayContainer, UiDialogService]
})
export class InspectionBodiesFormComponent implements OnInit {

  public newRow: any = {};
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  public errorLoader: boolean = false;
  public inspectionBodyForm: any = {};
  public inspectionBodyFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [{}];
  public ownOrgMembInfo: Array<any> = [{}];
  public proficiencyTesting: Array<any> = [];
  public accreditationInfo: Array<any> = [{}];


  public schemeRows: Array<any> = [{}];


  //public accreditationInfo: any;
  public technicalManager: any = {};
  public managementManager: any = {}
  public inspectionBodyInfo:Array<any>=[];
  public medicaMainlLabInfo:Array<any>=[];
  public inspectionBodyScopeFields:Array<any>=[];
  public inspectionBodyData:any={}
  public medicalLabFirstData:Array<any>=[];
  public countryList:Array<any>=[];
  public labTypeList:Array<any>=[];
  public fullScope:any[]=[];
  public mailing_address:boolean=true;
  public orgMembToggle: boolean = false;
  public is_bod_select: any = 0;
  is_hold_other_accreditation_toggle: any = 0;
  public proficiency_testing_val: any = 0;
  public is_agreement: boolean=false;
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public loader:boolean=true;
  public banner:any=[];
  public selectedValuesMl:Array<any>=[];
  public selectedValuesData:Array<any>=[];
  public inspectionBodyScopeData:any = {};
  public addMinutesToTime:any;
  selectedFood1: string;
  selectedFood2: string;
  rowCount:number=1;
  field2:number=2;
  public minDate = new Date();
  public authorizationList:any;

  authorizationListTerms1: any; //agreement
  authorizationListTerms2: any; // ILA/IAF

  public recommend:any;
  public authorizationStatus: boolean = false;
  recommendStatus:boolean = false;

  readAccredAgreem: boolean = false;
  readReviewChecklist: boolean = false;
  readTermsCond: boolean = false;

  routeId: any;  

  public isSubmit:boolean = false;
  public isNoteSubmit:boolean = false;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;
  afterSubmit: boolean = false;
  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  // version = VERSION;
  public file_validation:boolean = true;
  authorization_confirm2:any;
  searchCountryLists:any;
  accreditationId:any;
  onbehalf_representative_date:boolean = false;

  getDutyTimeForm1IndexValue:number;// = 2;
  allCityByCountry: any = [];
  getCountryLists:any = [];

  recommendYearValues: any[] = [];

  //Dynamic scope forms model object declaration
  //dynamicScopeModel:any[]         = [];   //Master form data object
  dynamicScopeModel:any         = {};   //Master form data object
  //dynamicScopeFieldColumns:any[]  = [];   //Master column data for each section
  dynamicScopeFieldColumns:any  = {};  
  dynamicScopeFieldType:any  = {}; 
  criteriaMaster: any[] = [];

  transactions: any[] =[];
  transactionsItem: any={};
  total: any = 0;
  allStateList: any[] = [];
  allCityList: any[] = [];
  allCountryList: any[] = [];

  step1Data:any = {};
  step2Data:any = {};
  step3Data:any = {};
  step4Data:any = {};
  step5Data:any = {};
  step6Data:any = {};
  step7Data:any = {};
  fileAny:any;
  tradeLicensedValidation:any = false;
  paymentReceiptValidation: boolean = false;
  paymentFile:any = false;

  recomendVisit: any[] = [];
  

  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  step4DataBodyFormFile:any = new FormData();
  step5DataBodyFormFile:any = new FormData();
  step6DataBodyFormFile:any = new FormData();
  step7DataBodyFormFile:any = new FormData();
  step1DraftDataBodyFormFile:any = new FormData();
  step2DraftDataBodyFormFile:any = new FormData();
  step3DraftDataBodyFormFile:any = new FormData();
  step4DraftDataBodyFormFile:any = new FormData();
  step5DraftDataBodyFormFile:any = new FormData();
  step6DraftDataBodyFormFile:any = new FormData();
  step7DraftDataBodyFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  isCompleteness:any;
  profileComplete:any;
  today = new Date();
  urlVal: any;

  formApplicationId: number = 0;
  scopeDataLoad: boolean = false;
  accreditationChecked = true;
  deliveryAddrChecked = true;
  isApplicationSubmitted: boolean = false;
  isPrelimSubmitted: boolean = false;

  termsGeneral: any;
  termsILA: any;

  accredAgreemFile: any;
  checklistDocFile: any;
  modalOptions:NgbModalOptions;
  closeResult: string;
  pathPDF: any;
  voucherFile:any = new FormData();
  voucherSentData: any = {};
  selectTradeLicName :string = ''; 
  selectTradeLicPath :string = ''; 
  paymentFilePath: string = '';
  profileCountrySel: string = '';
  profileAutoData: boolean = false;
  criteriaList: any = [];

  paymentStepComp: boolean = false;

  formDraftsaved: any;
  formAccrStatus: any;
  viewData: any;
  editScopeData: any;
  getScopeData: any;

  payment_date: string;

  selectDeleteID: number =0;
  selectDeleteKey: any;
  selectDeleteIndex: any;
  deleteEditScopeConfirm: boolean = false;
  deleteScopeConfirm: boolean = false;

  is_main_activity_note_entry: boolean = false;


  shift2_from: boolean = false;
  shift2_to: boolean = false;
  shift3_from: boolean = false;
  shift3_to: boolean = false;


  //dynamicScopeOptions:any[] = [];  
  //dynamicScopeModelValues:any={};
  //dynamicFirstFieldValues:any;
  
  @ViewChild('mydiv', null) mydiv: ElementRef;
  @ViewChild('elementDateIssue', null) _input: ElementRef;
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;

  @HostListener('scroll', ['$event.target'])
  scrollHandler(elem) {
    if(elem != undefined){
      console.debug("Scroll Event: ", elem.srcElement.scrollHeight, " == [ ",elem.srcElement.offsetHeight, " - ",elem.srcElement.scrollTop," ]"  );
      if(( elem.srcElement.offsetHeight + elem.srcElement.scrollTop) >=  elem.srcElement.scrollHeight) {
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
  headerSteps:any[] = [];

  constructor(public Service: AppService, public uiDialog: UiDialogService, public sanitizer: DomSanitizer,
    private modalService: NgbModal,private _trainerService: TrainerService, private _customModal: CustomModalComponent,
    public _toaster: ToastrService, public constant:Constants,public router: Router,public toastr: ToastrService) { 
    this.today.setDate(this.today.getDate());
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
  getData(getVal){
    //  ////////console.log(">>>>Get MapBox Value: ", getVal);
     this.Service.mapboxToken = getVal;
    }

    //Paypal Button creation
    private loadExternalScript(scriptUrl: string) {
      return new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script')
        scriptElement.src = scriptUrl
        scriptElement.onload = resolve
        //////////console.log("load script...");
        document.body.appendChild(scriptElement)
      })
    }

    saveInspectopnAfterPayment(theData: any){
      ////////console.log(">>> The Data: ", theData);
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
      //  //this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
      // }, 1000)      
   }
   createPaymentButton(itemData: any, formObj?:any, compObj?:any){
    ////console.log("creating....buttons...", " -- ",this.transactionsItem, " --- ", this.transactions);
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
          ////////console.log("@Paypal payment actionms: ", actions, " -- ", data, " --- ", itemData);        
          return actions.payment.create({
            payment: {
              transactions: [itemData]
            }
          })
        },
        onAuthorize: function(data, actions) {
          ////////console.log("@Paypal onAuthorize actionms: ", actions, " -- ", data);
          return actions.payment.execute().then(function(payment) {
            ////////console.log(">>>Success: ", payment);
            formObj.paypalReturn = payment;
            formObj.paypalStatus = 'success';
            ////////console.log("<<<Review obj: ", formObj, " :: ", compObj);
            compObj.saveInspectopnAfterPayment(formObj);
          })
        },
        onCancel: (data, actions) => {
          ////////console.log('OnCancel', data, actions);
          //this.showCancel = true;
          formObj.paypalReturn = data;
          formObj.paypalStatus = 'cancel';
          this._toaster.warning("You have cancelled payment, Continue next step please complete payment process again.", 'Paypal>>',{timeOut:6500}); 
  
      },
      onError: err => {
          ////////console.log('OnError', err);
          formObj.paypalReturn = err;
          formObj.paypalStatus = 'error';
          //compObj.saveCourseAfterPayment(formObj);
          this._toaster.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
      },
      onClick: (data, actions) => {
          ////////console.log('onClick', data, actions);
          //this.resetStatus();
      }
      }, '#paypalPayment');
    });
    }
  }

  backApp(){
    this.router.navigateByUrl('/dashboard/cab_client/application-accreditation')
    this.modalService.dismissAll();
  }

    //Paypal Button creation
    
  onChange(prevFieldId,row,curField,field) {
    ////////////console.log(prevFieldId.value,'sfasfdas');
      let selectedValueObj = this.selectedValuesMl[row-1] ? this.selectedValuesMl[row-1] : {};
      let selectedValueObj2 = this.selectedValuesData[row-1] ? this.selectedValuesData[row-1] : {};
      selectedValueObj[curField] = prevFieldId.value;

      let tempKey = ''

      if(curField=='field1'){
        tempKey = this.inspectionBodyScopeFields[0].id;
      }
      else if(curField=='field2'){
        tempKey = this.inspectionBodyScopeFields[1].id;
      }
      else if(curField=='field3'){
        tempKey = this.inspectionBodyScopeFields[2].id;
      }
      else if(curField=='field4'){
        tempKey = this.inspectionBodyScopeFields[3].id;
      }
      else if(curField=='field5'){
        tempKey = this.inspectionBodyScopeFields[4].id;
      }
      else if(curField=='field6'){
        tempKey = this.inspectionBodyScopeFields[5].id;
      }

      selectedValueObj2[tempKey] = prevFieldId.source.selected.viewValue;

      if(this.selectedValuesMl[row-1]){ //////////console.log('IFFFFFF');
        this.selectedValuesMl[row-1] = selectedValueObj;
        this.selectedValuesData[row-1] = selectedValueObj2;
      }
      else{ //////////console.log('ELSEEE');
        this.selectedValuesMl.push(selectedValueObj);
        this.selectedValuesData.push(selectedValueObj2);
      }

      this.rowCount = row

      this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,{'value_id':prevFieldId.value})
      .subscribe(
        res => {
          // if(res['banner'].length>0){
          //   this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
          // }
          
          if(field=='field2'){
            // this.inspectionBodyData[this.rowCount][this.field2] = ''
            this.inspectionBodyData[this.rowCount]['field2']=res['scopeValue']
          }
          else if(field=='field3'){
            //////////console.log('field3')
            this.inspectionBodyData[row].field3=res['scopeValue']
          }
          else if(field=='field4'){
            this.inspectionBodyData[row].field4=res['scopeValue']
          }
          else if(field=='field5'){
            this.inspectionBodyData[row].field5=res['scopeValue']
          }
          else if(field=='field6'){
            this.inspectionBodyData[row].field6=[{'field_value':'A','value':'A'},{'field_value':'B','value':'B'},{'field_value':'C','value':'C'}];
          }

          this.inspectionBodyScopeData['inspectioBodydata'] = this.selectedValuesData;
          this.inspectionBodyForm.inspectionBodyScopeData = this.inspectionBodyScopeData

          //////////console.log("LOggggg==>");
          //////////console.log(this.selectedValuesData);

        },
        error => {
        
    })
  }

  //onChangeScopeOption(getValues: any, secIndex: number, lineIndex: number, columnIndex: number, secName: string, type?:string) {
  onChangeScopeOption(getValues: any,secIndex: any, lineIndex: number, columnIndex: number, type?:string) {
      //////console.log('@GET Options: ', getValues, " :: ",  lineIndex, " -- ", type, " -- ", columnIndex, " --sec--  ", secIndex);

      let selectValue: any;
      if(type === undefined){
        selectValue = getValues.value;
      }
      if(type !== undefined && type === 'initLoad'){
        selectValue = getValues;
      }
      let url = this.Service.apiUatServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data;
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

  loadCriteriaScope(value){
    

  }
  agreeView(event){
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
    //////////console.log('PDF Error: ', error)
    this.errorLoader = true;
  }

  completeLoadPDF(pdfLoad: PDFDocumentProxy){
    //////////console.log("Completed Load PDF :: ", pdfLoad);
    this.loaderPdf = false;
    this.completeLoaded = true;
  }

  onProgress(progressData: PDFProgressData){
   //////////console.log("Loding Pdf :: ", progressData);
    this.loaderPdf = true;
  }

  getSantizeUrl(url : string) { 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); 
  }

  openView(content, type?:string) {
    let pathData: any;
    ////////console.log(">>>pop up...", content);
    if(type != undefined && type == 'agreement'){
      pathData = this.getSantizeUrl(this.accredAgreemFile);
      this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
    }
    if(type != undefined && type == 'checklist'){
      pathData = this.getSantizeUrl(this.checklistDocFile);
      this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
      console.log(">>> PDF Path: ", this.pathPDF);
    }

    ////////console.log(">>> open view", this.pathPDF, " -- ",  this.pathPDF);

    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //////////console.log("Closed: ", this.closeResult);
      //this.courseViewData['courseDuration'] = '';
      //this.courseViewData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //////////console.log("Closed with ESC ");
      
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //////////console.log("Closed with CLOSE ICON ");
     
      return 'by clicking on a backdrop';
    } else {
      //////////console.log("Closed ",`with: ${reason}`);
      
      return  `with: ${reason}`;
    }
  }

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

      //save to server at time
      this.inspectionBodyForm = {};      
      this.step5Data['scopeDetails']    = this.editScopeData;
      this.inspectionBodyForm = {};
      this.inspectionBodyForm.step5 = {};
      this.inspectionBodyForm.step5 = this.step5Data;
      this.inspectionBodyForm.step5.is_draft = false;
      this.inspectionBodyForm.saved_step = 5;
      this.inspectionBodyForm.step5.application_id = this.formApplicationId;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
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

  ngOnInit() { 

    //this.urlVal = this.Service.getValue() != '' ? this.Service.getValue() : '';
    this.urlVal = sessionStorage.getItem('ibUrlId');;
    ////console.log(">>>Get URL value: ", this.urlVal);
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');

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

    //this.routeId = sessionStorage.getItem('routerId');
    //this.routeId = this.urlVal;//this.Service.getValue() != '' ? this.Service.getValue() : '';
    //////console.log("@@router: ", this.routeId, " -- ", this.Service.setValue);
    this.step5Data.scheme_ids = [];

    var d = new Date();
    var yr = d.getFullYear();
    for(var k=2010; k<=2030; k++){
      this.recommendYearValues.push({title: k.toString(), value: k});
    }
    this.step7Data.recommend_year = yr;

    


    // let jsonStrting = '{"18":{"scope_heading":{"43":"Inspection Category","45":"Inspection field","47":"Range of inspection","49":"Stage of the inspection","51":"Inspection criteria","53":"Inspection Activity Type"},"scope_value":[{"43":"Product","45":"Mechanical Engineering of Lifting Equipment","47":"Lever hoist","49":"In-service","51":"BS EN 13157","53":"A"},{"43":"Product","45":"Mechanical, Electrical and Structural Engineering of Lifting Equipment","47":"Mobile crane","49":"In-service","51":"BS 7121-2-1,BS 7121-2-3","53":"B,C"},{"43":"Product","45":"Mechanical Engineering of Lifting Equipment – Earth Moving","47":"Backhoe Loader","49":"In-service","51":"BS EN 474-4","53":"A,B"}]},"105":{"scope_heading":{"55":"Inspection Category","57":"Inspection field","59":"Range of inspection","61":"Stage of the inspection","63":"Inspection criteria","65":"Inspection Activity Type"},"scope_value":[{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Hook","61":"In-service","63":"Welcome","65":"Hello"},{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Chain sling","61":"In-service","63":"bbb","65":"aaa"}]}}';
    // let jsonObject = JSON.parse(jsonStrting);
    // //this.editScopeData = jsonObject;// this.Service.jsonToArray(jsonObject);
    // ////console.log(">>>Saved details: ", jsonObject, " -- ", this.editScopeData);


    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
    }

    this.accredAgreemFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Accreditation%20Agreement.pdf');
    this.checklistDocFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Document%20review%20Checklist-%20ISO%2017020-%202012_Inspection%20Bodies.pdf');

    //this.step1Data.accredation_criteria = 1;//
    //this.step1Data.certificate_delivery_addr = true;
    
    //this.inspectionBodyForm.criteria_request = 'ISO/IEC17020';
    // this.titleService.setTitle('EIAC - Inspection Bodies');
    this.addMinutesToTime = this.Service.addMinutesToTime();
    //this.dynamicScopeModelValues[0] = {};


  

    //return;
    
      this.loadData();
   
      this.loadCountryStateCity();
    if(this.urlVal != 'undefined'){
      ////console.log(">>>> enter...");
    this.loadAppData();
    this.loadAppInfo();
    }

    if(this.urlVal == 'undefined'){
      ////console.log(">>>> enter...1");
      this.loadAppInfo();
    }
    this.loadFormDynamicTable();
    

    // let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    // ////////console.log("app info: ", url);
    // this.Service.getwithoutData(url)
    //   .subscribe(
    //     res => {
    //       let getData: any = res;
    //       let data: any;
    //       //, getData.data.step1, " -- ", getData.data.step2
    //       ////////console.log("Profile info >>> ", getData.data);
  
    //     }
    //   )
    //   return;

    this.loader = false;
    //
    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
      },
      {
      title:'profciency_testing_participation', desc:'2. Proficiency Testing Participation', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'personal_information', desc:'3. Personnel Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
      },
      {
      title:'information_audit_management', desc:'4. Internal Audit & MRM Date', activeStep:false, stepComp:false, icon:'icon-task', activeClass:''
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
  }

  statelistById = async(country_id) => {
    this.allStateList = [];
    let stateList =  this.Service.getState();
    ////console.log("enter state...", country_id);
    this.step1Data.state = '';
    this.step1Data.city = '';
    await stateList.subscribe( result => {
        for(let key in result['states']) {
          ///////console.log("state: ", result['states'][key], " -- ", country_id);
          if(result['states'][key]['country_id'] == country_id )
          {
            this.allStateList.push(result['states'][key]);
          }
        }
    });
    ////console.log(this.allStateList);
  }

  citylistById = async(state_id) => {
    this.allCityList = [];
    let cityList =  this.Service.getCity();
    //this.step1Data.city = '';
    ///////console.log("enter city...");
    await cityList.subscribe( result => {
        for(let key in result['cities']) {
          ///////console.log("city: ", result['cities'][key], " -- ", state_id);
          if(result['cities'][key]['state_id'] == state_id )
          {
            this.allCityList.push(result['cities'][key]);
          }
        }
    },
    error =>{
        ////////console.log("Error: ", error);
    }
    
    );
  }
  
  loadCountryStateCity = async() => {
    let countryList =  this.Service.getCountry();
    await countryList.subscribe(record => {
      // ////console.log(record,'record');
      this.getCountryLists = record['countries'];
    });
    // await countryList.subscribe(record => {
    //   ///////////console.log(record,'contry record :: ', this.step1Data.country);
    //   //this.getCountryLists = record['countries'];
    //   // //////console.log(">>>Country List: ", this.getCountryLists);
    //   // let getC = this.getCountryLists.find(rec => rec.name == this.profileCountrySel);
    //   // //////console.log('>>>> country: ', getC);
    //   // if(getC){
    //   //   this.step1Data.country = getC.id;
    //   // }
    // });
    
  }

  scrollForm(el: HTMLElement)
  {
    //this.vps.scrollToAnchor(el);
    el.scrollIntoView({behavior: 'smooth'});
  }

  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
  }
  bod_toggle(value,type){
    if(type == 'is_bod')
    {
      this.is_bod_select = value;
    }else if(type == "is_hold_other_accreditation_toggle")
    {
      this.is_hold_other_accreditation_toggle = value;
    }
  }
  proficiency_testing(value){
    this.proficiency_testing_val = value;
  }
  loadFormDynamicTable(){
    // this.ownOrgBasicInfo  =   [{}];
    // this.ownOrgMembInfo = [{}];
    // this.accreditationInfo = [{}];
    this. proficiencyTesting =[{}];
    this.inspectionBodyInfo=[{}];
    this.medicaMainlLabInfo=[{}];
    this.inspectionBodyForm.organizationBasicInfo    = this.ownOrgBasicInfo;
    this.inspectionBodyForm.organizationMemberInfo   = this.ownOrgMembInfo;
    this.inspectionBodyForm.accreditationInfo        = this.accreditationInfo;
    this.inspectionBodyForm.proficiencyTesting       = this.proficiencyTesting;
    this.inspectionBodyForm.technicalManager         = this.technicalManager;
    this.inspectionBodyForm.managementManager        = this.managementManager;
    this.inspectionBodyForm.inspectionBodyInfo           = this.inspectionBodyInfo;
    this.inspectionBodyForm.medicaMainlLabInfo        = this.medicaMainlLabInfo;
    //, undertaking_confirmTop1: false,undertaking_confirmTop2: false,, 
    this.authorizationList = {undertaking_confirm1:false, undertaking_confirmTop3: false, undertaking_confirm2:false,undertaking_confirm3:false,
      undertaking_confirm4:false,undertaking_confirm5:false,
      undertaking_confirm6:false,
      undertaking_confirm7:false,undertaking_confirm8:false,authorization_confirm1:false,authorization_confirm2:false};

    // this.recommend = {first:false,second:false,third:false,fourth:false}

    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        if(res['status'] != true) {
          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];

            var stateList =  this.Service.getState();
            var cityList =  this.Service.getCity();

            stateList.subscribe( result => {
              for(let key in result['states']) {
                if(result['states'][key]['name'] == step1.state )
                {
                  //this.allStateList.push(result['states'][key]);
                }
              }
            });

            cityList.subscribe( result => {
              for(let key in result['cities']) {
                if(result['cities'][key]['name'] == step1.city )
                {
                  //this.allCityList.push(result['cities'][key]);
                }
              }
            });

            // this.tradeLicensedValidation = this.constant.mediaPath+step1.trade_license;
            // this.step1Data.trade_license_number = step1.office_email;
            // this.step1Data.date_of_issue = new Date(step1.dob);
            // this.step1Data.date_of_expiry = step1.mailing_address;
            // this.step1Data.date_of_establishment = step1.phone;
            // this.step1Data.search_location_name = step1.fax_no;
            // this.step1Data.official_commercial_name = step1.office;
            // this.step1Data.accredation_type_id = step1.designation;
            // this.step1Data.criteria_request = step1.office_address;
            // this.step1Data.physical_location_address = step1.office_tel_no;
            // this.step1Data.po_box = step1.office_fax_no;
            // this.step1Data.country = step1.office_fax_no;
            // this.step1Data.state = step1.office_fax_no;
            // this.step1Data.city = step1.office_fax_no;
            // this.step1Data.telephone = step1.office_fax_no;
            // this.step1Data.fax_no = step1.office_fax_no;
            // this.step1Data.official_email = step1.office_fax_no;
            // this.step1Data.official_website = step1.office_fax_no;

            // this.ownOrgBasicInfo = step1.cabOwnerData;
            // this.step1Data.is_bod = step1.cabOwnerData != '' ? '1' : '0';
            // this.ownOrgMembInfo = step1.ownOrgMembInfo;
            // this.step1Data.duty_from1 = step1.duty_from1;
            // this.step1Data.duty_to1 = step1.duty_to1;
            // this.step1Data.duty_from2 = step1.duty_to2;
            // this.step1Data.duty_from3 = step1.duty_from3;
            // this.step1Data.duty_to3 = step1.duty_to3;
            // this.step1Data.indication = step1.indication;
            // this.step1Data.is_hold_other_accreditation = step1.is_hold_other_accreditation;
            // this.step1Data.accreditationInfo = step1.is_hold_other_accreditation != '' ? '1' : '0';;
            // this.step1Data.duty_to3 = step1.duty_to3;
          }
          if(res['data'].step2 != '') {
            
          }
        }
    });
  }

  getCriteria(value, secInd: any){
    //////console.log("select Criteris: ", value, " -- ", secInd);
    this.scopeDataLoad = true;
    let duplicateScheme: boolean = false;
    if(value != undefined && value > 0){
       //Get fullscope
       //let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.criteriaIdByScope + value;
       //this.Service.apiServerUrl+"/"
       //value =18;
       let apiURL = this.Service.apiUatServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data+"?scheme="+value;
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
            this.scopeDataLoad = false;
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

                console.log(this.fullScope);

                //check already existing scheme...
                this.fullScope.forEach((item, index) => {
                    console.log(item.title, " :: ", scopeTitle);
                    if(item.title == scopeTitle){
                      duplicateScheme = true;
                      this._toaster.warning("Duplicate Scheme!","Validation")
                      return;
                    }
                })
                // for(let m in this.dynamicScopeModel){
                //   console.log("mkey: ", m, " -- ", scopeTitle, " -- ", this.dynamicScopeModel);
                //     //let fobj: any = this.fullScope;
                //     if(m === scopeTitle){
                //       console.log(">>> Deleting....existing...");
                //       this.fullScope.splice(secInd, 1);
                //       //delete this.dynamicScopeModel[m];
                //       console.log(">>> after Deleting...");
                //       this._toaster.error("Scheme should be unique, Please check.","Validation")
                //       //return;
                //     }
                // }
                if(!duplicateScheme){
                  this.dynamicScopeFieldColumns[scopeTitle] = [];
                this.dynamicScopeFieldType[scopeTitle] = [];
                this.dynamicScopeModel[scopeTitle] = {};

                if(this.fullScope.length){
                     //console.log("@Existing scheme....1");
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
                ////console.log("--Scope ", rec, " :: ", key);

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

                if(defLine['firstFieldValues'].length > 0  && key == 0){
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
                // let arr = [];  
                // let columnsDyna: any= {};
                // columnsDyna = this.dynamicScopeFieldColumns;
                // Object.keys(columnsDyna).map(function(key){  
                //     arr.push({[key]:columnsDyna[key]})  
                //     return arr;  
                // });  


                
                //Load first field value default by selecting first item
                this.dynamicScopeModel[scopeTitle].fieldLines.push(defLine);
                //this.dynamicScopeModel[customKey].fieldLines.push(defLine);
              });

              ////console.log("@@@@Update Model: ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeFieldType, " -- ", this.dynamicScopeModel);

            }
            //Load first field value default by selecting first item
            //////////console.log("calling.....default...1.4", this.dynamicScopeModel[customKey].fieldLines);
            ////////console.log("@Loading Model.........", this.dynamicScopeModel);
            //this.loadDefaultColumnValues(this.dynamicScopeModel);

          /*
            //this.fullScope   = dataScope.fullScope;
            dataScope.fullScope.forEach(dataRec => {
              if(dataRec.firstFieldValues != undefined){
                this.fullScope.push(dataRec);
              }
            })

            //////////console.log("full scope: ", this.fullScope);
            //return;
            if(dataScope.fullScope.length > 0){
              var counter = 0;
              dataScope.fullScope.forEach((rec, key) => {
                //////////console.log("-- ", rec, " :: ", key, " --- ", counter++);
                if(rec.firstFieldValues != undefined){
                  ////////console.log('>>> firstFieldValues null bababab');
                  let defLine = {};
                    let customKey = rec.accr_title[0];
                    this.dynamicScopeModel[customKey] = [];
                    this.dynamicScopeFieldColumns[key] = [];
                    fieldTitleValue[key] = [];
                    this.dynamicScopeModel[customKey].fieldLines = [];
                    //Initialize fields values
                    if(rec.firstFieldValues != undefined){
                      ////////////console.log("first value length: ", rec.firstFieldValues.length);
                      defLine['firstFieldValues'] = rec.firstFieldValues;
                    }
                    if(rec.fields.length > 0){
                      rec.fields.forEach((data,key1) =>{
                          let fieldValues = data.title.split(" ").join("")+"Values";
                          let fieldTitle = data.title.split(" ").join("_");
                          this.dynamicScopeFieldColumns[key].push({title: fieldTitle, values:fieldValues});
                          defLine[fieldValues] = [];

                          if(defLine['firstFieldValues'].length > 0){
                            ////////////console.log("calling.....default...");
                            let getValue = defLine['firstFieldValues'][0].field_value;
                            if(key1 === 0){
                              fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
                            }
                            //Default load next column                  
                            this.onChangeScopeOption(getValue,key,0,0,customKey,'initLoad');
                          }
                      })
                    }
                    //Load first field value default by selecting first item
                    this.dynamicScopeModel[customKey].fieldLines.push(defLine);
                }
          })
          //set default value
          //Load first field value default by selecting first item
          this.loadDefaultColumnValues(this.dynamicScopeModel);

        }
        */
        ////////console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns, " ::-> ",this.fullScope);
       })
    }
  }

  jsonParseKeyvalue(data) {
    if(data) {
      //var obj1 = data.replace(/'/g, "\"");
      return JSON.parse(data);
    }
  }

  jsonParsevalue(data) {
    if(data) {
      return JSON.parse(data);
    }
  }



  loadAppData(){
    ////console.log(">> >route id:  ", " -- ", this.routeId, " -- ", this.urlVal, " -- ", );
    let url = '';
    this.routeId = 0;//954;//931;
  // return;
    if(this.urlVal != '' && this.urlVal != undefined){
      ////console.log(">>> get URL Id: ", this.urlVal);
      let getId= (this.urlVal);
      url = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+getId;
      ////console.log(">>>Get url and ID: ", url, " :: ", getId);
      this.Service.getwithoutData(url)
      .subscribe(
      res => {
        let getData: any = res;
        let data: any;
        let pathData: any;
        let filePath: string;
        let saveStep: number;
        console.log(getData,"get APP Data:");

        this.viewData = getData;
        sessionStorage.setItem("userData", JSON.stringify(getData));

            var stateList =  this.Service.getState();
            var cityList =  this.Service.getCity();

            // stateList.subscribe( result => {
            //   for(let key in result['states']) {
            //     // if(result['states'][key]['name'] == data.state )
            //     // {
            //       this.allStateList.push(result['states'][key]);
            //     //}
            //   }
            // });

            // cityList.subscribe( result => {
            //   for(let key in result['cities']) {
            //     // if(result['cities'][key]['name'] == data.city )
            //     // {
            //       this.allCityList.push(result['cities'][key]);
            //     //}
            //   }
            // });



        if(getData.data.id != undefined && getData.data.id > 0){
          this.formApplicationId = getData.data.id;
          this.formDraftsaved = getData.data.is_draft;
          this.formAccrStatus = getData.data.accr_status;
        }

        /*if(!this.Service.isObjectEmpty(getData.data.paymentDetails)){
          
          if(getData.data.paymentDetails.voucher_invoice != undefined && getData.data.paymentDetails.voucher_invoice != '' && 
              (getData.data.paymentDetails.payment_receipt == null || getData.data.paymentDetails.payment_receipt == '')){
            filePath = this.constant.mediaPath + '/media/' + getData.data.paymentDetails.voucher_invoice;
            pathData = this.getSantizeUrl(filePath);
            this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
            saveStep = parseInt(getData.data.saved_step);
            
          }else if(getData.data.paymentDetails.payment_receipt != null && getData.data.paymentDetails.payment_receipt != ''){
            saveStep = 8;
          }else{
            saveStep = parseInt(getData.data.saved_step) - 1;
          }
          //////////console.log(">>>> payment details upload: ", getData.data.paymentDetails, " -- ", this.paymentFilePath, " :: ", filePath);
        }
        else{
          saveStep = parseInt(getData.data.saved_step) - 1; 
        }*/
        if(!this.Service.isObjectEmpty(getData.data.paymentDetails)){
          if(getData.data.paymentDetails.voucher_invoice != undefined && getData.data.paymentDetails.voucher_invoice != ''){
            filePath = this.constant.mediaPath + '/media/' + getData.data.paymentDetails.voucher_invoice;
            pathData = this.getSantizeUrl(filePath);
            this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
          }
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

        /*
        if(this.step1Data.accredation_criteria == 2){
              //Extension
              let stepData: any = this.headerSteps.find(item => item.title == 'information_audit_management');
              console.log(">>step select: 1 ", stepData);
              if(stepData){
                stepData.activeClass = '';
                stepData.stepComp = true;
              }
              console.log(">>step select: 2 ", this.headerSteps);
              this.Service.moveSteps('personal_information', 'scope_accreditation', this.headerSteps);
            }

        */

        if(getData.data.saved_step  != null){
          ///////////console.log("@saved step assign....");
          //saveStep = parseInt(getData.data.saved_step) - 1;
          //open step
          this.headerSteps.forEach((item, key) => {
                ///////////console.log(item, " --- ", key);
                if(key < saveStep){
                  //////////console.log('moving steps....');
                  let curStep: any = item;
                  
                  curStep.stepComp = true;
                  let nextStep: any = this.headerSteps[key+1];
                  this.Service.moveSteps(curStep.title, nextStep.title, this.headerSteps);
                }
                if(key == saveStep){
                  let curStep: any = this.headerSteps[key];
                  ///////////console.log('found steps....',curStep);
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
          //////////console.log("#Step data: ", this.headerSteps);
        }

        //Step 1
        //

        if(getData.data.trade_license != ''){
          // let getFile = getData.data.trade_license.toString().split('/');
          // if(getFile.length){
          // this.selectTradeLicName = getFile[4].toString().split('.')[0];
          // this.selectTradeLicPath = this.constant.mediaPath +  data.trade_license.toString();
          // }
          }
          this.step1Data.trade_license_number = getData.data.trade_license_number;
          
          // if(getData.data.cab_name  != ''){
          // this.step1Data.official_commercial_name = getData.data.cab_name.toString();
          // }
          
          // if(getData.data.date_of_issue != ''){
          // this.step1Data.date_of_expiry = getData.data.date_of_expiry;
          // this.step1Data.date_of_establishment = getData.data.date_of_establishment;//
          // this.step1Data.date_of_issue = getData.data.date_of_issue;
          // }
          
          this.step1Data.physical_location_address = getData.data.physical_location_address;
          this.step1Data.po_box = getData.data.po_box;
          this.step1Data.telephone = getData.data.telephone;
          this.step1Data.fax_no = getData.data.fax_no;
          this.step1Data.mailing_address = getData.data.mailing_address;
          //this.step1Data.official_website = data.applicant_website;
          // this.step1Data.date_of_expiry = data.date_of_expiry;
          // this.step1Data.date_of_establishment = data.date_of_establisment;
          // this.step1Data.date_of_issue = data.date_of_issue; //|
          this.step1Data.official_email = getData.data.official_email;
          this.step1Data.official_website = getData.data.official_website;
          
          if(getData.data.ownershipOfOrg != undefined && getData.data.ownershipOfOrg.length){
          ////console.log('>>> owner data....');
          this.ownOrgBasicInfo = getData.data.cabOwnerData;
          //this.profileAutoData = true;
          ////////console.log('>>> owner data....', this.ownOrgBasicInfo);
          }
          if(getData.data.bodMember != undefined && getData.data.bodMember.length){
          ////////console.log('>>> member data....');
          if(getData.data.bodMember.length > 0){
          //this.profileAutoData = true;
          this.ownOrgMembInfo = getData.data.bodMember;
          //this.step1Data.is_bod_select = "1";
          } 
          //////console.log('>>> profile member data....', this.ownOrgMembInfo);
          }



        //////console.log('>>>', getData.data.accredation_criteria);
        if(getData.data.accredation_criteria  != ''){
          this.step1Data.accredation_criteria = getData.data.accredation_criteria.toString();
        }
        if(getData.data.criteria_request  != ''){
          this.step1Data.criteria_request = getData.data.criteria_request;
        }
        if(getData.data.ptParticipation  != null){
          this.proficiencyTesting = getData.data.ptParticipation;
        }

        // if(getData.data.official_commercial_name  != ''){
        //   this.step1Data.official_commercial_name = getData.data.official_commercial_name.toString();
        // }
        // if(getData.data.country  != null){
        //   this.step1Data.country = getData.data.country;
        // }
        // if(getData.data.date_of_issue != ''){
        //   this.step1Data.date_of_expiry = getData.data.date_of_expiry;
        //   this.step1Data.date_of_establishment = getData.data.date_of_establishment;
        //   this.step1Data.date_of_issue = getData.data.date_of_issue;
        // }
        this.step1Data.duty_shift = getData.data.duty_shift.toString();
        //if(getData.data.duty_from1 != null && getData.data.duty_shift != '' && getData.data.duty_shift == 1){
          //////console.log(">>>duty shift...0 ", getData.data.duty_shift, " :: ", getData.data.duty_shift.toString());
        if(getData.data.duty_shift != ''){
          ////console.log(">>>duty shift...1");
          this.step1Data.duty_shift = getData.data.duty_shift.toString();

          if(this.step1Data.duty_shift == 1){
            ////console.log(".....1");
            this.step1Data.duty_from1 = (getData.data.duty_from1 != null) ? getData.data.duty_from1.toString() : undefined;
            this.step1Data.duty_to1   = (getData.data.duty_to1 != null) ? getData.data.duty_to1.toString() : undefined;
            this.step1Data.duty_from2 = undefined;
            this.step1Data.duty_to2   = undefined;
            this.step1Data.duty_from3 = undefined;
            this.step1Data.duty_to3   = undefined;
          }
          else if(this.step1Data.duty_shift == 2){
            ////console.log(".....2");
            this.step1Data.duty_from1 = (getData.data.duty_from1 != null) ? getData.data.duty_from1.toString() : undefined;
            this.step1Data.duty_to1   = (getData.data.duty_to1 != null) ? getData.data.duty_to1.toString() : undefined;
            this.step1Data.duty_from2 = (getData.data.duty_from2 != null) ? getData.data.duty_from2.toString() : undefined;
            this.step1Data.duty_to2   = (getData.data.duty_to2 != null) ? getData.data.duty_to2.toString() : undefined;
            this.step1Data.duty_from3 = undefined;
            this.step1Data.duty_to3   = undefined;
          }
          else if(this.step1Data.duty_shift == 3){
            ////console.log(".....3");
            this.step1Data.duty_from1 = (getData.data.duty_from1 != null) ? getData.data.duty_from1.toString() : undefined;
            this.step1Data.duty_to1   = (getData.data.duty_to1 != null) ? getData.data.duty_to1.toString() : undefined;
            this.step1Data.duty_from2 = (getData.data.duty_from2 != null) ? getData.data.duty_from2.toString() : undefined;
            this.step1Data.duty_to2   = (getData.data.duty_to2 != null) ? getData.data.duty_to2.toString() : undefined;
            this.step1Data.duty_from3 = (getData.data.duty_from3 != null) ? getData.data.duty_from3.toString() : undefined;
            this.step1Data.duty_to3   = (getData.data.duty_to3 != null) ? getData.data.duty_to3.toString() : undefined;
          }
          
          ////console.log(">>>Working time: 1 ", this.step1Data.duty_shift);
        }
        // if(getData.data.duty_from2 != null && getData.data.duty_shift != ''  && getData.data.duty_shift == 2){
          
        //   this.step1Data.duty_shift = getData.data.duty_shift.toString();
        //   this.step1Data.duty_from2 = getData.data.duty_from2.toString();
        //   this.step1Data.duty_to2   = getData.data.duty_to2.toString();
        //   ////console.log(">>>Working time: 2 ", this.step1Data.duty_shift);
        // }
        // if(getData.data.duty_from3 != null && getData.data.duty_shift != ''  && getData.data.duty_shift == 3){
          
        //   this.step1Data.duty_shift = getData.data.duty_shift.toString();
        //   this.step1Data.duty_from3 = getData.data.duty_from3.toString();
        //   this.step1Data.duty_to3   = getData.data.duty_to3.toString();
        //   ////console.log(">>>Working time: 3 ", this.step1Data.duty_shift);
        // }
        if(getData.data.is_main_activity != undefined){
            ////////console.log(">>>main sctivuty: 1", getData.data.is_main_activity);
            this.step1Data.is_main_activity = getData.data.is_main_activity.toString();
            if(!getData.data.is_main_activity){
              ////console.log(">>>main sctivuty: 2", getData.data.is_main_activity);
              this.step1Data.is_main_activity_note = getData.data.is_main_activity_note.toString();
            }
        }
        // if(getData.data.country != undefined && getData.data.country > 0){
        //   //this.step1Data.country = getData.data.country;
        // }
        this.step1Data.country = getData.data.country;
        //////console.log(">>> country data: ", this.getCountryLists);
        if(this.getCountryLists.length){
          //////console.log(">>> 11c country data: ", this.getCountryLists);
          let cdata: any = this.getCountryLists.find(rec => rec.name == getData.data.country)
            //////console.log("Fnd country: ", cdata);  
            if(cdata){
              let cid = cdata.id;
              this.statelistById(cid) 
            }
        }
        
        // var stateList =  this.Service.getState();
        //   var cityList =  this.Service.getCity();
        //   stateList.subscribe( result => {
        //     for(let key in result['states']) {
        //       if(result['states'][key]['name'] == data.state )
        //       {
        //         this.allStateList.push(result['states'][key]);
        //       }
        //     }
        //   });

          cityList.subscribe( result => {
            for(let key in result['cities']) {
              //////console.log("ccc: ", result['cities'][key]);
              if(result['cities'][key]['name'] == getData.data.city )
              {
                this.allCityList.push(result['cities'][key]);
              }
            }
          });
        this.step1Data.state = getData.data.state;  
      
        this.step1Data.city = getData.data.city;
        //Accreditation Info
        //this.accreditationInfo
        if(getData.data.otherAccr != undefined && getData.data.otherAccr.length > 0){
          ////////console.log('>>>Accr infor: ', getData.data.otherAccr);
          this.accreditationInfo = [];
          this.step1Data.is_hold_other_accreditation_select = "1";
          //this.accreditationInfo = '';
          getData.data.otherAccr.forEach((item, key) => {
               //////////console.log('>> ', item, " :: ", key);
               let data: any;
               data = item['value'];
               var obj1 = data.replace(/'/g, "\"");
               let jparse = JSON.parse(obj1);
               this.accreditationInfo.push(jparse);
               //////////console.log('>> parse: ', jparse);
          })
          //////////console.log('>>>Info: ', this.accreditationInfo);
           
        }else{
          //this.accreditationInfo = [{}];
          this.step1Data.is_hold_other_accreditation_select = "0";
        }



        //Step 2
        if(getData.data.ptParticipation != undefined && getData.data.ptParticipation.length > 0){
          this.step2Data.proficiency_testing_val = "1";
          this.proficiencyTesting = getData.data.ptParticipation;

        }else{
          this.step2Data.proficiency_testing_val = "0";
        }

        //Step 3

        if(getData.data.technicalManager != undefined && getData.data.technicalManager.length > 0){
          let getTechData: any = getData.data.technicalManager[0];
          this.step3Data.name_technical = getTechData.name;
          this.step3Data.designation_technical = getTechData.designation;
          this.step3Data.mobile_no_technical = getTechData.mobile_no;
          this.step3Data.tech_email_technical = getTechData.email;
          this.step3Data.relevent_experience_technical = getTechData.relevent_experience;
        }
        if(getData.data.managementManager != undefined && getData.data.managementManager.length > 0){
          let getMangData: any = getData.data.managementManager[0];
          this.step3Data.management_name = getMangData.name;
          this.step3Data.management_designation = getMangData.designation;
          this.step3Data.management_mobile_no = getMangData.mobile_no;
          this.step3Data.management_email = getMangData.email;
          this.step3Data.management_relevent_experience = getMangData.relevent_experience;
        }

        //Step 4
        if(getData.data.audit_date != null){
          this.step4Data.audit_date = getData.data.audit_date;
        }
        if(getData.data.mrm_date != null){
          this.step4Data.mrm_date = getData.data.mrm_date;
        }

        //Step 5
        if(getData.data.scopeDetails != undefined && !this.Service.isObjectEmpty(getData.data.scopeDetails)){
          ////console.log(">>> ", getData.data.scopeDetails);
          //let jsonStrting = '{"18":{"scope_heading":{"43":"Inspection Category","45":"Inspection field","47":"Range of inspection","49":"Stage of the inspection","51":"Inspection criteria","53":"Inspection Activity Type"},"scope_value":[{"43":"Product","45":"Mechanical Engineering of Lifting Equipment","47":"Lever hoist","49":"In-service","51":"BS EN 13157","53":"A"},{"43":"Product","45":"Mechanical, Electrical and Structural Engineering of Lifting Equipment","47":"Mobile crane","49":"In-service","51":"BS 7121-2-1,BS 7121-2-3","53":"B,C"},{"43":"Product","45":"Mechanical Engineering of Lifting Equipment – Earth Moving","47":"Backhoe Loader","49":"In-service","51":"BS EN 474-4","53":"A,B"}]},"105":{"scope_heading":{"55":"Inspection Category","57":"Inspection field","59":"Range of inspection","61":"Stage of the inspection","63":"Inspection criteria","65":"Inspection Activity Type"},"scope_value":[{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Hook","61":"In-service","63":"Welcome","65":"Hello"},{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Chain sling","61":"In-service","63":"bbb","65":"aaa"}]}}';
          //let jsonStrting = getData.data.scopeDetails.toString();
          let jsonObject = getData.data.scopeDetails;//JSON.parse(jsonStrting);
          this.Service.oldScopeData = jsonObject;
          this.editScopeData = jsonObject; 
          this.getScopeData = jsonObject;
          
          // this.Service.jsonToArray(jsonObject);
          ////console.log(">>>Saved details: ", jsonObject, " -- ", this.editScopeData);

            ////////console.log("@@@@@Scope details: ", getData.data.scopeDetails, " -- ", this.Service.isObjectEmpty(getData.data.scopeDetails) );
            //let rowDetails: any[] = getData.data.scopeDetails.details;
            //let rowLines: any[] = [];
            // getData.data.scopeDetails.details.forEach((item, key) => {
            //   //////console.log('>> ', item, " :: ", key);
            //   let data: any;
            //   data = item['value'];
            //   var obj1 = data.replace(/'/g, "\"");
            //   let jparse = JSON.parse(obj1);
            //   rowLines.push(jparse);
            //   //////////console.log('>> parse: ', jparse);
            //   })
            /*if(getData.data.scheme != undefined && getData.data.scheme > 0){
              //this.step5Data.scheme_ids[0] = getData.data.scheme;
              // this.schemeRows[0].id = getData.data.scheme;
              // this.getCriteria(getData.data.scheme, 0);

              //////console.log("@ Scope Model: ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns, " -- ", rowDetails, " -- ", rowLines);
              //onChangeScopeOption(getValues: any, lineIndex: number, columnIndex: number, type?:string) {
                let tempModel = [this.dynamicScopeModel];
                //////console.log('model type: ', typeof this.dynamicScopeModel, " -- ", tempModel);
                // tempModel.forEach((rec, key) =>{
                //   //////console.log("scope key: ", key, " -- ",rec, " -- ", tempModel[0].fieldLines);
                //   if(typeof rec === 'object'){
                //      //////console.log('get fieldlines...');
                //      for(var p in rec){
                //       //////console.log("1 scope key: ", p, " -- ", rec[p]);
                //      }
                //   }
                // })
              // for(var k in this.dynamicScopeModel){
              //   //////console.log("scope key: ", k);
              // }

              // if(this.dynamicScopeModel['fieldLines'].length){
              //   this.dynamicScopeModel['fieldLines'].forEach((rec, key) => {
              //          //////console.log("scope key: ", key, " -- ",);
              //          let findSel = this.dynamicScopeFieldColumns.find(item => item[0].InspectionCategoryValues == key);
              //          //////console.log(findSel);

              //   })
              // }
            }*/
        }




        //Step 6
        if(getData.data.is_prelim_visit != null){
          this.step6Data.prelim_visit_val = (getData.data.is_prelim_visit) ? "1" : "0";
          this.step6Data.prelim_visit_select_date = getData.data.prelim_visit_date;
        this.step6Data.prelim_visit_select_time = getData.data.prelim_visit_time;
        }
        //Step 7
        if(getData.data.onBehalfApplicantDetails != null && getData.data.onBehalfApplicantDetails != undefined){
          let getAuthData = getData.data.onBehalfApplicantDetails;
          ////console.log(">>> Auth data: ", getAuthData);
          this.step7Data.organization_name        = (getAuthData.organization_name != undefined) ? getAuthData.organization_name : '';
          this.step7Data.representative_name      = getAuthData.representative_name;
          this.step7Data.designation              = getAuthData.designation;
          this.step7Data.digital_signature        = getAuthData.digital_signature;
          this.step7Data.application_date         = getAuthData.application_date;
          //check checkboxes

          // this.authorizationList.authorization_confirm1 = true;
          // this.authorizationList.authorization_confirm2 = true;
          // this.readTermsCond       = true;
          // this.authorizationList.undertaking_confirmTop3 = true;
          // this.authorizationList.undertaking_confirm1 = true;
          // this.authorizationList.undertaking_confirm2 = true;
          // this.readReviewChecklist = true;
          // this.authorizationList.undertaking_confirm3 = true;
          // this.authorizationList.undertaking_confirm4 = true;
          // this.authorizationList.undertaking_confirm5 = true;
          // this.authorizationList.undertaking_confirm6 = true;
          // this.authorizationList.undertaking_confirm7 = true;

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


          //this.authorizationStatus = true;
          //this.readReviewChecklist= true;
          //let visitRecomm = getData.data.recommend_visit.toString().replace(/["']/g, "");
          //////console.log(">>>recommm", visitRecomm);
          //this.step7Data.recommend_visit = visitRecomm;
          // let json: any = getData.data.recommend_visit;
          // var newJson = json.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
          // newJson = newJson.replace(/'/g, '"');

          // var dataJson = JSON.parse(newJson);
          //console.log("@recommend visit  Data json : ", dataJson, " -- ", dataJson[0]);
          // console.log(getData.data.recommend_visit,'fghhhhhhhhhh');
          // let replace:  any = getData.data.recommend_visit.replaceAll("\\", "");
          // var replace1:any = JSON.parse(replace);
          // // var recomData = getData.data.recommend_visit;
          // // var reaplaceComma  = replace.replace(/'/g, "\"");
          // // let reaplaceComma: any = replace.replaceAll('"', "'");
          // console.log(replace,'reaplaceComma');
          // let replace:  any = getData.data.recommend_visit.replaceAll("\\", "");
          
          // let replace1: any = replace.replaceAll('"', '');
          // console.log(">>>..", replace, " -- ",replace1, " :: ");
          // console.log(JSON.parse(JSON.stringify(replace)))
          this.recomendVisit.forEach((item, index) => {
                
                //console.log(">>> replace: ", getData.data.recommend_visit, " :: ", replace);
                // let tempJson = replace;//'{\"first\": false, \"second\": true, \"third\": true, \"fourth\": false}';//'{"first": false, "second": true, "third": false, "fourth": true}';
                //let cpjson: any = getData.data.recommend_visit;
               let replace1 =  JSON.parse(getData.data.recommend_visit);//{first: false, second: true, third: true, fourth: false}; //fixed data
                let findVsit: any = (replace1);
                //console.log("JOSN:  ", findVsit);
                //console.log(replace);
                //return;
                //
                for(let key in findVsit){
                //  console.log('>>> ', key);
                   if(key === item.name){
                     console.log(">>>> found: ", item, " == ", replace1[key]);
                     item.checked = findVsit[key];
                   }
                }
          })
          // console.log("@recommend visit: ", replace1, " -- ", getData.data.recommend_visit);
          this.step7Data.recommend_visit = this.recomendVisit;// (getData.data.recommend_visit);
          
          this.step7Data.recommend_year = parseInt(getData.data.recommend_year);
        }

        //step 9
        if(getData.data.paymentDetails != null && typeof getData.data.paymentDetails === 'object'){
          console.log(">>>payment details...show; ", getData.data.paymentDetails);
            this.voucherSentData.voucher_code     = getData.data.paymentDetails.voucher_no;
            this.voucherSentData.payment_date     = getData.data.paymentDetails.voucher_date;
            this.voucherSentData.amount           = getData.data.paymentDetails.amount;

            this.voucherSentData.transaction_no   = (getData.data.paymentDetails.transaction_no != 'null') ? getData.data.paymentDetails.transaction_no : '';
            this.voucherSentData.payment_method   = (getData.data.paymentDetails.payment_method != 'null') ? getData.data.paymentDetails.payment_method : '' ;
            this.voucherSentData.payment_made_by  = (getData.data.paymentDetails.payment_made_by != 'null') ? getData.data.paymentDetails.payment_made_by  : '';
            this.voucherSentData.mobile_no        =  (getData.data.paymentDetails.mobile_no != 'null') ? getData.data.paymentDetails.mobile_no : '';

            this.paymentFile = res['data'].paymentDetails.payment_receipt && res['data'].paymentDetails.payment_receipt != null ? this.constant.mediaPath+'/media/'+res['data'].paymentDetails.payment_receipt : '';
            
            if(this.paymentFile != undefined && this.paymentFile != ''){
              this.paymentReceiptValidation = true;
            }

            //
            // if(getData.data.paymentDetails.transaction_no != null && getData.data.paymentDetails.payment_method != null &&
            //   getData.data.paymentDetails.payment_made_by !+ null && getData.data.paymentDetails.mobile_no != null && getData.data.paymentDetails.payment_receipt != ''){
            //       this.paymentStepComp = true;
            // }
        }
        
      }
    );
    }
    //let url = this.Service.apiServerUrl+"/"+'accrediation-details-show/0';
    
  }

  loadAppInfo(){
    //let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    let getUserdata = '';
  let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
  //////console.log("app info: ", url);
  this.Service.getwithoutData(url)
    .subscribe(
      res => {
        let getData: any = res;
        let data: any;
        //, getData.data.step1, " -- ", getData.data.step2
        //console.log(getData,"Profile info >>> ");

        if(getData.data.step1.length){
          data = getData.data['step1'][0];
          ///////////console.log('data enter...1', data);

          if(data){
            ////console.log('data enter...2');
            if(this.urlVal == 'undefined'){
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
            // var stateList =  this.Service.getState();
            // var cityList =  this.Service.getCity();

            // stateList.subscribe( result => {
            //   for(let key in result['states']) {
            //     // if(result['states'][key]['name'] == data.state )
            //     // {
            //       this.allStateList.push(result['states'][key]);
            //     //}
            //   }
            // });

            // cityList.subscribe( result => {
            //   for(let key in result['cities']) {
            //     // if(result['cities'][key]['name'] == data.city )
            //     // {
            //       this.allCityList.push(result['cities'][key]);
            //     //}
            //   }
            // });
          }

            ////console.log(">>> list: ", this.allStateList, " -- ", this.allCityList);


            // let countryList =  this.Service.getCountry();
            // countryList.subscribe( result => {
            //   for(let key in result['countries']) {
            //     ////////console.log("cc: ", result['countries'][key]['name']);
            //     if(result['countries'][key]['name'] == data.country )
            //     {
            //       this.allCountryList.push(result['countries'][key]);
            //     }
            //   }
            // });
    // await countryList.subscribe(record => {
    //   ///////////console.log(record,'contry record :: ', this.step1Data.country);
    //   this.getCountryLists = record['countries'];
    //   //////console.log(">>>Country List: ", this.getCountryLists);
    //   let getC = this.getCountryLists.find(rec => rec.name == this.profileCountrySel);
    //   //////console.log('>>>> country: ', getC);
    //   if(getC){
    //     this.step1Data.country = getC.id;
    //   }
    // });


            //this.profileCountrySel = data.country;\
            if(this.urlVal == 'undefined'){
            this.step1Data.country = data.country;
            
            this.step1Data.state = data.state;
            this.step1Data.city = data.city;
            }
            //selectTradeLicName
            if(data.trade_license != ''){
              let getFile = data.trade_license.toString().split('/');
              if(getFile.length){
                this.selectTradeLicName = getFile[4].toString().split('.')[0];
                this.selectTradeLicPath = this.constant.mediaPath +  data.trade_license.toString();
              }
            }
            this.step1Data.trade_license_number = data.trade_license_number;
            //if(this.urlVal == 'undefined'){
                if(data.cab_name  != ''){
                  this.step1Data.official_commercial_name = data.cab_name.toString();
                }
            //}

            if(data.date_of_issue != ''){
              this.step1Data.date_of_expiry = data.date_of_expiry;
              this.step1Data.date_of_establishment = data.date_of_establisment;//
              this.step1Data.date_of_issue = data.date_of_issue;
            }
            if(this.urlVal == 'undefined'){
                this.step1Data.physical_location_address = data.applicant_location;
                this.step1Data.po_box = data.po_box;
                this.step1Data.telephone = data.tel_no;
                this.step1Data.fax_no = data.fax_no;
                this.step1Data.mailing_address = data.applicant_address;
                this.step1Data.official_website = data.applicant_website;
                // this.step1Data.date_of_expiry = data.date_of_expiry;
                // this.step1Data.date_of_establishment = data.date_of_establisment;
                // this.step1Data.date_of_issue = data.date_of_issue; //|
                this.step1Data.official_email = data.applicant_email;;//data.official_email;
                this.step1Data.official_website = data.applicant_website;
            }
          }
        }

            if(typeof getData.data.step2 === 'object'){
            let data: any = getData.data.step2;
            ////////console.log("step 2>>>", data);
            if(typeof data === 'object'){
                  if(data.cabOwnerData != undefined && data.cabOwnerData.length){
                    ////////console.log('>>> owner data....');
                    this.ownOrgBasicInfo = data.cabOwnerData;
                    this.profileAutoData = true;
                    ////////console.log('>>> owner data....', this.ownOrgBasicInfo);
                  }
                  if(data.cabBodData != undefined && data.cabBodData.length){
                    ////////console.log('>>> member data....');
                    if(data.cabBodData.length > 0){
                      this.profileAutoData = true;
                      this.ownOrgMembInfo = data.cabBodData;
                      this.step1Data.is_bod_select = "1";
                    } 
                    //////console.log('>>> profile member data....', this.ownOrgMembInfo);
                  }
            }

            }
        if(getData.data.criteriaList != undefined && getData.data.criteriaList.length){
          ////////console.log(">>>Criteria list: ", getData.data.criteriaList);
          //this.criteriaList = getData.data.criteriaList;
        }
      })
  }

  loadData(){
  this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data)
    .subscribe( 
      res => {
        ////console.log("@Load scope....", res);
        this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
        //this.countryList = res['allCountry'];
        this.labTypeList = res['allLabtype'];
        //this.fullScope   = res['fullScope'];
        this.criteriaList = res['data']['criteriaList'];
        this.step1Data.criteria_request = this.criteriaList[0].code;
        this.criteriaMaster = res['data']['schemes'];
        ////////console.log("#Get criteria: ", this.criteriaMaster);

      },
      error => {
      
  })


  ///get info
  // let getUserdata = '';
  // let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
  // ////////console.log("app info: ", url);
  // this.Service.getwithoutData(url)
  //   .subscribe(
  //     res => {
  //       let getData: any = res;
  //       let data: any;
  //       ////////console.log(getData,"get info:");
  //       if(getData['step1'] != undefined){
  //         data = getData['step1'][0];
  //         ////////console.log('data enter...1', data);
  //         if(data){
  //           ////////console.log('data enter...2');
  //           this.step1Data.physical_location_address = data.registered_address;
  //           this.step1Data.po_box = data.po_box;
  //           this.step1Data.telephone = data.tel_no;
  //           this.step1Data.fax_no = data.fax_no;
  //         }
  //       }
        

  //     })

    if(this.inspectionBodyScopeFields.length<1){
      this.inspectionBodyScopeFields=  [{},{},{},{},{},{}];
    }
  }

  loadDefaultColumnValues(modelObject: any){
      ////////console.log("### Setting default values: ", modelObject, " --- ", typeof(modelObject), " === ", this.dynamicScopeFieldColumns);
      var lineCount = 0;
      let getModelKey = '';
      let getFistValue = 0;
      for(var key in modelObject){
          ////////console.log(key," ----- ", modelObject[key]);
        if(modelObject[key].fieldLines[0].firstFieldValues.length > 0){
          ////////console.log(">>> Firstfieldvalues: ", key , modelObject[key].fieldLines[0].firstFieldValues);
          if(this.dynamicScopeFieldColumns.length > 0){
            getModelKey = this.dynamicScopeFieldColumns[lineCount][0].title;
          }
          getFistValue = modelObject[key].fieldLines[0].firstFieldValues[0].field_value;
          ////////console.log("Field/model value: ", getFistValue, " :: ", getModelKey);
          if(getModelKey != '' && getFistValue > 0){
            modelObject[key].fieldLines[0][getModelKey] = getFistValue;
          }
        }
        lineCount++;
      }
      //////////console.log("@Final Model column: ", model);
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
    //////////console.log('Get Index: ', indexVal.value, " -- ", indexVal);
      var keyVal;
      for(keyVal in this.addMinutesToTime){
          //////////console.log(keyVal);
          if(indexVal.value === this.addMinutesToTime[keyVal].val){
            //////////console.log("match ", this.addMinutesToTime[keyVal].val);
            this.getDutyTimeForm1IndexValue = keyVal;
            return;
          }
      }
  }
  emailValidation(email){
    // var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // if(!regex.test(email)){
    //   this.mailing_address = true;
    // }
    // else{
    //   this.mailing_address = false;
    // }
  }

  assignModel(secIndex, lineIndex, colIndex){
    //////////console.log('Model assign...');
  }

  selectChange(event){
    //////////console.log('Change Event: ', event);
  }
  //Dynamic Scope binding ----  Abhishek @Navsoft

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
    //////console.log("@ADD ROW - Total line: ", lineData, " - ", lineIndex, " == ", lineData.length, " --Model: ", this.dynamicScopeModel);
    if(lineData != undefined && lineData.length > 0){
      lineIndex  = lineData.length;
    }
    for(var key in this.dynamicScopeModel[secIndex]){
        //////console.log("Key: ", key , " :: ", this.dynamicScopeModel[secIndex][key]);
        let getValue: any = 0;
        //if( key === secName ){
          if(this.dynamicScopeModel[secIndex].fieldLines != undefined){
            let fieldValues = this.dynamicScopeModel[secIndex].fieldLines[0].firstFieldValues;
            
            //////console.log("@ADD ROW - Fieldvalues:: ", fieldValues);
            line['firstFieldValues'] = fieldValues;
            this.dynamicScopeModel[secIndex].fieldLines.push(line);
            if(fieldValues.length > 0 && typeof fieldValues[0] === "object" && fieldValues[0].field_value != undefined){
              getValue = fieldValues[0].field_value.id;
            }
            //////console.log('@ADD ROW - Calling on change...', getValue, " -- ", secIndex, " Lineindex: ", lineIndex);
            
            this.dynamicScopeFieldColumns[secIndex].forEach((recCol, keyCol) => {
              ////////////console.log(" > >>   ", keyCol)
              if(keyCol === 0){
                let getModelKey = recCol[0].title;
                //////console.log(" >>>>>ModelKey ",getModelKey, " --- FindValue:  ", getValue, " --- ");
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

  addRow(obj: any = [],type?: string){
    if(type != '' && type != undefined){
      let getIndex    =   obj.findIndex(rec => rec.type == type);
      this.newRow     =   {};
      obj[getIndex].data.push(this.newRow);
    }
    if(type === '' || type == undefined){
      let objlength = obj.length+1;
      this.inspectionBodyData['row'+objlength]={};
      this.inspectionBodyData['row'+objlength].field1 = this.medicalLabFirstData

      this.newRow     =   {};
      obj.push(this.newRow);
    }
      
    return true;
  }
  addMLRow(obj: any = [],type: string){ 

    this.rowCount++;
    if(type === '' || type == undefined){
      let objlength = obj.length+1;
      this.inspectionBodyData[this.rowCount]=[];
      this.inspectionBodyData[this.rowCount].field1 = this.medicalLabFirstData
      this.newRow     =   {};
      obj.push(this.newRow);
    }
      //////////console.log(this.inspectionBodyData)
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

  scrollPage(pageId: any){
    const el = document.getElementById(pageId);
            console.log("@Elem: ",el);
            if(el){
              el.scrollIntoView(true);    //arguement true bypass the non-exist element or undefined
            }
  }
  
  getFieldTooltip123(modelValue: any, modelObject: any, type: any){
    ////////////console.log("Model Tooltip: ", modelValue, " --- ", modelObject);
    let getValue: number;
    if(typeof modelValue === 'object'){
         for(var key in modelValue){
            if(key === type){
              getValue = modelValue[key];
            }
         }
    }
    if(type === 'field6'){
      getValue = modelValue;
    }

    if(modelValue != undefined && modelObject != undefined){
      let findText = modelObject.find(rec => rec.field_value === getValue);
      if(typeof findText === 'object' && findText.value != ''){
          return findText.value;
      }
  }
  }

   scrollToError(theForm: any){
     ////////console.log("scroll to find...");
     let invalidFields: any[] = [];
      // let findField =  document.querySelector('div .ng-invalid');
      // this.scrollToPos(findField);
      // const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      //   "div .ng-invalid"
      // );  
      // ////////console.log("scroll to postion...", firstInvalidControl);
      // firstInvalidControl.focus();  
      let getForm = theForm.form.controls;
      //////////console.log(getForm);
      var key;
      for(key in getForm){
         //////////console.log(key, " => ", getForm[key].status)
         if(getForm[key].status === 'INVALID' && getForm[key].errors.required === true){
           invalidFields.push({control: getForm[key], name: key});
         }
      }

      if(invalidFields.length > 0){
          let findElement = invalidFields.find(rec => rec.name === 'audit_date');
           ////////console.log("find elem: ", findElement, " :: ",findElement.control);
           if(findElement.control != undefined){
            const el = document.getElementById('audit_date');
            ////////console.log("@Elem: ",el);
            if(el){
              el.scrollIntoView(true);    //arguement true bypass the non-exist element or undefined
            }
            // let elem = document.getElementById('audit_date');
            // ////////console.log("#Elem: ", elem);
            // elem.scrollIntoView();
            ////findElement.control.focus();
          }
      }
      ////////console.log('model inputs: ', this.inspectionBodyForm);
      ////////console.log('invalid inputs: ', invalidFields);
      
   }
   scrollToPos(el: Element){
    ////////console.log("scroll to postion...", el);
    if(el) { 
      el.scrollIntoView({ behavior: 'smooth' });
     }
   }

   validateFileVoucher(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    //var ex_type = ['pdf, PDF'];
    var ex_type = ['pdf', 'PDF'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    //////console.log("...voucher file...1: ", ex_check, " -- ext ",file_exe, " -- ", ex_type, " -- ", file_name,  " -- ", fileEvent );
    if(ex_check){
      this.paymentReceiptValidation = true;
      //////console.log("...voucher file...2: ", ex_check);
      //if(type == undefined){
        this.voucherFile.append('payment_receipt',fileEvent.target.files[0]);
      //}
    }else{
      //////console.log("...voucher file...3: ", ex_check);
        this.paymentReceiptValidation = false;
        
    }
  }

   validateFile(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['png','pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      if(type == undefined){
        this.step1DataBodyFormFile.append('trade_license',fileEvent.target.files[0]);
      }if(type != undefined){
        ////////console.log(">>>File: ", fileEvent.target.files[0]);
        this.step5Data.payment_receipt = fileEvent.target.files[0].name;
        this.step5Data.payment_receipt_file = fileEvent.target.files[0];
        this.step5DataBodyFormFile.append(type,fileEvent.target.files[0]);
        ////////console.log(">>> data file: ", this.step5DataBodyFormFile);
        //this.step7DataBodyFormFile.append(type,fileEvent.target.files[0]);
      }
      
      this.file_validation = true;
      if(type == undefined){
        this.tradeLicensedValidation = true;
      }
      if(type != undefined){
        this.paymentReceiptValidation = true;
      }
      return true;
    }else{
      this.file_validation = false;
      if(type == undefined){
        this.tradeLicensedValidation = false;
      }if(type != undefined){
        this.paymentReceiptValidation = false;
      }
    }
  }

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }

  authorizeCheckCount(theEvent: any, type?:any){
    console.log(theEvent);
    let checkCount = 0;
    let readChecked = false;

    if(type != undefined && type == 'read'){
      //console.log(">>> readd...");
      readChecked = true;
    }

    if(theEvent.checked || readChecked == true){
      for(let key in this.authorizationList) {
        console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
        if(this.authorizationList[key] && key != 'undertaking_confirmTop3') {  
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
    console.log(">>> Check status count: ", checkCount);
  }

  onSubmitUndertakingApplicant(ngForm7: any, type?: boolean){
    // Object.keys(this.authorizationList).forEach(key => {
    //   if(this.authorizationList[key]==false){
    //     this.authorizationStatus = false;
    //   }
    // })
    
    //this.Service.moveSteps('undertaking_applicant', 'payment_update', this.headerSteps);
    //this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);

    // if(this.viewData != undefined && this.viewData.data.id > 0 && this.viewData.data.onBehalfApplicantDetails.length > 0){
    //   //////console.log(">>>find ID");
    //   this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);
    //   return;
    // }

    
    
    let checkCount = 0;
    if(type == undefined){
      this.isApplicationSubmitted = true;
      
        for(let key in this.authorizationList) {
          ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
          if(this.authorizationList[key] && key != 'undertaking_confirmTop3') {  
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
    }        

    console.log(">>> Check status count: ", checkCount);

    ////////console.log("authorize checklist count: ",checkCount)
    // for(let key in this.authorizationList) {
    //   ////////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
    //   if(this.authorizationList[key]) {
    //     this.authorizationStatus = true;
    //   }      
    // }
    
    // for(let key in this.recommend) {
    //   if(this.recommend[key] == true) {
    //     this.recommendStatus = true;
    //   }
    // }
    // if(!this.authorizationStatus && type == undefined){
    //   //this.isSubmit = false;
    //   this.toastr.warning('Please Fill required field','Validation Error','');
    // }
    // else if(this.recommendStatus != true){
    //   this.isSubmit = false;
    //   this.toastr.error('Please Check any recommend the visit ', '');
    // }
    this.inspectionBodyForm = {};
      this.inspectionBodyForm.step7 = {};
      //this.inspectionBodyForm.email = this.userEmail;
      //this.inspectionBodyForm.userType = this.userType;
      this.step7Data.authorization_list_json = this.authorizationList;

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

      //check check status
      
      

      ////////console.log("@@@Step7 Data: ", this.step7Data);
      this.inspectionBodyForm.step7 = this.step7Data;
      this.inspectionBodyForm.step7.email = this.userEmail;
      this.inspectionBodyForm.step7.userType = this.userType;
      this.inspectionBodyForm.step7.application_id = this.formApplicationId;

      this.inspectionBodyForm.step7.terms1 = this.authorizationListTerms1;
      this.inspectionBodyForm.step7.terms2 = this.authorizationListTerms2;


      //console.log(">>>Def Data: ", this.step7Data);

      // this.step7Data.organization_name = (this.step7Data.organization_name != '') ? this.step7Data.organization_name : '';
      // this.step7Data.representative_name = (this.step7Data.representative_name != '') ? this.step7Data.representative_name : '';
      // this.step7Data.organization_name = (this.step7Data.designation != '' && this.step7Data.designation != 'undefined') ? this.step7Data.designation : '';
      // this.step7Data.organization_name = (this.step7Data.digital_signature != '' && this.step7Data.digital_signature != 'undefined') ? this.step7Data.digital_signature : '';

      this.inspectionBodyForm.step7.application_date = new Date().toISOString().slice(0, 10);//'2020-09-14';

     // return;
     console.log(">>> Enter....1 ", ngForm7.form, " -- ", ngForm7.form.valid, " -- ", this.authorizationStatus, " == ", recomCheckCount)
     //return;
    if(ngForm7.form.valid && type == undefined && this.authorizationStatus == true && recomCheckCount > 0){ 
       
      this.inspectionBodyForm.step7.is_draft = false;
      this.inspectionBodyForm.saved_step = 7;
      console.log(">>>Step7 Data: ", this.inspectionBodyForm);
      //return;
      //this.step6DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      // setTimeout(() => {
      //   this.toastr.success("Please wait paypal", '');
      // }, 500)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'step 7 submit...')
          if(res['status'] == true) {
            this.isApplicationSubmitted = false;

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
      //&& this.authorizationStatus == true
    }else if(type != undefined && type == true ){
      console.log(">>> Enter drfat save: ", type, " -- ", ngForm7.form.valid, " -- ", this.inspectionBodyForm)
      this.inspectionBodyForm.step7.is_draft = true;
      this.inspectionBodyForm.saved_step     = 7; 
      // this.toastr.success('Application Successfully Submitted', '');
      //     setTimeout(()=> {
      //       this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //     }, 2000)
      // console.log(this.inspectionBodyForm);
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        ////////console.log(res,'res')
        if(res['status'] == true) {
          //this.toastr.success(res['msg'], '');
          this.toastr.success('Save Draft Successfully', '');
          // setTimeout(()=> {
          //   //this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          // }, 2000)
          //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
      }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }    
  }

  //Step FORM Action
  onSubmitApplication(ngForm1: any, type?:boolean){
    // ////////console.log("Step Application submit...", " -- ", ngForm.form);
    //  if(!ngForm.form.valid){
    //   this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    //  }else{
    //   this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    // } 
    //&& this.formAccrStatus ==
    // if(this.viewData != undefined && this.viewData.data.id > 0 && this.viewData.data.accredation_criteria  == ''){
    //     //////console.log(">>>find ID");
    //     this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    //   return;
    // }
    
    //////////console.log("Submit calling: ", this.step1Data);
    //return;
    //this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    
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

    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step1 = {};
    // if(this.step1Data.is_main_activity_note == undefined){
    //   this.step1Data.is_main_activity_note = " ";
    // }
    
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

    if(this.step1Data.fax_no == undefined || this.step1Data.fax_no === ''){
      this.step1Data.fax_no = " ";
    }
    if(this.step1Data.official_email == undefined){
      this.step1Data.official_email = " ";
    }

    // this.inspectionBodyForm.step1['ownOrgBasicInfo'] = (this.ownOrgBasicInfo.length> 0) ? this.ownOrgBasicInfo :  [];
    //   this.inspectionBodyForm.step1['ownOrgMembInfo'] = [];
    //   this.inspectionBodyForm.step1['accreditationInfo'] = [];
      
      // if(!this.Service.isObjectEmpty(this.ownOrgBasicInfo[0])) {

      //   this.inspectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      // }
      // if(!this.Service.isObjectEmpty(this.ownOrgMembInfo[0])) {
      //   this.inspectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      // }
      // if(!this.Service.isObjectEmpty(this.accreditationInfo[0])) {
      //   this.inspectionBodyForm.step1['accreditationInfo'] = this.accreditationInfo;
      // }
      this.inspectionBodyForm.step1 = this.step1Data;

      ////console.log(">>>2. First Step Data: ", this.inspectionBodyForm.step1, " -- org ", this.ownOrgBasicInfo);


    this.inspectionBodyForm.step1 = this.step1Data;  
    if(ngForm1.form.valid && type == undefined && this.isSubmit == true && this.isNoteSubmit == true) {

      if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 1){
        this.step1Data.is_bod = true;
      }
      if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 0){
        this.step1Data.is_bod = false;
      }
  
      if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 1){
        this.step1Data.is_hold_other_accreditation = true;
      }
      if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 0){
        this.step1Data.is_hold_other_accreditation = false;
      }
      this.inspectionBodyForm.email = this.userEmail;
      this.inspectionBodyForm.userType = this.userType;
      this.inspectionBodyForm.saved_step = 1;
      this.inspectionBodyForm.step1 = this.step1Data;      

      this.inspectionBodyForm.step1['ownOrgBasicInfo'] = [];
      this.inspectionBodyForm.step1['ownOrgMembInfo'] = [];
      this.inspectionBodyForm.step1['accreditationInfo'] = [];
      
      //if(!this.Service.isObjectEmpty(this.ownOrgBasicInfo[0])) {
      if(this.ownOrgBasicInfo) {
        this.inspectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if((this.ownOrgMembInfo)) {
        this.inspectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if((this.accreditationInfo)) {
        this.inspectionBodyForm.step1['accreditationInfo'] = this.accreditationInfo;
      }

      if(this.step1Data.date_of_issue != undefined){
        //////console.log(">>> date");
        this.step1Data.date_of_issue = new Date(this.step1Data.date_of_issue);
      }
      if(this.step1Data.date_of_expiry != undefined){
        //////console.log(">>> date");
        this.step1Data.date_of_expiry = new Date(this.step1Data.date_of_expiry);
      }
      if(this.step1Data.date_of_establishment != undefined){
        //////console.log(">>> date");
        this.step1Data.date_of_establishment = new Date(this.step1Data.date_of_establishment);
      }
      // //////console.log(">>> Date of issue: ", this.step1Data.date_of_issue);

      if(this.formApplicationId > 0){
        this.inspectionBodyForm.step1.application_id = this.formApplicationId;
      }
      
      //return;
      //this.inspectionBodyForm.step1['trade_license'] = this.step1DataBodyFormFile;
      this.inspectionBodyForm.step1.is_draft = false;
      console.log(">>> First Step Data: ", this.inspectionBodyForm);
      //return;
      //this.step1DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
          // this.toastr.success('Application Successfully Submitted', '');
          // setTimeout(()=> {
          //   this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
          // }, 1000)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'response')
          if(res['status'] == true) {
            let data: any = {};
            this.isApplicationSubmitted = false;
             data = res;
             ////////console.log(res,'Data')
            if(data.application_id != undefined && data.application_id > 0){
              this.formApplicationId = data.application_id;
              ////////console.log(this.formApplicationId,'App id assigned')
            }
            //this.toastr.success(res['msg'],);
            this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
      /*
          else if(ngForm1.form.valid && this.tradeLicensedValidation == false) {
      this.file_validation = false;
      this.toastr.warning('Please Fill required field','');
    }
      */   
     //&& this.tradeLicensedValidation == false
     /*
      else if(ngForm1.form.valid ) {
      this.file_validation = false;
      this.toastr.warning('Please Fill required field','');
    }
     */
    }else if(type != undefined && type == true){
        ////console.log("save a draft...");
        ////console.log(">>>1. First Step Data: ", this.inspectionBodyForm);
        if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 1){
          this.step1Data.is_bod = true;
        }
        if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 0){
          this.step1Data.is_bod = false;
        }
    
        if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 1){
          this.step1Data.is_hold_other_accreditation = true;
        }
        if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 0){
          this.step1Data.is_hold_other_accreditation = false;
        }
        this.inspectionBodyForm.email = this.userEmail;
        this.inspectionBodyForm.userType = this.userType;
        this.inspectionBodyForm.saved_step = 1;
        this.inspectionBodyForm.step1 = this.step1Data;      
  
        this.inspectionBodyForm.step1['ownOrgBasicInfo'] = [];
        this.inspectionBodyForm.step1['ownOrgMembInfo'] = [];
        this.inspectionBodyForm.step1['accreditationInfo'] = [];
        
        if(!this.Service.isObjectEmpty(this.ownOrgBasicInfo[0])) {
  
          this.inspectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
        }
        if(!this.Service.isObjectEmpty(this.ownOrgMembInfo[0])) {
          this.inspectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
        }
        if(!this.Service.isObjectEmpty(this.accreditationInfo[0])) {
          this.inspectionBodyForm.step1['accreditationInfo'] = this.accreditationInfo;
        }
  
        if(this.step1Data.date_of_issue != undefined){
          //////console.log(">>> date");
          this.step1Data.date_of_issue = new Date(this.step1Data.date_of_issue);
        }
        if(this.step1Data.date_of_expiry != undefined){
          //////console.log(">>> date");
          this.step1Data.date_of_expiry = new Date(this.step1Data.date_of_expiry);
        }
        if(this.step1Data.date_of_establishment != undefined){
          //////console.log(">>> date");
          this.step1Data.date_of_establishment = new Date(this.step1Data.date_of_establishment);
        }
        this.inspectionBodyForm.step1.is_draft = true;
        //this.inspectionBodyForm.step1.application_id = this.formApplicationId;
        this.inspectionBodyForm.saved_step = 1;
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
        .subscribe(
          res => {
            ////console.log(res,'res')
            if(res['status'] == true) {
              this.toastr.success('Save Draft Successfully', '');
            }else{
              this.toastr.warning(res['msg'], '');
            }
          });
    }
    else {
      this.toastr.warning('Please Fill required field','');
    }
  }


  step1SaveADraft(){
    ////console.log("save a draft saving")
    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step1 = {};

    // if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 1){
    //   this.step1Data.is_bod = true;
    // }
    // if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 0){
    //   this.step1Data.is_bod = false;
    // }
    this.step1Data.is_bod = true;
    
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

      
        // if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 1){
        //   this.step1Data.is_bod = true;
        // }
        // if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 0){
        //   this.step1Data.is_bod = false;
        // }
    
        if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 1){
          this.step1Data.is_hold_other_accreditation = true;
        }
        else if(this.step1Data.is_hold_other_accreditation_select != undefined && this.step1Data.is_hold_other_accreditation_select == 0){
          this.step1Data.is_hold_other_accreditation = false;
        }else{
          this.step1Data.is_hold_other_accreditation = false;
        }
        this.inspectionBodyForm.email = this.userEmail;
        this.inspectionBodyForm.userType = this.userType;
        this.inspectionBodyForm.saved_step = 1;
        this.inspectionBodyForm.step1 = this.step1Data;      
  
        this.inspectionBodyForm.step1['ownOrgBasicInfo'] = [];
        this.inspectionBodyForm.step1['ownOrgMembInfo'] = [];
        this.inspectionBodyForm.step1['accreditationInfo'] = [];
        
        if(!this.Service.isObjectEmpty(this.ownOrgBasicInfo[0])) {
  
          this.inspectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
        }
        if(!this.Service.isObjectEmpty(this.ownOrgMembInfo[0])) {
          this.inspectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
        }
        if(!this.Service.isObjectEmpty(this.accreditationInfo[0])) {
          this.inspectionBodyForm.step1['accreditationInfo'] = this.accreditationInfo;
        }
  
        if(this.step1Data.date_of_issue != undefined){
          //////console.log(">>> date");
          this.step1Data.date_of_issue = new Date(this.step1Data.date_of_issue);
        }
        if(this.step1Data.date_of_expiry != undefined){
          //////console.log(">>> date");
          this.step1Data.date_of_expiry = new Date(this.step1Data.date_of_expiry);
        }
        if(this.step1Data.date_of_establishment != undefined){
          //////console.log(">>> date");
          this.step1Data.date_of_establishment = new Date(this.step1Data.date_of_establishment);
        }
        this.inspectionBodyForm.step1.is_draft = true;
        this.inspectionBodyForm.saved_step = 1;

        ////console.log("save a draft...");
        ////console.log(">>>1. First Step Data: ", this.inspectionBodyForm);


        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
        .subscribe(
          res => {
            ////console.log(res,'res')
            if(res['status'] == true) {
              this.toastr.success('Save Draft Successfully', '');
            }else{
              this.toastr.warning(res['msg'], '');
            }
          });

  }


  onSubmitTestingParticipation(ngForm2: any, type?:boolean){
    //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);

  //   if(this.viewData != undefined && this.viewData.data.id > 0 && this.viewData.data.ptParticipation  != null){
  //     //////console.log(">>>find ID");
  //     this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
  //   return;
  // }


    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step2 = {};
    //this.inspectionBodyForm.email = this.userEmail;
    //this.inspectionBodyForm.userType = this.userType;
    this.inspectionBodyForm.step2 = this.step2Data;
    this.inspectionBodyForm.step2.email = this.userEmail;
    this.inspectionBodyForm.step2.userType = this.userType;
    this.inspectionBodyForm.step2.application_id = this.formApplicationId;
    this.inspectionBodyForm.step2['proficiencyTesting'] = [];
    this.inspectionBodyForm.step2.is_draft = false;
    this.inspectionBodyForm.saved_step = 2;

    //if(this.proficiencyTesting.length > 0 && this.step2Data.proficiency_testing_val > 0) {
      this.step2Data.proficiency_testing_val = 1;
      //if(type == undefined){
        
      this.inspectionBodyForm.step2['proficiencyTesting'] = this.proficiencyTesting;
     
      //}
        ////////console.log(">> Data: ", this.proficiencyTesting);

        this.proficiencyTesting.forEach((rec,key) => {
          let dtFormat = '';
         if(rec.participation_date != undefined && rec.participation_date._i != undefined){
          var dtData = rec.participation_date._i;
          var year = dtData.year;
          var month = dtData.month;
          var date = dtData.date;
        }
        dtFormat = year + "-" + month + "-" + date;
        ////////console.log(">>DT: ", dtFormat);
        this.proficiencyTesting[key].date = dtFormat;
  
        this.proficiencyTesting[key].test_name = (rec.test_name == undefined) ? "" : rec.test_name;
        var yyyy = new Date().getFullYear().toString();
        var mm = (new Date().getMonth()+1).toString();
        var dd  = new Date().getDate().toString();
        let dformat = yyyy + "-" + mm +"-"+dd;
        this.proficiencyTesting[key].participation_date = (rec.participation_date == undefined) ? dformat : rec.participation_date;
        this.proficiencyTesting[key].result = (rec.result == undefined) ? "" : rec.result;
        this.proficiencyTesting[key].pt_provider = (rec.pt_provider == undefined) ? "" : rec.pt_provider;
    })
    ////console.log("@Step2 submit...", this.inspectionBodyForm, " --- ", this.formApplicationId);
   // return;

    if(ngForm2.form.valid && type == undefined) {
      //////console.log('>>>>fffff: ', this.inspectionBodyForm);
      
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'res...')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step2.is_draft = true;
      this.inspectionBodyForm.saved_step = 2;
      ////console.log('ssssave a draft....save PT', this.proficiencyTesting)
        
      ////////console.log('save draft....2');
          // this.toastr.success('Application Successfully Submitted', '');
          // setTimeout(()=> {
          //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          // }, 1000)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            ////////console.log('save draft....2');
            this.toastr.success('Save Draft Successfully', '');
            // setTimeout(()=> {
            //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
            // },2000) 
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

  onSubmitPersonalInformation(ngForm3: any, type?: boolean){
      this.inspectionBodyForm = {};
      this.inspectionBodyForm.step3 = {};
      //this.inspectionBodyForm.email = this.userEmail;
      //this.inspectionBodyForm.userType = this.userType;
      this.inspectionBodyForm.step3.email = this.userEmail;
      this.inspectionBodyForm.step3.userType = this.userType;
      this.inspectionBodyForm.step3.application_id = this.formApplicationId;
      //this.inspectionBodyForm.step3 = this.step3Data;

      this.inspectionBodyForm.step3.technicalManager = {};
      //if(this.step3Data.name_technical != '' && this.step3Data.designation_technical != '' && this.step3Data.mobile_no_technical != ''
        // && this.step3Data.tech_email_technical != '' && this.step3Data.relevent_experience_technical != ''){
          this.inspectionBodyForm.step3.technicalManager['name'] = (this.step3Data.name_technical != '' && this.step3Data.name_technical != undefined) ? this.step3Data.name_technical : '';
          this.inspectionBodyForm.step3.technicalManager['designation'] = (this.step3Data.designation_technical != '' && this.step3Data.designation_technical != undefined) ? this.step3Data.designation_technical : '';
          this.inspectionBodyForm.step3.technicalManager['mobile_no'] = (this.step3Data.mobile_no_technical != '' && this.step3Data.mobile_no_technical != undefined) ? this.step3Data.mobile_no_technical : '';
          this.inspectionBodyForm.step3.technicalManager['email'] = (this.step3Data.tech_email_technical != '' && this.step3Data.tech_email_technical != undefined) ? this.step3Data.tech_email_technical : '';
          this.inspectionBodyForm.step3.technicalManager['relevent_experience'] = (this.step3Data.relevent_experience_technical != '' && this.step3Data.relevent_experience_technical != undefined) ? this.step3Data.relevent_experience_technical : '';
      //}     relevent_experience

      this.inspectionBodyForm.step3.managementManager = {};
      //if(this.step3Data.management_name != '' && this.step3Data.management_designation != '' && this.step3Data.management_mobile_no != ''
        // && this.step3Data.management_email != '' && this.step3Data.management_relevent_experience != ''){
          this.inspectionBodyForm.step3.managementManager['name'] = (this.step3Data.management_name != '' && this.step3Data.management_name != undefined) ? this.step3Data.management_name : '';
          this.inspectionBodyForm.step3.managementManager['designation'] = (this.step3Data.management_designation != '' && this.step3Data.management_designation != undefined) ? this.step3Data.management_designation : '' ;
          this.inspectionBodyForm.step3.managementManager['mobile_no'] = (this.step3Data.management_mobile_no != '' && this.step3Data.management_mobile_no != undefined) ? this.step3Data.management_mobile_no : '';
          this.inspectionBodyForm.step3.managementManager['email'] = (this.step3Data.management_email != '' && this.step3Data.management_email != undefined) ? this.step3Data.management_email : '';
          this.inspectionBodyForm.step3.managementManager['relevent_experience'] = (this.step3Data.management_relevent_experience != '' && this.step3Data.management_relevent_experience != undefined) ? this.step3Data.management_relevent_experience : '';
      //}

      ////////console.log('>>> step 3 ', this.inspectionBodyForm);
    if(ngForm3.form.valid && type == undefined) {
      // this.inspectionBodyForm = {};
      // this.inspectionBodyForm.step3 = {};
      // //this.inspectionBodyForm.email = this.userEmail;
      // //this.inspectionBodyForm.userType = this.userType;
      // this.inspectionBodyForm.step3.email = this.userEmail;
      // this.inspectionBodyForm.step3.userType = this.userType;
      // //this.inspectionBodyForm.step3 = this.step3Data;

      // this.inspectionBodyForm.step3.technicalManager = {};
      // this.inspectionBodyForm.step3.technicalManager['name'] = this.step3Data.name_technical;
      // this.inspectionBodyForm.step3.technicalManager['designation'] = this.step3Data.designation_technical;
      // this.inspectionBodyForm.step3.technicalManager['mobile_no'] = this.step3Data.mobile_no_technical;
      // this.inspectionBodyForm.step3.technicalManager['email'] = this.step3Data.tech_email_technical;
      // this.inspectionBodyForm.step3.technicalManager['relevent_experience'] = this.step3Data.relevent_experience_technical;

      // this.inspectionBodyForm.step3.managementManager = {};
      // this.inspectionBodyForm.step3.managementManager['name'] = this.step3Data.management_name;
      // this.inspectionBodyForm.step3.managementManager['designation'] = this.step3Data.management_designation;
      // this.inspectionBodyForm.step3.managementManager['mobile_no'] = this.step3Data.management_mobile_no;
      // this.inspectionBodyForm.step3.managementManager['email'] = this.step3Data.management_email;
      // this.inspectionBodyForm.step3.managementManager['relevent_experience'] = this.step3Data.management_relevent_experience;

      
      //return;

      this.inspectionBodyForm.step3.is_draft = false;
      this.inspectionBodyForm.saved_step = 3;
      //////console.log(">>> Step3 submit: ", this.inspectionBodyForm);
      // this.step3DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      // this.toastr.success('Application Successfully Submitted', '');
      //     setTimeout(()=> {
      //       this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
      //     }, 1000)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            //alert(this.step1Data.accredation_criteria);
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
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if( type != undefined && type == true){
      this.inspectionBodyForm.step3.is_draft  = true;
      this.inspectionBodyForm.saved_step      = 3;
      // this.toastr.success('Application Successfully Submitted', '');
      //     setTimeout(()=> {
      //       this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //     }, 1000)
      ////////console.log("save a draft ..setp 3: ");
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        ////////console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success('Save Draft Successfully', '');
          // setTimeout(()=> {
          //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          // },2000)          
          //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
      }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitInformationAuditManagement(ngForm4: any, type?:boolean){
    //  ////////console.log("Step InformationAuditManagement submit...");   
    //this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);

    // if(this.viewData != undefined && this.viewData.data.id > 0 && this.viewData.data.audit_date  != ''){
    //   //////console.log(">>>find ID");
    //   this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);
    //   //return;
    // }
    console.log("@Enter........");
    if(this.step1Data.accredation_criteria == 2){
      //Extension
      //alert(this.step1Data.accredation_criteria);
      let stepData: any = this.headerSteps.find(item => item.title == 'information_audit_management');
      //console.log(">>step select: 1 ", stepData);
      if(stepData){
        stepData.activeClass = '';
        stepData.stepComp = true;
      }
      //console.log(">>step select: 2 ", this.headerSteps);
      this.Service.moveSteps('personal_information', 'scope_accreditation', this.headerSteps);
    }

    this.inspectionBodyForm = {};
      this.inspectionBodyForm.step4 = {};
      ////////console.log(">>> step4 data: ", this.step4Data);
      ////console.log(">>>> ", this.step4Data);
      if(type != undefined){
        ////console.log("ssss...");
        this.step4Data['audit_date'] = (this.step4Data.audit_date != undefined) ? this.step4Data.audit_date : null;
        this.step4Data['mrm_date'] = (this.step4Data.mrm_date != undefined) ? this.step4Data.mrm_date : null;
      }
      //this.step4Data['audit_date'] = (this.step4Data.audit_date != '') ? this.step4Data.audit_date : null;
      //this.step4Data['mrm_date'] = (this.step4Data.mrm_date != undefined) ? this.step4Data.mrm_date : null;

      this.inspectionBodyForm.step4 = this.step4Data; 
      this.inspectionBodyForm.step4.email = this.userEmail;
      this.inspectionBodyForm.step4.application_id = this.formApplicationId;
      this.inspectionBodyForm.step4.userType = this.userType;

      ////////console.log(">>> step4 data: ", this.inspectionBodyForm);
    if(ngForm4.form.valid && type == undefined) {
      // this.inspectionBodyForm = {};
      // this.inspectionBodyForm.step4 = {};

      // this.inspectionBodyForm.step4 = this.step4Data; 
      // this.inspectionBodyForm.step4.email = this.userEmail;
      // this.inspectionBodyForm.step4.userType = this.userType;

      
      //return;
      this.inspectionBodyForm.step4.is_draft = false;
      this.inspectionBodyForm.saved_step = 4;
      //this.step4DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step4.is_draft = true;
      this.inspectionBodyForm.saved_step = 4;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        ////////console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success('Save Draft Successfully', '');
          // setTimeout(()=> {
          //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          // },2000) 
          //this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
      }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }
  
  onSubmitPerlimVisit(ngForm: any, type?:boolean){
    // ////////console.log("Step PerlimVisit submit...", ngForm.form);    
    //this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);

    // if(this.viewData != undefined && this.viewData.data.id > 0 && this.viewData.data.audit_date  != ''){
    //   //////console.log(">>>find ID");
    //   this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    //   return;
    // }

    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step6 = {};
    this.isPrelimSubmitted = true;

    ////console.log("@@@@Step6 data: ", this.step6Data);
    this.step6Data.is_prelim_visit = (this.step6Data.prelim_visit_val == "1") ? true : false;
    let dtFormat = '';
    if(this.step6Data.prelim_visit_select_date != undefined && this.step6Data.prelim_visit_select_date._i != undefined){
      var dtData = this.step6Data.prelim_visit_select_date._i;
      var year = dtData.year;
      var month = dtData.month;
      var date = dtData.date;
    }
    //let dtData = this.step5Data.perlim_visit_select_date._i;
    //let year = dtData.year;
    //let month = dtData.month;
    //let date = dtData.date;
    dtFormat = year + "-" + month + "-" + date;
    ////console.log("date format: ", dtFormat, " -- ", dtData);
    this.step6Data['prelim_visit_date'] = (this.step6Data.prelim_visit_select_date != undefined) ? new Date(this.step6Data.prelim_visit_select_date) : null;
    this.step6Data['prelim_visit_time'] = (this.step6Data.prelim_visit_select_time != undefined) ? this.step6Data.prelim_visit_select_time : null;

    this.inspectionBodyForm.step6 = this.step6Data;
    this.inspectionBodyForm.step6.email = this.userEmail;
    this.inspectionBodyForm.step6.application_id = this.formApplicationId;
    this.inspectionBodyForm.step6.userType = this.userType;
    this.inspectionBodyForm.step6.is_draft = false;
    this.inspectionBodyForm.saved_step = 6;
    

    ////console.log(">>> Step6 data: ", this.inspectionBodyForm);
    //return;

    if(ngForm.form.valid && type == undefined) {
      // this.inspectionBodyForm = {};
      // this.inspectionBodyForm.step5 = {};
      // this.step5Data.is_perlim_visit = (this.step5Data.perlim_visit_val) ? true : false;
      // this.inspectionBodyForm.step5 = this.step5Data;
      // this.inspectionBodyForm.step5.email = this.userEmail;
      // this.inspectionBodyForm.step5.userType = this.userType;

      
      //this.inspectionBodyForm.step6.is_draft = false;
      //this.inspectionBodyForm.saved_step = 6;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          this.isPrelimSubmitted = false;
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step6.is_draft = true;
      this.inspectionBodyForm.saved_step = 6;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        ////////console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success('Save Draft Successfully', '');
          //this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          // setTimeout(()=> {
          //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          // },2000) 
          //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
      }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
 }

 removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};

onSubmitProformaInvoice() {
  this.toastr.success('Save Draft Successfully', '');
}

findObjectKeyValues(object: any, value: string){
  ////console.log(">>get column: ", value);
    for(var k in object){
        let theVal = object[k];
        ////console.log("...Value: ", theVal);
        if(theVal == value){
          return true;
        }
    }
    return false;
}

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
  //this.schemeRows.length
  for(let t=rowInd;t<=rowInd; t++){

    ////console.log("Scheme Sec: ", t," -- ", scopeCollections);
    selectScheme = this.schemeRows[t].id;
    if(selectScheme == undefined){
      ////console.log(">>Heading scheme notfff....exit", selectScheme);
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
  console.log(">>> build scope: ", scopeCollections, " -- ", this.dynamicScopeModel, " -> Scheme: ", this.schemeRows);
  //return;

  let secInd: number = 0;
  let resultTempAr: any = [];
  let tempDataObj: any = {};
  let tempDataRow: any = {};
  if(this.schemeRows.length){
    //this.schemeRows.length
      for(let t=rowInd;t<=rowInd; t++){

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
  //https://stackoverflow.com/questions/45266543/checking-of-duplicate-value-in-json-object-array
  for(var p in scopeCollections){
    if(scopeCollections[p]){
        let getDetails: any = scopeCollections[p]['scope_value'];
        console.log(">>>Value: ", p, " -- ", getDetails, " -- ", getDetails.length);
        if(getDetails.length == 0){
          //////console.log(">>>Empty values: ", p, " deleting");
          delete scopeCollections[p];
        }
    }
  }
  ////console.log("#Updated Scope after edit: ", scopeCollections, " -- ", this.editScopeData);
  this.step5Data['scopeDetails']    = scopeCollections;
  this.getScopeData = scopeCollections;
}
//scopeCollections[selectScheme]['scope_heading'][keyIds]  //assign scope heading
//scopeCollections[selectScheme]['scope_value'] //assign unmatch scope value

hasDupes(array) {
  var hash = Object.create(null);
  return array.some(function (a) {
      return a.seq && (hash[a.seq] || !(hash[a.seq] = true));
  });
}

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
  this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
}
backScopeAccreditation(){
  //Reset all model data 
  this.dynamicScopeFieldColumns = {};
  this.dynamicScopeFieldType = {};
  this.dynamicScopeModel = {};
  this.fullScope = [];
  this.schemeRows = [{}];
  if(this.step1Data.accredation_criteria == 1){
    this.Service.moveSteps('scope_accreditation', 'information_audit_management', this.headerSteps);
  }
  if(this.step1Data.accredation_criteria == 2){
    this.Service.moveSteps('scope_accreditation', 'personal_information', this.headerSteps);
  }
}

 onSubmitScopeAccreditation = (ngForm: any, type?: boolean, rowInd?:any) =>{
  
  this.inspectionBodyForm = {};
  this.inspectionBodyForm.step5 = {};
  this.inspectionBodyForm.step5 = this.step5Data;
  this.inspectionBodyForm.step5.application_id = this.formApplicationId;
  this.inspectionBodyForm.step5['scheme_id'] = 1;

  
  console.log(">>> Rows: ", this.fullScope, " -- ", this.schemeRows, " -- ", rowInd, " == ", type);
  //return;

  //Check dynamic model column fields validation
  let secInd: number;
  let selectScheme: any;
  let errorScope: boolean = false;
  if(this.schemeRows.length){
    for(let t=rowInd;t<=rowInd; t++){
        secInd = t;
        selectScheme = this.schemeRows[t].id;
        let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == selectScheme);
        console.log("@Scheme Data: ", getData);
        let scopeTitle: string ='';
        if(getData){
          scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
        }
            for(var key in this.dynamicScopeModel[scopeTitle]){
              if(key == 'fieldLines'){
                let rowLen = this.dynamicScopeModel[scopeTitle][key].length;
                // Browse rows
                console.log("Section: ", scopeTitle, " -- ", rowLen)                
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

  //check duplicate values
 
  // for(let item in this.getScopeData){
  //   let selectScheme = this.schemeRows[rowInd].id;
  //   console.log(selectScheme);
  //   if(selectScheme == item){
  //       console.log(">>> fond");
  //       let scDetails: any = this.getScopeData[item]['scope_value'];
  //       let checkDup: any = this.hasDupes(scDetails);
  //       console.log("@@@ check duplicate: ", checkDup);
  //       let arr: any[] = [];
  //       arr = scDetails;
  //       console.log(">>> Before: ", scDetails);
  //       const mySetSerialized = new Set(scDetails);

  //       const myUniqueArrSerialized = [...mySetSerialized];
  //       const myUniqueArr = myUniqueArrSerialized.map(e => JSON.parse(JSON.stringify(e)));
  //       // const removeDuplicatesFromArray = (arr) => [...new Set(
  //       //   arr.map(el => JSON.stringify(el))
  //       // )].map(e => JSON.parse(e));

  //       console.log(">>> after: ", myUniqueArr);
  //   }
  // }
  


    ////console.log("scheme Rows: ", this.schemeRows,  " -- ", this.schemeRows.length, " :: ", this.editScopeData, " :: ", this.getScopeData);

    //////console.log(">>>Form Submit: ", ngForm, " -- ",ngForm.form, " -- ", this.schemeRows); 
   
     //return;
    //ngForm.form.valid &&
    if(!ngForm.form.valid && type == undefined && this.schemeRows.length == 1 
        && this.schemeRows[0].id === undefined && this.editScopeData != undefined && this.editScopeData != null) {
      console.log(">>>Bypass saving...");
      ////console.log(">>>Enter....2")
      this.saveScope(rowInd);
      console.log(">>> step5 submit...", this.step5Data, " -- ", this.inspectionBodyForm);
      this.inspectionBodyForm.step5.is_draft = false;
      this.inspectionBodyForm.saved_step = 5;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }
    else if(ngForm.form.valid && type == undefined) {
      console.log(">>>Scope saving...");
      ////console.log(">>>Enter....3")
      this.saveScope(rowInd);
      ////console.log(">>> step5 submit...", this.step5Data, " -- ", this.inspectionBodyForm);
      this.inspectionBodyForm.step5.is_draft = false;
      this.inspectionBodyForm.saved_step = 5;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
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
      console.log(">>>Enter. saving...4")
      this.inspectionBodyForm.step5.is_draft = true;
      this.inspectionBodyForm.saved_step = 5;
      this.saveScope(rowInd);
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
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

 onSubmitScopeAccreditations(ngForm: any, type?: boolean){

    //scope accreditation....
   //this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);
   this.inspectionBodyForm = {};
   //this.inspectionBodyForm = {};
   this.inspectionBodyForm.data ={};
   //this.step5Data.payment_receipt = 'test';
   this.inspectionBodyForm.voucher_number = this.step5Data.voucher_number;
   
   let dtFormat = '';
   if(this.step5Data.voucher_dates != undefined && this.step5Data.voucher_dates._i != undefined){
     var dtData = this.step5Data.voucher_dates._i;
     var year = dtData.year;
     var month = dtData.month;
     var date = dtData.date;
   }
   dtFormat = year + "-" + month + "-" + date;
   ////////console.log("date format: ", dtFormat, " -- ", dtData);
   //this.step5Data['voucher_dates'] = (this.step5Data.voucher_dates != undefined) ? dtFormat : null;
   this.inspectionBodyForm.voucher_date = dtFormat;
   ////////console.log(">>>>payment file: ", this.step5Data.payment_receipt_file);
   //this.inspectionBodyForm.payment_receipt = this.step5DataBodyFormFile;//this.step5Data.payment_receipt_file;
   let postObject: any = {};
   postObject['voucher_date'] = dtFormat;
   postObject['voucher_number'] = this.step5Data.voucher_number;
   this.step5DataBodyFormFile.append('data',JSON.stringify(postObject));
   
   ////////console.log("submit...", " -- ", this.step5DataBodyFormFile);
    if(ngForm.form.valid && this.paymentReceiptValidation != false){
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.paymentReceipt,this.step5DataBodyFormFile)
      .subscribe(
        res => {
          ////////console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            //this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }

   //return false;
 }

 onSubmitProforma(ngForm){
  this.transactionsItem['amount']               = {};
  this.transactionsItem['amount']['total']      = 0.00;
  this.transactionsItem['amount']['currency']   = 'USD';
  this.transactionsItem['amount']['details']    = {};
  this.transactionsItem['amount']['details']['subtotal'] = 0.00;
  //declare Items data
  this.transactionsItem['item_list']            = {};
  this.transactionsItem['item_list']['items']   = [];
  let custPrice: any = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;
  this.total = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;//520;
    this.transactionsItem['item_list']['items'].push({name: 'Inspection Body Application', quantity: 1, price: custPrice, currency: 'USD'});
      if(this.total > 0){
        //////////console.log("Calculate price: ", calcPrice);
        this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
        this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
        this.transactions.push(this.transactionsItem);
        //////////console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
      }
      setTimeout(() => {
        this.createPaymentButton(this.transactionsItem, this.inspectionBodyForm, this);
        let elem = document.getElementsByClassName('paypal-button-logo');
        ////console.log("button creting...", elem);
        if(elem){
          ////console.log("button creted...");          
        }
      }, 100)
 }

onSubmitPaymentInformation(ngForm7: any, type?: boolean){
    ////////console.log("payment submitting.....");
    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step9 = {};
    //this.inspectionBodyForm.saved_step = 9;

          // let dtFormat: string = '';
          // if(this.voucherSentData['payment_date'] != undefined && 
          //   this.voucherSentData['payment_date']._i != undefined){
          //   var dtData = this.voucherSentData['payment_date']._i;
          //   var year = dtData.year;
          //   var month = dtData.month;
          //   var date = dtData.date;
          //   dtFormat = year + "-" + month + "-" + date;
          // }

          console.log("payment date: ", " -- ",this.voucherSentData, " -- ");
        let is_valid: boolean = false;
        this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
        this.voucherFile.append('amount',this.voucherSentData['amount']);
        this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
        this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
        this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
        this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
        this.voucherFile.append('payment_date',this.voucherSentData['payment_date']);
        this.voucherFile.append('accreditation',this.formApplicationId);
        this.voucherFile.append('application_id',this.formApplicationId);
        this.voucherFile.append('saved_step', 9);
        // if(!this.paymentReceiptValidation){
        //   var blob = new Blob(['Lorem ipsum'], { type: 'plain/text' });
        //   //formData.append('file', blob,'readme.txt');
        //   this.voucherFile.append('payment_receipt',blob,'null_recipt.txt');
        // }
        console.log(">>> Data: ", this.voucherSentData);
        if(this.voucherSentData['transaction_no'] != '' && this.voucherSentData['payment_method'] != '' && this.voucherSentData['payment_made_by'] &&
          this.voucherSentData['mobile_no'] != ''){
            is_valid = true;
          }

    //!ngForm7.form.valid &&
    if(is_valid == true && type == undefined && this.paymentReceiptValidation != false) {
      //this.inspectionBodyForm.step7.payment_receipt = this.step7DataBodyFormFile;
      this.inspectionBodyForm.step9.is_draft = false;
      this.voucherFile.append('is_draft', false);
      //this.subscriptions.push(
        this._trainerService.paymentVoucherSave((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                ////////console.log("submit voucher: ", data);
                if(data.status){
                  //this.openView('appComp');
                  setTimeout(()=>{
                    let elem = document.getElementById('openAppDialog');
                    //////console.log("App dialog hash....", elem);
                    if(elem){
                      elem.click();
                    }
                  }, 100)
                  setTimeout(() => {                    
                    // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                    this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);
                  },3500)
                  // this._toaster.success("Your form has been successfully submitted and it is under review.We will update you shortly.",'THANK YOU');
                  // setTimeout(() => {                    
                  //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                  // },3500)
                  
                }else{
                  this._toaster.warning(data.msg,'');

                }
                // if(data != undefined && typeof data === 'object'){
                //     //this.pageCurrentNumber = 1;
                //     this._service.openFlashMessage('Voucher Sent Successfully','',5000);
                //     this.modalService.dismissAll();
                //     this.dataLoad = true;
                //     //this.trainerdata = data.records;
                //     //this.pageTotal = data.records.length;
                // }
             }
            )
          //)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.paymentDetailsSave,this.voucherFile)
      // .subscribe(
      // res => {
      //   ////////console.log(res,'res')
      //   if(res['status'] == true) {
      //     this.toastr.success(res['msg'], '');
      //     //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
      //   }else{
      //     this.toastr.warning(res['msg'], '');
      //   }
      // });
      //&& this.paymentReceiptValidation == false
    }else if(type != undefined && type == true ){
      this.inspectionBodyForm.step9.is_draft = true;
      this.voucherFile.append('is_draft', true);
      console.log(">>> Saving draft....");
      this._trainerService.paymentVoucherSave((this.voucherFile))
        .subscribe(
        result => {
          let data: any = result;
          console.log("submit payment: ", data);
          if(data.status){
            this.toastr.success('Save Draft Successfully', '');
          }else{
            this.toastr.warning(data.msg,'');
          }
        }
      )
    }
    else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }

}
   //Step FORM Action
savedraftStep(stepsCount) {
  if(stepsCount == 'step1') {
    // ////////console.log(this.step1Data,'step1Data');
    this.inspectionBodyForm = {};
      this.inspectionBodyForm.step1 = {};
      this.inspectionBodyForm.email = this.userEmail;
      this.inspectionBodyForm.userType = this.userType;
      this.inspectionBodyForm.step1 = this.step1Data;


      this.inspectionBodyForm.step1['ownOrgBasicInfo'] = [];
      this.inspectionBodyForm.step1['ownOrgMembInfo'] = [];
      this.inspectionBodyForm.step1['accreditationInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.inspectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.inspectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.accreditationInfo) {
        this.inspectionBodyForm.step1['accreditationInfo'] = this.accreditationInfo;
      }
      
    ////////console.log(this.inspectionBodyForm,'step1DraftDataBodyFormFile')

    this.step1DraftDataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DraftDataBodyFormFile)
    .subscribe(
      res => {
        ////////console.log(res,'res Load Data')
        if(res['status'] == true) {
          //this.toastr.success(res['msg'], '');
          this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
}

onSubmit(ngForm){
    //this.getErrorScroll(this.inspectionBodyForm);
    //////////console.log(this.inspectionBodyForm);
    //this.is_bod = !this.is_bod || typeof this.is_bod == 'undefined' ? "0" : ""+this.is_bod+"";

    //this.scrollToError(ngForm);
    //return false;

    this.inspectionBodyForm.is_bod = !this.is_bod_select || typeof this.is_bod_select == 'undefined' ? "0" : ""+this.is_bod_select+"";
    this.inspectionBodyForm.proficiency_testing_val = !this.proficiency_testing_val || typeof this.proficiency_testing_val == 'undefined' ? "0" : ""+this.proficiency_testing_val+"";
    this.inspectionBodyForm.is_hold_other_accreditation = !this.is_hold_other_accreditation_toggle || typeof this.is_hold_other_accreditation_toggle == 'undefined' ? "0" : ""+this.is_hold_other_accreditation_toggle+"";

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
    // if(!this.Service.checkInput('email',this.inspectionBodyForm.mailing_address)){
    //   this.isSubmit = false;
    //   //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }

    if(this.inspectionBodyForm.duty_shift == '1' && typeof this.inspectionBodyForm.duty_from1 == 'undefined' && typeof this.inspectionBodyForm.duty_to1 == 'undefined')
    {
      this.dutyTime1 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime1 = true;
    }
    if(this.inspectionBodyForm.duty_shift == '2' && typeof this.inspectionBodyForm.duty_from2 == 'undefined' && typeof this.inspectionBodyForm.duty_to2 == 'undefined')
    {
      if(typeof this.inspectionBodyForm.duty_from1 == 'undefined' || typeof this.inspectionBodyForm.duty_to1 == 'undefined')
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
    if(this.inspectionBodyForm.duty_shift == '3' && typeof this.inspectionBodyForm.duty_from3 == 'undefined' && typeof this.inspectionBodyForm.duty_to3 == 'undefined')
    {
      if(typeof this.inspectionBodyForm.duty_from1 == 'undefined' || typeof this.inspectionBodyForm.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else{
        this.dutyTime1 = true;
      }
      if(typeof this.inspectionBodyForm.duty_from2 == 'undefined' || typeof this.inspectionBodyForm.duty_to2 == 'undefined')
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

    // this.inspectionBodyForm.is_bod = this.is_bod;
    this.inspectionBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
    //////////console.log('>>>>>>');
    //////////console.log(this.inspectionBodyForm.authorization_confirm1);

    // if(this.checkSecurity == true)
    // {
    //   this.checkCaptchaValidation = true;
    // }else{
    //   this.checkCaptchaValidation = false;
    // }
    ////////////console.log("Check Error Required: ", this.scrollToError(ngForm.form));
    
    if(ngForm.form.valid  && this.checkCaptchaValidation == true){
        this.loader = true;
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyFormFile)
        .subscribe(
          res => {
            if(res['status']==true){
              this.loader = false;
              this.afterSubmit = false;
              this.captchaRef.reset();
              this.checkCaptchaValidation = false;
              this.toastr.success(res['msg'], '');
              this.router.navigate(['application-form/service/inspection_bodies']);
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
        this.toastr.warning('Please Fill required field','');
        var elmnt = document.getElementById("form_section_one");
        ////////////console.log('Element pos: ', elmnt);
        elmnt.scrollIntoView();
      }
    }

    getErrorScroll(formData)
    {
      const firstStep = document.querySelector('#firstStep');
      const ownOrgBasicInfos = document.querySelector('#ownOrgBasicInfos');
      const is_bod_complete = document.querySelector('#is_bod_complete');
      const is_hold_other_accreditations = document.querySelector('#is_hold_other_accreditations');
      
      //////////console.log(formData);
      if(!formData.trade_license_name || !formData.date_of_issue || !formData.date_of_expiry || !formData.date_of_establishment || !formData.search_location_name || !formData.official_commercial_name || !formData.accredation_type_id || !formData.criteria_request || !formData.physical_location_address || !formData.mailing_address || !formData.po_box || !formData.country_id || !formData.city || !formData.telephone || !formData.fax_no || !formData.official_email || formData.trade_license_name =='' || formData.date_of_issue =='' || formData.date_of_expiry =='' || formData.date_of_establishment =='' || formData.search_location_name =='' || formData.official_commercial_name =='' || formData.accredation_type_id =='' || formData.criteria_request =='' || formData.physical_location_address =='' || formData.mailing_address =='' || formData.po_box =='' || formData.country_id =='' || formData.city =='' || formData.telephone =='' || formData.fax_no =='' || formData.official_email =='' || formData.official_website =='')
      {
          firstStep.scrollIntoView({ behavior: 'smooth' });
      }
      else if(this.inspectionBodyForm.is_bod == '1')
      {
        Object.keys(this.inspectionBodyForm.organizationMemberInfo).forEach(key => {
          // if(key['name'] == ''){
          // }
          //////////console.log(this.inspectionBodyForm.organizationMemberInfo[key].name,'Keysssssss');
          if(this.inspectionBodyForm.organizationMemberInfo[key].name !='')
          {
            
            if(!this.inspectionBodyForm.organizationMemberInfo[key].list_comp)
            {
              is_bod_complete.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.organizationMemberInfo[key].contact_person)
            {
              is_bod_complete.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.organizationMemberInfo[key].designation)
            {
              is_bod_complete.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.organizationMemberInfo[key].mobile_no)
            {
              is_bod_complete.scrollIntoView({ behavior: 'smooth' });
            }
          }
        })
      }else if(this.inspectionBodyForm.is_hold_other_accreditation_toggle == '1')
      {
        Object.keys(this.inspectionBodyForm.accreditationInfo).forEach(key => {
          // if(key['name'] == ''){
          // }
          if(this.inspectionBodyForm.accreditationInfo[key].scheme_name !='')
          {
            
            if(!this.inspectionBodyForm.accreditationInfo[key].acccreditation_body_name)
            {
              is_hold_other_accreditations.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.accreditationInfo[key].acccreditation_scope)
            {
              is_hold_other_accreditations.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.accreditationInfo[key].certificate_expiry_date)
            {
              is_hold_other_accreditations.scrollIntoView({ behavior: 'smooth' });
            }
          }
        })
      }else if(this.inspectionBodyForm.organizationBasicInfo.length > 0)
      {
        Object.keys(this.inspectionBodyForm.organizationBasicInfo).forEach(key => {
          // if(key['name'] == ''){
          // }
          ////////////console.log(this.inspectionBodyForm.organizationBasicInfo[key].name,'Keysssssss');
          if(this.inspectionBodyForm.organizationBasicInfo[key].name !='')
          {
            
            if(!this.inspectionBodyForm.organizationBasicInfo[key].telephone_no)
            {
              ownOrgBasicInfos.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.organizationBasicInfo[key].mobile_no)
            {
              ownOrgBasicInfos.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.organizationBasicInfo[key].email)
            {
              ownOrgBasicInfos.scrollIntoView({ behavior: 'smooth' });
            }else if(!this.inspectionBodyForm.organizationBasicInfo[key].designation)
            {
              ownOrgBasicInfos.scrollIntoView({ behavior: 'smooth' });
            }
          }
        })
      }
      
      // const firstElementWithError = document.querySelector('.ng-invalid');

      // if (firstElementWithError) {
      //   firstElementWithError.scrollIntoView({ behavior: 'smooth' });
      // }
    }
    getPlaceName(data)
    {
      if(typeof this.step1Data.physical_location_address != 'undefined')
      {
        this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step1Data.physical_location_address+'.json?access_token='+this.Service.mapboxToken+'','')
          .subscribe(res => {
              //////console.log(res['features']);
              this.searchCountryLists = res['features'];
            },
            error => {
            
        })
      }
    }

    // reviewDocument()
    // {
    //   this.accreditationId = '12';
    //   this.router.navigate(['application-form/publications'],{queryParams:{publicationId:12}});
    // }

    getLatitudelongitude(longitude,latitude)
    {
      this.inspectionBodyForm.location_longitude = longitude;
      this.inspectionBodyForm.location_latitude = latitude;
    }

    dayTimeChange(event,dayTime)
    {
      ////////////console.log(dayTime);
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

    // openDialogBox(obj: any, index: number) {
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

    // idToName(title,val) {
    //   if(title == 'country')
    //   {
    //     this.inspectionBodyForm.country_name = val;
    //     this.loadCountryCity(this.inspectionBodyForm.country_name);
    //   }else{
    //     this.inspectionBodyForm.accredation_type_name = val;
    //   }
      
    // }

}

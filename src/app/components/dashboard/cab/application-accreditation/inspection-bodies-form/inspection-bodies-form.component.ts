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

declare let paypal: any;
@Component({
  selector: 'app-inspection-bodies-form',
  templateUrl: './inspection-bodies-form.component.html',
  styleUrls: ['./inspection-bodies-form.component.scss'],
  providers: [Constants, AppService, ToastrService, Overlay, OverlayContainer, UiDialogService]
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
  public recommend:any;
  public authorizationStatus: boolean = false;
  recommendStatus:boolean = false;

  readAccredAgreem: boolean = false;
  readReviewChecklist: boolean = false;
  readTermsCond: boolean = false;
  

  public isSubmit:boolean = true;
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
  getCountryLists:any;

  //Dynamic scope forms model object declaration
  //dynamicScopeModel:any[]         = [];   //Master form data object
  dynamicScopeModel:any         = {};   //Master form data object
  dynamicScopeFieldColumns:any[]  = [];   //Master column data for each section
  criteriaMaster: any[] = [];

  transactions: any[] =[];
  transactionsItem: any={};
  total: any = 0;
  allStateList: Array<any> = [];
  allCityList: Array<any> = [];
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

  formApplicationId: number = 0;
  scopeDataLoad: boolean = false;
  accreditationChecked = true;
  deliveryAddrChecked = true;
  isApplicationSubmitted: boolean = false;
  isPrelimSubmitted: boolean = false;

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

  formDraftsaved: any;
  formAccrStatus: any;

  //dynamicScopeOptions:any[] = [];  
  //dynamicScopeModelValues:any={};
  //dynamicFirstFieldValues:any;
  
  @ViewChild('mydiv', null) mydiv: ElementRef;
  @ViewChild('elementDateIssue', null) _input: ElementRef;
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;

  @HostListener('scroll', ['$event.target'])
  scrollHandler(elem) {
    if(elem != undefined){
      //console.debug("Scroll Event: ", elem.srcElement.scrollHeight, " == [ ",elem.srcElement.offsetHeight, " - ",elem.srcElement.scrollTop," ]"  );
      if(( elem.srcElement.offsetHeight + elem.srcElement.scrollTop) >=  elem.srcElement.scrollHeight) {
         //////console.log("Yo have reached!");
         this.authorizationList.authorization_confirm2 = true;
         this.readTermsCond = true;
      }else{
        this.authorizationList.authorization_confirm2 = false;
        this.readTermsCond = false;
      } 
    }        
  }
  headerSteps:any[] = [];

  constructor(public Service: AppService, public uiDialog: UiDialogService, public sanitizer: DomSanitizer,
    private modalService: NgbModal,private _trainerService: TrainerService,
    public _toaster: ToastrService, public constant:Constants,public router: Router,public toastr: ToastrService) { 
    this.today.setDate(this.today.getDate());
  }

  checkAction(objKey: string, type: string){


  }  

  getData(getVal){
    //  //console.log(">>>>Get MapBox Value: ", getVal);
     this.Service.mapboxToken = getVal;
    }

    //Paypal Button creation
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
      //console.log(">>> The Data: ", theData);
      this.transactions = [];
      this.toastr.success('Payment Success, Thank you.','Paypal>>',{timeOut:2000});
      setTimeout(()=> {
        this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
        ////console.log("moving...");
        //this.Service.moveSteps('undertaking_applicant', 'payment_update', this.headerSteps);
      }, 1000)      
      //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
   }
   createPaymentButton(itemData: any, formObj?:any, compObj?:any){
    ////console.log("creating....buttons...", this.paymentReview, " :: ", this.paymentReview.length, " -- ",this.transactionsItem, " --- ", this.transactions);
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
          this._toaster.warning("You have cancelled payment, Continue next step please complete payment process again.", 'Paypal>>',{timeOut:6500}); 
  
      },
      onError: err => {
          //console.log('OnError', err);
          formObj.paypalReturn = err;
          formObj.paypalStatus = 'error';
          //compObj.saveCourseAfterPayment(formObj);
          this._toaster.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
      },
      onClick: (data, actions) => {
          //console.log('onClick', data, actions);
          //this.resetStatus();
      }
      }, '#paypalPayment');
    });
    }
  }

    //Paypal Button creation
    
  onChange(prevFieldId,row,curField,field) {
    //////console.log(prevFieldId.value,'sfasfdas');
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

      if(this.selectedValuesMl[row-1]){ ////console.log('IFFFFFF');
        this.selectedValuesMl[row-1] = selectedValueObj;
        this.selectedValuesData[row-1] = selectedValueObj2;
      }
      else{ ////console.log('ELSEEE');
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
            ////console.log('field3')
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

          ////console.log("LOggggg==>");
          ////console.log(this.selectedValuesData);

        },
        error => {
        
    })
  }

  //onChangeScopeOption(getValues: any, secIndex: number, lineIndex: number, columnIndex: number, secName: string, type?:string) {
    onChangeScopeOption(getValues: any, lineIndex: number, columnIndex: number, type?:string) {
      //console.log('@GET Options: ', getValues, " :: ",  lineIndex, " -- ", type, " -- ", columnIndex);
      let selectValue: number;
      if(type === undefined){
        selectValue = getValues.value;
      }
      if(type !== undefined && type === 'initLoad'){
        selectValue = getValues;
      }
      let url = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data;
      //console.log("option change: ", url, " :: ", getValues, " -- ", selectValue);
      let jsonReq: any = {};
      jsonReq['value_id'] = selectValue;
      this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,jsonReq)
      .subscribe(
        record => {
            //console.log("SErvice Data: ", record, " -- ", this.dynamicScopeFieldColumns[1], " - ", this.dynamicScopeModel);
            //get through array find key column
            if(record['scopeValue'].length == undefined){
              record['scopeValue'] = [];
            }
            let theColumnIndex  = columnIndex;
            let nextColumnIndex = theColumnIndex + 1;
            let totSecColumn    = this.dynamicScopeFieldColumns.length;//this.dynamicScopeFieldColumns[secIndex].length;
            //console.log(">>>Column Data: ", theColumnIndex, " -- ", nextColumnIndex, " -- ", totSecColumn, " -- ", );
            if(nextColumnIndex > 0 && nextColumnIndex < totSecColumn){
                //Get ridge of the values
                ////console.log("field columns: ", this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][0].values] , " :: ", this.dynamicScopeFieldColumns[1][0].values);
                this.dynamicScopeModel['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[nextColumnIndex][0].values] = record['scopeValue'];
                //this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
                //this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
                //this.dynamicScopeModel[secName].fieldLines[lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
                //console.log(">>>>Model column: ", this.dynamicScopeModel);
            }
            //console.log("@@@Updated Model Values: ", this.dynamicScopeModel);
        });
  }

  loadCriteriaScope(value){
    

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

  ngOnInit() { 

    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');

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
    this.loadAppData();
    this.loadAppInfo();
    this.loadFormDynamicTable();
    this.loadCountryStateCity();

    // let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    // //console.log("app info: ", url);
    // this.Service.getwithoutData(url)
    //   .subscribe(
    //     res => {
    //       let getData: any = res;
    //       let data: any;
    //       //, getData.data.step1, " -- ", getData.data.step2
    //       //console.log("Profile info >>> ", getData.data);
  
    //     }
    //   )
    //   return;

    this.loader = false;
    //
    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      },
      {
      title:'profciency_testing_participation', desc:'2. Profciency Testing Participation', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'personal_information', desc:'3. Personal Information', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'information_audit_management', desc:'4. Internal Audit & MRM Date', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
        title:'scope_accreditation', desc:'5. Accreditation Scope', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'perlim_visit', desc:'6. Prelim Visit', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'undertaking_applicant', desc:'7. Authorization of the Application', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
        title:'proforma_invoice', desc:'8. Proforma Invoice', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
        title:'payment_update', desc:'9. Payment Update', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
        title:'application_complete', desc:'10. Application Complete', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
    );
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
      /////console.log(record,'contry record :: ', this.step1Data.country);
      this.getCountryLists = record['countries'];
      // //let getC = this.getCountryLists.find(rec => rec.name == this.profileCountrySel);

      // if(getC){
      //   //this.step1Data.country = getC.id;
      // }
    });
    
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
    //, undertaking_confirmTop1: false,undertaking_confirmTop2: false,
    this.authorizationList = {undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,
      undertaking_confirm7:false,authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirmTop3: false};

    this.recommend = {first:false,second:false,third:false,fourth:false}

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
                  this.allStateList.push(result['states'][key]);
                }
              }
            });

            cityList.subscribe( result => {
              for(let key in result['cities']) {
                if(result['cities'][key]['name'] == step1.city )
                {
                  this.allCityList.push(result['cities'][key]);
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

  getCriteria(value){
    //console.log("select Criteris: ", value);
    this.scopeDataLoad = true;
    if(value != undefined && value > 0){
       //Get fullscope
       //let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.criteriaIdByScope + value;
       //this.Service.apiServerUrl+"/"
       //value =18;
       let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data+"?scheme="+value;
       //this.constant.API_ENDPOINT.criteriaScope + value;
       //console.log("API: ", apiURL);

       this.fullScope = [];
       //this.dynamicScopeModel = [];
       this.dynamicScopeFieldColumns = [];

       this.Service.getwithoutData(apiURL).subscribe(record => {
            //console.log('Fullscope: ', record);
            let dataScope:any = [];
            let fieldTitleValue: any = [];
            dataScope = record['data'];
            this.scopeDataLoad = false;
            let customKey;
            if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
              let firstColumValues = dataScope.firstColumnData[0];
              //console.log(">>Firstcolumn: ", firstColumValues);
              //this.fullScope.push(dataScope.scopeValue);
              let scopeName: string = '';
              let scopeTitle: string ='';
              let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == value);
              //console.log(">>> Fined Scheme: ", getData);
              if(getData){
                scopeName = getData.title;
                scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
              }
              //title: "lifting_equipment", id:1, name:"Lifting Equipment"
              this.fullScope = [{
                title: scopeTitle, id:1, name:scopeName
              }];//dataScope.schemes;
              //console.log(">>> Fined Scope Section: ", this.fullScope);
            }

            if(dataScope.scopeValue.length){
              var counter = 0;let defLine = {};
              dataScope.scopeValue.forEach((rec, key) => {
                ////console.log("-- ", rec, " :: ", key, " --- ", counter++);
                
                

                 customKey = this.fullScope[0].title;//rec.title.toString().toLowerCase().split(' ').join('_');//rec.accr_title[0];
                //this.dynamicScopeModel[customKey] = [];
                this.dynamicScopeFieldColumns[key] = [];


                fieldTitleValue[key] = [];
                //this.dynamicScopeModel[customKey].fieldLines = [];
                this.dynamicScopeModel['fieldLines'] = [];

                if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
                  //////console.log("first value length: ", rec.firstFieldValues.length);
                  defLine['firstFieldValues'] = dataScope.firstColumnData;
                }
                let fieldValues = rec.title.split(" ").join("")+"Values";
                let fieldTitle = rec.title.split(" ").join("_");
                let filedId = rec.id;
                this.dynamicScopeFieldColumns[key].push({title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId});
                defLine[fieldValues] = [];

                //console.log(">>> Field values: ", fieldValues, " -- ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeModel.fieldLines);

                if(defLine['firstFieldValues'].length > 0  && key == 0){
                  ////console.log("calling.....default...1");
                  let getValue = defLine['firstFieldValues'][0].field_value;
                  
                  ////console.log("calling.....default...1: ", getValue, " -- ", defLine['firstFieldValues']);
                  if(key === 0){
                    ////console.log("calling.....default...1.1 ", getValue);
                    //this.dynamicScopeModel['fieldLines'][0][this.dynamicScopeFieldColumns[0][0].values] = [defLine['firstFieldValues'][0]];
                    fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
                  }
                  ////console.log("calling.....default...1.2");
                  //Default load next column 
                  if(key == 0){
                    this.onChangeScopeOption(getValue,key,key,'initLoad');
                  } 
                  setTimeout(()=>{
                    if(getValue != undefined && getValue > 0){                      
                      this.dynamicScopeModel['fieldLines'][0][this.dynamicScopeFieldColumns[0][0].values] = [defLine['firstFieldValues'][0]];
                      this.dynamicScopeModel.fieldLines[key][this.dynamicScopeFieldColumns[key][0].title] = getValue;
                    }
                  },0)
                                  
                  
                }
                ////console.log("calling.....default...1.3");
                //Load first field value default by selecting first item
                this.dynamicScopeModel.fieldLines.push(defLine);
                //this.dynamicScopeModel[customKey].fieldLines.push(defLine);
              });
            }
            //Load first field value default by selecting first item
            ////console.log("calling.....default...1.4", this.dynamicScopeModel[customKey].fieldLines);
            //console.log("@Loading Model.........", this.dynamicScopeModel);
            //this.loadDefaultColumnValues(this.dynamicScopeModel);

          /*
            //this.fullScope   = dataScope.fullScope;
            dataScope.fullScope.forEach(dataRec => {
              if(dataRec.firstFieldValues != undefined){
                this.fullScope.push(dataRec);
              }
            })

            ////console.log("full scope: ", this.fullScope);
            //return;
            if(dataScope.fullScope.length > 0){
              var counter = 0;
              dataScope.fullScope.forEach((rec, key) => {
                ////console.log("-- ", rec, " :: ", key, " --- ", counter++);
                if(rec.firstFieldValues != undefined){
                  //console.log('>>> firstFieldValues null bababab');
                  let defLine = {};
                    let customKey = rec.accr_title[0];
                    this.dynamicScopeModel[customKey] = [];
                    this.dynamicScopeFieldColumns[key] = [];
                    fieldTitleValue[key] = [];
                    this.dynamicScopeModel[customKey].fieldLines = [];
                    //Initialize fields values
                    if(rec.firstFieldValues != undefined){
                      //////console.log("first value length: ", rec.firstFieldValues.length);
                      defLine['firstFieldValues'] = rec.firstFieldValues;
                    }
                    if(rec.fields.length > 0){
                      rec.fields.forEach((data,key1) =>{
                          let fieldValues = data.title.split(" ").join("")+"Values";
                          let fieldTitle = data.title.split(" ").join("_");
                          this.dynamicScopeFieldColumns[key].push({title: fieldTitle, values:fieldValues});
                          defLine[fieldValues] = [];

                          if(defLine['firstFieldValues'].length > 0){
                            //////console.log("calling.....default...");
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
        //console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns, " ::-> ",this.fullScope);
       })
    }
  }

  loadAppData(){
    let url = this.Service.apiServerUrl+"/"+'accrediation-details-show/0';
    this.Service.getwithoutData(url)
    .subscribe(
      res => {
        let getData: any = res;
        let data: any;
        let pathData: any;
        let filePath: string;
        console.log(getData,"get APP Data:");

        if(getData.data.id != undefined && getData.data.id > 0){
          this.formApplicationId = getData.data.id;
          this.formDraftsaved = getData.data.is_draft;
          this.formAccrStatus = getData.data.accr_status;
        }

        if(!this.Service.isObjectEmpty(getData.data.paymentDetails)){
          
          if(getData.data.paymentDetails.voucher_invoice != undefined && getData.data.paymentDetails.voucher_invoice != ''){
            filePath = this.constant.mediaPath + '/media/' + getData.data.paymentDetails.voucher_invoice;
            pathData = this.getSantizeUrl(filePath);
            this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
          }
          ////console.log(">>>> payment details upload: ", getData.data.paymentDetails, " -- ", this.paymentFilePath, " :: ", filePath);
        }
        if(getData.data.saved_step  != null){
          /////console.log("@saved step assign....");
          let saveStep = getData.data.saved_step;
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

        //Step 1
        //
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
        if(getData.data.date_of_issue != ''){
          this.step1Data.date_of_expiry = getData.data.date_of_expiry;
          this.step1Data.date_of_establishment = getData.data.date_of_establishment;
          this.step1Data.date_of_issue = getData.data.date_of_issue;
        }
        if(getData.data.duty_from1 != null && getData.data.duty_shift != '' && getData.data.duty_shift == 1){
          
          this.step1Data.duty_shift = getData.data.duty_shift.toString();
          this.step1Data.duty_from1 = getData.data.duty_from1.toString();
          this.step1Data.duty_to1   = getData.data.duty_to1.toString();
          //console.log(">>>Working time: 1 ", this.step1Data.duty_shift);
        }
        if(getData.data.duty_from2 != null && getData.data.duty_shift != ''  && getData.data.duty_shift == 2){
          
          this.step1Data.duty_shift = getData.data.duty_shift.toString();
          this.step1Data.duty_from2 = getData.data.duty_from2.toString();
          this.step1Data.duty_to2   = getData.data.duty_to2.toString();
          //console.log(">>>Working time: 2 ", this.step1Data.duty_shift);
        }
        if(getData.data.duty_from3 != null && getData.data.duty_shift != ''  && getData.data.duty_shift == 3){
          
          this.step1Data.duty_shift = getData.data.duty_shift.toString();
          this.step1Data.duty_from3 = getData.data.duty_from3.toString();
          this.step1Data.duty_to3   = getData.data.duty_to3.toString();
          //console.log(">>>Working time: 3 ", this.step1Data.duty_shift);
        }
        if(getData.data.is_main_activity != undefined){
            //console.log(">>>main sctivuty: 1", getData.data.is_main_activity);
            this.step1Data.is_main_activity = getData.data.is_main_activity.toString();
            if(!getData.data.is_main_activity){
              //console.log(">>>main sctivuty: 2", getData.data.is_main_activity);
              this.step1Data.is_main_activity_note = getData.data.is_main_activity_note.toString();
            }
        }
        if(getData.data.country != undefined && getData.data.country > 0){
          this.step1Data.country = getData.data.country;
        }

        //Accreditation Info
        //this.accreditationInfo
        if(getData.data.otherAccr != undefined && getData.data.otherAccr.length > 0){

          //console.log('>>>Accr infor: ', getData.data.otherAccr);
          this.accreditationInfo = [];
          this.step1Data.is_hold_other_accreditation_select = "1";
          //this.accreditationInfo = '';
          getData.data.otherAccr.forEach((item, key) => {
               ////console.log('>> ', item, " :: ", key);
               let data: any;
               data = item['value'];
               var obj1 = data.replace(/'/g, "\"");
               let jparse = JSON.parse(obj1);
               this.accreditationInfo.push(jparse);

               ////console.log('>> parse: ', jparse);
          })
          ////console.log('>>>Info: ', this.accreditationInfo);
           
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
            //console.log("@@@@@Scope details: ", getData.data.scopeDetails, " -- ", this.Service.isObjectEmpty(getData.data.scopeDetails) );
            let rowDetails: any[] = getData.data.scopeDetails.details;
            let rowLines: any[] = [];
            getData.data.scopeDetails.details.forEach((item, key) => {
              console.log('>> ', item, " :: ", key);
              let data: any;
              data = item['value'];
              var obj1 = data.replace(/'/g, "\"");
              let jparse = JSON.parse(obj1);
              rowLines.push(jparse);
              ////console.log('>> parse: ', jparse);
         })
            if(getData.data.scheme != undefined && getData.data.scheme > 0){
              this.step5Data.scheme_id = getData.data.scheme;
              this.getCriteria(this.step5Data.scheme_id);

              console.log("@ Scope Model: ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns, " -- ", rowDetails, " -- ", rowLines);
              //onChangeScopeOption(getValues: any, lineIndex: number, columnIndex: number, type?:string) {
                let tempModel = [this.dynamicScopeModel];
                console.log('model type: ', typeof this.dynamicScopeModel, " -- ", tempModel);
                // tempModel.forEach((rec, key) =>{
                //   console.log("scope key: ", key, " -- ",rec, " -- ", tempModel[0].fieldLines);
                //   if(typeof rec === 'object'){
                //      console.log('get fieldlines...');
                //      for(var p in rec){
                //       console.log("1 scope key: ", p, " -- ", rec[p]);
                //      }
                //   }
                // })
              // for(var k in this.dynamicScopeModel){
              //   console.log("scope key: ", k);
              // }

              // if(this.dynamicScopeModel['fieldLines'].length){
              //   this.dynamicScopeModel['fieldLines'].forEach((rec, key) => {
              //          console.log("scope key: ", key, " -- ",);
              //          let findSel = this.dynamicScopeFieldColumns.find(item => item[0].InspectionCategoryValues == key);
              //          console.log(findSel);

              //   })
              // }
            }
        }



        //Step 6
        if(getData.data.is_prelim_visit != null){
          this.step6Data.prelim_visit_val = (getData.data.is_prelim_visit) ? "1" : "0";
          this.step6Data.prelim_visit_select_date = getData.data.prelim_visit_date;
        this.step6Data.prelim_visit_select_time = getData.data.prelim_visit_time;
        }
        //Step 7
        if(getData.data.onBehalfApplicantDetails != null && getData.data.onBehalfApplicantDetails != undefined){
          let getAuthData = getData.data.onBehalfApplicantDetails[0];
          //console.log(">>> Auth data: ", getAuthData);
          this.step7Data.organization_name        = getAuthData.organization_name;
          this.step7Data.representative_name      = getAuthData.representative_name;
          this.step7Data.designation              = getAuthData.designation;
          this.step7Data.digital_signature        = getAuthData.digital_signature;
          this.step7Data.application_date         = getAuthData.application_date;
        }
        
      }
    );
  }

  loadAppInfo(){
    //let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    let getUserdata = '';
  let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
  console.log("app info: ", url);
  this.Service.getwithoutData(url)
    .subscribe(
      res => {
        let getData: any = res;
        let data: any;
        //, getData.data.step1, " -- ", getData.data.step2
        //console.log(getData,"Profile info >>> ");

        if(getData.data.step1.length){
          data = getData.data['step1'][0];
          /////console.log('data enter...1', data);

          if(data){
            //console.log('data enter...2');

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

            //this.profileCountrySel = data.country;
            //this.step1Data.country = data.country;
            this.step1Data.state = data.state;
            this.step1Data.city = data.city;
            //selectTradeLicName
            if(data.trade_license != ''){
              let getFile = data.trade_license.toString().split('/');
              if(getFile.length){
                this.selectTradeLicName = getFile[4].toString().split('.')[0];
                this.selectTradeLicPath = this.constant.mediaPath +  data.trade_license.toString();
              }
            }
            
            if(data.cab_name  != ''){
              this.step1Data.official_commercial_name = data.cab_name.toString();
            }

            this.step1Data.physical_location_address = data.registered_address;
            this.step1Data.po_box = data.po_box;
            this.step1Data.telephone = data.tel_no;
            this.step1Data.fax_no = data.fax_no;
            this.step1Data.mailing_address = data.mailing_address;
            this.step1Data.official_website = data.official_website;
            // this.step1Data.date_of_expiry = data.date_of_expiry;
            // this.step1Data.date_of_establishment = data.date_of_establisment;
            // this.step1Data.date_of_issue = data.date_of_issue; //|
            this.step1Data.official_email = data.official_email;
            this.step1Data.official_website = data.official_website;

            /*

            this.tradeLicensedValidation = this.constant.mediaPath+step1.trade_license;
            this.step1Data.trade_license_number = step1.office_email;
            this.step1Data.date_of_issue = new Date(step1.dob);
            this.step1Data.date_of_expiry = step1.mailing_address;
            this.step1Data.date_of_establishment = step1.phone;
            this.step1Data.search_location_name = step1.fax_no;
            this.step1Data.official_commercial_name = step1.office;
            this.step1Data.accredation_type_id = step1.designation;
            this.step1Data.criteria_request = step1.office_address;
            this.step1Data.physical_location_address = step1.office_tel_no;
            this.step1Data.po_box = step1.office_fax_no;
            this.step1Data.country = step1.office_fax_no;
            this.step1Data.state = step1.office_fax_no;
            this.step1Data.city = step1.office_fax_no;
            this.step1Data.telephone = step1.office_fax_no;
            this.step1Data.fax_no = step1.office_fax_no;
            this.step1Data.official_email = step1.office_fax_no;
            this.step1Data.official_website = step1.office_fax_no;

            this.ownOrgBasicInfo = step1.cabOwnerData;
            this.step1Data.is_bod = step1.cabOwnerData != '' ? '1' : '0';
            this.ownOrgMembInfo = step1.ownOrgMembInfo;
            this.step1Data.duty_from1 = step1.duty_from1;
            this.step1Data.duty_to1 = step1.duty_to1;
            this.step1Data.duty_from2 = step1.duty_to2;
            this.step1Data.duty_from3 = step1.duty_from3;
            this.step1Data.duty_to3 = step1.duty_to3;
            this.step1Data.indication = step1.indication;
            this.step1Data.is_hold_other_accreditation = step1.is_hold_other_accreditation;
            this.step1Data.accreditationInfo = step1.is_hold_other_accreditation != '' ? '1' : '0';;
            this.step1Data.duty_to3 = step1.duty_to3;


            */
          }
        }
        if(typeof getData.data.step2 === 'object'){
         let data: any = getData.data.step2;
         //console.log("step 2>>>", data);
         if(typeof data === 'object'){
              if(data.cabOwnerData != undefined && data.cabOwnerData.length){
                //console.log('>>> owner data....');
                this.ownOrgBasicInfo = data.cabOwnerData;
                this.profileAutoData = true;
                //console.log('>>> owner data....', this.ownOrgBasicInfo);
              }
              if(data.cabBodData != undefined && data.cabBodData.length){
                //console.log('>>> member data....');
                if(data.cabBodData.length > 0){
                  this.profileAutoData = true;
                  this.ownOrgMembInfo = data.cabBodData;
                  this.step1Data.is_bod_select = "1";
                } 
                //console.log('>>> member data....', this.ownOrgMembInfo);
              }
         }

        }
        if(getData.data.criteriaList != undefined && getData.data.criteriaList.length){
          //console.log(">>>Criteria list: ", getData.data.criteriaList);
          this.criteriaList = getData.data.criteriaList;
        }
      })
  }

  loadData(){
  this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data)
    .subscribe(
      res => {
        //console.log("@Load scope....", res);
        this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
        this.countryList = res['allCountry'];
        this.labTypeList = res['allLabtype'];
        //this.fullScope   = res['fullScope'];
        //this.criteriaMaster = res['criteriaMaster'];
        this.criteriaMaster = res['data']['schemes'];
        //console.log("#Get criteria: ", this.criteriaMaster);

      },
      error => {
      
  })


  ///get info
  // let getUserdata = '';
  // let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
  // //console.log("app info: ", url);
  // this.Service.getwithoutData(url)
  //   .subscribe(
  //     res => {
  //       let getData: any = res;
  //       let data: any;
  //       //console.log(getData,"get info:");
  //       if(getData['step1'] != undefined){
  //         data = getData['step1'][0];
  //         //console.log('data enter...1', data);
  //         if(data){
  //           //console.log('data enter...2');
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
      //console.log("### Setting default values: ", modelObject, " --- ", typeof(modelObject), " === ", this.dynamicScopeFieldColumns);
      var lineCount = 0;
      let getModelKey = '';
      let getFistValue = 0;
      for(var key in modelObject){
          //console.log(key," ----- ", modelObject[key]);
        if(modelObject[key].fieldLines[0].firstFieldValues.length > 0){
          //console.log(">>> Firstfieldvalues: ", key , modelObject[key].fieldLines[0].firstFieldValues);
          if(this.dynamicScopeFieldColumns.length > 0){
            getModelKey = this.dynamicScopeFieldColumns[lineCount][0].title;
          }
          getFistValue = modelObject[key].fieldLines[0].firstFieldValues[0].field_value;
          //console.log("Field/model value: ", getFistValue, " :: ", getModelKey);
          if(getModelKey != '' && getFistValue > 0){
            modelObject[key].fieldLines[0][getModelKey] = getFistValue;
          }
        }
        lineCount++;
      }
      ////console.log("@Final Model column: ", model);
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
    ////console.log('Model assign...');
  }

  selectChange(event){
    ////console.log('Change Event: ', event);
  }
  //Dynamic Scope binding ----  Abhishek @Navsoft

  getFieldTooltip(modelValue, modelObj){
    //////console.log("Tooltip data value: ", modelValue, " :: ", modelObj);
    if(modelValue != undefined && modelObj.length > 0){
        let findText = modelObj.find(rec => rec.field_value === modelValue);
        //////console.log('Text value: ', findText);
        if(typeof findText === 'object' && findText.value != ''){
          //////console.log('Value find: ', findText.value);
            return findText.value;
        }
    }
  }

  removeScopeLine(lineIndex: number){
      if(this.dynamicScopeModel.fieldLines != undefined && this.dynamicScopeModel.fieldLines.length > 0){
        this.dynamicScopeModel.fieldLines.splice(lineIndex, 1);
      }
  }
  
  //addScopeLine(secName:any, secIndex: number, lineIndex: number, lineData: any){
    addScopeLine(lineIndex: number, lineData: any){
    let line     =   {};    
    //console.log("Total line: ", lineData, " - ", lineIndex, " == ", lineData.length);
    if(lineData != undefined && lineData.length > 0){
      lineIndex  = lineData.length;
    }

    for(var key in this.dynamicScopeModel){
        //console.log("Key: ", key , " :: ", this.dynamicScopeModel[key]);
        let getValue: any = 0;
        //if( key === secName ){
          if(this.dynamicScopeModel.fieldLines != undefined){
            let fieldValues = this.dynamicScopeModel.fieldLines[0].firstFieldValues;
            
            //console.log("Fieldvalues:: ", fieldValues);
            line['firstFieldValues'] = fieldValues;
            this.dynamicScopeModel.fieldLines.push(line);
            if(fieldValues.length > 0 && typeof fieldValues[0] === "object" && fieldValues[0].field_value != undefined){
              getValue = fieldValues[0].field_value;
            }
            //////console.log('Calling on change...', getValue, " -- ", secName, " Lineindex: ", lineIndex);
            
            this.dynamicScopeFieldColumns.forEach((recCol, keyCol) => {
              //////console.log(" > >>   ", keyCol)
              if(keyCol === 0){
                let getModelKey = recCol[0].title;
                //console.log(" >>>>> ",getModelKey, " --- FindValue:  ", getValue, " --- ");
                this.dynamicScopeModel['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[0][0].values] = fieldValues;
                if(getValue != undefined && getValue > 0){
                  this.dynamicScopeModel.fieldLines[lineIndex][getModelKey] = getValue;
                }
                //this.onChangeScopeOption(getValue,secIndex,lineIndex,0,secName,'initLoad');
                this.onChangeScopeOption(getValue,lineIndex,0,'initLoad');
              }
            });
          }
        //}
    }    
    //console.log("Add Line status: ", this.dynamicScopeModel);
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
      ////console.log(this.inspectionBodyData)
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
  
  getFieldTooltip123(modelValue: any, modelObject: any, type: any){
    //////console.log("Model Tooltip: ", modelValue, " --- ", modelObject);
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
     //console.log("scroll to find...");
     let invalidFields: any[] = [];
      // let findField =  document.querySelector('div .ng-invalid');
      // this.scrollToPos(findField);
      // const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      //   "div .ng-invalid"
      // );  
      // //console.log("scroll to postion...", firstInvalidControl);
      // firstInvalidControl.focus();  
      let getForm = theForm.form.controls;
      ////console.log(getForm);
      var key;
      for(key in getForm){
         ////console.log(key, " => ", getForm[key].status)
         if(getForm[key].status === 'INVALID' && getForm[key].errors.required === true){
           invalidFields.push({control: getForm[key], name: key});
         }
      }

      if(invalidFields.length > 0){
          let findElement = invalidFields.find(rec => rec.name === 'audit_date');
           //console.log("find elem: ", findElement, " :: ",findElement.control);
           if(findElement.control != undefined){
            const el = document.getElementById('audit_date');
            //console.log("@Elem: ",el);
            if(el){
              el.scrollIntoView(true);    //arguement true bypass the non-exist element or undefined
            }
            // let elem = document.getElementById('audit_date');
            // //console.log("#Elem: ", elem);
            // elem.scrollIntoView();
            ////findElement.control.focus();
          }
      }
      //console.log('model inputs: ', this.inspectionBodyForm);
      //console.log('invalid inputs: ', invalidFields);
      
   }
   scrollToPos(el: Element){
    //console.log("scroll to postion...", el);
    if(el) { 
      el.scrollIntoView({ behavior: 'smooth' });
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

   validateFile(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['png','pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      if(type == undefined){
        this.step1DataBodyFormFile.append('trade_license',fileEvent.target.files[0]);
      }if(type != undefined){
        //console.log(">>>File: ", fileEvent.target.files[0]);
        this.step5Data.payment_receipt = fileEvent.target.files[0].name;
        this.step5Data.payment_receipt_file = fileEvent.target.files[0];
        this.step5DataBodyFormFile.append(type,fileEvent.target.files[0]);
        //console.log(">>> data file: ", this.step5DataBodyFormFile);
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

  onSubmitUndertakingApplicant(ngForm7: any, type?: boolean){
    // Object.keys(this.authorizationList).forEach(key => {
    //   if(this.authorizationList[key]==false){
    //     this.authorizationStatus = false;
    //   }
    // })
    
    //this.Service.moveSteps('undertaking_applicant', 'payment_update', this.headerSteps);
    //this.Service.moveSteps('undertaking_applicant', 'proforma_invoice', this.headerSteps);

    let checkCount = 0;
    for(let key in this.authorizationList) {
      //console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
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

    //console.log("authorize checklist count: ",checkCount)
    // for(let key in this.authorizationList) {
    //   //console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
    //   if(this.authorizationList[key]) {
    //     this.authorizationStatus = true;
    //   }      
    // }
    
    // for(let key in this.recommend) {
    //   if(this.recommend[key] == true) {
    //     this.recommendStatus = true;
    //   }
    // }
    if(!this.authorizationStatus){
      //this.isSubmit = false;
      this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    // else if(this.recommendStatus != true){
    //   this.isSubmit = false;
    //   this.toastr.error('Please Check any recommend the visit ', '');
    // }
    this.inspectionBodyForm = {};
      this.inspectionBodyForm.step7 = {};
      //this.inspectionBodyForm.email = this.userEmail;
      //this.inspectionBodyForm.userType = this.userType;
      this.step7Data.authorizationList = this.authorizationList;
      this.step7Data.recommend = this.recommend;

      //console.log("@@@Step7 Data: ", this.step7Data);
      this.inspectionBodyForm.step7 = this.step7Data;
      this.inspectionBodyForm.step7.email = this.userEmail;
      this.inspectionBodyForm.step7.userType = this.userType;
      this.inspectionBodyForm.step7.application_id = this.formApplicationId;

      this.inspectionBodyForm.step7.application_date = '2020-09-14';

      //console.log(">>>Step7 submit Data: ", this.inspectionBodyForm);

     // return;

    if(ngForm7.form.valid && type == undefined && this.authorizationStatus == true){

      // this.step6Data = this.recommend.first;
      // this.step6Data = this.recommend.second;
      // this.step6Data = this.recommend.first;
      // this.step6Data = this.recommend.first;
      // this.step6Data = this.recommend.first;

      // this.inspectionBodyForm = {};
      // this.inspectionBodyForm.step6 = {};
      // //this.inspectionBodyForm.email = this.userEmail;
      // //this.inspectionBodyForm.userType = this.userType;
      // this.step6Data.authorizationList = this.authorizationList;
      // this.step6Data.recommend = this.recommend;

      // this.inspectionBodyForm.step6 = this.step6Data;
      // this.inspectionBodyForm.step6.email = this.step6Data;
      // this.inspectionBodyForm.step6.userType = this.step6Data;

      //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);

      //console.log(">>>Step7 Data: ", this.inspectionBodyForm);
      //return;
      this.inspectionBodyForm.step7.is_draft = false;
      this.inspectionBodyForm.saved_step = 7;
      //this.step6DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      // setTimeout(() => {
      //   this.toastr.success("Please wait paypal", '');
      // }, 500)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          //console.log(res,'step 7 submit...')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
            this.transactionsItem['amount']               = {};
            this.transactionsItem['amount']['total']      = 0.00;
            this.transactionsItem['amount']['currency']   = 'USD';
            this.transactionsItem['amount']['details']    = {};
            this.transactionsItem['amount']['details']['subtotal'] = 0.00;
            //declare Items data
            this.transactionsItem['item_list']            = {};
            this.transactionsItem['item_list']['items']   = [];
            let custPrice: any = 520;
            this.total = 520;
              this.transactionsItem['item_list']['items'].push({name: 'Inspection Body Application', quantity: 1, price: custPrice, currency: 'USD'});
                if(this.total > 0){
                  ////console.log("Calculate price: ", calcPrice);
                  this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
                  this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
                  this.transactions.push(this.transactionsItem);
                  ////console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
                }
                setTimeout(() => {
                  this.createPaymentButton(this.transactionsItem, this.inspectionBodyForm, this);
                  let elem = document.getElementsByClassName('paypal-button-logo');
                  //console.log("button creting...");
                  if(elem){
                    //console.log("button creted...");
                    
                  }
                }, 100)
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

      //Paypal config data
      //applyTrainerPublicCourse
      // this.transactionsItem['amount']               = {};
      // this.transactionsItem['amount']['total']      = 0.00;
      // this.transactionsItem['amount']['currency']   = 'USD';
      // this.transactionsItem['amount']['details']    = {};
      // this.transactionsItem['amount']['details']['subtotal'] = 0.00;
      // //declare Items data
      // this.transactionsItem['item_list']            = {};
      // this.transactionsItem['item_list']['items']   = [];
      // let custPrice: any = 520;
      // this.total = 520;
      //   this.transactionsItem['item_list']['items'].push({name: 'Inspection Body Application', quantity: 1, price: custPrice, currency: 'USD'});
      //     if(this.total > 0){
      //       ////console.log("Calculate price: ", calcPrice);
      //       this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
      //       this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
      //       this.transactions.push(this.transactionsItem);
      //       ////console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
      //     }
      //     setTimeout(() => {
      //       this.createPaymentButton(this.transactionsItem, this.inspectionBodyForm, this);
      //       let elem = document.getElementsByClassName('paypal-button-logo');
      //       //console.log("button creting...");
      //       if(elem){
      //         //console.log("button creted...");
              
      //       }
      //     }, 100)

      //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step6.is_draft = true;
      this.inspectionBodyForm.saved_step     = 7; 
      // this.toastr.success('Application Successfully Submitted', '');
      //     setTimeout(()=> {
      //       this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //     }, 2000)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        //console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success(res['msg'], '');
          setTimeout(()=> {
            //this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          }, 2000)
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
    // //console.log("Step Application submit...", " -- ", ngForm.form);
    //  if(!ngForm.form.valid){
    //   this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    //  }else{
    //   this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    // } 
    //&& this.formAccrStatus ==
    if(this.formApplicationId > 0 ){
        console.log(">>>find ID");
        this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
      return;
    }
    
    ////console.log("Submit calling: ", this.step1Data);
    //return;
    //this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    this.isApplicationSubmitted = true;
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
    //this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);

    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step1 = {};
    //
    // if(this.step1Data.criteria_request != undefined){
    //   let schemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id);

    //   if(schemeData){
    //     this.step1Data.criteria_request = schemeData.title;
    //     this.inspectionBodyForm.step1['scheme'] = schemeData.scope_accridiation.id;
    //   }
    // }
    // if(this.step1Data.is_bod != undefined && this.step1Data.is_bod == 1){
    //   this.step1Data.is_bod = "true";
    // }
    // if(this.step1Data.is_bod != undefined && this.step1Data.is_bod == 0){
    //   this.step1Data.is_bod = "false";
    // }//

    // if(this.step1Data.is_hold_other_accreditation != undefined && this.step1Data.is_hold_other_accreditation == 1){
    //   this.step1Data.is_hold_other_accreditation = "true";
    // }
    // if(this.step1Data.is_hold_other_accreditation != undefined && this.step1Data.is_hold_other_accreditation == 0){
    //   this.step1Data.is_hold_other_accreditation = "false";
    // }
    if(this.step1Data.is_main_activity_note == undefined){
      this.step1Data.is_main_activity_note = " ";
    }
    if(this.step1Data.fax_no == undefined || this.step1Data.fax_no === ''){
      this.step1Data.fax_no = " ";
    }
    if(this.step1Data.official_email == undefined){
      this.step1Data.official_email = " ";
    }

    if(this.step1Data.duty_shift == '1'){
      this.step1Data.duty_from2 = '00:00:00'
      this.step1Data.duty_to2 = '00:00:00';
      this.step1Data.duty_from3 = '00:00:00'
      this.step1Data.duty_to3 = '00:00:00';
    }
    if(this.step1Data.duty_shift == '2'){
      this.step1Data.duty_from1 = '00:00:00'
      this.step1Data.duty_to1 = '00:00:00';
      this.step1Data.duty_from3 = '00:00:00';
      this.step1Data.duty_to3 = '00:00:00';
    }
    if(this.step1Data.duty_shift == '3'){
      this.step1Data.duty_from2 = '00:00:00'
      this.step1Data.duty_to2 = '00:00:00';
      this.step1Data.duty_from1 = '00:00:00'
      this.step1Data.duty_to1 = '00:00:00';
    }

    if(this.step1Data.duty_from1 == undefined){
      this.step1Data.duty_from1 = ''
      this.step1Data.duty_to1 = '';
    }
    if(this.step1Data.duty_from2 == undefined){
      this.step1Data.duty_from2 = ''
      this.step1Data.duty_to2 = '';
    }
    if(this.step1Data.duty_from3 == undefined){
      this.step1Data.duty_from3 = ''
      this.step1Data.duty_to3 = '';
    }


    this.inspectionBodyForm.step1 = this.step1Data;      
    // this.inspectionBodyForm.step1['ownOrgBasicInfo'] = [];
    // this.inspectionBodyForm.step1['ownOrgMembInfo'] = [];
    // this.inspectionBodyForm.step1['accreditationInfo'] = [];
    
    // if(!this.Service.isObjectEmpty(this.ownOrgBasicInfo[0])) {
    //   //this.inspectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
    // }
    // if(!this.Service.isObjectEmpty(this.ownOrgMembInfo[0])) {
    //   //this.inspectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
    // }
    // if(!this.Service.isObjectEmpty(this.accreditationInfo[0])) {
    //   this.inspectionBodyForm.step1['accreditationInfo'] = this.accreditationInfo;
    // }

    // let scopeValues: any =[];
    // let scopeIds:any =[];
    // let scopeSelValues:any =[];

    // var key = '';
    // var key2 = '';
    // let resultAr: any={};
    // let scopeCollections: any={};
    // scopeCollections['scope_heading'] = {};
    // scopeCollections['scope_value'] = [];

    // this.dynamicScopeFieldColumns.forEach((item,key) => {
    //     ////console.log(item);
    //     let keyIds = item[0].idVal;
    //     let name = item[0].name;
    //     ////console.log("...", name);
    //     let tempObj = {};
    //    tempObj[keyIds] = name;
    //     ////console.log("...", tempObj);
    //     //scopeCollections['scope_heading'][key] = {};  
    //     //scopeCollections['scope_heading'][key] = tempObj; 
    //     //scopeCollections['scope_heading'] = tempObj; 
    //     scopeCollections['scope_heading'][keyIds] = name;
    //     //scopeCollections['scope_heading'][0].push( tempObj); 
    //     //let custKey = ids.toString();
    //     //this.dynamicScopeModel.fieldLines[key][this.dynamicScopeFieldColumns[key][0].title] = getValue;
    //     //scopeCollections['scope_heading'][key][custKey] = 'test';
    //     //scopeCollections['scope_heading'].push(tempObj);
    //     // scopeCollections['scope_heading'][key] = {
    //     //   tempObj
    //     // }
    // });
    // //console.log(">>> build scope: ", scopeCollections);
    // //return;


    // for(key in this.dynamicScopeModel){
    //     if(key == 'fieldLines'){
    //       this.dynamicScopeModel.fieldLines.forEach((rec,key1) => {
    //             //console.log(rec, " -- ", key);
    //             //resultAr[key1] = [];
    //             scopeIds = [];
    //             scopeSelValues = [];
    //             if(typeof rec === 'object'){
    //               for(key2 in rec){
                      
    //                   let selectVal;
    //                   let selectId;
                      
    //                   let getDataValues = this.dynamicScopeFieldColumns.find(item => item[0].values == key2)
    //                   let getSelectValues = this.dynamicScopeFieldColumns.find(item => item[0].title == key2)
    //                   if(getDataValues){
    //                     let fdata: any = getDataValues[0];                        
    //                     if(fdata.values == key2){
    //                       selectId = fdata.idVal;//rec[key2][0].id;
    //                       scopeIds.push({id: selectId})
    //                     }
    //                   }
    //                   if(getSelectValues){
    //                     let fdata: any = getSelectValues[0];
    //                     if(fdata.title == key2){
    //                       selectVal = rec[key2];
    //                       scopeSelValues.push({value: selectVal})
    //                     }
    //                   }
    //                   //scopeValues.push({id:selectId , value: selectVal});

    //                   //console.log("scope aa: ", key2, " -- ", selectVal, " -- ", selectId);

    //               }
    //             }
    //             resultAr[key1] = [];
                
    //             for(var k=0; k<scopeIds.length; k++){
    //               let idKey = scopeIds[k].id;
    //               let valueKey = scopeSelValues[k].value;
    //               let tempObj = {};
    //               tempObj[idKey] = valueKey;
    //               resultAr[key1].push({id: idKey, value: valueKey});
    //            }
    //            //resultAr[key1] = tempObj;
    //            //console.log('scope object: ', " -- ", resultAr);
    //       })
    //     }
    // }
    
    // if(scopeCollections){
    //   let resultTempAr: any ={};
    //   let tempObj: any = {};
    //   let rstAr: any=[];
    //   var p;
    //   for(p in resultAr){
    //     //console.log(p, " -- ", resultAr[p])
    //     //resultTempAr[p] = [];
    //     if(resultAr[p].length){
    //       resultAr[p].forEach(item =>{
    //         tempObj = {};
    //           //tempObj[item.id] = item.value;
    //           resultTempAr[item.id] = item.value;
    //           //resultTempAr[p].push(tempObj);
    //       })
    //     }
    //     rstAr.push(resultTempAr);
    //   }
    //   //console.log('<<>>>> ', resultTempAr, " -- ", rstAr);
    //   scopeCollections['scope_value'] = rstAr;
    // }


    // }
    // //console.log("@selected scope values: ", scopeIds, " =-- ", scopeSelValues);
    // //console.log("#Scope result: ", resultAr, " -- ", scopeCollections);
    // // this.dynamicScopeModel.forEach(rec => {
    // //      if(rec.fieldLines){
    // //       //console.log("field rows: ", rec.fieldLines);
    // //      }
    // // })
    // if(scopeCollections != undefined){
    //   this.inspectionBodyForm.step1['scope_heading'] = scopeCollections['scope_heading'];
    //   this.inspectionBodyForm.step1['scope_value'] = scopeCollections['scope_value'];
    // }
    ////console.log(">> submit: ", this.inspectionBodyForm);
    //return;    
    //this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    //&& this.tradeLicensedValidation != false
    if(ngForm1.form.valid && type == undefined) {

      if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 1){
        this.step1Data.is_bod = true;
      }
      if(this.step1Data.is_bod_select != undefined && this.step1Data.is_bod_select == 0){
        this.step1Data.is_bod = false;
      }//
  
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

      this.inspectionBodyForm.step1.application_id = this.formApplicationId;
      
      //return;
      //this.inspectionBodyForm.step1['trade_license'] = this.step1DataBodyFormFile;
      // this.inspectionBodyForm.step1.is_draft = false;
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
          //console.log(res,'response')
          if(res['status'] == true) {
            let data: any = {};
            this.isApplicationSubmitted = false;
             data = res;
             //console.log(res,'Data')
            if(data.application_id != undefined && data.application_id > 0){
              this.formApplicationId = data.application_id;
              //console.log(this.formApplicationId,'App id assigned')
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
    }else if(!ngForm1.form.valid && type != undefined && type == true){
        //console.log("save a draft...");
        this.inspectionBodyForm.step1.is_draft = true;
        this.inspectionBodyForm.step2.application_id = this.formApplicationId;
        this.inspectionBodyForm.saved_step = 1;
        if(this.step1DataBodyFormFile != undefined){
          //this.inspectionBodyForm.step1['trade_license'] = this.step1DataBodyFormFile;
        }        
        // //console.log(">>> Save a draft First Step Data: ", this.inspectionBodyForm);
        // this.toastr.success("Record saved successfully");
        // setTimeout(()=> {
        //this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
        // },2000) 
        //this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
        .subscribe(
          res => {
            //console.log(res,'res')
            if(res['status'] == true) {
              //this.toastr.success(res['msg'],);
              //this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
              this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
            }else{
              this.toastr.warning(res['msg'], '');
            }
          });
    }
    else {
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitTestingParticipation(ngForm2: any, type?:boolean){
    //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
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

    if(this.proficiencyTesting.length > 0 && this.step2Data.proficiency_testing_val > 0) {
      this.inspectionBodyForm.step2['proficiencyTesting'] = this.proficiencyTesting;
    }
        
        this.proficiencyTesting.forEach((rec,key) => {
              let dtFormat = '';
             if(rec.participation_date != undefined && rec.participation_date._i != undefined){
              var dtData = rec.participation_date._i;
              var year = dtData.year;
              var month = dtData.month;
              var date = dtData.date;
            }
            dtFormat = year + "-" + month + "-" + date;

            //console.log(">>DT: ", dtFormat);
            this.proficiencyTesting[key].date = dtFormat;
        })
        //console.log(">> Data: ", this.proficiencyTesting);


    ////console.log("@Step2 submit...", this.inspectionBodyForm, " --- ", this.formApplicationId);
    //return;

    if(ngForm2.form.valid && type == undefined) {
      // this.inspectionBodyForm = {};
      // this.inspectionBodyForm.step2 = {};
      // //this.inspectionBodyForm.email = this.userEmail;
      // //this.inspectionBodyForm.userType = this.userType;
      // this.inspectionBodyForm.step2 = this.step2Data;
      // this.inspectionBodyForm.step2.email = this.userEmail;
      // this.inspectionBodyForm.step2.userType = this.userType;
      // this.inspectionBodyForm.step2['proficiencyTesting'] = [];
      
      // if(this.ownOrgBasicInfo) {
      //   this.inspectionBodyForm.step2['proficiencyTesting'] = this.proficiencyTesting;
      // }
      
      //return;
      //this.inspectionBodyForm.step2.is_draft = false;
      //this.inspectionBodyForm.saved_step = 2;
      //console.log(">>>step2 submit data: ", this.inspectionBodyForm, " --- ", this.formApplicationId);
      //return;
      //this.step2DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
          // this.toastr.success('Application Successfully Submitted', '');
          // setTimeout(()=> {
          //   this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
          // }, 1000)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          //console.log(res,'res...')
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
      //console.log('save draft....2');
          // this.toastr.success('Application Successfully Submitted', '');
          // setTimeout(()=> {
          //   this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          // }, 1000)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          //console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');

            setTimeout(()=> {
              this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
            },2000) 
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
    // //console.log("Step PersonalInformation submit...");
      //this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
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
          this.inspectionBodyForm.step3.technicalManager['relevent_experience'] = (this.step3Data.relevent_experience_technical != '' && this.step3Data.mobile_no_technical != undefined) ? this.step3Data.relevent_experience_technical : '';
      //}     

      this.inspectionBodyForm.step3.managementManager = {};
      //if(this.step3Data.management_name != '' && this.step3Data.management_designation != '' && this.step3Data.management_mobile_no != ''
        // && this.step3Data.management_email != '' && this.step3Data.management_relevent_experience != ''){
          this.inspectionBodyForm.step3.managementManager['name'] = (this.step3Data.management_name != '' && this.step3Data.management_name != undefined) ? this.step3Data.management_name : '';
          this.inspectionBodyForm.step3.managementManager['designation'] = (this.step3Data.management_designation != '' && this.step3Data.management_designation != undefined) ? this.step3Data.management_designation : '' ;
          this.inspectionBodyForm.step3.managementManager['mobile_no'] = (this.step3Data.management_mobile_no != '' && this.step3Data.management_mobile_no != undefined) ? this.step3Data.management_mobile_no : '';
          this.inspectionBodyForm.step3.managementManager['email'] = (this.step3Data.management_email != '' && this.step3Data.management_email != undefined) ? this.step3Data.management_email : '';
          this.inspectionBodyForm.step3.managementManager['relevent_experience'] = (this.step3Data.management_relevent_experience != '' && this.step3Data.management_relevent_experience != undefined) ? this.step3Data.management_relevent_experience : '';
      //}

      //console.log('>>> step 3 ', this.inspectionBodyForm);
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
      //console.log(">>> Step3 submit: ", this.inspectionBodyForm);
      // this.step3DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      // this.toastr.success('Application Successfully Submitted', '');
      //     setTimeout(()=> {
      //       this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
      //     }, 1000)
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          //console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
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
      //console.log("save a draft ..setp 3: ");
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        //console.log(res,'res')
        if(res['status'] == true) {
          //this.toastr.success(res['msg'], '');
          setTimeout(()=> {
            this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          },2000)          
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
    //  //console.log("Step InformationAuditManagement submit...");   
    //this.Service.moveSteps('information_audit_management', 'scope_accreditation', this.headerSteps);
    this.inspectionBodyForm = {};
      this.inspectionBodyForm.step4 = {};
      //console.log(">>> step4 data: ", this.step4Data);
      this.step4Data['audit_date'] = (this.step4Data.audit_date != '') ? this.step4Data.audit_date : null;
      this.step4Data['mrm_date'] = (this.step4Data.mrm_date != undefined) ? this.step4Data.mrm_date : null;

      this.inspectionBodyForm.step4 = this.step4Data; 
      this.inspectionBodyForm.step4.email = this.userEmail;
      this.inspectionBodyForm.step4.application_id = this.formApplicationId;
      this.inspectionBodyForm.step4.userType = this.userType;

      //console.log(">>> step4 data: ", this.inspectionBodyForm);
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
          //console.log(res,'res')
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
        //console.log(res,'res')
        if(res['status'] == true) {
          //this.toastr.success(res['msg'], '');
          setTimeout(()=> {
            this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          },2000) 
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
    // //console.log("Step PerlimVisit submit...", ngForm.form);    
    //this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step6 = {};
    this.isPrelimSubmitted = true;

    //console.log("@@@@Step6 data: ", this.step6Data);
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
    //console.log("date format: ", dtFormat, " -- ", dtData);
    this.step6Data['prelim_visit_date'] = (this.step6Data.prelim_visit_select_date != undefined) ? dtFormat : null;
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
          //console.log(res,'res')
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
        //console.log(res,'res')
        if(res['status'] == true) {
          //this.toastr.success(res['msg'], '');
          //this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          setTimeout(()=> {
            this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          },2000) 
          //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
      }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
 }


 onSubmitScopeAccreditation(ngForm: any, type?: boolean){
  //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);

  this.inspectionBodyForm = {};
  this.inspectionBodyForm.step5 = {};
  this.inspectionBodyForm.step5 = this.step5Data;
  this.inspectionBodyForm.step5.application_id = this.formApplicationId;
  if(this.step5Data.criteria_request != undefined){
    let schemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id);
    //console.log("scheme data: ", schemeData);
      if(schemeData){
      this.step5Data.criteria_request = schemeData.title;
      this.inspectionBodyForm.step5['scheme_id'] = schemeData.scope_accridiation.id;
      }
    }
    let scopeValues: any =[];
    let scopeIds:any =[];
    let scopeSelValues:any =[];
    //console.log("dynamic ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns);
    var key = '';
    var key2 = '';
    let resultAr: any={};
    let scopeCollections: any={};
    scopeCollections['scope_heading'] = {};
    scopeCollections['scope_value'] = [];

    this.dynamicScopeFieldColumns.forEach((item,key) => {
        ////console.log(item);
        let keyIds = item[0].idVal;
        let name = item[0].name;
        ////console.log("...", name);
        let tempObj = {};
       tempObj[keyIds] = name;
        ////console.log("...", tempObj);
        //scopeCollections['scope_heading'][key] = {};  
        //scopeCollections['scope_heading'][key] = tempObj; 
        //scopeCollections['scope_heading'] = tempObj; 
        scopeCollections['scope_heading'][keyIds] = name;
        //scopeCollections['scope_heading'][0].push( tempObj); 
        //let custKey = ids.toString();
        //this.dynamicScopeModel.fieldLines[key][this.dynamicScopeFieldColumns[key][0].title] = getValue;
        //scopeCollections['scope_heading'][key][custKey] = 'test';
        //scopeCollections['scope_heading'].push(tempObj);
        // scopeCollections['scope_heading'][key] = {
        //   tempObj
        // }
    });
    //console.log(">>> build scope: ", scopeCollections);
    //return;


    for(key in this.dynamicScopeModel){
        if(key == 'fieldLines'){
          this.dynamicScopeModel.fieldLines.forEach((rec,key1) => {
                //console.log(rec, " -- ", key);
                //resultAr[key1] = [];
                scopeIds = [];
                scopeSelValues = [];
                if(typeof rec === 'object'){
                  for(key2 in rec){
                      
                      let selectVal;
                      let selectId;
                      
                      let getDataValues = this.dynamicScopeFieldColumns.find(item => item[0].values == key2)
                      let getSelectValues = this.dynamicScopeFieldColumns.find(item => item[0].title == key2)
                      //console.log("scope : ", key2, " -- ", getDataValues, " -- ", getSelectValues);
                      if(getDataValues){
                        let fdata: any = getDataValues[0];                        
                        if(fdata.values == key2){
                          selectId = fdata.idVal;//rec[key2][0].id;
                          scopeIds.push({id: selectId, rowValues:fdata.values})
                        }
                      }
                      if(getSelectValues){
                        let fdata: any = getSelectValues[0];
                        if(fdata.title == key2){
                          selectVal = rec[key2];
                          scopeSelValues.push({value: selectVal})
                        }
                      }
                      //scopeValues.push({id:selectId , value: selectVal});

                      //console.log("scope aa: ", key2, " -- ", selectVal, " -- ", selectId);

                  }
                }
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
               ///console.log('scope object: ', " -- ", resultAr);
          })
        }
    }
    
    if(scopeCollections){
      let resultTempAr: any ={};
      let tempObj: any = {};
      let rstAr: any=[];
      var p;
      let scopeRows: any;
      //this.dynamicScopeModel
      if(this.dynamicScopeModel.fieldLines != undefined && this.dynamicScopeModel.fieldLines.length > 0){
        scopeRows = this.dynamicScopeModel.fieldLines;
      }
      for(p in resultAr){
        //console.log(p, " -- ", resultAr[p])
        //resultTempAr[p] = [];
        if(resultAr[p].length){
          resultAr[p].forEach(item =>{
            tempObj = {};
            let optionName = '';
              //tempObj[item.id] = item.value;
              if(typeof scopeRows[p] === 'object'){
                 for(var k in scopeRows[p]){
                   //console.log('>>>> ', k, " -- ", item.valueSrc);
                   if(k === item.valueSrc){
                     let tempAr = scopeRows[p][k];
                     let findVal = tempAr.find(itemF => itemF.field_value == item.value);
                     if(findVal){
                      optionName = findVal.value;
                     }
                     //console.log("found...", k," :: ", scopeRows[p][k], " -- ",optionName, " --- ", findVal);
                   }
                 }
              }
              resultTempAr[item.id] = optionName;
              //resultTempAr[item.id] = item.value;
              //resultTempAr[p].push(tempObj);
          })
        }
        rstAr.push(resultTempAr);
      }
      //console.log('<<>>>> ', resultTempAr, " -- ", rstAr);
      scopeCollections['scope_value'] = rstAr;
    }


    // }
    ///console.log("@selected scope values: ", scopeCollections);
    //return;
    //console.log("#Scope result: ", resultAr, " -- ", scopeCollections);
    // this.dynamicScopeModel.forEach(rec => {
    //      if(rec.fieldLines){
    //       //console.log("field rows: ", rec.fieldLines);
    //      }
    // })
    if(scopeCollections != undefined){
      this.inspectionBodyForm.step5['scope_heading'] = scopeCollections['scope_heading'];
      this.inspectionBodyForm.step5['scope_value'] = scopeCollections['scope_value'];
    }
    // this.inspectionBodyForm.step5['application_id'] = 812;
    // this.inspectionBodyForm.step5['is_perlim_visit'] = false;
    // let dtFormat: string = "2020-09-12";
    // this.step5Data['perlim_visit_date'] = dtFormat ;
    // this.step5Data['perlim_visit_time'] = "01:30AM";
    
    ////console.log(">>> step5 submit...", this.step5Data, " -- ", this.inspectionBodyForm);
    //return;
    //ngForm.form.valid &&
    if(ngForm.form.valid && type == undefined) {
      this.inspectionBodyForm.step5.is_draft = false;
      this.inspectionBodyForm.saved_step = 5;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          //console.log(res,'res')
          if(res['status'] == true) {
            //this.toastr.success(res['msg'], '');
            this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step5.is_draft = true;
      this.inspectionBodyForm.saved_step = 5;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          //console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            //this.Service.moveSteps('scope_accreditation', 'perlim_visit', this.headerSteps);
            setTimeout(()=> {
              this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
            },2000) 
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
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
   //console.log("date format: ", dtFormat, " -- ", dtData);
   //this.step5Data['voucher_dates'] = (this.step5Data.voucher_dates != undefined) ? dtFormat : null;
   this.inspectionBodyForm.voucher_date = dtFormat;
   //console.log(">>>>payment file: ", this.step5Data.payment_receipt_file);
   //this.inspectionBodyForm.payment_receipt = this.step5DataBodyFormFile;//this.step5Data.payment_receipt_file;
   let postObject: any = {};
   postObject['voucher_date'] = dtFormat;
   postObject['voucher_number'] = this.step5Data.voucher_number;
   this.step5DataBodyFormFile.append('data',JSON.stringify(postObject));
   
   //console.log("submit...", " -- ", this.step5DataBodyFormFile);
    if(ngForm.form.valid && this.paymentReceiptValidation != false){
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.paymentReceipt,this.step5DataBodyFormFile)
      .subscribe(
        res => {
          //console.log(res,'res')
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

onSubmitPaymentInformation(ngForm7: any, type?: boolean){
    //console.log("payment submitting.....");
    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step9 = {};

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

        this.voucherFile.append('voucher_code',this.voucherSentData['voucher_code']);
        this.voucherFile.append('amount',this.voucherSentData['amount']);
        this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
        this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
        this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
        this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
        this.voucherFile.append('payment_date',dtFormat);
        this.voucherFile.append('accreditation',this.formApplicationId);
        this.voucherFile.append('application_id',this.formApplicationId);
        

      //console.log(this.voucherFile, " -- ", this.voucherFile);



    //!ngForm7.form.valid &&
    if(ngForm7.form.valid && this.paymentReceiptValidation != false) {
      //this.inspectionBodyForm.step7.payment_receipt = this.step7DataBodyFormFile;
      //this.subscriptions.push(
        this._trainerService.paymentVoucherSave((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                //console.log("submit voucher: ", data);
                if(data.status){
                  //this.voucherFile = new FormData();
                  //this.voucherSentData = {};
                  this._toaster.success("Your form has been successfully submitted and it is under review.We will update you shortly.",'THANK YOU');
                  //this.openView('appComp','');
                  setTimeout(() => {                    
                    this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                  },3500)
                  
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
      //   //console.log(res,'res')
      //   if(res['status'] == true) {
      //     this.toastr.success(res['msg'], '');
      //     //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
      //   }else{
      //     this.toastr.warning(res['msg'], '');
      //   }
      // });
    }else if(type != undefined && type == true && this.paymentReceiptValidation != false){
      this.inspectionBodyForm.step7.is_draft = true;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
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
   //Step FORM Action
savedraftStep(stepsCount) {
  if(stepsCount == 'step1') {
    // //console.log(this.step1Data,'step1Data');
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
      
    //console.log(this.inspectionBodyForm,'step1DraftDataBodyFormFile')

    this.step1DraftDataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DraftDataBodyFormFile)
    .subscribe(
      res => {
        //console.log(res,'res Load Data')
        if(res['status'] == true) {
          this.toastr.success(res['msg'], '');
          this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
  }
}

onSubmit(ngForm){
    //this.getErrorScroll(this.inspectionBodyForm);
    ////console.log(this.inspectionBodyForm);
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
    ////console.log('>>>>>>');
    ////console.log(this.inspectionBodyForm.authorization_confirm1);

    // if(this.checkSecurity == true)
    // {
    //   this.checkCaptchaValidation = true;
    // }else{
    //   this.checkCaptchaValidation = false;
    // }
    //////console.log("Check Error Required: ", this.scrollToError(ngForm.form));
    
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
        //////console.log('Element pos: ', elmnt);
        elmnt.scrollIntoView();
      }
    }

    getErrorScroll(formData)
    {
      const firstStep = document.querySelector('#firstStep');
      const ownOrgBasicInfos = document.querySelector('#ownOrgBasicInfos');
      const is_bod_complete = document.querySelector('#is_bod_complete');
      const is_hold_other_accreditations = document.querySelector('#is_hold_other_accreditations');
      
      ////console.log(formData);
      if(!formData.trade_license_name || !formData.date_of_issue || !formData.date_of_expiry || !formData.date_of_establishment || !formData.search_location_name || !formData.official_commercial_name || !formData.accredation_type_id || !formData.criteria_request || !formData.physical_location_address || !formData.mailing_address || !formData.po_box || !formData.country_id || !formData.city || !formData.telephone || !formData.fax_no || !formData.official_email || formData.trade_license_name =='' || formData.date_of_issue =='' || formData.date_of_expiry =='' || formData.date_of_establishment =='' || formData.search_location_name =='' || formData.official_commercial_name =='' || formData.accredation_type_id =='' || formData.criteria_request =='' || formData.physical_location_address =='' || formData.mailing_address =='' || formData.po_box =='' || formData.country_id =='' || formData.city =='' || formData.telephone =='' || formData.fax_no =='' || formData.official_email =='' || formData.official_website =='')
      {
          firstStep.scrollIntoView({ behavior: 'smooth' });
      }
      else if(this.inspectionBodyForm.is_bod == '1')
      {
        Object.keys(this.inspectionBodyForm.organizationMemberInfo).forEach(key => {
          // if(key['name'] == ''){
          // }
          ////console.log(this.inspectionBodyForm.organizationMemberInfo[key].name,'Keysssssss');
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
          //////console.log(this.inspectionBodyForm.organizationBasicInfo[key].name,'Keysssssss');
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
      if(typeof this.step1Data.search_location_name != 'undefined')
      {
        this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step1Data.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
          .subscribe(res => {
              // ////console.log(res['features']);
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
      //////console.log(dayTime);
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

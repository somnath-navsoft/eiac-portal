import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';

declare let paypal: any;
@Component({
  selector: 'app-inspection-bodies-form',
  templateUrl: './inspection-bodies-form.component.html',
  styleUrls: ['./inspection-bodies-form.component.scss'],
  providers: [Constants, AppService, ToastrService, Overlay, OverlayContainer]
})
export class InspectionBodiesFormComponent implements OnInit {

  public newRow: any = {};
  public inspectionBodyForm: any = {};
  public inspectionBodyFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [{}];
  public ownOrgMembInfo: Array<any> = [{}];
  public proficiencyTesting: Array<any> = [];
  public accreditationInfo: Array<any> = [{}];
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
  public is_bod: any = 0;
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
  public authorizationStatus: boolean = true;
  recommendStatus:boolean = false
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

  formApplicationId: number = 785;

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
         ////console.log("Yo have reached!");
         this.authorizationList.authorization_confirm2 = true;
      } 
    }        
  }
  headerSteps:any[] = [];

  constructor(public Service: AppService, public _toaster: ToastrService, public constant:Constants,public router: Router,public toastr: ToastrService) { 
    this.today.setDate(this.today.getDate());
  }

  getData(getVal){
    //  console.log(">>>>Get MapBox Value: ", getVal);
     this.Service.mapboxToken = getVal;
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
      console.log(">>> The Data: ", theData);
      this.transactions = [];
      this.toastr.success('Payment Success, Thank you.','Paypal>>',{timeOut:2000});
      setTimeout(()=> {
        this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      }, 1000)      
      //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
   }
   createPaymentButton(itemData: any, formObj?:any, compObj?:any){
    //console.log("creating....buttons...", this.paymentReview, " :: ", this.paymentReview.length, " -- ",this.transactionsItem, " --- ", this.transactions);
   //AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl = das.abhishek77@gmail.com
   //Get transaction ID - https://developer.paypal.com/docs/checkout/reference/server-integration/get-transaction/#on-the-server
    if(this.transactions.length){
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
          this._toaster.warning("You have cancelled payment, Continue next step please complete payment process again.", 'Paypal>>',{timeOut:6500}); 
  
      },
      onError: err => {
          console.log('OnError', err);
          formObj.paypalReturn = err;
          formObj.paypalStatus = 'error';
          //compObj.saveCourseAfterPayment(formObj);
          this._toaster.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
          //this.resetStatus();
      }
      }, '#paypalPayment');
    });
    }
  }

    //Paypal Button creation
    
  onChange(prevFieldId,row,curField,field) {
    ////console.log(prevFieldId.value,'sfasfdas');
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

      if(this.selectedValuesMl[row-1]){ //console.log('IFFFFFF');
        this.selectedValuesMl[row-1] = selectedValueObj;
        this.selectedValuesData[row-1] = selectedValueObj2;
      }
      else{ //console.log('ELSEEE');
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
            //console.log('field3')
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

          //console.log("LOggggg==>");
          //console.log(this.selectedValuesData);

        },
        error => {
        
    })
  }

  //onChangeScopeOption(getValues: any, secIndex: number, lineIndex: number, columnIndex: number, secName: string, type?:string) {
    onChangeScopeOption(getValues: any, lineIndex: number, columnIndex: number, type?:string) {
      console.log('@GET Options: ', getValues, " :: ",  lineIndex, " -- ", type, " -- ", columnIndex);
      let selectValue: number;
      if(type === undefined){
        selectValue = getValues.value;
      }
      if(type !== undefined && type === 'initLoad'){
        selectValue = getValues;
      }
      let url = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data;
      console.log("option change: ", url, " :: ", getValues, " -- ", selectValue);
      let jsonReq: any = {};
      jsonReq['value_id'] = selectValue;
      this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,jsonReq)
      .subscribe(
        record => {
            console.log("SErvice Data: ", record, " -- ", this.dynamicScopeFieldColumns[1], " - ", this.dynamicScopeModel);
            //get through array find key column
            if(record['scopeValue'].length == undefined){
              record['scopeValue'] = [];
            }
            let theColumnIndex  = columnIndex;
            let nextColumnIndex = theColumnIndex + 1;
            let totSecColumn    = this.dynamicScopeFieldColumns.length;//this.dynamicScopeFieldColumns[secIndex].length;
            console.log(">>>Column Data: ", theColumnIndex, " -- ", nextColumnIndex, " -- ", totSecColumn, " -- ", );
            if(nextColumnIndex > 0 && nextColumnIndex < totSecColumn){
                //Get ridge of the values
                //console.log("field columns: ", this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][0].values] , " :: ", this.dynamicScopeFieldColumns[1][0].values);
                this.dynamicScopeModel['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[nextColumnIndex][0].values] = record['scopeValue'];
                //this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
                //this.dynamicScopeModel[secName]['fieldLines'][lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
                //this.dynamicScopeModel[secName].fieldLines[lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
                console.log(">>>>Model column: ", this.dynamicScopeModel);
            }
            console.log("@@@Updated Model Values: ", this.dynamicScopeModel);
        });
  }

  loadCriteriaScope(value){
    

  }

  ngOnInit() { 

    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');
    
    this.inspectionBodyForm.criteria_request = 'ISO/IEC17020';
    // this.titleService.setTitle('EIAC - Inspection Bodies');
    this.addMinutesToTime = this.Service.addMinutesToTime();
    //this.dynamicScopeModelValues[0] = {};
    this.loadData();
    this.loadFormDynamicTable();
    this.loadCountryStateCity();
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
      title:'information_audit_management', desc:'4. Internal Audit & Management', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'perlim_visit', desc:'5. Perlim Visit', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'undertaking_applicant', desc:'6. Undertaking & Applicant Company', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      // {
      // title:'payment', desc:'7. Payment Information', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
      // }
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
      console.log(record,'contry record');
      this.getCountryLists = record['countries'];
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
      this.is_bod = value;
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
    this.authorizationList = {undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false,authorization_confirm1:false,authorization_confirm2:false};

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
          }
          if(res['data'].step2 != '') {
            
          }
        }
    });
  }

  getCriteria(value){
    console.log("select Criteris: ", value);
    if(value != undefined && value > 0){
       //Get fullscope
       //let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.criteriaIdByScope + value;
       //this.Service.apiServerUrl+"/"
       //value =18;
       let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data+"?scheme="+value;
       //this.constant.API_ENDPOINT.criteriaScope + value;
       console.log("API: ", apiURL);

       this.fullScope = [];
       //this.dynamicScopeModel = [];
       this.dynamicScopeFieldColumns = [];

       this.Service.getwithoutData(apiURL).subscribe(record => {
            console.log('Fullscope: ', record);
            let dataScope:any = [];
            let fieldTitleValue: any = [];
            dataScope = record['data'];
            let customKey;
            if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
              let firstColumValues = dataScope.firstColumnData[0];
              //console.log(">>Firstcolumn: ", firstColumValues);
              //this.fullScope.push(dataScope.scopeValue);
              let scopeName: string = '';
              let scopeTitle: string ='';
              let getData = this.criteriaMaster.find(rec => rec.scope_accridiation.id == value);
              console.log(">>> Fined Scheme: ", getData);
              if(getData){
                scopeName = getData.title;
                scopeTitle = getData.title.toString().toLowerCase().split(" ").join('_');
              }
              //title: "lifting_equipment", id:1, name:"Lifting Equipment"
              this.fullScope = [{
                title: scopeTitle, id:1, name:scopeName
              }];//dataScope.schemes;
              console.log(">>> Fined Scope Section: ", this.fullScope);
            }

            if(dataScope.scopeValue.length){
              var counter = 0;let defLine = {};
              dataScope.scopeValue.forEach((rec, key) => {
                //console.log("-- ", rec, " :: ", key, " --- ", counter++);
                
                

                 customKey = this.fullScope[0].title;//rec.title.toString().toLowerCase().split(' ').join('_');//rec.accr_title[0];
                //this.dynamicScopeModel[customKey] = [];
                this.dynamicScopeFieldColumns[key] = [];


                fieldTitleValue[key] = [];
                //this.dynamicScopeModel[customKey].fieldLines = [];
                this.dynamicScopeModel['fieldLines'] = [];

                if(dataScope.firstColumnData != undefined && dataScope.firstColumnData.length > 0){
                  ////console.log("first value length: ", rec.firstFieldValues.length);
                  defLine['firstFieldValues'] = dataScope.firstColumnData;
                }
                let fieldValues = rec.title.split(" ").join("")+"Values";
                let fieldTitle = rec.title.split(" ").join("_");
                let filedId = rec.id;
                this.dynamicScopeFieldColumns[key].push({title: fieldTitle, values:fieldValues, name: rec.title, idVal: filedId});
                defLine[fieldValues] = [];

                console.log(">>> Field values: ", fieldValues, " -- ", this.dynamicScopeFieldColumns, " -- ", this.dynamicScopeModel.fieldLines);

                if(defLine['firstFieldValues'].length > 0  && key == 0){
                  //console.log("calling.....default...1");
                  let getValue = defLine['firstFieldValues'][0].field_value;
                  
                  //console.log("calling.....default...1: ", getValue, " -- ", defLine['firstFieldValues']);
                  if(key === 0){
                    //console.log("calling.....default...1.1 ", getValue);
                    //this.dynamicScopeModel['fieldLines'][0][this.dynamicScopeFieldColumns[0][0].values] = [defLine['firstFieldValues'][0]];
                    fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
                  }
                  //console.log("calling.....default...1.2");
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
                //console.log("calling.....default...1.3");
                //Load first field value default by selecting first item
                this.dynamicScopeModel.fieldLines.push(defLine);
                //this.dynamicScopeModel[customKey].fieldLines.push(defLine);
              });
            }
            //Load first field value default by selecting first item
            //console.log("calling.....default...1.4", this.dynamicScopeModel[customKey].fieldLines);
            console.log("@Loading Model.........", this.dynamicScopeModel);
            //this.loadDefaultColumnValues(this.dynamicScopeModel);

          /*
            //this.fullScope   = dataScope.fullScope;
            dataScope.fullScope.forEach(dataRec => {
              if(dataRec.firstFieldValues != undefined){
                this.fullScope.push(dataRec);
              }
            })

            //console.log("full scope: ", this.fullScope);
            //return;
            if(dataScope.fullScope.length > 0){
              var counter = 0;
              dataScope.fullScope.forEach((rec, key) => {
                //console.log("-- ", rec, " :: ", key, " --- ", counter++);
                if(rec.firstFieldValues != undefined){
                  console.log('>>> firstFieldValues null bababab');
                  let defLine = {};
                    let customKey = rec.accr_title[0];
                    this.dynamicScopeModel[customKey] = [];
                    this.dynamicScopeFieldColumns[key] = [];
                    fieldTitleValue[key] = [];
                    this.dynamicScopeModel[customKey].fieldLines = [];
                    //Initialize fields values
                    if(rec.firstFieldValues != undefined){
                      ////console.log("first value length: ", rec.firstFieldValues.length);
                      defLine['firstFieldValues'] = rec.firstFieldValues;
                    }
                    if(rec.fields.length > 0){
                      rec.fields.forEach((data,key1) =>{
                          let fieldValues = data.title.split(" ").join("")+"Values";
                          let fieldTitle = data.title.split(" ").join("_");
                          this.dynamicScopeFieldColumns[key].push({title: fieldTitle, values:fieldValues});
                          defLine[fieldValues] = [];

                          if(defLine['firstFieldValues'].length > 0){
                            ////console.log("calling.....default...");
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
        console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns, " ::-> ",this.fullScope);
       })
    }
  }

  loadData(){
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data)
    .subscribe(
      res => {
        console.log("@Load scope....", res);
        this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
        this.countryList = res['allCountry'];
        this.labTypeList = res['allLabtype'];
        //this.fullScope   = res['fullScope'];
        //this.criteriaMaster = res['criteriaMaster'];
        this.criteriaMaster = res['data']['schemes'];
        console.log("#Get criteria: ", this.criteriaMaster);

        // Object.keys(res['scopeValue']).forEach(key => {

        //   this.inspectionBodyData[this.rowCount]=[];
        //   this.inspectionBodyData[this.rowCount].field1  = res['scopeValue'][key].values;
        //   this.medicalLabFirstData      = res['scopeValue'][key].values;
        //   //this.dynamicFirstFieldValues  = res['scopeValue'][key].values;
        // });

        //Dynamic Scope binding ----  Abhishek @Navsoft
        // let fieldTitleValue: any = [];
        // if(res['fullScope'].length > 0){
        //   res['fullScope'].forEach((rec, key) => {
        //         ////console.log("-- ", rec, " :: ", key);
        //         let defLine = {};
        //         let customKey = rec.accr_title[0];
        //         this.dynamicScopeModel[customKey] = [];
        //         this.dynamicScopeFieldColumns[key] = [];
        //         fieldTitleValue[key] = [];
        //         this.dynamicScopeModel[customKey].fieldLines = [];
        //         //Initialize fields values
        //         if(rec.firstFieldValues != undefined){
        //           ////console.log("first value length: ", rec.firstFieldValues.length);
        //           defLine['firstFieldValues'] = rec.firstFieldValues;
        //         }
        //         if(rec.fields.length > 0){
        //           rec.fields.forEach((data,key1) =>{
        //               let fieldValues = data.title.split(" ").join("")+"Values";
        //               let fieldTitle = data.title.split(" ").join("_");
        //               this.dynamicScopeFieldColumns[key].push({title: fieldTitle, values:fieldValues});
        //               defLine[fieldValues] = [];

        //               if(defLine['firstFieldValues'].length > 0){
        //                 ////console.log("calling.....default...");
        //                 let getValue = defLine['firstFieldValues'][0].field_value;
        //                 if(key1 === 0){
        //                   fieldTitleValue[key].push({title: fieldTitle, defValue: getValue, secName: customKey});
        //                 }
        //                 //Default load next column                  
        //                 this.onChangeScopeOption(getValue,key,0,0,customKey,'initLoad');
        //               }
        //           })
        //         }
        //         //Load first field value default by selecting first item

        //         this.dynamicScopeModel[customKey].fieldLines.push(defLine);
        //         ////console.log(defLine['firstFieldValues'].length, " -- ", customKey, " ===== ", fieldTitleValue );
        //         // if(defLine['firstFieldValues'].length > 0){
        //         //   //console.log("For Key: ", key, " --- ", this.dynamicScopeFieldColumns[key]);
        //         //   let fieldColumns: any = [];
        //         //   fieldColumns = this.dynamicScopeFieldColumns[key];
                  
        //         //   this.dynamicScopeFieldColumns.forEach((recCol, keyCol) => {
        //         //         //console.log(" >>>   ^^ ", recCol, " :: ", keyCol)
        //         //         if(keyCol === 0){
        //         //           let getModelKey = recCol[0].title;
        //         //           let getDefValue = 0;
        //         //           fieldTitleValue.forEach((recV,keyV) => {
        //         //               ////console.log("*** ", recV, " -- ", keyV)
        //         //               if(recV[keyV].title === getModelKey){
        //         //                  getDefValue = recV[keyV].defValue;
        //         //               }
        //         //           })
        //         //           ////console.log(getModelKey, " --- FindValue:  ", getDefValue);
        //         //           //console.log("***** Model Status: ", this.dynamicScopeModel[customKey]);
        //         //           this.dynamicScopeModel[customKey].fieldLines[0][getModelKey] = getDefValue;
        //         //         }
        //         //   })
        //         // }
        //   })

        //   //set default value
        //   //Load first field value default by selecting first item
        //   this.loadDefaultColumnValues(this.dynamicScopeModel);
        // }
        ////console.log(res,'::Result::');
        ////console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns);
        //Dynamic Scope binding ----  Abhishek @Navsoft
      },
      error => {
      
  })

    if(this.inspectionBodyScopeFields.length<1){
      this.inspectionBodyScopeFields=  [{},{},{},{},{},{}];
    }
  }

  loadDefaultColumnValues(modelObject: any){
      console.log("### Setting default values: ", modelObject, " --- ", typeof(modelObject), " === ", this.dynamicScopeFieldColumns);
      var lineCount = 0;
      let getModelKey = '';
      let getFistValue = 0;
      for(var key in modelObject){
          console.log(key," ----- ", modelObject[key]);
        if(modelObject[key].fieldLines[0].firstFieldValues.length > 0){
          console.log(">>> Firstfieldvalues: ", key , modelObject[key].fieldLines[0].firstFieldValues);
          if(this.dynamicScopeFieldColumns.length > 0){
            getModelKey = this.dynamicScopeFieldColumns[lineCount][0].title;
          }
          getFistValue = modelObject[key].fieldLines[0].firstFieldValues[0].field_value;
          console.log("Field/model value: ", getFistValue, " :: ", getModelKey);
          if(getModelKey != '' && getFistValue > 0){
            modelObject[key].fieldLines[0][getModelKey] = getFistValue;
          }
        }
        lineCount++;
      }
      //console.log("@Final Model column: ", model);
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
    //console.log('Model assign...');
  }

  selectChange(event){
    //console.log('Change Event: ', event);
  }
  //Dynamic Scope binding ----  Abhishek @Navsoft

  getFieldTooltip(modelValue, modelObj){
    ////console.log("Tooltip data value: ", modelValue, " :: ", modelObj);
    if(modelValue != undefined && modelObj.length > 0){
        let findText = modelObj.find(rec => rec.field_value === modelValue);
        ////console.log('Text value: ', findText);
        if(typeof findText === 'object' && findText.value != ''){
          ////console.log('Value find: ', findText.value);
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
    console.log("Total line: ", lineData, " - ", lineIndex, " == ", lineData.length);
    if(lineData != undefined && lineData.length > 0){
      lineIndex  = lineData.length;
    }

    for(var key in this.dynamicScopeModel){
        console.log("Key: ", key , " :: ", this.dynamicScopeModel[key]);
        let getValue: any = 0;
        //if( key === secName ){
          if(this.dynamicScopeModel.fieldLines != undefined){
            let fieldValues = this.dynamicScopeModel.fieldLines[0].firstFieldValues;
            
            console.log("Fieldvalues:: ", fieldValues);
            line['firstFieldValues'] = fieldValues;
            this.dynamicScopeModel.fieldLines.push(line);
            if(fieldValues.length > 0 && typeof fieldValues[0] === "object" && fieldValues[0].field_value != undefined){
              getValue = fieldValues[0].field_value;
            }
            ////console.log('Calling on change...', getValue, " -- ", secName, " Lineindex: ", lineIndex);
            
            this.dynamicScopeFieldColumns.forEach((recCol, keyCol) => {
              ////console.log(" > >>   ", keyCol)
              if(keyCol === 0){
                let getModelKey = recCol[0].title;
                console.log(" >>>>> ",getModelKey, " --- FindValue:  ", getValue, " --- ");
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
    console.log("Add Line status: ", this.dynamicScopeModel);
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
      //console.log(this.inspectionBodyData)
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
    ////console.log("Model Tooltip: ", modelValue, " --- ", modelObject);
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
     console.log("scroll to find...");
     let invalidFields: any[] = [];
      // let findField =  document.querySelector('div .ng-invalid');
      // this.scrollToPos(findField);
      // const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      //   "div .ng-invalid"
      // );  
      // console.log("scroll to postion...", firstInvalidControl);
      // firstInvalidControl.focus();  
      let getForm = theForm.form.controls;
      //console.log(getForm);
      var key;
      for(key in getForm){
         //console.log(key, " => ", getForm[key].status)
         if(getForm[key].status === 'INVALID' && getForm[key].errors.required === true){
           invalidFields.push({control: getForm[key], name: key});
         }
      }

      if(invalidFields.length > 0){
          let findElement = invalidFields.find(rec => rec.name === 'audit_date');
           console.log("find elem: ", findElement, " :: ",findElement.control);
           if(findElement.control != undefined){
            const el = document.getElementById('audit_date');
            console.log("@Elem: ",el);
            if(el){
              el.scrollIntoView(true);    //arguement true bypass the non-exist element or undefined
            }
            // let elem = document.getElementById('audit_date');
            // console.log("#Elem: ", elem);
            // elem.scrollIntoView();
            ////findElement.control.focus();
          }
      }
      console.log('model inputs: ', this.inspectionBodyForm);
      console.log('invalid inputs: ', invalidFields);
      
   }
   scrollToPos(el: Element){
    console.log("scroll to postion...", el);
    if(el) { 
      el.scrollIntoView({ behavior: 'smooth' });
     }
   }

   validateFile(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      if(type == undefined){
        this.step1DataBodyFormFile.append('trade_license',fileEvent.target.files[0]);
      }if(type != undefined){
        this.step7DataBodyFormFile.append(type,fileEvent.target.files[0]);
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

  onSubmitUndertakingApplicant(ngForm6: any, type?: boolean){
    // Object.keys(this.authorizationList).forEach(key => {
    //   if(this.authorizationList[key]==false){
    //     this.authorizationStatus = false;
    //   }
    // })

    for(let key in this.authorizationList) {
      if(this.authorizationList[key] == false) {
        this.authorizationStatus = false;
      }else {
        this.authorizationStatus = true;
      }
    }
    
    for(let key in this.recommend) {
      if(this.recommend[key] == true) {
        this.recommendStatus = true;
      }
    }
    if(this.authorizationStatus == false){
      this.isSubmit = false;
      this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }else if(this.recommendStatus != true){
      this.isSubmit = false;
      this.toastr.error('Please Check any recommend the visit ', '');
    }
    this.inspectionBodyForm = {};
      this.inspectionBodyForm.step6 = {};
      //this.inspectionBodyForm.email = this.userEmail;
      //this.inspectionBodyForm.userType = this.userType;
      this.step6Data.authorizationList = this.authorizationList;
      this.step6Data.recommend = this.recommend;

      console.log("@@@Step6 Data: ", this.step6Data);
      this.inspectionBodyForm.step6 = this.step6Data;
      this.inspectionBodyForm.step6.email = this.userEmail;
      this.inspectionBodyForm.step6.userType = this.userType;
      this.inspectionBodyForm.step6.application_id = this.formApplicationId;

      console.log(">>>Step6 Data: ", this.inspectionBodyForm);

    if(ngForm6.form.valid && type == undefined){

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

      console.log(">>>Step6 Data: ", this.inspectionBodyForm);
      //return;
      this.inspectionBodyForm.step6.is_draft = false;
      //this.step6DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      // setTimeout(() => {
      //   this.toastr.success("Please wait paypal", '');
      // }, 500)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.inspectionBodyForm)
      // .subscribe(
      //   res => {
      //     console.log(res,'res')
      //     if(res['status'] == true) {
      //       this.toastr.success(res['msg'], '');
      //       this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });

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
      let custPrice: any = 520;
      this.total = 520;
        this.transactionsItem['item_list']['items'].push({name: 'Inspection Body Application', quantity: 1, price: custPrice, currency: 'USD'});
          if(this.total > 0){
            //console.log("Calculate price: ", calcPrice);
            this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
            this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
            this.transactions.push(this.transactionsItem);
            //console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
          }
          setTimeout(() => {
            this.createPaymentButton(this.transactionsItem, this.inspectionBodyForm, this);
            let elem = document.getElementsByClassName('paypal-button-logo');
            console.log("button creting...");
            if(elem){
              console.log("button creted...");
              
            }
          }, 100)

      //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step6.is_draft = true;
      this.toastr.success('Application Successfully Submitted', '');
          setTimeout(()=> {
            this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          }, 2000)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      // .subscribe(
      // res => {
      //   console.log(res,'res')
      //   if(res['status'] == true) {
      //     this.toastr.success(res['msg'], '');
      //     setTimeout(()=> {
      //       this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //     }, 2000)
      //     //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
      //   }else{
      //     this.toastr.warning(res['msg'], '');
      //   }
      // });
      }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }    
  }

  //Step FORM Action
  onSubmitApplication(ngForm1: any, type?:boolean){
    // console.log("Step Application submit...", " -- ", ngForm.form);
    //  if(!ngForm.form.valid){
    //   this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    //  }else{
    //   this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    // }
    
    console.log("Submit calling: ", ngForm1, " -- ", type);
    //return;
    
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
    let scopeValues: any =[];
    let scopeIds:any =[];
    let scopeSelValues:any =[];
    console.log("dynamic ", this.dynamicScopeModel, " -- ", this.dynamicScopeFieldColumns);
    var key = '';
    var key2 = '';
    let resultAr: any={};
    let scopeCollections: any={};
    scopeCollections['scope_heading'] = {};
    scopeCollections['scope_value'] = [];

    this.dynamicScopeFieldColumns.forEach((item,key) => {
        //console.log(item);
        let keyIds = item[0].idVal;
        let name = item[0].name;
        //console.log("...", name);
        let tempObj = {};
       tempObj[keyIds] = name;
        //console.log("...", tempObj);
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
    console.log(">>> build scope: ", scopeCollections);
    //return;


    for(key in this.dynamicScopeModel){
        if(key == 'fieldLines'){
          this.dynamicScopeModel.fieldLines.forEach((rec,key1) => {
                console.log(rec, " -- ", key);
                //resultAr[key1] = [];
                scopeIds = [];
                scopeSelValues = [];
                if(typeof rec === 'object'){
                  for(key2 in rec){
                      
                      let selectVal;
                      let selectId;
                      
                      let getDataValues = this.dynamicScopeFieldColumns.find(item => item[0].values == key2)
                      let getSelectValues = this.dynamicScopeFieldColumns.find(item => item[0].title == key2)
                      if(getDataValues){
                        let fdata: any = getDataValues[0];                        
                        if(fdata.values == key2){
                          selectId = fdata.idVal;//rec[key2][0].id;
                          scopeIds.push({id: selectId})
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

                      console.log("scope aa: ", key2, " -- ", selectVal, " -- ", selectId);

                  }
                }
                resultAr[key1] = [];
                
                for(var k=0; k<scopeIds.length; k++){
                  let idKey = scopeIds[k].id;
                  let valueKey = scopeSelValues[k].value;
                  let tempObj = {};
                  tempObj[idKey] = valueKey;
                  resultAr[key1].push({id: idKey, value: valueKey});
               }
               //resultAr[key1] = tempObj;
               console.log('scope object: ', " -- ", resultAr);
          })
        }
    }
    
    if(scopeCollections){
      let resultTempAr: any ={};
      let tempObj: any = {};
      let rstAr: any=[];
      var p;
      for(p in resultAr){
        console.log(p, " -- ", resultAr[p])
        //resultTempAr[p] = [];
        if(resultAr[p].length){
          resultAr[p].forEach(item =>{
            tempObj = {};
              //tempObj[item.id] = item.value;
              resultTempAr[item.id] = item.value;
              //resultTempAr[p].push(tempObj);
          })
        }
        rstAr.push(resultTempAr);
      }
      console.log('<<>>>> ', resultTempAr, " -- ", rstAr);
      scopeCollections['scope_value'] = rstAr;
    }


    // }
    console.log("@selected scope values: ", scopeIds, " =-- ", scopeSelValues);
    console.log("#Scope result: ", resultAr, " -- ", scopeCollections);
    // this.dynamicScopeModel.forEach(rec => {
    //      if(rec.fieldLines){
    //       console.log("field rows: ", rec.fieldLines);
    //      }
    // })
    if(scopeCollections != undefined){
      this.inspectionBodyForm.step1['scope_heading'] = scopeCollections['scope_heading'];
      this.inspectionBodyForm.step1['scope_value'] = scopeCollections['scope_value'];
    }
    console.log(">> submit: ", this.inspectionBodyForm);
    //return;

    if(ngForm1.form.valid && this.tradeLicensedValidation != false) {
      
      //this.inspectionBodyForm.email = this.userEmail;
      //this.inspectionBodyForm.userType = this.userType;
      // this.inspectionBodyForm.step1 = this.step1Data;      

      // this.inspectionBodyForm.step1['ownOrgBasicInfo'] = [];
      // this.inspectionBodyForm.step1['ownOrgMembInfo'] = [];
      // this.inspectionBodyForm.step1['accreditationInfo'] = [];
      
      // if(this.ownOrgBasicInfo) {
      //   this.inspectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      // }
      // if(this.ownOrgMembInfo) {
      //   this.inspectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      // }
      // if(this.accreditationInfo) {
      //   this.inspectionBodyForm.step1['accreditationInfo'] = this.accreditationInfo;
      // }
      console.log(">>> First Step Data: ", this.inspectionBodyForm);
      //return;
      this.inspectionBodyForm.step1['trade_license'] = this.step1DataBodyFormFile;
      this.inspectionBodyForm.step1.is_draft = false;
      //this.step1DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
          this.toastr.success('Application Successfully Submitted', '');
          setTimeout(()=> {
            this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
          }, 1000)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      // .subscribe(
      //   res => {
      //     console.log(res,'res')
      //     if(res['status'] == true) {
      //       this.toastr.success(res['msg'],);
      //       this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });
    }else if(ngForm1.form.valid && this.tradeLicensedValidation == false) {
      this.file_validation = false;
      this.toastr.warning('Please Fill required field','');
    }else if(!ngForm1.form.valid && type != undefined && type == true){
        console.log("save a draft...");
        this.inspectionBodyForm.step1.is_draft = true;
        if(this.step1DataBodyFormFile != undefined){
          this.inspectionBodyForm.step1['trade_license'] = this.step1DataBodyFormFile;
        }        
        console.log(">>> Save a draft First Step Data: ", this.inspectionBodyForm);
        this.toastr.success("Record saved successfully");
        setTimeout(()=> {
          this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
        },2000) 
        //this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
        // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
        // .subscribe(
        //   res => {
        //     console.log(res,'res')
        //     if(res['status'] == true) {
        //       this.toastr.success(res['msg'],);
        //       this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
        //     }else{
        //       this.toastr.warning(res['msg'], '');
        //     }
        //   });
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
    
    if(this.ownOrgBasicInfo) {
      this.inspectionBodyForm.step2['proficiencyTesting'] = this.proficiencyTesting;
    }

    console.log("@Step2 submit...", this.inspectionBodyForm);

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
      console.log(">>>step2 data: ", this.inspectionBodyForm);
      //return;
      this.inspectionBodyForm.step2.is_draft = false;
      //this.step2DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
          this.toastr.success('Application Successfully Submitted', '');
          setTimeout(()=> {
            this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
          }, 1000)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      // .subscribe(
      //   res => {
      //     console.log(res,'res')
      //     if(res['status'] == true) {
      //       this.toastr.success(res['msg'], '');
      //       this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step2.is_draft = true;
      console.log('save draft....1');
          this.toastr.success('Application Successfully Submitted', '');
          setTimeout(()=> {
            this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          }, 1000)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      // .subscribe(
      //   res => {
      //     console.log(res,'res')
      //     if(res['status'] == true) {
      //       this.toastr.success(res['msg'], '');
      //       console.log('save draft....2');
      //       setTimeout(()=> {
      //         this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //       },2000) 
      //       //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });
    }
    else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitPersonalInformation(ngForm3: any, type?: boolean){
    // console.log("Step PersonalInformation submit...");
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

      console.log('>>> ', this.inspectionBodyForm);
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

      console.log(">>> Step3 post: ", this.inspectionBodyForm);
      //return;

      this.inspectionBodyForm.step3.is_draft = false;
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.toastr.success('Application Successfully Submitted', '');
          setTimeout(()=> {
            this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
          }, 1000)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      // .subscribe(
      //   res => {
      //     console.log(res,'res')
      //     if(res['status'] == true) {
      //       this.toastr.success(res['msg'], '');
      //       this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });
    }else if( type != undefined && type == true){
      this.inspectionBodyForm.step3.is_draft = true;
      this.toastr.success('Application Successfully Submitted', '');
          setTimeout(()=> {
            this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
          }, 1000)
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      // .subscribe(
      // res => {
      //   console.log(res,'res')
      //   if(res['status'] == true) {
      //     this.toastr.success(res['msg'], '');
      //     setTimeout(()=> {
      //       this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //     },2000)          
      //     //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
      //   }else{
      //     this.toastr.warning(res['msg'], '');
      //   }
      // });
      }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitInformationAuditManagement(ngForm4: any, type?:boolean){
  //   console.log("Step InformationAuditManagement submit...");   
    //this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
    this.inspectionBodyForm = {};
      this.inspectionBodyForm.step4 = {};
      console.log(">>> step4 data: ", this.step4Data);
      this.step4Data['audit_date'] = (this.step4Data.audit_date != '') ? this.step4Data.audit_date : null;
      this.step4Data['mrm_date'] = (this.step4Data.mrm_date != undefined) ? this.step4Data.mrm_date : null;

      this.inspectionBodyForm.step4 = this.step4Data; 
      this.inspectionBodyForm.step4.email = this.userEmail;
      this.inspectionBodyForm.step4.application_id = this.formApplicationId;
      this.inspectionBodyForm.step4.userType = this.userType;

      console.log(">>> step4 data: ", this.inspectionBodyForm);
    if(ngForm4.form.valid && type == undefined) {
      // this.inspectionBodyForm = {};
      // this.inspectionBodyForm.step4 = {};

      // this.inspectionBodyForm.step4 = this.step4Data; 
      // this.inspectionBodyForm.step4.email = this.userEmail;
      // this.inspectionBodyForm.step4.userType = this.userType;

      
      //return;
      this.inspectionBodyForm.step4.is_draft = false;
      //this.step4DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step4.is_draft = true;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success(res['msg'], '');
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
  
  onSubmitPerlimVisit(ngForm5: any, type?:boolean){
    // console.log("Step PerlimVisit submit...", ngForm.form);    
    //this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step5 = {};

    console.log("@@@@Step5 data: ", this.step5Data);
    this.step5Data.is_perlim_visit = (this.step5Data.perlim_visit_val) ? true : false;
    let dtFormat = '';
    if(this.step5Data.perlim_visit_select_date != undefined && this.step5Data.perlim_visit_select_date._i != undefined){
      var dtData = this.step5Data.perlim_visit_select_date._i;
      var year = dtData.year;
      var month = dtData.month;
      var date = dtData.date;
    }
    //let dtData = this.step5Data.perlim_visit_select_date._i;
    //let year = dtData.year;
    //let month = dtData.month;
    //let date = dtData.date;
    dtFormat = year + "-" + month + "-" + date;
    console.log("date format: ", dtFormat, " -- ", dtData);
    this.step5Data['perlim_visit_date'] = (this.step5Data.perlim_visit_select_date != undefined) ? dtFormat : null;
    this.step5Data['perlim_visit_time'] = (this.step5Data.perlim_visit_select_time != undefined) ? this.step5Data.perlim_visit_select_time : null;

    this.inspectionBodyForm.step5 = this.step5Data;
    this.inspectionBodyForm.step5.email = this.userEmail;
    this.inspectionBodyForm.step5.application_id = this.formApplicationId;
    this.inspectionBodyForm.step5.userType = this.userType;

    console.log(">>> Step5 data: ", this.inspectionBodyForm);

    if(ngForm5.form.valid && type == undefined) {
      // this.inspectionBodyForm = {};
      // this.inspectionBodyForm.step5 = {};
      // this.step5Data.is_perlim_visit = (this.step5Data.perlim_visit_val) ? true : false;
      // this.inspectionBodyForm.step5 = this.step5Data;
      // this.inspectionBodyForm.step5.email = this.userEmail;
      // this.inspectionBodyForm.step5.userType = this.userType;

      
      this.inspectionBodyForm.step5.is_draft = false;
      //this.step5DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(type != undefined && type == true){
      this.inspectionBodyForm.step5.is_draft = true;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success(res['msg'], '');
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

onSubmitPaymentInformation(ngForm7: any, type?: boolean){
    console.log("payment submitting.....");
    this.inspectionBodyForm = {};
    this.inspectionBodyForm.step7 = {};
    //!ngForm7.form.valid &&
    if(ngForm7.form.valid && this.paymentReceiptValidation != false) {
      this.inspectionBodyForm.step7.payment_receipt = this.step7DataBodyFormFile;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        console.log(res,'res')
        if(res['status'] == true) {
          this.toastr.success(res['msg'], '');
          //this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
        }else{
          this.toastr.warning(res['msg'], '');
        }
      });
    }else if(type != undefined && type == true && this.paymentReceiptValidation != false){
      this.inspectionBodyForm.step7.is_draft = true;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.inspectionBodyForm)
      .subscribe(
      res => {
        console.log(res,'res')
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
    // console.log(this.step1Data,'step1Data');
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
      
    console.log(this.inspectionBodyForm,'step1DraftDataBodyFormFile')

    this.step1DraftDataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DraftDataBodyFormFile)
    .subscribe(
      res => {
        console.log(res,'res')
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
    //console.log(this.inspectionBodyForm);
    //this.is_bod = !this.is_bod || typeof this.is_bod == 'undefined' ? "0" : ""+this.is_bod+"";

    //this.scrollToError(ngForm);
    //return false;

    this.inspectionBodyForm.is_bod = !this.is_bod || typeof this.is_bod == 'undefined' ? "0" : ""+this.is_bod+"";
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
    //console.log('>>>>>>');
    //console.log(this.inspectionBodyForm.authorization_confirm1);

    // if(this.checkSecurity == true)
    // {
    //   this.checkCaptchaValidation = true;
    // }else{
    //   this.checkCaptchaValidation = false;
    // }
    ////console.log("Check Error Required: ", this.scrollToError(ngForm.form));
    
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
        ////console.log('Element pos: ', elmnt);
        elmnt.scrollIntoView();
      }
    }

    getErrorScroll(formData)
    {
      const firstStep = document.querySelector('#firstStep');
      const ownOrgBasicInfos = document.querySelector('#ownOrgBasicInfos');
      const is_bod_complete = document.querySelector('#is_bod_complete');
      const is_hold_other_accreditations = document.querySelector('#is_hold_other_accreditations');
      
      //console.log(formData);
      if(!formData.trade_license_name || !formData.date_of_issue || !formData.date_of_expiry || !formData.date_of_establishment || !formData.search_location_name || !formData.official_commercial_name || !formData.accredation_type_id || !formData.criteria_request || !formData.physical_location_address || !formData.mailing_address || !formData.po_box || !formData.country_id || !formData.city || !formData.telephone || !formData.fax_no || !formData.official_email || formData.trade_license_name =='' || formData.date_of_issue =='' || formData.date_of_expiry =='' || formData.date_of_establishment =='' || formData.search_location_name =='' || formData.official_commercial_name =='' || formData.accredation_type_id =='' || formData.criteria_request =='' || formData.physical_location_address =='' || formData.mailing_address =='' || formData.po_box =='' || formData.country_id =='' || formData.city =='' || formData.telephone =='' || formData.fax_no =='' || formData.official_email =='' || formData.official_website =='')
      {
          firstStep.scrollIntoView({ behavior: 'smooth' });
      }
      else if(this.inspectionBodyForm.is_bod == '1')
      {
        Object.keys(this.inspectionBodyForm.organizationMemberInfo).forEach(key => {
          // if(key['name'] == ''){
          // }
          //console.log(this.inspectionBodyForm.organizationMemberInfo[key].name,'Keysssssss');
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
          ////console.log(this.inspectionBodyForm.organizationBasicInfo[key].name,'Keysssssss');
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
              // //console.log(res['features']);
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

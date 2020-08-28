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
  public authorizationStatus: boolean = false;
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
  dynamicScopeModel:any[]         = [];   //Master form data object
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
  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  step4DataBodyFormFile:any = new FormData();
  step5DataBodyFormFile:any = new FormData();
  step6DataBodyFormFile:any = new FormData();
  step7DataBodyFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  isCompleteness:any;
  profileComplete:any;
  today = new Date();

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
      this.toastr.success('Payment Success, Please upload payment receipt, Thank you.','Paypal>>',{timeOut:5500});
      this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
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

  onChangeScopeOption(getValues: any, secIndex: number, lineIndex: number, columnIndex: number, secName: string, type?:string) {
      //console.log('@GET Options: ', getValues, " :: ", secIndex, " :: ", lineIndex, " -- ", type, " -- ", columnIndex);
      let selectValue: number;
      if(type === undefined){
        selectValue = getValues.value;
      }
      if(type !== undefined && type === 'initLoad'){
        selectValue = getValues;
      }

      this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,{'value_id' : selectValue})
      .subscribe(
        record => {
            //console.log("SErvice Data: ", record, " -- ", record['scopeValue'].length);
            //get through array find key column
            if(record['scopeValue'].length == undefined){
              record['scopeValue'] = [];
            }
            let theColumnIndex  = columnIndex;
            let nextColumnIndex = theColumnIndex + 1;
            let totSecColumn    = this.dynamicScopeFieldColumns[secIndex].length;
            if(nextColumnIndex > 0 && nextColumnIndex < totSecColumn){
                //Get ridge of the values
                ////console.log("field columns: ", this.dynamicScopeFieldColumns, " :: ");
                this.dynamicScopeModel[secName].fieldLines[lineIndex][this.dynamicScopeFieldColumns[secIndex][nextColumnIndex].values] = record['scopeValue'];
            }
            //console.log("@@@Updated Model Values: ", this.dynamicScopeModel, " :: ", record['scopeValue'].length);
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
      {
      title:'payment', desc:'7. Payment Information', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
      }
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
      // console.log(record,'record');
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
    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,authorization_confirm3:false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false};


  }

  getCriteria(value){
    //console.log("select Criteris: ", value);
    if(value != undefined && value > 0){
       //Get fullscope
       let apiURL = this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.criteriaIdByScope + value;
       //console.log("API: ", apiURL);

       this.fullScope = [];
       this.dynamicScopeModel = [];
       this.dynamicScopeFieldColumns = [];

       this.Service.get(apiURL,'').subscribe(record => {
            //console.log('Fullscope: ', record);
            let dataScope:any = [];
            let fieldTitleValue: any = [];
            dataScope = record;
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
                  //console.log('null bababab');
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
                //if(key >=0 && key<=7){
                    
                //}
          })
          //set default value
          //Load first field value default by selecting first item
          this.loadDefaultColumnValues(this.dynamicScopeModel);

        }
        //console.log(">>>> ", this.dynamicScopeModel, " --- ", this.dynamicScopeFieldColumns);
       })
    }
  }

  loadData(){
    this.Service.get(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,'')
    .subscribe(
      res => {
        //console.log("@@@@ ", res);
        this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
        this.countryList = res['allCountry'];
        this.labTypeList = res['allLabtype'];
        //this.fullScope   = res['fullScope'];
        this.criteriaMaster = res['criteriaMaster'];


        Object.keys(res['scopeValue']).forEach(key => {

          this.inspectionBodyData[this.rowCount]=[];
          this.inspectionBodyData[this.rowCount].field1  = res['scopeValue'][key].values;
          this.medicalLabFirstData      = res['scopeValue'][key].values;
          //this.dynamicFirstFieldValues  = res['scopeValue'][key].values;
        });

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
      ////console.log("### Setting default values: ", modelObject, " --- ", typeof(modelObject), " === ", this.dynamicScopeFieldColumns);
      var lineCount = 0;
      let getModelKey = '';
      let getFistValue = 0;
      for(var key in modelObject){
          ////console.log(key," ----- ", modelObject[key]);
        if(modelObject[key].fieldLines[0].firstFieldValues.length > 0){
          ////console.log(">>> Firstfieldvalues: ", key , modelObject[key].fieldLines[0].firstFieldValues);
          if(this.dynamicScopeFieldColumns.length > 0){
            getModelKey = this.dynamicScopeFieldColumns[lineCount][0].title;
          }
          getFistValue = modelObject[key].fieldLines[0].firstFieldValues[0].field_value;
          ////console.log("Field/model value: ", getFistValue, " :: ", getModelKey);
          if(getModelKey != '' && getFistValue > 0){
            modelObject[key].fieldLines[0][getModelKey] = getFistValue;
          }
        }
        lineCount++;
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

  
  addScopeLine(secName:any, secIndex: number, lineIndex: number, lineData: any){
    let line     =   {};    
    ////console.log("Total line: ", lineData, " - ", lineIndex, " == ", lineData.length);
    if(lineData != undefined && lineData.length > 0){
      lineIndex  = lineData.length;
    }

    for(var key in this.dynamicScopeModel){
        ////console.log("Key: ", key , " :: ", this.dynamicScopeModel[key]);
        let getValue: any = 0;
        if( key === secName ){
          if(this.dynamicScopeModel[key].fieldLines != undefined){
            let fieldValues = this.dynamicScopeModel[key].fieldLines[0].firstFieldValues;
            ////console.log("Fieldvalues:: ", fieldValues);
            line['firstFieldValues'] = fieldValues;
            this.dynamicScopeModel[key].fieldLines.push(line);
            if(fieldValues.length > 0 && typeof fieldValues[0] === "object" && fieldValues[0].field_value != undefined){
              getValue = fieldValues[0].field_value;
            }
            ////console.log('Calling on change...', getValue, " -- ", secName, " Lineindex: ", lineIndex);
            this.dynamicScopeFieldColumns.forEach((recCol, keyCol) => {
              ////console.log(" > >>   ", keyCol)
              if(keyCol === 0){
                let getModelKey = recCol[0].title;
                ////console.log(getModelKey, " --- FindValue:  ", getValue, " --- ", this.dynamicScopeModel[secName]);
                if(getValue != undefined && getValue > 0){
                  this.dynamicScopeModel[secName].fieldLines[lineIndex][getModelKey] = getValue;
                }
                this.onChangeScopeOption(getValue,secIndex,lineIndex,0,secName,'initLoad');
              }
            });
          }
        }
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

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }

  onSubmitUndertakingApplicant(ngForm: any){
    console.log("Step UndertakingApplicant submit...");
    if(!ngForm.form.valid){

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
            this.createPaymentButton(this.transactionsItem, this.inspectionBodyForm, this);
            let elem = document.getElementsByClassName('paypal-button-logo');
            console.log("button creting...");
            if(elem){
              console.log("button creted...");
              
            }
          }, 100)

      //this.Service.moveSteps('undertaking_applicant', 'payment', this.headerSteps);
    }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }    
  }

  //Step FORM Action
  onSubmitApplication(ngForm1: any){
    // console.log("Step Application submit...", " -- ", ngForm.form);
    //  if(!ngForm.form.valid){
    //   this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
    //  }else{
    //   this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    // }
    this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);

    if(ngForm1.form.valid && this.tradeLicensedValidation != false) {
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
      

      this.step1DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
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
    }else if(ngForm1.form.valid && this.tradeLicensedValidation == false) {
      this.file_validation = false;
      this.toastr.warning('Please Fill required field','');
    }
    else {
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitTestingParticipation(ngForm2: any){
    this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
    // console.log("Step TestingParticipation submit...", " -- ", ngForm.form);
    //  if(!ngForm.form.valid){
    //   this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
    //  }else{
    //   this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    // } 
    if(ngForm2.form.valid) {
      this.inspectionBodyForm = {};
      this.inspectionBodyForm.step2 = {};
      this.inspectionBodyForm.email = this.userEmail;
      this.inspectionBodyForm.userType = this.userType;
      this.inspectionBodyForm.step2 = this.step2Data;

      this.inspectionBodyForm.step2['proficiencyTesting'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.inspectionBodyForm.step2['proficiencyTesting'] = this.proficiencyTesting;
      }

      this.step2DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('profciency_testing_participation', 'personal_information', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitPersonalInformation(ngForm3: any){
    // console.log("Step PersonalInformation submit...");
    //  if(!ngForm.form.valid){
    //   this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
    //  }else{
    //   this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    // }
    this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
    if(ngForm3.form.valid) {
      this.inspectionBodyForm = {};
      this.inspectionBodyForm.step3 = {};
      this.inspectionBodyForm.email = this.userEmail;
      this.inspectionBodyForm.userType = this.userType;
      this.inspectionBodyForm.step3 = this.step4Data;

      this.step3DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.Service.moveSteps('personal_information', 'information_audit_management', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitInformationAuditManagement(ngForm4: any){
  //   console.log("Step InformationAuditManagement submit...");
  //   if(!ngForm.form.valid){
  //     this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
  //   }else{
  //    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
  //  }     

    if(ngForm4.form.valid) {
      this.inspectionBodyForm = {};
      this.inspectionBodyForm.step4 = {};
      this.inspectionBodyForm.email = this.userEmail;
      this.inspectionBodyForm.userType = this.userType;
      this.inspectionBodyForm.step4 = this.step4Data;

      // this.step4DataBodyFormFile.append('data',JSON.stringify(this.inspectionBodyForm));
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step4DataBodyFormFile)
      // .subscribe(
      //   res => {
      //     console.log(res,'res')
      //     if(res['status'] == true) {
      //       this.toastr.success(res['msg'], '');
      //       this.Service.moveSteps('information_audit_management', 'perlim_visit', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });
    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }
  
  onSubmitPerlimVisit(ngForm: any){
    console.log("Step PerlimVisit submit...", ngForm.form);
    if(!ngForm.form.valid){
      this.Service.moveSteps('perlim_visit', 'undertaking_applicant', this.headerSteps);
    }else{
    this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }     
 }

onSubmitPaymentInformation(ngForm: any){
    console.log("payment submitting.....");
}
   //Step FORM Action


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

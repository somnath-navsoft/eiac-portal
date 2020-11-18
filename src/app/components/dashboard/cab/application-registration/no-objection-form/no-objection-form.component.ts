import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import {FormControl} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-no-objection-form',
  templateUrl: './no-objection-form.component.html',
  styleUrls: ['./no-objection-form.component.scss']
})
export class NoObjectionFormComponent implements OnInit {

  @ViewChild('fileInput' , {static: true}) fileInput;
  @ViewChild('reCaptcha' , {static: true}) reCaptcha;
  @ViewChild('fruitInput' , {static: true}) fruitInput: ElementRef<HTMLInputElement>;

  public newRow: any = {};
  //public healthCareForm: any = {};
  public noObjectionForm: any = {};
  public testingLabJson: Array<any> = [];
  public calibrationLabJson: Array<any> = [];
  public instrumentEqipmentJson: Array<any> = [];
  public staffJson: Array<any> = [];
  public inspectionBodyJson: Array<any> = [];
  public medicalLabData:any={}
  public orgMembToggle: boolean = false;
  selectedFood1: string;
  selectedFood2: string;
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public loader:boolean=true;
  public banner:any=[];
  other_description = [false,false,false,false,false];
  public cab_type: Array<any> = [];

  laboratory:string = '';
  inspection_body:string = '';
  certification_body:string = '';
  halal_cab:string = '';
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = true;
  testimony_date:boolean = false;

  public ownOrgBasicInfo: Array<any> = [{}];
  public ownOrgMembInfo: Array<any> = [{}];

  step1Data: any ={};
  step2Data: any ={};
  step3Data: any ={};
  step4Data: any ={};
  step5Data: any ={};
  step6Data: any ={};
  step7Data: any ={};
  step8Data: any ={};

  noObjectionBodyForm: any = {};
  isFormSubmitted: boolean = false;
  formApplicationId: number = 0;
  voucherFile:any = new FormData();
  voucherSentData: any = {};
  paymentReceiptValidation: boolean = false;


  searchCountryLists: any[] =[];
  llCityByCountry: any = [];
  getCountryLists:any;
  onbehalf_representative_date:boolean = false;
  paymentStepComp: boolean = false;
  selectTradeLicName: any;
  selectTradeLicPath: any;
  allStateList: Array<any> = [];
  allCityList: Array<any> = [];

  userEmail:any;
  userType:any;
  urlVal : any;
  userId: any;
  headerSteps: any[] = [];

  //Stepwise input declaration
  //STEP 2
  cabTypeLaboratory: any;
  cabTypeInspectionBody: any;
  cabTypeCertificationBody: any;
  cabTypeHalal: any;

  //STEP 3
  testingLabCheckboxes: any[] = [];
  testingLabCheckItemOthers:boolean = false;
  testingLabCheckItemOtherInput: any;
  testingLabInfo: any[] = [{}];
  calibrationLabCheckboxes: any[] = [];
  calibrationLabCheckItemOthers:boolean = false;
  calibrationLabInfo: any[] = [{}];

  certificationBodiesCheckboxesFirst: any[] = [];
  certificationBodiesCheckItemOthersFirst:boolean = false;
  certificationBodiesCheckboxesSecond: any[] = [];
  certificationBodiesCheckItemOthersSecond:boolean = false;
  certificationBodiesInfo: any[] = [{}];
  certificationBodiesCheckboxesForProducts: boolean = false;
  certificationBodiesCheckboxesForPersons: boolean = false;
  certificationBodiesCheckboxesForInspection: boolean = false;
  halalCabCheckboxes: any[] = [];
  halalCabCheckItemOthers: boolean = false;

  //STEP 4


  //Add multiple input items
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredFruits: Observable<string[]>;
  users: string[] = [];
  userItems: any;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() { 
    //this.meta.addTag({name: 'title', content: 'Angular Project, Create Angular Project'});
    //this.loadFormDynamicTable();
    this.urlVal = this.Service.getValue() != '' ? this.Service.getValue() : '';
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');

    console.log(">>> URL value: ", this.urlVal);
    this.loadCountryStateCity();
    this.loadAppInfo();

    //Step initializer
    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
      },
      {
      title:'cab_information', desc:'2. CAB Information', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
      },
      {
      title:'list_service_scope', desc:'3. List Of Services Scope', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'list_instrument_equipment', desc:'4. List of Indtrument & Equipments', activeStep:false, stepComp:false, icon:'icon-task', activeClass:''
      },
      {
        title:'list_staff', desc:'5. List of Staff', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
      },
      {
      title:'authorization_application', desc:'6. Authorization of the Application', activeStep:false, stepComp:false, icon:'icon-paper', activeClass:''
      },
      {
      title:'proforma_invoice', desc:'7. Proforma Invoice', activeStep:false, stepComp:false, icon:'icon-work', activeClass:''
      },
      {
        title:'payment_update', desc:'8. Payment Update', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
      },
      {
        title:'application_complete', desc:'9. Application Complete', activeStep:false, stepComp:false, icon:'icon-paper', activeClass:''
      },
    );
      
    
    //Step wise checkboxes
    //STEP 3
    this.testingLabCheckboxes.push({
      name: "Construction Materials",
      checked: false,
      label: "Construction Materials"
    },
    {
      name: "Environmental",
      checked: false,
      label: "Environmental"
    },
    {
      name: "Food",
      checked: false,
      label: "Food"
    },
    {
      name: "Geo Technical Investigation",
      checked: false,
      label: "Geo Technical Investigation"
    },
    {
      name: "Precious Metals",
      checked: false,
      label: "Precious Metals"
    },
    {
      name: "Petroleum and Petrochemical",
      checked: false,
      label: "Petroleum and Petrochemical"
    },
    {
      name: "Electrical Appliances",
      checked: false,
      label: "Electrical Appliances"
    },
    {
      name: "Metalurgical",
      checked: false,
      label: "Metalurgical"
    },
    {
      name: "Textile",
      checked: false,
      label: "Textile"
    });


  }

  //Table row Add/Remove
  addRow(theObj: any){
    let newRow: any ={};
    theObj.push(newRow);
  }
  removeRow(theObj: any, index: number){
    theObj.splice(index, 1);
  }


  checkItemClick(theEvt: any, type: string){
    switch(type){

      case 'testing_lab':
        if(theEvt.checked){
          this.testingLabCheckItemOthers = false;
        }
      break;

      default:
      break;

    }

  }
  checkOthersItemClick(theEvt: any, type: string){
    switch(type){

      case 'testing_lab':
        if(theEvt.checked){
          this.testingLabCheckboxes.forEach(item => {
            if(item.checked){
              item.checked = false;
            }
          }) 
        }
      break;

      default:
      break;

    }
  }

  //Add /REmove multiple items
  //Ref link - https://material.angular.io/components/chips/examples
  addUser(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if(this.users.length >=5){
        this.toastr.warning("Maximum users(5) exceeds.");
        return;
    }
    // Add our fruit
    if ((value || '').trim()) {
      this.users.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  removeUser(user: string): void {
    const index = this.users.indexOf(user);
    if(this.users.length == 1){
      this.toastr.warning("At least one user required.");
      return;
    }
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
  //Add /REmove multiple items

  validateFileVoucher(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf', 'PDF'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.paymentReceiptValidation = true;
        this.voucherFile.append('payment_receipt',fileEvent.target.files[0]);
    }else{
      //////console.log("...voucher file...3: ", ex_check);
        this.paymentReceiptValidation = false;
        
    }
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
    let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    this.Service.getwithoutData(url)
    .subscribe(
      res => {
        let getData: any = res;
        let data: any;
        //, getData.data.step1, " -- ", getData.data.step2
        console.log(getData,"Profile info >>> ");
        //return;
  
        if(getData.data.step1 && getData.data.step1.length){
            data = getData.data['step1'][0];
            ///////console.log('data enter...1', data);
  
  
          var step2 = getData.data['step2'];
  
          //var stateList =  this.Service.getState();
          var cityList =  this.Service.getCity();
          if(data.trade_license != ''){
            let getFile = data.trade_license.toString().split('/');
            if(getFile.length){
              this.selectTradeLicName = getFile[4].toString().split('.')[0];
              this.selectTradeLicPath = this.constant.mediaPath +  data.trade_license.toString();
            }
          }
          this.step1Data.country = data.country;
                if(this.getCountryLists.length){
                  let cdata: any = this.getCountryLists.find(rec => rec.name == data.country)
                    console.log("Fnd country: ", cdata);  
                    if(cdata){
                      let cid = cdata.id;
                      this.statelistById(cid) 
                    }
                }
                cityList.subscribe( result => {
                  for(let key in result['cities']) {
                    ////console.log(">> cities: ", result['cities'][key]);
                    if(result['cities'][key]['name'] == data.city )
                     {
                      this.allCityList.push(result['cities'][key]);
                    }
                  }
                });
          this.step1Data.city =  data.city;
          this.step1Data.country = data.country;
          this.step1Data.state = data.state;
          this.step1Data.date_of_establishment = new Date(data.date_of_establisment);
          this.step1Data.date_of_expiry = new Date(data.date_of_expiry);
          this.step1Data.date_of_issue = new Date(data.date_of_issue);
          this.step1Data.fax_no = data.applicant_fax_no;
          this.step1Data.is_bod = step2['cabBodData'] != '' ? "1" : "0";
          this.step1Data.mailing_address = data.mailing_address;// data.applicant_address;
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
            /*
            if(res['data'].id && res['data'].id != '') {
                let pathData: any;
                let filePath: string;
                let getData: any = res;
                let saveStep: number;
  
                sessionStorage.setItem("userData", JSON.stringify(getData));
                
                if(!this.Service.isObjectEmpty(getData.data.paymentDetails)){
                  if(getData.data.paymentDetails.voucher_invoice != undefined && getData.data.paymentDetails.voucher_invoice != ''){
                    filePath = this.constant.mediaPath + '/media/' + getData.data.paymentDetails.voucher_invoice;
                    pathData = this.getSantizeUrl(filePath);
                    this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
                  }
                }
        
                //check steps
                // if(getData.data.is_draft){
                //   saveStep = parseInt(getData.data.saved_step) - 1;
                // }else{
                //   if(parseInt(getData.data.saved_step) == 9){
                //     saveStep = parseInt(getData.data.saved_step) - 1;
                //   }else{
                //   saveStep = parseInt(getData.data.saved_step);
                //   }
                // }
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
  
                var cityList =  this.Service.getCity();
  
                this.step1Data.country = getData.data.country;
                ////console.log(">>> country data: ", this.getCountryLists);
                if(this.getCountryLists.length){
                  ////console.log(">>> 11c country data: ", this.getCountryLists);
                  let cdata: any = this.getCountryLists.find(rec => rec.name == getData.data.country)
                    console.log("Fnd country: ", cdata);  
                    if(cdata){
                      let cid = cdata.id;
                      this.statelistById(cid) 
                    }
                }
                cityList.subscribe( result => {
                  for(let key in result['cities']) {
                    ////console.log(">> cities: ", result['cities'][key]);
                    if(result['cities'][key]['name'] == getData.data.city )
                     {
                      this.allCityList.push(result['cities'][key]);
                    }
                  }
                });
                this.step1Data.state = getData.data.state;  
        
                this.step1Data.city = getData.data.city;
                
                if(res['data'].saved_step  != null){
                  ///////console.log("@saved step assign....");
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
                  if(getData.data.accredation_criteria == 2){
                      let stepData: any = this.headerSteps.find(item => item.title == 'information_audit_management');
                      console.log(">>step select: 1 ", stepData);
                      if(stepData){
                        stepData.activeClass = '';
                        stepData.stepComp = true;
                      }
                  }
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
                
  
                // if(res['data'].otherAccr != undefined && res['data'].otherAccr.length > 0){
                //   ////console.log('>>>Accr infor: ', getData.data.otherAccr);
                //   this.accreditationInfo = [];
                //   this.step1Data.is_hold_other_accreditation_select = "1";
                //   //this.accreditationInfo = '';
                //   res['data'].otherAccr.forEach((item, key) => {
                //       //////console.log('>> ', item, " :: ", key);
                //       let data: any;
                //       data = item['value'];
                //       var obj1 = data.replace(/'/g, "\"");
                //       let jparse = JSON.parse(obj1);
                //       this.accreditationInfo.push(jparse);
                //   })
                // }else{
                //   //this.accreditationInfo = [{}];
                //   this.step1Data.is_hold_other_accreditation_select = "0";
                // }
  
                //step2

                // var ptProvider = res['data']['ptParticipation'];
                // this.proficiencyTesting = ptProvider && ptProvider != '' ? ptProvider : [{}];
  
                // //step3
                // if(res['data'].technicalManager != undefined && res['data'].technicalManager.length > 0){
                //   let getTechData: any = res['data'].technicalManager[0];
                //   this.step3Data.name = getTechData.name;
                //   this.step3Data.designation = getTechData.designation;
                //   this.step3Data.mobile_no = getTechData.mobile_no;
                //   this.step3Data.email = getTechData.email;
                //   this.step3Data.relevent_experience = getTechData.relevent_experience;
                // }
                // if(res['data'].managementManager != undefined && res['data'].managementManager.length > 0){
                //   let getMangData: any = res['data'].managementManager[0];
                //   this.step3Data.management_name = getMangData.name;
                //   this.step3Data.management_designation = getMangData.designation;
                //   this.step3Data.management_mobile_no = getMangData.mobile_no;
                //   this.step3Data.management_email = getMangData.email;
                //   this.step3Data.management_relevent_experience = getMangData.relevent_experience;
                // }
  
                //step4
                // if(res['data'].audit_date != null){
                //   //console.log(">>> audit data...", res['data'].audit_date);
                //   this.step4Data.audit_date = new Date(res['data'].audit_date);
                // }
                // if(res['data'].mrm_date != null){
                //   //console.log(">>> mRM data...", res['data'].mrm_date);
                //   this.step4Data.mrm_date = new Date(res['data'].mrm_date);
                // }
  
                //step 5
                if(res['data'].scopeDetails != undefined && !this.Service.isObjectEmpty(res['data'].scopeDetails)){
                  //console.log(">>> ", res['data'].scopeDetails);
                  //let jsonStrting = '{"18":{"scope_heading":{"43":"Inspection Category","45":"Inspection field","47":"Range of inspection","49":"Stage of the inspection","51":"Inspection criteria","53":"Inspection Activity Type"},"scope_value":[{"43":"Product","45":"Mechanical Engineering of Lifting Equipment","47":"Lever hoist","49":"In-service","51":"BS EN 13157","53":"A"},{"43":"Product","45":"Mechanical, Electrical and Structural Engineering of Lifting Equipment","47":"Mobile crane","49":"In-service","51":"BS 7121-2-1,BS 7121-2-3","53":"B,C"},{"43":"Product","45":"Mechanical Engineering of Lifting Equipment – Earth Moving","47":"Backhoe Loader","49":"In-service","51":"BS EN 474-4","53":"A,B"}]},"105":{"scope_heading":{"55":"Inspection Category","57":"Inspection field","59":"Range of inspection","61":"Stage of the inspection","63":"Inspection criteria","65":"Inspection Activity Type"},"scope_value":[{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Hook","61":"In-service","63":"Welcome","65":"Hello"},{"55":"Product","57":"Mechanical Engineering of Lifting Accessories","59":"Chain sling","61":"In-service","63":"bbb","65":"aaa"}]}}';
                  //let jsonStrting = getData.data.scopeDetails.toString();
                  
                }
  
  
                //Step 6
                // if(res['data'].is_prelim_visit != null){
                //   //this.step6Data.is_prelim_visit = (res['data'].is_prelim_visit) ? "1" : "0";
                //   this.step6Data.prelim_visit_val = (getData.data.is_prelim_visit) ? "1" : "0";
  
                //   this.step6Data.prelim_visit_date = res['data'].prelim_visit_date;
                //   this.step6Data.prelim_visit_time = res['data'].prelim_visit_time;
                // }

                //Step 7
                if(res['data'].onBehalfApplicantDetails && res['data'].onBehalfApplicantDetails != null && res['data'].onBehalfApplicantDetails != undefined){
                  let getAuthData = res['data'].onBehalfApplicantDetails;
                  ////console.log(">>> Auth data: ", getAuthData);
                  // this.step7Data.organization_name        = getAuthData.organization_name;
                  // this.step7Data.representative_name      = getAuthData.representative_name;
                  // this.step7Data.designation              = getAuthData.designation;
                  // this.step7Data.digital_signature        = getAuthData.digital_signature;
                  // this.step7Data.application_date         = getAuthData.application_date;
  
                  // Object.keys(this.authorizationList).forEach( key => { 
                  //   this.authorizationList[key] = true;
                  // })
                  // this.authorizationStatus = true;
                  // this.readReviewChecklist= true;
                  //let visitRecomm = getData.data.recommend_visit.toString().replace(/["']/g, "");
                  //this.step7Data.recommend_visit = visitRecomm;//'second';
              //      this.step7Data.recommend_year = parseInt(getData.data.recommend_year);
              //      this.recomendVisit.forEach((item, index) => {
              //       //let replace:  any = getData.data.recommend_visit.replaceAll("\\", "");
              //       //console.log(">>> replace: ", getData.data.recommend_visit, " :: ", replace);
              //       let cpjson: any = getData.data.recommend_visit ;//'{"first": false, "second": true, "third": false, "fourth": true}';
  
              //       let findVsit: any = JSON.parse(cpjson); 
              //       console.log(">>> ", findVsit);
              //       for(let key in findVsit){
              //          if(key === item.name){
              //            console.log(">>>> found: ", item, " == ", findVsit[key]);
              //            item.checked = findVsit[key];
              //          }
              //       }
              // })
              // console.log("@recommend visit: ", this.recomendVisit, " -- ", getData.data.recommend_visit);
              // this.step7Data.recommend_visit = this.recomendVisit;//(getData.data.recommend_visit);
  
              //      let authList: any;
              //     authList = getData.data.authorization_list;
              //     console.log("@ Auth checked status: ", authList);
              //     this.authorizationList = JSON.parse(authList);
              //     console.log("# Auth checked status: ", this.authorizationList);
  
              //     //check read ters check
              //     if(this.authorizationList.authorization_confirm2){
              //       this.readTermsCond       = true;
              //     }
              //     //check review checklist checked
              //     if(this.authorizationList.undertaking_confirm2){
              //       this.readReviewChecklist       = true;
              //     }
              //   }
  
                //Step 9
                // if(res['data'].paymentDetails != null && typeof res['data'].paymentDetails === 'object'){
                //   console.log(">>>payment details...show ", res['data'].paymentDetails);
                //     this.voucherSentData.voucher_code     = res['data'].paymentDetails.voucher_no;
                //     this.voucherSentData.payment_date     = new Date(res['data'].paymentDetails.voucher_date);
                //     this.voucherSentData.amount           = res['data'].paymentDetails.amount;
  
                //     this.voucherSentData.transaction_no   = (res['data'].paymentDetails.transaction_no != 'null') ? res['data'].paymentDetails.transaction_no : '';
                //     this.voucherSentData.payment_method   = (res['data'].paymentDetails.payment_method != 'null') ? res['data'].paymentDetails.payment_method : '';
                //     this.voucherSentData.payment_made_by  = (res['data'].paymentDetails.payment_made_by != 'null') ? res['data'].paymentDetails.payment_made_by : '';
                //     this.voucherSentData.mobile_no        = (res['data'].paymentDetails.mobile_no != 'null') ? res['data'].paymentDetails.mobile_no : '';
  
                //     this.paymentFile = res['data'].paymentDetails.payment_receipt && res['data'].paymentDetails.payment_receipt != null ? this.constant.mediaPath+'/media/'+res['data'].paymentDetails.payment_receipt : '';
                //     if(this.paymentFile != undefined && this.paymentFile != ''){
                //       this.paymentReceiptValidation = true;
                //     }  
                // }
              }
          
          
            
            }
            */
          
            });
      }
  
      // this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,  undertaking_confirmTop3: false,undertaking_confirm1:false,
      //                           undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,
      //                           undertaking_confirm6:false,undertaking_confirm7:false};
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
  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  loadFormDynamicTable(){
    this.testingLabJson  =   [{}];
    this.inspectionBodyJson  =   [{}];
    this.calibrationLabJson  =   [{}];
    this.instrumentEqipmentJson  =   [{}];
    this.staffJson =  [{}];
    this.cab_type =  [{}];
    
    this.noObjectionForm.testingLabJson          = this.testingLabJson;
    this.noObjectionForm.inspectionBodyJson          = this.inspectionBodyJson;
    this.noObjectionForm.calibrationLabJson            = this.calibrationLabJson;
    this.noObjectionForm.instrumentEqipmentJson      = this.instrumentEqipmentJson;
    this.noObjectionForm.staffJson            = this.staffJson;
    this.authorizationList = {authorization_confirm1:false};

    //this.noObjectionForm.cab_type            = this.noObjectionForm.laboratory;

  }
  //organizationArray
  addRow1(obj: any = [],type?: string){
    if(type != '' && type != undefined){
      //console.log('1st')
      let getIndex    =   obj.findIndex(rec => rec.type == type);
      this.newRow     =   {};
      obj[getIndex].data.push(this.newRow);
    }
    if(type === '' || type == undefined){
      //console.log('2nd')
      this.newRow     =   {};
      obj.push(this.newRow);
    }
      
    return true;
  }
  removeRow1(obj: any, index: number, type?:string){

    if(type === '' || type == undefined){
      obj.splice(index, 1);
    }    
    return true;
  }


  /*******************************
   * 
   * Application Submit Functions
   * 
   * 
   ********************************/

  onSubmitApplicationInformation(theForm: any, type?: any){
    //this.Service.moveSteps('application_information', 'cab_information', this.headerSteps);


    if(theForm.form.valid && type == undefined){
      this.noObjectionBodyForm = {};      
      this.noObjectionBodyForm.saved_step = 1;      
      this.noObjectionBodyForm.step1 = this.step1Data;
      this.noObjectionBodyForm.step1['ownOrgBasicInfo'] = [];
      this.noObjectionBodyForm.step1['ownOrgMembInfo'] = [];
      if(this.ownOrgBasicInfo) {
        this.noObjectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if((this.ownOrgMembInfo)) {
        this.noObjectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      if(this.formApplicationId > 0){
        this.noObjectionBodyForm.step1.application_id = this.formApplicationId;
      }
      this.noObjectionBodyForm.step1.is_draft = false;
      console.log(">> Submit Form: ", this.step1Data, " -- ", this.noObjectionBodyForm);

      this.Service.moveSteps('application_information', 'cab_information', this.headerSteps);

      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.noObjectionBodyForm)
      // .subscribe(
      //   res => {
      //     ////////console.log(res,'Step1 Submit...')
      //     if(res['status'] == true) {
      //       let data: any = {};
      //       //this.isApplicationSubmitted = false;
      //        data = res;
      //       if(data.application_id != undefined && data.application_id > 0){
      //         this.formApplicationId = data.application_id;
      //       }
      //       //this.toastr.success(res['msg'],);
      //       this.Service.moveSteps('application_information', 'profciency_testing_participation', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });

    }else if(type != undefined && type == true){
      this.noObjectionBodyForm = {};
      this.noObjectionBodyForm.saved_step = 1;      
      this.noObjectionBodyForm.step1 = this.step1Data;
      this.noObjectionBodyForm.step1.is_draft = true;
      console.log(">> Submit Save draft: ", this.step1Data, " -- ", this.noObjectionBodyForm);

    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }

  }

  onSubmitCabInformation(theForm: any, type?: any){
    //this.Service.moveSteps('cab_information', 'list_service_scope', this.headerSteps);
    this.isFormSubmitted = true;
    if(theForm.form.valid && type == undefined){
      this.noObjectionBodyForm = {};      
      this.noObjectionBodyForm.saved_step = 2;      
      this.noObjectionBodyForm.step2 = this.step2Data;
      this.noObjectionBodyForm.step2.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step2.is_draft = false;
      console.log(">> Submit Form: ", this.step1Data, " -- ", this.noObjectionBodyForm);

      this.Service.moveSteps('cab_information', 'list_service_scope', this.headerSteps);
      // this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.noObjectionBodyForm)
      // .subscribe(
      //   res => {
      //     if(res['status'] == true) {
      //       let data: any = {};
      //       this.isFormSubmitted = false;
      //        data = res;               
      //       //this.toastr.success(res['msg'],);
      //       this.Service.moveSteps('cab_information', 'list_service_scope', this.headerSteps);
      //     }else{
      //       this.toastr.warning(res['msg'], '');
      //     }
      //   });

    }else if(type != undefined && type == true){
      this.noObjectionBodyForm = {};
      this.noObjectionBodyForm.saved_step = 2;      
      this.noObjectionBodyForm.step2 = this.step2Data;
      this.noObjectionBodyForm.step2.is_draft = true;
      console.log(">> Submit Save draft: ", this.step1Data, " -- ", this.noObjectionBodyForm);

    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
    
  }

  onSubmitListServiceScope(theForm: any, type?: any){
    this.Service.moveSteps('list_service_scope', 'list_instrument_equipment', this.headerSteps);
  }

  onSubmitListInstrumentEquipment(theForm: any, type?: any){
    this.Service.moveSteps('list_instrument_equipment', 'list_staff', this.headerSteps);
  }

  onSubmitListStaff(theForm: any, type?: any){
    this.Service.moveSteps('list_staff', 'authorization_application', this.headerSteps);
  }

  onSubmitAuthorizeApplication(theForm: any, type?: any){
    this.Service.moveSteps('authorization_application', 'proforma_invoice', this.headerSteps);
  }

  onSubmitProformaInvoice(theForm: any, type?: any){
    this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
  }

  onSubmitPaymentUpdate(theForm: any, type?: any){
    this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);
  }



/*
  onSubmit(ngForm){
    ////console.log(this.noObjectionForm.cab_type);
    this.authorizationStatus = true;
    this.isSubmit = true;
    Object.keys(this.authorizationList).forEach(key => {
      if(this.authorizationList[key]==false){
        this.authorizationStatus = false;
      }
    })
    if(!this.authorizationStatus){
      this.isSubmit = false;
      this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    if(!this.Service.checkInput('email',this.noObjectionForm.email_address)){
      this.isSubmit = false;
      //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    if(this.checkSecurity == true)
    {
      this.checkCaptchaValidation = true;
    }else{
      this.checkCaptchaValidation = false;
    }
    if(ngForm.form.valid && this.isSubmit)
    {
        this.Obj.laboratory = ((this.noObjectionForm.laboratory != '') ?  this.noObjectionForm.laboratory : '');
        this.Obj.inspection_body = ((this.noObjectionForm.inspection_body != '') ?  this.noObjectionForm.inspection_body : '');
        this.Obj.certification_body = ((this.noObjectionForm.for_certification_body != '') ?  this.noObjectionForm.for_certification_body : '');
        this.Obj.halal_cab = ((this.noObjectionForm.halal_cab != '') ?  this.noObjectionForm.halal_cab : '');
        this.noObjectionForm.cab_type = this.Obj;
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.noObjectionForm)
        .subscribe(
          res => {
          ////console.log(res)
          if(res['status']==true){
            this.toastr.success(res['msg'], '');
            this.router.navigateByUrl('/application-form/service/no_objection_certificate');
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

  cabType(value)
  {
    if(value == "testing_laboratory" || value == "calibration_laboratory")
    {
      this.laboratory = value;
    }
    if(value == "inspection_body")
    {
      this.inspection_body = value;
    }
    if(value == "certification_body")
    {
      this.certification_body = value;
    }
    if(value == "halal_cab")
    {
      this.halal_cab = value;
    }
  }
  */

}

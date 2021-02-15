import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import {FormControl} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
import { TrainerService } from '../../../../../services/trainer.service';


declare let paypal: any; 
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
  paymentFile: any;


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
  calibrationLabCheckItemOtherInput: any;

  certificationBodiesCheckboxesFirst: any[] = [];
  certificationBodiesCheckItemOthersFirst:boolean = false;
  certificationBodiesCheckItemOthersFirstInput: any;

  certificationBodiesCheckboxesSecond: any[] = [];
  certificationBodiesCheckItemOthersSecond:boolean = false;
  certificationBodiesCheckItemOthersSecondInput: any;
  certificationBodiesInfo: any[] = [{}];
  certificationBodiesCheckboxesForProducts: boolean = false;
  certificationBodiesCheckboxesForPersons: boolean = false;
  certificationBodiesCheckboxesForInspection: boolean = false;
  halalCabCheckboxes: any[] = [];
  halalCabCheckItemOthers: boolean = false;
  halalCabCheckItemOthersInput: any;

  entryTestingLab: boolean      = false;
  entryCalibrationLab: boolean  = false;
  entryInspection: boolean      = false;
  entryHalal: boolean           = false;


  //STEP 4
  listOfIntEquip: any[] = [{}];
  //Step 5
  listOfStaff: any[]    = [{}];


  //Add multiple input items
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredFruits: Observable<string[]>;
  users: string[] = [];
  userItems: any;

  paymentFilePath: string = '';
  transactions: any[] =[];
  transactionsItem: any={};
  total: any = 0;

  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  public errorLoader: boolean = false;
  closeResult: string;
  modalOptions:NgbModalOptions;
  paypalSandboxToken: string = '';
  paymentMode: string = '';

  showHideCBSec: boolean = false;
  
  constructor(public Service: AppService, public constant:Constants, public sanitizer: DomSanitizer , public router: Router,
    public toastr: ToastrService, private modalService: NgbModal, private _trainerService: TrainerService,) { }

  ngOnInit() { 
    //this.meta.addTag({name: 'title', content: 'Angular Project, Create Angular Project'});
    //this.loadFormDynamicTable();
    this.urlVal = this.Service.getValue() != '' ? this.Service.getValue() : '';
    this.userEmail = localStorage.getItem('email');
    this.userType = localStorage.getItem('type');
    this.userId = localStorage.getItem('userId');

    this.step2Data.cabTypeLaboratory_testing = false;
    this.step2Data.cabTypeLaboratory_calibration = false;
    this.step2Data.cabTypeInspectionBody_engineering_ib = false;
    this.step2Data.cabTypeInspectionBody_sustainability_ib = false;
    this.step2Data.cabTypeCertificationBody_management_system_cb = false;
    this.step2Data.cabTypeCertificationBody_personal_cb = false;
    this.step2Data.cabTypeCertificationBody_product_cb = false;
    this.step2Data.cabTypeHalal_lab =false;
    this.step2Data.cabTypeHalal_ib = false;
    this.step2Data.cabTypeHalal_cb = false;

    console.log(">>> URL value: ", this.urlVal);
    this.loadCountryStateCity();
    this.loadAppInfo();

    this.step6Data.authorization_confirm1 = false;

    //Step initializer
    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Applicant Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
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

    this.calibrationLabCheckboxes.push({
      name: "Density",
      checked: false,
      label: "Density"
    },
    {
      name: "Chemical",
      checked: false,
      label: "Chemical"
    },
    {
      name: "Electrical",
      checked: false,
      label: "Electrical"
    },    
    {
      name: "Flow",
      checked: false,
      label: "Flow"
    },
    {
      name: "Fiber Optics",
      checked: false,
      label: "Fiber Optics"
    },
    {
      name: "Hardness",
      checked: false,
      label: "Hardness"
    },
    {
      name: "Mass",
      checked: false,
      label: "Mass"
    },
    {
      name: "Radiological",
      checked: false,
      label: "Radiological"
    },
    {
      name: "Pressure",
      checked: false,
      label: "Pressure"
    },
    {
      name: "Temperature",
      checked: false,
      label: "Temperature"
    },
    {
      name: "Ultrasonic",
      checked: false,
      label: "Ultrasonic"
    },
    {
      name: "Torque",
      checked: false,
      label: "Torque"
    },
    {
      name: "Viscosity",
      checked: false,
      label: "Viscosity"
    },
    {
      name: "Acoustic",
      checked: false,
      label: "Acoustic"
    },
    {
      name: "Accelerometer",
      checked: false,
      label: "Accelerometer"
    },
    {
      name: "Dimesional",
      checked: false,
      label: "Dimesional"
    },
    {
      name: "Force",
      checked: false,
      label: "Force"
    },
    {
      name: "Optical",
      checked: false,
      label: "Optical"
    },
    {
      name: "Volume",
      checked: false,
      label: "Volume"
    },
    {
      name: "Humidity",
      checked: false,
      label: "Humidity"
    });

    this.certificationBodiesCheckboxesFirst.push({
      name: "ISO 9001",
      checked: false,
      label: "ISO 9001"
    },
    {
      name: "ISO 22000",
      checked: false,
      label: "ISO 22000"
    },
    {
      name: "ISO 14001",
      checked: false,
      label: "ISO 14001"
    },
    {
      name: "OHSAS 18001",
      checked: false,
      label: "OHSAS 18001"
    },
    {
      name: "HACCP",
      checked: false,
      label: "HACCP"
    })

    this.certificationBodiesCheckboxesSecond.push({
      name: "Lifting Equipment Inspection",
      checked: false,
      label: "Lifting Equipment Inspection"
    },
    {
      name: "Pressure Equipment Inspection",
      checked: false,
      label: "Pressure Equipment Inspection"
    },
    {
      name: "Lifting Accessories Inspection",
      checked: false,
      label: "Lifting Accessories Inspection"
    },
    {
      name: "Non Destructive Testing",
      checked: false,
      label: "Non Destructive Testing"
    },
    {
      name: "Sustanability Inspection",
      checked: false,
      label: "Sustanability Inspection"
    })
  
    this.halalCabCheckboxes.push({
      name: "Lab",
      checked: false,
      label: "Lab"
    },
    {
      name: "IB",
      checked: false,
      label: "IB"
    },
    {
      name: "CB",
      checked: false,
      label: "CB"
    }
    )
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
      case 'calibration_lab':
        let checkCount: number = 0;
        if(theEvt.checked){
          console.log("#check...");
          this.calibrationLabCheckItemOthers = false;
          this.calibrationLabCheckboxes.forEach(item => {
            if(item.checked){
              checkCount++;
            }
          })          
        }else{
          console.log("@uncheck...");
          this.calibrationLabCheckboxes.forEach(item => {
            if(item.checked){
              checkCount++;
            }
          })
        }
        console.log(">>>Count check: ", checkCount);
        if(checkCount > 0){
          //this.showHideCBSec = true;
        }
        if(checkCount == 0){
          //this.showHideCBSec = false;
        }
      break;
      case 'certification_body_first':
        if(theEvt.checked){
          this.certificationBodiesCheckItemOthersFirst = false;
        }
      break;
      case 'certification_body_second':
        if(theEvt.checked){
          this.certificationBodiesCheckItemOthersSecond = false;
        }
      break;
      case 'halal_cab':
        if(theEvt.checked){
          this.halalCabCheckItemOthers = false;
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
      case 'calibration_lab':
        if(theEvt.checked){
          this.calibrationLabCheckboxes.forEach(item => {
            if(item.checked){
              item.checked = false;
            }
          }) 
        }
        if(this.calibrationLabCheckItemOthers){
          //this.showHideCBSec = true;
        }
        if(!this.calibrationLabCheckItemOthers){
          //this.showHideCBSec = false;
        }
      break;
      case 'certification_body_first':
        if(theEvt.checked){
          this.certificationBodiesCheckboxesFirst.forEach(item => {
            if(item.checked){
              item.checked = false;
            }
          }) 
        }
      break;
      case 'certification_body_second':
        if(theEvt.checked){
          this.certificationBodiesCheckboxesSecond.forEach(item => {
            if(item.checked){
              item.checked = false;
            }
          }) 
        }
      break;
      case 'halal_cab':
        if(theEvt.checked){
          this.halalCabCheckboxes.forEach(item => {
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
      console.log(record,'record');
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
                if(this.getCountryLists != undefined && this.getCountryLists.length > 0){
                  let cdata: any = this.getCountryLists.find(rec => rec.name == data.country)
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

          var cabName = data.cab_name.toString();
          // console.log(cabName,'cabName');
          this.step6Data.organization_name  = (cabName != undefined && cabName != null) ? cabName : 'N/A';

          this.step1Data.official_email = data.applicant_email;
          this.step1Data.official_website = data.applicant_website;
          this.ownOrgBasicInfo = step2['cabOwnerData'];
          this.ownOrgMembInfo = step2['cabBodData'];
          this.step1Data.physical_location_address = data.applicant_location;
          this.step1Data.po_box = data.po_box;          
          this.step1Data.telephone = data.applicant_tel_no;
          this.step1Data.trade_license_number = data.trade_license_number;
        }
      }) 
  
      if(this.urlVal && this.urlVal != '') {
  
        this.loader = false;
        let url2 = this.Service.apiServerUrl+"/"+'registration-details-show/'+this.urlVal;
        this.Service.getwithoutData(url2)
        .subscribe(
          res => {
            console.log(res,'urlVal')
            //return;
            this.loader = true;
            
            if(res['data'].id && res['data'].id != '') {
                let pathData: any;
                let filePath: string;
                let getData: any = res;
                let saveStep: number;
  
                localStorage.setItem("userData", JSON.stringify(getData));
                
                if(!this.Service.isObjectEmpty(getData.data.paymentDetails)){
                  if(getData.data.paymentDetails.voucher_invoice != undefined && getData.data.paymentDetails.voucher_invoice != ''){
                    filePath = this.constant.mediaPath + '/media/' + getData.data.paymentDetails.voucher_invoice;
                    pathData = this.getSantizeUrl(filePath);
                    this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
                  }
                }

                getData.data.application_number != null ? localStorage.setItem('application_number',getData.data.application_number) : '';

        
                //check steps
                // if(getData.data.is_draft){
                //   saveStep = parseInt(getData.data.saved_step) - 1;
                // }else{
                //   if(parseInt(getData.data.saved_step) == 9){
                //     saveStep = parseInt(getData.data.saved_step) - 1;
                //   }else{
                //   saveStep = parseInt(getData.data.saved_step);
                //   }
                // if(parseInt(getData.data.saved_step) == 9){
                //   saveStep = parseInt(getData.data.saved_step) - 1;
                //   this.paymentStepComp = true;
                // }else
                // }
                if(getData.data.is_draft){
                  saveStep = parseInt(getData.data.saved_step) - 1;
                }else{
                   if(parseInt(getData.data.saved_step) == 8){
                    saveStep = parseInt(getData.data.saved_step) - 1;
                    this.paymentStepComp = true;
                  }else{
                    saveStep = parseInt(getData.data.saved_step);
                  }
                }
  
                var cityList =  this.Service.getCity();
  
                this.step1Data.country = getData.data.country;
                ////console.log(">>> country data: ", this.getCountryLists);
                if(this.getCountryLists != undefined && this.getCountryLists.length > 0){
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
                 
                  //////console.log("#Step data: ", this.headerSteps);
                }
  
                if(res['data'].id != undefined && res['data'].id > 0){
                  this.formApplicationId = res['data'].id;
                  //this.formDraftsaved = res['data'].is_draft;
                  //this.formAccrStatus = res['data'].accr_status;
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
                console.log("<<< ", getData.data.nocData);
                if(getData.data.nocData != null && getData.data.nocData.cab_type != ''){
                  console.log(">>>Get tyepe.....");
                   let getType: any = JSON.parse((getData.data.nocData.cab_type));
                   console.log(">>>> ", getType);
                   if(typeof getType == 'object'){
                      if(getType.lab != undefined && getType.lab.length > 0){
                        console.log("....lab addding....");
                        this.step2Data.cabTypeLaboratory_testing = getType.lab[0].cabTypeLaboratory_testing;
                        this.step2Data.cabTypeLaboratory_calibration = getType.lab[0].cabTypeLaboratory_calibration;
                      }
                      if(getType.IB != undefined && getType.IB.length > 0){
                        console.log("....IB addding....");
                        this.step2Data.cabTypeInspectionBody_engineering_ib = getType.IB[0].cabTypeInspectionBody_engineering_ib;
                        this.step2Data.cabTypeInspectionBody_sustainability_ib = getType.IB[0].cabTypeInspectionBody_sustainability_ib;
                      }
                      if(getType.CB != undefined && getType.CB.length > 0){
                        console.log("....CB addding....");
                        this.step2Data.cabTypeCertificationBody_management_system_cb = getType.CB[0].cabTypeCertificationBody_management_system_cb;
                        this.step2Data.cabTypeCertificationBody_personal_cb = getType.CB[0].cabTypeCertificationBody_personal_cb;
                        this.step2Data.cabTypeCertificationBody_product_cb = getType.CB[0].cabTypeCertificationBody_product_cb;
                      }
                      if(getType.HCAB != undefined && getType.HCAB.length > 0){
                        console.log("....CB addding....");
                        this.step2Data.cabTypeHalal_lab = getType.HCAB[0].cabTypeHalal_lab;
                        this.step2Data.cabTypeHalal_ib = getType.HCAB[0].cabTypeHalal_ib;
                        this.step2Data.cabTypeHalal_cb = getType.HCAB[0].cabTypeHalal_cb;
                      }
                   }
                }
                
                //Step 3
                if(getData.data.nocTableData != undefined && typeof getData.data.nocTableData == 'object'){
                    let nocData: any = getData.data.nocTableData;

                    if(nocData.testing_lab != undefined && typeof nocData.testing_lab == 'object'){
                      let testingLabCheckboxes: any = nocData.testing_lab.testingLabCheckDetails;
                      console.log(">>>>>Testing Lab ", testingLabCheckboxes, " == ", nocData.testing_lab);
                      if(testingLabCheckboxes.checkItems.length){
                           this.testingLabCheckboxes.forEach(item => {
                              let findText: any = testingLabCheckboxes.checkItems.find(rec => rec.value == item.label);
                              if(findText){
                                item.checked = true;
                              }
                           })
                      }
                      if(testingLabCheckboxes.checkItemsOthers.length){
                        this.testingLabCheckItemOthers = true;
                        this.testingLabCheckItemOtherInput = testingLabCheckboxes.checkItemsOthers[0].value;
                      }
                      if(nocData.testing_lab.testingLabInformation.length){
                        this.testingLabInfo = nocData.testing_lab.testingLabInformation;
                      }
                    }
                    //calibration Lab
                    if(nocData.calibration_lab != undefined && typeof nocData.calibration_lab == 'object'){
                      let calibrationLabCheckboxes: any = nocData.calibration_lab.calibrationLabCheckDetails;
                      console.log(">>>>>calibration Lab ", calibrationLabCheckboxes, " == ", nocData.calibration_lab);
                      let checkCount: number = 0;
                      if(calibrationLabCheckboxes.checkItems.length){
                           this.calibrationLabCheckboxes.forEach(item => {
                              let findText: any = calibrationLabCheckboxes.checkItems.find(rec => rec.value == item.label);
                              if(findText){
                                checkCount++;
                                item.checked = true;
                              }
                           })
                      }
                      if(checkCount > 0){
                        //this.showHideCBSec = true;
                      }
                      if(calibrationLabCheckboxes.checkItemsOthers.length){
                        this.calibrationLabCheckItemOthers = true;
                        this.calibrationLabCheckItemOtherInput = calibrationLabCheckboxes.checkItemsOthers[0].value;
                      }
                      if(nocData.calibration_lab.calibrationLabInformation.length){
                        this.calibrationLabInfo = nocData.calibration_lab.calibrationLabInformation;
                      }
                    }
                    //Certification body
                    if(nocData.cb_management != undefined && typeof nocData.cb_management == 'object'){
                      let certificationBodyCheckboxes: any = nocData.cb_management.certificationCheckDetails;
                      console.log(">>>>>cerrtification ", certificationBodyCheckboxes, " == ", nocData.cb_management);
                      if(certificationBodyCheckboxes.checkItems.length){
                           this.certificationBodiesCheckboxesFirst.forEach(item => {
                              let findText: any = certificationBodyCheckboxes.checkItems.find(rec => rec.value == item.label);
                              if(findText){
                                item.checked = true;
                              }
                           })
                      }
                      if(certificationBodyCheckboxes.checkItemsOthers.length){
                        this.certificationBodiesCheckItemOthersFirst = true;
                        this.certificationBodiesCheckItemOthersFirstInput = certificationBodyCheckboxes.checkItemsOthers[0].value;
                      }
                    }
                    this.step3Data.certificationBodiesCheckboxesForProducts = nocData.cb_product;
                    this.step3Data.certificationBodiesCheckboxesForPersons  = nocData.cb_person;

                    //inspection body
                    if(nocData.inspection_body != undefined && typeof nocData.inspection_body == 'object'){
                      let inspectionCheckboxes: any = nocData.inspection_body.inspectionCheckDetails;
                      console.log(">>>>>Inspection bodies ", inspectionCheckboxes, " == ", nocData.inspection_body);
                      if(inspectionCheckboxes.checkItems.length){
                           this.certificationBodiesCheckboxesSecond.forEach(item => {
                              let findText: any = inspectionCheckboxes.checkItems.find(rec => rec.value == item.label);
                              if(findText){
                                item.checked = true;
                              }
                           })
                      }
                      if(inspectionCheckboxes.checkItemsOthers.length){
                        this.certificationBodiesCheckItemOthersSecond = true;
                        this.certificationBodiesCheckItemOthersSecondInput = inspectionCheckboxes.checkItemsOthers[0].value;
                      }
                      if(nocData.inspection_body.inspectionInfo.length){
                        this.certificationBodiesInfo = nocData.inspection_body.inspectionInfo;
                      }
                    }

                    //Halal Lab
                    if(nocData.halal_lab != undefined && typeof nocData.halal_lab == 'object'){
                      let halalCheckboxes: any = nocData.halal_lab.halalLabCheckDetails;
                      console.log(">>>>>halal Lab ", halalCheckboxes, " == ", nocData.halal_lab);
                      if(halalCheckboxes.checkItems.length){
                           this.halalCabCheckboxes.forEach(item => {
                              let findText: any = halalCheckboxes.checkItems.find(rec => rec.value == item.label);
                              if(findText){
                                item.checked = true;
                              }
                           })
                      }
                      if(halalCheckboxes.checkItemsOthers.length){
                        this.halalCabCheckItemOthers = true;
                        this.halalCabCheckItemOthersInput = halalCheckboxes.checkItemsOthers[0].value;
                      }
                    }

                    if(nocData.listOfIntEquip != undefined && nocData.listOfIntEquip.length >0){
                        this.listOfIntEquip = nocData.listOfIntEquip;
                    }
                    if(nocData.listOfStaff != undefined && nocData.listOfStaff.length >0){
                      this.listOfStaff = nocData.listOfStaff;
                  }
                }
  
  
                //Step 6
                if(res['data'].onBehalfApplicantDetails && res['data'].onBehalfApplicantDetails != null && res['data'].onBehalfApplicantDetails != undefined){
                  let getAuthData = res['data'].onBehalfApplicantDetails;
                  ////console.log(">>> Auth data: ", getAuthData);
                  this.step6Data.organization_name        = getAuthData.organization_name;
                  this.step6Data.representative_name      = getAuthData.representative_name;
                  this.step6Data.behalf_designation       = getAuthData.designation;
                  this.step6Data.digital_signature        = getAuthData.digital_signature;
                  this.step6Data.application_date         = getAuthData.application_date;

                  let authCheck: any = JSON.parse(getData.data.authorization_list);
                  this.step6Data.authorization_confirm1 = authCheck.authorization_confirm1;
  
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
  
                //Step 8
                if(res['data'].paymentDetails != null && typeof res['data'].paymentDetails === 'object'){
                  console.log(">>>payment details...show ", res['data'].paymentDetails);
                    this.voucherSentData.voucher_code     = res['data'].paymentDetails.voucher_no;
                    this.voucherSentData.payment_date     = new Date(res['data'].paymentDetails.voucher_date);
                    this.voucherSentData.amount           = res['data'].paymentDetails.amount;
  
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


  openView(content, type:string) {
    let pathData: any;
    ////console.log(">>>pop up...", content);   
  
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

  closeDialog(){
    this.modalService.dismissAll();
  }

  /*******************************
   * 
   * Application Submit Functions
   * 
   * 
   ********************************/

  onSubmitApplicationInformation(theForm: any, type?: any){
    //this.Service.moveSteps('application_information', 'cab_information', this.headerSteps);

    let postData: any =new FormData();

    this.noObjectionBodyForm = {};
    this.noObjectionBodyForm.step1 = {};
    this.noObjectionBodyForm.step1['ownOrgBasicInfo'] = [];
    this.noObjectionBodyForm.step1['ownOrgMembInfo'] = [];

    if(theForm.form.valid && type == undefined){
      
      this.step1Data.application_number = this.Service.getAppID();
      localStorage.setItem('application_number',this.step1Data.application_number);

      this.noObjectionBodyForm.saved_step = 1; 
      if(this.ownOrgMembInfo.length > 0){
        this.step1Data.is_bod = true;
      }else{
        this.step1Data.is_bod = false;
      }
          
      this.noObjectionBodyForm.step1 = this.step1Data;
     
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

      postData.append("data", JSON.stringify(this.noObjectionBodyForm))

      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          console.log(res,'Step1 Submit...')
          if(res['status'] == true) {
            let data: any = {};
            //this.isApplicationSubmitted = false;
             data = res;
            if(data.id != undefined && data.id > 0){
              this.formApplicationId = data.id;
            }
            //this.toastr.success(res['msg'],);
            this.Service.moveSteps('application_information', 'cab_information', this.headerSteps);
          }else{
            //this.toastr.warning(res['msg'], '');
            this.Service.moveSteps('application_information', 'cab_information', this.headerSteps);
          }
        });

    }else if(type != undefined && type == true){      
      this.noObjectionBodyForm.saved_step = 1;      
      this.noObjectionBodyForm.step1 = this.step1Data;
      if(this.ownOrgBasicInfo) {
        this.noObjectionBodyForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if((this.ownOrgMembInfo)) {
        this.noObjectionBodyForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }
      this.noObjectionBodyForm.step1.is_draft = true;
      console.log(">> Submit Save draft: ", this.step1Data, " -- ", this.noObjectionBodyForm);
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          console.log(res,'Save Draft Submit...')
          if(res['status'] == true) {
            let data: any = {};
             data = res;   
             if(data.id != undefined && data.id > 0){
              this.formApplicationId = data.id;
            }   
            this.toastr.success('Save Draft Successfully: '+this.formApplicationId,);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      this.toastr.warning('Please Fill required field','',{timeOut:5000});
    }

  }

  onSubmitCabInformation(theForm: any, type?: any){
   //this.Service.moveSteps('cab_information', 'list_service_scope', this.headerSteps);
    console.log(">>>>>");
   //return;
   let postData: any =new FormData();
    this.isFormSubmitted = true;
    let checkLaboratory: boolean = true;
    let checkInspection: boolean = true;
    let checkCertification: boolean = true;
    let checkHalal: boolean = true;
    console.log(this.step2Data.cabTypeLaboratory_testing,  " -- ", this.step2Data.cabTypeLaboratory_calibration);
    let cabTypes: any = {};
    cabTypes['lab'] = [];
    cabTypes['IB'] = [];
    cabTypes['CB'] = [];
    cabTypes['HCAB'] = [];
    //Check Laboratory
    if((this.step2Data.cabTypeLaboratory_testing == undefined || this.step2Data.cabTypeLaboratory_testing == false) &&
      (this.step2Data.cabTypeLaboratory_calibration == undefined || this.step2Data.cabTypeLaboratory_calibration == false)){
      checkLaboratory = false;
    }
    //Check Inspection
    if((this.step2Data.cabTypeInspectionBody_engineering_ib == undefined || this.step2Data.cabTypeInspectionBody_engineering_ib == false) &&
      (this.step2Data.cabTypeInspectionBody_sustainability_ib == undefined || this.step2Data.cabTypeInspectionBody_sustainability_ib == false)){
      checkInspection = false;
    }

    //Check Certification
    if((this.step2Data.cabTypeCertificationBody_management_system_cb == undefined || this.step2Data.cabTypeCertificationBody_management_system_cb == false) && 
      (this.step2Data.cabTypeCertificationBody_personal_cb == undefined || this.step2Data.cabTypeCertificationBody_personal_cb == false) && 
      (this.step2Data.cabTypeCertificationBody_product_cb == undefined || this.step2Data.cabTypeCertificationBody_product_cb == false)){
      checkCertification = false;
    }

    //Check Halal
    if((this.step2Data.cabTypeHalal_lab == undefined || this.step2Data.cabTypeHalal_lab == false) &&
      (this.step2Data.cabTypeHalal_ib == undefined || this.step2Data.cabTypeHalal_ib == false) &&
      (this.step2Data.cabTypeHalal_cb == undefined || this.step2Data.cabTypeHalal_cb == false)){
      checkHalal = false;
    }

    cabTypes['lab'].push({
      'cabTypeLaboratory_testing':this.step2Data.cabTypeLaboratory_testing,
      'cabTypeLaboratory_calibration':this.step2Data.cabTypeLaboratory_calibration
    });
    cabTypes['IB'].push({
      'cabTypeInspectionBody_engineering_ib':this.step2Data.cabTypeInspectionBody_engineering_ib,
      'cabTypeInspectionBody_sustainability_ib':this.step2Data.cabTypeInspectionBody_sustainability_ib
    });
    cabTypes['CB'].push({
      'cabTypeCertificationBody_management_system_cb':this.step2Data.cabTypeCertificationBody_management_system_cb,
      'cabTypeCertificationBody_personal_cb':this.step2Data.cabTypeCertificationBody_personal_cb,
      'cabTypeCertificationBody_product_cb':this.step2Data.cabTypeCertificationBody_product_cb,
    });
    cabTypes['HCAB'].push({
      'cabTypeHalal_lab':this.step2Data.cabTypeHalal_lab,
      'cabTypeHalal_ib':this.step2Data.cabTypeHalal_ib,
      'cabTypeHalal_cb':this.step2Data.cabTypeHalal_cb,
    });
    this.step2Data.cab_type = cabTypes;//JSON.stringify(cabTypes);
    console.log(">>>form status: ",theForm.form.valid ," -- ", this.step2Data);

    //return; 

    if((checkLaboratory == true || checkInspection == true || checkCertification == true || checkHalal == true) && type == undefined){
      this.noObjectionBodyForm = {};      
      this.noObjectionBodyForm.saved_step = 2;    
      this.noObjectionBodyForm.step2 = {};  
      this.noObjectionBodyForm.step2 = this.step2Data;
      this.noObjectionBodyForm.step2.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step2.is_draft = false;
      console.log(">> Submit Form: ", " -- ", this.noObjectionBodyForm);
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          console.log(">>>Submit step: ", res);
          if(res['status'] == true) {
            let data: any = {};
            this.isFormSubmitted = false;
             data = res;               
            //this.toastr.success(res['msg'],);
            this.Service.moveSteps('cab_information', 'list_service_scope', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else if(type != undefined && type == true){
      this.noObjectionBodyForm = {};
      this.noObjectionBodyForm.step2 = {};
      this.noObjectionBodyForm.saved_step = 2;        
      this.noObjectionBodyForm.step2 = this.step2Data;
      this.noObjectionBodyForm.step2.application_id = this.formApplicationId; 
      this.noObjectionBodyForm.step2.is_draft = true;
      console.log(">> Submit Save draft: ", this.step2Data, " -- ", this.noObjectionBodyForm);
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          console.log(res,'Save Draft Submit...')
          if(res['status'] == true) {
            let data: any = {};
             data = res;      
            this.toastr.success('Save Draft Successfully',);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      this.toastr.warning('Please Fill required field','',{timeOut:1500});
    }
    
  }

  onSubmitListServiceScope(theForm: any, type?: any){
   //this.Service.moveSteps('list_service_scope', 'list_instrument_equipment', this.headerSteps);



      let scopeCollections: any = {};
      let postData: any = new FormData();
      scopeCollections['testingLab'] = {};
      scopeCollections['calibrationLab'] = {};
      scopeCollections['certificationBodies'] = {};
      scopeCollections['inspectionBodies'] = {};
      scopeCollections['halalCab'] = {};
      let tempObj: any ={};

      //For testing lab checkboxes
      let testingLabCheckCount = 0;
      let testingLabCheckValues: any = {};
      
      testingLabCheckValues['checkItems'] = [];
      testingLabCheckValues['checkItemsOthers'] = [];
      this.testingLabCheckboxes.forEach((item,index) => {
        let tempObj: any ={};
        if(item.checked == true){
          testingLabCheckCount++;
          tempObj['value'] = item.label;
          console.log("@heck items: ", item.label);
          testingLabCheckValues['checkItems'].push(tempObj);
        }
      })
      if(this.testingLabCheckItemOthers){
        if(this.testingLabCheckItemOtherInput != '' && this.testingLabCheckItemOtherInput != undefined){
          testingLabCheckCount++;
          testingLabCheckValues['checkItemsOthers'].push({value: this.testingLabCheckItemOtherInput});
        }            
      }
     // this.step3Data.testingLabCheckDetails = testingLabCheckValues;
      //this.step3Data.testingLabInformation = this.testingLabInfo;
      tempObj['testingLabCheckDetails'] = testingLabCheckValues;
      tempObj['testingLabInformation'] = this.testingLabInfo;
      //scopeCollections['testingLab'] = tempObj;
      this.step3Data.testing_lab = tempObj;


      //For calibration lab checkboxes
      tempObj = {};
      let calibrationLabCheckCount = 0;
      let calibrationLabCheckValues: any = {};
      
      calibrationLabCheckValues['checkItems'] = [];
      calibrationLabCheckValues['checkItemsOthers'] = [];
      this.calibrationLabCheckboxes.forEach((item,index) => {
        let tempObj: any ={};
        if(item.checked == true){
          calibrationLabCheckCount++;
          tempObj['value'] = item.label;
          calibrationLabCheckValues['checkItems'].push(tempObj);
        }
      })
      if(this.calibrationLabCheckItemOthers){
        if(this.calibrationLabCheckItemOtherInput != '' && this.calibrationLabCheckItemOtherInput != undefined){
          calibrationLabCheckCount++;
          calibrationLabCheckValues['checkItemsOthers'].push({value: this.calibrationLabCheckItemOtherInput});
        }            
      }
      tempObj['calibrationLabCheckDetails'] = calibrationLabCheckValues;
      tempObj['calibrationLabInformation'] = this.calibrationLabInfo;

      this.step3Data.calibration_lab = tempObj;

      console.log("@TCL Data: ",this.step3Data.testing_lab, " :: ", this.step3Data.calibration_lab);

      //For certification bodies checkboxes
      let certificationCheckCountFirst = 0;
      let certificationCheckValuesFirst: any = {};
      certificationCheckValuesFirst['checkItems'] = [];
      certificationCheckValuesFirst['checkItemsOthers'] = [];
      this.certificationBodiesCheckboxesFirst.forEach((item,index) => {
        let tempObj: any ={};
      if(item.checked == true){
          certificationCheckCountFirst++;
          tempObj['value'] = item.label;
          certificationCheckValuesFirst['checkItems'].push(tempObj);
        }
      })
      if(this.certificationBodiesCheckItemOthersFirst){
        if(this.certificationBodiesCheckItemOthersFirstInput != '' && this.certificationBodiesCheckItemOthersFirstInput != undefined){
          certificationCheckCountFirst++;
          certificationCheckValuesFirst['checkItemsOthers'].push({value: this.certificationBodiesCheckItemOthersFirstInput});
        }            
      }
      //this.step3Data.certificationCheckDetailsFirst = certificationCheckValuesFirst;
      tempObj = {};
      tempObj['certificationCheckDetails'] = certificationCheckValuesFirst;
      //scopeCollections['certificationBodies'] = tempObj;
      this.step3Data.cb_management = tempObj;
      this.step3Data.cb_product = (this.step3Data.certificationBodiesCheckboxesForProducts == undefined) ? false : this.step3Data.certificationBodiesCheckboxesForProducts;
      this.step3Data.cb_person = (this.step3Data.certificationBodiesCheckboxesForPersons == undefined ) ? false : this.step3Data.certificationBodiesCheckboxesForPersons;

      let certificationCheckCountSecond = 0;
      let certificationCheckValuesSecond: any = {};
      certificationCheckValuesSecond['checkItems'] = [];
      certificationCheckValuesSecond['checkItemsOthers'] = [];
      this.certificationBodiesCheckboxesSecond.forEach((item,index) => {
        let tempObj: any ={};
      if(item.checked == true){
        certificationCheckCountSecond++;
          tempObj['value'] = item.label;
          certificationCheckValuesSecond['checkItems'].push(tempObj);
        }
      })
      if(this.certificationBodiesCheckItemOthersSecond){
        if(this.certificationBodiesCheckItemOthersSecondInput != '' && this.certificationBodiesCheckItemOthersSecondInput != undefined){
          certificationCheckCountSecond++;
          certificationCheckValuesSecond['checkItemsOthers'].push({value: this.certificationBodiesCheckItemOthersSecondInput});
        }            
      }
      //this.step3Data.certificationCheckDetailsSecond = certificationCheckValuesSecond;
      //this.step3Data.certificationInformation = this.certificationBodiesInfo;
      tempObj = {};
      tempObj['inspectionCheckDetails'] = certificationCheckValuesSecond;
      tempObj['inspectionInfo'] = this.certificationBodiesInfo;
      //scopeCollections['inspectionBodies'] = tempObj;
     this.step3Data.inspection_body = tempObj;

     console.log("@IB Data: ",this.step3Data.inspection_body);
    

      //Hall Lab checkboxes
      let halalLabCheckCount = 0;
      let halalLabCheckValues: any = {};
      
      halalLabCheckValues['checkItems'] = [];
      halalLabCheckValues['checkItemsOthers'] = [];
      this.halalCabCheckboxes.forEach((item,index) => {
        let tempObj: any ={};
        if(item.checked == true){
          halalLabCheckCount++;
          tempObj['value'] = item.label;
          halalLabCheckValues['checkItems'].push(tempObj);
        }
      })
      if(this.halalCabCheckItemOthers){
        if(this.halalCabCheckItemOthersInput != '' && this.halalCabCheckItemOthersInput != undefined){
          halalLabCheckCount++;
          halalLabCheckValues['checkItemsOthers'].push({value: this.halalCabCheckItemOthersInput});
        }            
      }
      //this.step3Data.halalLabCheckDetails = halalLabCheckValues;
      tempObj = {};
      tempObj['halalLabCheckDetails'] = halalLabCheckValues;
      //this.step3Data.calibration_lab = tempObj;
      //scopeCollections['halalCab'] = tempObj;
      this.step3Data.halal_lab = tempObj;

      console.log("@HALAL Data: ",this.step3Data.halal_lab);

      /*--------------------------------------
      entryTestingLab: boolean      = false;
      entryCalibrationLab: boolean  = false;
      entryInspection: boolean      = false;
      entryHalal: boolean           = false;
      */

      this.entryTestingLab = false;
      this.entryCalibrationLab = false;
      this.entryInspection = false;
      this.entryHalal = false;


      //Check section entry from scope section
      if(this.step3Data.testing_lab != undefined && typeof this.step3Data.testing_lab == 'object'){
        if(this.step3Data.testing_lab.testingLabCheckDetails.checkItems.length > 0 || 
            this.step3Data.testing_lab.testingLabCheckDetails.checkItemsOthers.length > 0 ||
            (this.step3Data.testing_lab.testingLabInformation.length > 0 && this.Service.isObjectEmpty(this.step3Data.testing_lab.testingLabInformation[0]) == false))
                  { 
                    console.log("TCL..........>") 
                    this.entryTestingLab = true;
                  }
      }
      if(this.step3Data.calibration_lab != undefined && typeof this.step3Data.calibration_lab == 'object'){
        if(this.step3Data.calibration_lab.calibrationLabCheckDetails != undefined && 
          (this.step3Data.calibration_lab.calibrationLabCheckDetails.checkItems.length > 0 || 
            this.step3Data.calibration_lab.calibrationLabCheckDetails.checkItemsOthers.length > 0 ||
            (this.step3Data.calibration_lab.calibrationLabInformation.length > 0 && this.Service.isObjectEmpty(this.step3Data.calibration_lab.calibrationLabInformation[0]) == false ))){ 
            
              console.log("CAL..........>")
            this.entryCalibrationLab = true;
        }
      }
      if(this.step3Data.inspection_body != undefined && typeof this.step3Data.inspection_body == 'object'){
        if(this.step3Data.inspection_body.inspectionCheckDetails != undefined && 
          (this.step3Data.inspection_body.inspectionCheckDetails.checkItems.length > 0 || 
            this.step3Data.inspection_body.inspectionCheckDetails.checkItemsOthers.length > 0 ||
            this.step3Data.inspection_body.inspectionCheckDetails.checkItemsOthers.length > 0 ||
            (this.step3Data.inspection_body.inspectionInfo.length > 0 && this.Service.isObjectEmpty(this.step3Data.inspection_body.inspectionInfo[0]) == false))){  
          this.entryInspection = true;
        }
      }
      if(this.step3Data.halal_lab != undefined && typeof this.step3Data.halal_lab == 'object'){
        if(this.step3Data.halal_lab.halalLabCheckDetails != undefined && 
          (this.step3Data.halal_lab.halalLabCheckDetails.checkItems.length > 0 || 
            this.step3Data.halal_lab.halalLabCheckDetails.checkItemsOthers.length > 0 ||
            this.step3Data.halal_lab.halalLabCheckDetails.checkItemsOthers.length > 0)){  
              this.entryHalal = true;
        }
      }

      //Check section entry from scope section


    if(theForm.form.valid && type == undefined && (testingLabCheckCount > 0 || 
        calibrationLabCheckCount > 0 || certificationCheckCountFirst > 0 || certificationCheckCountSecond > 0 || halalLabCheckCount > 0)){
      this.noObjectionBodyForm = {};      
      this.noObjectionBodyForm.saved_step = 3;
      this.noObjectionBodyForm.step3 = this.step3Data;
      this.noObjectionBodyForm.step3.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step3.is_draft = false;
      console.log(">> Submit Form: ", this.step3Data, " -- ", this.noObjectionBodyForm, " == ", scopeCollections);

      //this.Service.moveSteps('list_service_scope', 'list_instrument_equipment', this.headerSteps);
      //this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.inspection_form_basic_data,this.noObjectionBodyForm)
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          console.log(">>>>POST submit: ", res);
          if(res['status'] == true) {
            let data: any = {};
            //this.isFormSubmitted = false;
             data = res;               
            //this.toastr.success(res['msg'],);
            this.Service.moveSteps('list_service_scope', 'list_instrument_equipment', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else if(type != undefined && type == true){
      this.noObjectionBodyForm = {};
      this.noObjectionBodyForm.saved_step = 3;      
      this.noObjectionBodyForm.step3 = this.step3Data;
      this.noObjectionBodyForm.step3.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step3.is_draft = true;
      
      console.log(">> Submit Save draft: ", this.step3Data, " -- ", this.noObjectionBodyForm);
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          //console.log(res,'Save Draft Submit...')
          if(res['status'] == true) {
            let data: any = {};
             data = res;      
            this.toastr.success('Save Draft Successfully',);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      this.toastr.warning('Please Fill required field','',{timeOut:5000});
    }
  }

  onSubmitListInstrumentEquipment(theForm: any, type?: any){
    //this.Service.moveSteps('list_instrument_equipment', 'list_staff', this.headerSteps);

    let postData: any = new FormData();
    if(theForm.form.valid && type == undefined){
      this.noObjectionBodyForm = {};      
      this.noObjectionBodyForm.saved_step = 4;  

      this.step4Data['listOfIntEquip'] = [];
      if(this.listOfIntEquip != undefined && !this.Service.isObjectEmpty(this.listOfIntEquip)){
        this.step4Data['listOfIntEquip'] = this.listOfIntEquip;
      }    
      this.noObjectionBodyForm.step4 = this.step4Data;
      this.noObjectionBodyForm.step4.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step4.is_draft = false;
      console.log(">> Submit Form: "," -- ", this.noObjectionBodyForm);

      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          if(res['status'] == true) {
            let data: any = {};
             data = res;               
            //this.toastr.success(res['msg'],);
            this.Service.moveSteps('list_instrument_equipment', 'list_staff', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else if(type != undefined && type == true){
      this.noObjectionBodyForm = {};
      this.noObjectionBodyForm.saved_step = 4;      
      this.step4Data['listOfIntEquip'] = [];
      if(this.listOfIntEquip != undefined && !this.Service.isObjectEmpty(this.listOfIntEquip)){
        this.step4Data['listOfIntEquip'] = this.listOfIntEquip;
      }    
      this.noObjectionBodyForm.step4 = this.step4Data;
      this.noObjectionBodyForm.step4.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step4.is_draft = true;
      console.log(">> Submit Save draft: "," -- ", this.noObjectionBodyForm);
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          //console.log(res,'Save Draft Submit...')
          if(res['status'] == true) {
            let data: any = {};
             data = res;      
            this.toastr.success('Save Draft Successfully',);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitListStaff(theForm: any, type?: any){
    //this.Service.moveSteps('list_staff', 'authorization_application', this.headerSteps);

    let postData: any =  new FormData();
    if(theForm.form.valid && type == undefined){
      this.noObjectionBodyForm = {};      
      this.noObjectionBodyForm.saved_step = 5;  

      this.step5Data['listOfStaff'] = [];
      if(this.listOfStaff != undefined && !this.Service.isObjectEmpty(this.listOfStaff)){
        this.step5Data['listOfStaff'] = this.listOfStaff;
      }    
      this.noObjectionBodyForm.step5 = this.step5Data;
      this.noObjectionBodyForm.step5.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step5.is_draft = false;
      console.log(">> Submit Form: "," -- ", this.noObjectionBodyForm);

      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          if(res['status'] == true) {
            let data: any = {};
            //this.isFormSubmitted = false;
             data = res;               
            //this.toastr.success(res['msg'],);
            this.Service.moveSteps('list_staff', 'authorization_application', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else if(type != undefined && type == true){
      this.noObjectionBodyForm = {};
      this.noObjectionBodyForm.saved_step = 5;      
      this.step5Data['listOfStaff'] = [];
      if(this.listOfStaff != undefined && !this.Service.isObjectEmpty(this.listOfStaff)){
        this.step5Data['listOfStaff'] = this.listOfStaff;
      }    
      this.noObjectionBodyForm.step5 = this.step5Data;
      this.noObjectionBodyForm.step5.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step5.is_draft = true;
      console.log(">> Submit Save draft: ", this.step1Data, " -- ", this.noObjectionBodyForm);


      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          //console.log(res,'Save Draft Submit...')
          if(res['status'] == true) {
            let data: any = {};
             data = res;      
            this.toastr.success('Save Draft Successfully',);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmitAuthorizeApplication(theForm: any, type?: any){
    //this.Service.moveSteps('authorization_application', 'proforma_invoice', this.headerSteps);

    let postData: any = new FormData();
    this.noObjectionBodyForm = {}; 
    this.noObjectionBodyForm.step6 = {}; 
    this.step6Data.application_number = localStorage.getItem('application_number');
    console.log(">>>TSEP 6 SUBMIT: ", this.step6Data);
    //this.step6Data.authorization_confirm1 == true

    if(theForm.form.valid && type == undefined && this.step6Data.authorization_confirm1 == true){
      //this.noObjectionBodyForm = {};      
      this.noObjectionBodyForm.saved_step = 6;  
      this.step6Data.authorization_list_json = {'authorization_confirm1' : this.step6Data.authorization_confirm1};
      this.noObjectionBodyForm.step6 = this.step6Data;
      
      this.noObjectionBodyForm.step6.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step6.is_draft = false;
      console.log(">> Submit Form: "," -- ", this.noObjectionBodyForm);
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          if(res['status'] == true) {
            let data: any = {};
            //this.isFormSubmitted = false;
             data = res;               
            //this.toastr.success(res['msg'],);

            if(this.paymentFilePath != ''){
              this.Service.moveSteps('authorization_application', 'proforma_invoice', this.headerSteps);
            }
            else{
              setTimeout(()=>{
                let elem = document.getElementById('openPayDialog');
                //////console.log("App dialog hash....", elem);
                if(elem){
                  elem.click();
                }
              }, 100)
              setTimeout(() => {                    
                // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                //this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);
              },1500)
            }
            //this.Service.moveSteps('authorization_application', 'proforma_invoice', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else if(type != undefined && type == true){ 
      //this.noObjectionBodyForm = {};
      this.noObjectionBodyForm.saved_step = 6;   
      this.step6Data.authorization_list_json = {'authorization_confirm1' : this.step6Data.authorization_confirm1};
      this.noObjectionBodyForm.step6 = this.step6Data;
      this.noObjectionBodyForm.step6.application_id = this.formApplicationId;
      this.noObjectionBodyForm.step6.is_draft = true;
      console.log(">> Submit Save draft: ", " -- ", this.noObjectionBodyForm);
      postData.append("data", JSON.stringify(this.noObjectionBodyForm))
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.noc_submit_form + "/", postData)
      .subscribe(
        res => {
          //console.log(res,'Save Draft Submit...')
          if(res['status'] == true) {
            let data: any = {};
             data = res;      
            this.toastr.success('Save Draft Successfully',);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });

    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
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

  saveInspectopnAfterPayment(theForm: any){
    this.transactions = [];
    this.toastr.success('Payment Success, Thank you.','Paypal>>',{timeOut:2000});
    setTimeout(()=> {
      // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
      //////console.log("moving...");
      this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);
    }, 1000)
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
          sandbox: compObj.paypalSandboxToken
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
          this.toastr.warning("You have cancelled payment, Continue next step please complete payment process again.", 'Paypal>>',{timeOut:6500}); 
  
      },
      onError: err => {
          ////////console.log('OnError', err);
          formObj.paypalReturn = err;
          formObj.paypalStatus = 'error';
          //compObj.saveCourseAfterPayment(formObj);
          this.toastr.error("Paypal transaction error has occured, please try again", 'Payment Return'); 
      },
      onClick: (data, actions) => {
          ////////console.log('onClick', data, actions);
          //this.resetStatus();
      }
      }, '#paypalPayment');
    });
    }
  }


  step_payment(){
    this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);   
  }

  onSubmitProformaInvoice(theForm: any, type?: any){
    //this.Service.moveSteps('proforma_invoice', 'payment_update', this.headerSteps);

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

      //Check payment service to redirect.....
      //Check @UAT - Paypal | @LIVE - Third party redirect
      this._trainerService.checkPaymentGateway() 
      .subscribe(
        result => {
            let data: any = result;
            //console.log(">>> Payment Gateway... ", data);
            if(data.records.status){
              if(data.records.title == 'Live'){
                  this.paymentMode = 'Live';
                  let postData: any = new FormData();
                  postData.append('accreditation', this.formApplicationId);
                  this._trainerService.proformaAccrSave(postData)
                  .subscribe(
                    result => {
                        let record: any = result;
                        if(record.status){
                          //Check step complete service....
                          let getUrl: string = data.records.other_details;
                          //console.log("@@ ", getUrl);
                          //top.location.href = getUrl;
                          this.loaderPdf = true;
                          setTimeout(() => {
                            this.loaderPdf = false;
                            window.open(getUrl);
                          }, 1500)
                        }
                        //console.log(">>> Save resultts: ", result);
                    });                      
              }
              if(data.records.title == 'Sandbox'){
                this.paymentMode = 'Sandbox';
                this.paypalSandboxToken = data.records.value;
                setTimeout(() => {
                  this.createPaymentButton(this.transactionsItem, this.noObjectionBodyForm, this);
                  let elem = document.getElementsByClassName('paypal-button-logo');
                  ////console.log("button creting...", elem);
                  if(elem){
                    ////console.log("button creted...");          
                  }
                }, 100)
              }
            }
        });


      /*setTimeout(() => {
        console.log("Button...........");
        this.createPaymentButton(this.transactionsItem, this.noObjectionBodyForm, this);
        let elem = document.getElementsByClassName('paypal-button-logo');
        console.log("button creting...", elem);
        if(elem){
          ////console.log("button creted...");          
        }
      }, 100)*/

  }

  

  onSubmitPaymentUpdate(theForm: any, type?: any){
    //this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);

    this.noObjectionBodyForm = {};
    this.noObjectionBodyForm.step8 = {};
    let is_valid: boolean = false;

    let dtFormat: string = '';
    // if(this.voucherSentData['payment_date'] != undefined && 
    //   this.voucherSentData['payment_date']._i != undefined){
    //   var dtData = this.voucherSentData['payment_date']._i;
    //   var year = dtData.year;
    //   var month = dtData.month;
    //   var date = dtData.date;
    //   dtFormat = year + "-" + month + "-" + date;
    // }else{
    if(this.voucherSentData['payment_date'] != undefined){
      var nFdate = new Date(this.voucherSentData['payment_date']);
      var nMonth = nFdate.getMonth() + 1;
      var nDate = nFdate.getDate();
      var nYear = nFdate.getFullYear();
      dtFormat = nYear + "-" + nMonth + "-" + nDate;
    }

    console.log(">>> Date: ", dtFormat, " -- ", this.voucherSentData);

      var applicationNumber = localStorage.getItem('application_number');
      this.voucherFile.append('application_number',applicationNumber);
      
      this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
      this.voucherFile.append('amount',this.voucherSentData['amount']);
      this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
      this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
      this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
      this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
      this.voucherFile.append('voucher_date', dtFormat);
      // this.voucherFile.append('accreditation',this.formApplicationId);
      this.voucherFile.append('application_id',this.formApplicationId);
      this.voucherFile.append('saved_step', 8);
      this.voucherFile.append('payment_status', 'paid');
      if(!type){
        this.voucherFile.append('is_draft', false);
      }else{
        this.voucherFile.append('is_draft', true);
      }

      console.log(">>> Data: ", this.voucherSentData);
      if(this.voucherSentData['transaction_no'] != '' && this.voucherSentData['payment_method'] != '' && this.voucherSentData['payment_made_by'] &&
        this.voucherSentData['mobile_no'] != '' && this.voucherSentData['amount'] != null && (this.voucherSentData['payment_date'] != undefined && this.voucherSentData['payment_date'] != null)){
          is_valid = true;
        }

        if(is_valid == true && type == undefined && this.paymentReceiptValidation != false) {
          //this.noObjectionBodyForm.saved_step = 8;      
          //this.noObjectionBodyForm.step8 = this.step6Data;
          //this.noObjectionBodyForm.step8.application_id = this.formApplicationId;
          //this.noObjectionBodyForm.step8.is_draft = false;
          console.log(">> Submit Form: "," -- ", this.voucherSentData);

          this._trainerService.paymentVoucherNOCSave((this.voucherFile))
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
                  
                }else{
                  this.toastr.warning(data.msg,'');
                }
          })   
    
        }else if(type != undefined && type == true){
          //this.noObjectionBodyForm.saved_step = 6;   
          //this.noObjectionBodyForm.step6 = this.step6Data;
         // this.noObjectionBodyForm.step8.is_draft = true;
          console.log(">> Submit Save draft: ", " -- ", this.voucherSentData);

          this._trainerService.paymentVoucherNOCSave((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                console.log("submit voucher draft: ", data);
                if(data.status){
                  this.toastr.success("Save Draft Successfully",'');                  
                }else{
                  this.toastr.warning(data.msg,'');
                }
          })    
        }else{
          this.toastr.warning('Please Fill required field','',{timeOut:5000});
        }
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

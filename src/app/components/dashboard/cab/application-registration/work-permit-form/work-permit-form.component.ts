import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
declare let paypal: any;
// import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { TrainerService } from '../../../../../services/trainer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-work-permit-form',
  templateUrl: './work-permit-form.component.html',
  styleUrls: ['./work-permit-form.component.scss']
})
export class WorkPermitFormComponent implements OnInit {

  public newRow: any = {};
  public testingCalForm: any = {};
  public workPermitForm: any = {};
  public workPermitFormData:any = new FormData();
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public banner:any=[];
  public loader:boolean=true;
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = true;
  @ViewChild('fileInput' , {static: true}) fileInput;
  @ViewChild('reCaptcha' , {static: true}) reCaptcha;
  public file_validation:boolean = true;
  public file_validation2:boolean = true;
  public file_validation3:boolean = true;
  public file_validation4:boolean = true;
  licence_document_validation:boolean = false;
  quality_manual_validation:boolean = false;
  work_instruction_validation:boolean = false;
  check_list_validation:boolean = false;
  licence_document_file:any;
  quality_manual_file:any;
  work_instruction_file:any;
  check_list_file:any;
  // licence_document_validation:boolean = true;
  // licence_document_validation:boolean = true;
  // licence_document_validation:boolean = true;
  licence_document_path:any;
  quality_manual_path:any;
  work_instruction_path:any;
  check_list_path:any;
  getWorkPermitId:any;
  headerSteps:any[] = [];

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
  modalOptions:NgbModalOptions;

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
  ownOrgBasicInfo:any = [{}];
  ownOrgMembInfo:any = [{}];
  formApplicationId:any;
  transactionsItem: any={};
  voucherSentData: any = {};
  total: any = 0;
  transactions: any[] =[];
  voucherFile:any = new FormData();
  pathPDF: any;
  closeResult: string;
  paymentStepComp: boolean = false;
  // modalOptions:NgbModalOptions;
  accredAgreemFile: any;
  checklistDocFile: any;
  paymentReceiptValidation:boolean
  getCountryLists:any[] = [];
  selectTradeLicName :string = ''; 
  selectTradeLicPath :string = '';
  userId:any;
  paymentFilePath :string = '';
  subscriptions: Subscription[] = [];
  public minDate;
  activitySectionArr:any[] = [];
  activitySection:any;
  public errorLoader: boolean = false;
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  paymentFile:any;
  paymentDetailsChk:any;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,public _trainerService:TrainerService,public sanitizer:DomSanitizer,private modalService: NgbModal) { }

  ngOnInit() {
    this.getWorkPermitId = sessionStorage.getItem('workPermitId');
    this.checkCaptchaValidation = true;
    // this.authorizationList = {authorization_confirm1:false};
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete'); 
    this.userId = sessionStorage.getItem('userId');
    this.loadData();
    this.loadCountryStateCity();
    this.loadAppInfo();

    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Applicant Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
      },
      {
      title:'activities_scope', desc:'2. Activities & Scope', activeStep:false, stepComp:false, icon:'icon-user', activeClass:''
      },
      {
        title:'documents_tobe_attached', desc:'3. Documents to be Attached', activeStep:false, stepComp:false, icon:'icon-sheet', activeClass:''
      },
      {
      title:'authorization_ofthe_application', desc:'4. Authorization of the Application', activeStep:false, stepComp:false, icon:'icon-work', activeClass:''
      },
      {
        title:'proforma_invoice', desc:'5. Proforma Invoice', activeStep:false, stepComp:false, icon:'icon-file_invoice', activeClass:''
      },
      {
        title:'payment_update', desc:'6. Payment Update', activeStep:false, stepComp:false, icon:'icon-payment', activeClass:''
      },
      {
        title:'application_complete', desc:'7. Application Complete', activeStep:false, stepComp:false, icon:'icon-document-pen', activeClass:''
      },
    );

    // this.workPermitForm.name_of_cab = '';
    // this.workPermitForm.address = '';
    // this.workPermitForm.cab_license_no = '';
    // this.workPermitForm.cab_issue_date = null;
    // this.workPermitForm.applicant_name = '';
    // this.workPermitForm.designation = '';
    // this.workPermitForm.tel_no = '';
    // this.workPermitForm.email_address = '';
    // this.workPermitForm.activity_section = '';
    // this.workPermitForm.scopes_to_be_authorized = '';
    // this.workPermitForm.license_no = '';
    // this.workPermitForm.date_of_issue = null;
    // this.workPermitForm.date_of_expiry = null; 

    // this.workPermitFormData.append('licence_document_file','');
    // this.workPermitFormData.append('quality_manual_file','');
    // this.workPermitFormData.append('work_instruction_file','');
    // this.workPermitFormData.append('check_list_file','');

    // this.workPermitForm.organization_name = '';
    // this.workPermitForm.representative_name = '';
    // this.workPermitForm.behalf_designation = '';
    // this.workPermitForm.digital_signature = '';
    // this.activitySectionArr.length > 0 ? 
    this.activitySection = {laboratory:false,inspection_body:false,certification_body:false};
    // this.authorizationList = {authorization_confirm1:false};
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

  loadAppInfo() {
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
          
          this.step1Data.mailing_address = data.applicant_address;
          this.step1Data.official_commercial_name = data.cab_name;
          this.step1Data.official_email = data.applicant_email;
          this.step1Data.official_website = data.applicant_website;
          this.ownOrgBasicInfo = step2['cabOwnerData'];
          this.step3Data.license_no = data.trade_license_number;
          
          this.step3Data.date_of_issue = new Date(data.date_of_expiry);
          this.step3Data.date_of_expiry = new Date(data.date_of_issue);
          
          // step2['cabBodData'].forEach((res,key) => {
          //   step2['cabBodData'][key].name = res.name;
          //   step2['cabBodData'][key].designation = res.designation;
          //   step2['cabBodData'][key].relationship = res.relationship && res.relationship != undefined ? res.relationship : 'None';
          //   step2['cabBodData'][key].current_occupation = res.current_occupation && res.current_occupation != undefined ? res.current_occupation : 'None';
          //   step2['cabBodData'][key].employment = res.employment && res.employment != undefined ? res.employment : 'None';
          // });
          
          this.ownOrgMembInfo = step2['cabBodData'];
          
          this.step1Data.physical_location_address = data.applicant_location;
          this.step1Data.po_box = data.po_box;
          
          this.step1Data.telephone = data.applicant_tel_no;
        }
      })

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

  closeDialog(){
    this.modalService.dismissAll();
  }
  
  loadData() {
    // let url2 = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+this.urlVal;
    if(this.getWorkPermitId != 'undefined') {

        let url2 = this.Service.apiServerUrl+"/"+'registration-details-show/'+this.getWorkPermitId;
        this.Service.getwithoutData(url2)
        .subscribe(
          res => {
            console.log(res);

            if(res['data'].id != undefined && res['data'].id > 0){
              this.formApplicationId = res['data'].id;
            }

            let saveStep: number;
            //check steps
            if(res['data'].is_draft){

              saveStep = parseInt(res['data'].saved_step) - 1;
            }else{
              if(parseInt(res['data'].saved_step) == 6){
                this.paymentStepComp = true;
                saveStep = parseInt(res['data'].saved_step) - 1;
              }else{
                
              saveStep = parseInt(res['data'].saved_step);
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
                      console.log('found steps....',curStep);
                      curStep.stepComp = true;
                      this.Service.headerStepMove(item.title, this.headerSteps,'menu')
                    }
              })
              //////console.log("#Step data: ", this.headerSteps);
            }

            var wapdata = res['data'].wapData;
            this.step2Data.activity_section = wapdata.activity_section != null ? wapdata.activity_section : '';
            this.step2Data.scopes_to_be_authorized = wapdata.scopes_to_be_authorized != null ? wapdata.scopes_to_be_authorized : '';
            if(res['data'].wapData.activity_section != null) {
              this.activitySection = JSON.parse(res['data'].wapData.activity_section);
            }
            // console.log(this.activitySection,'activitySectionactivitySectionactivitySectionactivitySection');


            let pathData: any;
            let filePath: string;

            if(!this.Service.isObjectEmpty(res['data'].paymentDetails)){
              this.paymentDetailsChk = res['data'].paymentDetails;
              if(res['data'].paymentDetails.voucher_invoice != undefined && res['data'].paymentDetails.voucher_invoice != ''){
                filePath = this.constant.mediaPath + '/media/' + res['data'].paymentDetails.voucher_invoice;
                pathData = this.getSantizeUrl(filePath);
                this.paymentFilePath = pathData.changingThisBreaksApplicationSecurity;
              }
            // console.log(this.paymentFilePath,'activitySectionactivitySectionactivitySectionactivitySection');

              //////console.log(">>>> payment details upload: ", getData.data.paymentDetails, " -- ", this.paymentFilePath, " :: ", filePath);
            }

            var recognized_logo1 = wapdata.licence_document_file;
            if(recognized_logo1 != ''){
              let getFile =recognized_logo1.toString().split('/');
              if(getFile.length){
                this.workPermitForm.licence_document = getFile[4].toString().split('.')[0];
                this.licence_document_path = this.constant.mediaPath +'/media/'+ recognized_logo1.toString();
              }
            }

            var quality_manual1 = wapdata.quality_manual_file;
            if(quality_manual1 != ''){
              let getFile = quality_manual1.toString().split('/');
              if(getFile.length){
                this.workPermitForm.quality_manual = getFile[4].toString().split('.')[0];
                this.quality_manual_path = this.constant.mediaPath +'/media/'+ quality_manual1.toString();
              }
            }

            var work_instruction1 = wapdata.work_instruction_file;
            if(work_instruction1 != ''){
              let getFile = work_instruction1.toString().split('/');
              if(getFile.length){
                this.workPermitForm.work_instruction = getFile[4].toString().split('.')[0];
                this.work_instruction_path = this.constant.mediaPath +'/media/'+ work_instruction1.toString();
              }
            }

            var check_list1 = wapdata.check_list_file;
            if(check_list1 != ''){
              let getFile = check_list1.toString().split('/');
              if(getFile.length){
                this.workPermitForm.check_list = getFile[4].toString().split('.')[0];
                this.check_list_path = this.constant.mediaPath +'/media/'+ check_list1.toString();
              }
            }

            if(res['data'].onBehalfApplicantDetails != null) {
              this.step4Data.organization_name = res['data'].onBehalfApplicantDetails.organization_name;
              this.step4Data.representative_name = res['data'].onBehalfApplicantDetails.representative_name;
              this.step4Data.behalf_designation = res['data'].onBehalfApplicantDetails.designation;
              this.step4Data.digital_signature = res['data'].onBehalfApplicantDetails.digital_signature;

              // if(res['data'].onBehalfApplicantDetails.organization_name && res['data'].onBehalfApplicantDetails.representative_name && res['data'].onBehalfApplicantDetails.designation && res['data'].onBehalfApplicantDetails.digital_signature){
              //   this.authorizationList.authorization_confirm1 = true;
              // }
            }
            

            if(res['data'].paymentDetails != null){
              // //console.log(">>>payment details...show");
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
                if(this.paymentFile != ''){
                  this.paymentReceiptValidation = true;
                }                
            }
          })
      }
  }
  

  voucherSentSubmit(theForm){
     
    let postObject: any = {};
    let is_valid: boolean = false;
    if(this.voucherSentData['voucher_no'] != undefined && this.voucherSentData['amount'] != undefined &&
     this.voucherSentData['voucher_date'] != undefined){
       is_valid = true;
     }
     //console.log("Valid/Invalid: ", theForm.form.valid, " -- "," --", is_valid, " --", this.voucherSentData);

   //return false;
    if(is_valid == true && this.paymentReceiptValidation === true){ 
         let dtFormat: string = '';;
         if(this.voucherSentData['voucher_date'] != undefined && 
         this.voucherSentData['voucher_date']._i != undefined){
           var dtData = this.voucherSentData['voucher_date']._i;
           var year = dtData.year;
           var month = dtData.month + 1;
           var date = dtData.date;
           dtFormat = year + "-" + month + "-" + date;
         }

         //console.log(">>> Date: ", (dtFormat), " -- ", this.voucherSentData['voucher_date'], " -- ", this.voucherSentData['voucher_date']._i);
         //console.log("@accred ID: ", this.voucherSentData['accreditation'])
         this.voucherFile.append('voucher_no',this.voucherSentData['voucher_no']);
         this.voucherFile.append('amount',this.voucherSentData['amount']);
         this.voucherFile.append('voucher_date',dtFormat);
        //  this.voucherFile.append('accreditation',this.formApplicationId);
         this.voucherFile.append('registration',this.formApplicationId);

         this.subscriptions.push(this._trainerService.registrationVoucherSave((this.voucherFile))
         .subscribe(
            result => {
              let data: any = result;
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
         )

    }else{
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }

    // else if(theForm.form.valid && (this.paymentReceiptValidation == false || this.paymentReceiptValidation == null)){
    //  this._toaster.warning('Please Upload Valid Files','Upload Error',{timeOut:5000});
    // }
    // else{
    //  this._toaster.warning('Please Fill required fields','Validation Error',{timeOut:5000});
    // }
 }



 validateFile1(fileEvent: any, type?: any) {
   var file_name = fileEvent.target.files[0].name;
   var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
   var ex_type = ['pdf', 'PDF'];
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


  validateFile(fileEvent: any,fileName?:any) {
    // console.log(fileName,'fileName')
    var file_name = fileEvent.target.files[0].name;
    console.log(file_name,'file_name')
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    //var ex_type = ['doc','odt','pdf','rtf','docx','xlsx'];
    var ex_type = ['pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);

    if(ex_check && fileName == 'licence_document_file'){
      this.step3Data.licence_document = fileEvent.target.files[0].name;
      this.step3DataBodyFormFile.append(fileName,fileEvent.target.files[0]);
      this.licence_document_validation = true;
      return true;
    }else if(!ex_check && fileName == 'licence_document_file') {
      this.licence_document_validation = false;
      return false;
    }else if(ex_check && fileName == 'quality_manual_file'){
      this.step3Data.quality_manual = fileEvent.target.files[0].name;
      this.step3DataBodyFormFile.append(fileName,fileEvent.target.files[0]);
      this.quality_manual_validation = true;
      return true;
    }else if(!ex_check && fileName == 'quality_manual_file') {
      this.quality_manual_validation = false;
      return false;
    }else if(ex_check && fileName == 'work_instruction_file'){
      this.step3Data.work_instruction = fileEvent.target.files[0].name;
      this.step3DataBodyFormFile.append(fileName,fileEvent.target.files[0]);
      this.work_instruction_validation = true;
      return true;
    }else if(!ex_check && fileName == 'work_instruction_file') {
      this.work_instruction_validation = false;
      return false;
    }else if(ex_check && fileName == 'check_list_file'){
      this.step3Data.check_list = fileEvent.target.files[0].name;
      this.step3DataBodyFormFile.append(fileName,fileEvent.target.files[0]);
      this.check_list_validation = true;
      return true;
    }else if(!ex_check && fileName == 'check_list_file') {
      this.check_list_validation = false;
      return false;
    }
  }

  
  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  checkboxChecking(theEvent) {
    var checkCount = 0;
    if(theEvent.checked){
      for(let key in this.activitySection) {
        ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
        if(this.activitySection[key]) {  
          checkCount++;
        }    
      }
    }

    if(checkCount > 0){
      this.authorizationStatus = true;
    }else{
      this.authorizationStatus = false;
    }
  }

  onSubmit1(ngForm1) {
    // this.Service.moveSteps('application_information', 'activities_scope', this.headerSteps);
    if(ngForm1.form.valid) {
      this.workPermitForm = {};
      this.workPermitForm.step1 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '1';
      this.step1Data.is_draft = false;
      if(this.formApplicationId > 0){
        this.step1Data.application_id = this.formApplicationId;
      }

      this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
      // this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accr == '0' ? false : true;

      this.workPermitForm.step1.is_draft = false;
      this.workPermitForm.step1 = this.step1Data;

      this.workPermitForm.step1['ownOrgBasicInfo'] = [];
      this.workPermitForm.step1['ownOrgMembInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.workPermitForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.workPermitForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }

      // this.loader = false;

      this.step1DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {

            this.formApplicationId = (this.formApplicationId && this.formApplicationId != '') ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['id']);
            
            this.Service.moveSteps('application_information', 'activities_scope', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else {
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  onSubmit2(ngForm2) {
    // this.Service.moveSteps('activities_scope', 'documents_tobe_attached', this.headerSteps);
    // this.step2Data.activity_section = this.activitySectionArr;
    // console.log(this.activitySectionArr);
    var checkCount = 0;
    for(let key in this.activitySection) {
      ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
      if(this.activitySection[key]) {  
        checkCount++; 
      }
    }
    // console.log(checkCount);
    
    if(checkCount > 0) {
      this.workPermitForm = {};
      this.workPermitForm.step2 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

      this.step2Data.is_draft = false;
      this.step2Data.activity_section = this.activitySection;
      this.workPermitForm.step2 = this.step2Data;

      // this.loader = false;

      this.step2DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {
            
            this.Service.moveSteps('activities_scope', 'documents_tobe_attached', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else {
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
    
  }

  onSubmit3(ngForm3) {
    // this.Service.moveSteps('documents_tobe_attached', 'authorization_ofthe_application', this.headerSteps);

    if(ngForm3.form.valid) {
      this.workPermitForm = {};
      this.workPermitForm.step3 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '3';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

      this.step3Data.is_draft = false;
      this.workPermitForm.step3 = this.step3Data;

      // this.loader = false;

      this.step3DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {
            
            this.Service.moveSteps('documents_tobe_attached', 'authorization_ofthe_application', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else {
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
    
  }

  onSubmit4(ngForm4) {
    // this.Service.moveSteps('authorization_ofthe_application', 'proforma_invoice', this.headerSteps);

    // console.log(this.authorizationList.authorization_confirm);
    if(ngForm4.form.valid) {
      this.workPermitForm = {};
      this.workPermitForm.step4 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '4';
      this.step4Data.authorization_list_json = {'authorization_confirm1' : this.step4Data.authorization_confirm1};
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

      this.step4Data.is_draft = false;
      this.step4Data.application_date = new Date();
      this.workPermitForm.step4 = this.step4Data;

      // this.loader = false;

      this.step4DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {
            
            // this.Service.moveSteps('authorization_ofthe_application', 'proforma_invoice', this.headerSteps);
            if(this.paymentFilePath != ''){
              this.Service.moveSteps('authorization_ofthe_application', 'proforma_invoice', this.headerSteps);
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
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }
    // else if(ngForm4.form.valid && this.authorizationList.authorization_confirm1 == false) {
    //   this.toastr.warning('Please select authorization box', '');
    // }
    else {
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
    
  }

  onSubmit5(ngForm5) {
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
    let custPrice: any = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;
    this.total = (this.voucherSentData.amount != undefined && this.voucherSentData.amount > 0) ? this.voucherSentData.amount : 0;//0.05;
    this.transactionsItem['item_list']['items'].push({name: 'Test Course', quantity: 1, price: custPrice, currency: 'USD'});
    // this.total = 1;
    // custPrice = 0.1;
      if(this.total > 0){
        ////console.log("Calculate price: ", calcPrice);
        this.transactionsItem['amount']['total'] = custPrice.toFixed(2);
        this.transactionsItem['amount']['details']['subtotal'] = custPrice.toFixed(2);
        this.transactions.push(this.transactionsItem);
        //console.log("Cart Items: ", this.transactionsItem, " -- ", this.transactions);
      }
      setTimeout(() => {
        this.createPaymentButton(this.transactionsItem, this.workPermitForm, this);
        let elem = document.getElementsByClassName('paypal-button-logo');
        //console.log("button creting...");
        if(elem){
          //console.log("button creted...");
        }else{
          //console.log("Loding button...");
        }
      }, 100)
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

  closeChecklistDialog(){
    this.modalService.dismissAll();
  }

  onSubmitPaymentInformation(theForm: any, type?: any){
    //this.Service.moveSteps('payment_update', 'application_complete', this.headerSteps);

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

      this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
      this.voucherFile.append('amount',this.voucherSentData['amount']);
      this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
      this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
      this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
      this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
      this.voucherFile.append('voucher_date', dtFormat);
      this.voucherFile.append('accreditation',this.formApplicationId);
      this.voucherFile.append('application_id',this.formApplicationId);
      this.voucherFile.append('saved_step', 8);
      if(!type){
        this.voucherFile.append('is_draft', false);
      }else{
        this.voucherFile.append('is_draft', true);
      }

      console.log(">>> Data: ", this.voucherSentData);
      if(this.voucherSentData['transaction_no'] != '' && this.voucherSentData['payment_method'] != '' && this.voucherSentData['payment_made_by'] &&
        this.voucherSentData['mobile_no'] != ''){
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

  onSubmitPaymentInformation123(ngForm6: any, type?: boolean){
      ////console.log("payment submitting.....");
      this.workPermitForm = {};
      this.workPermitForm.step6 = {};
      
      // console.log(this.voucherSentData['payment_date'],'payment_date');
      // console.log(this.voucherSentData['payment_date']._i,'payment_dati');
        let dtFormat: string = '';
        if(this.voucherSentData['payment_date'] != undefined && 
          this.voucherSentData['payment_date']._i != undefined){
          var dtData = this.voucherSentData['payment_date']._i;
          var year = dtData.year;
          var month = dtData.month + 1;
          var date = dtData.date;
          dtFormat = year + "-" + month + "-" + date;
        }else{
          var nFdate = new Date(this.voucherSentData['payment_date']);
          var nMonth = nFdate.getMonth();
          var nDate = nFdate.getDate();
          var nYear = nFdate.getFullYear();
          dtFormat = nYear + "-" + nMonth + "-" + nDate;
        }
        //
      // console.log(dtFormat,'dtFormat');
      
      this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
      this.voucherFile.append('amount',this.voucherSentData['amount']);
      this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
      this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
      this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
      this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
      this.voucherFile.append('voucher_date',dtFormat);
      this.voucherFile.append('application_id',this.formApplicationId);
      this.voucherFile.append('is_draft', false);
      // this.voucherFile.append('application_id',this.formApplicationId);
          
      
      if(ngForm6.form.valid && this.paymentReceiptValidation != false && type == false) {
        this.loader = false;
        // //console.log(this.voucherFile);
          this._trainerService.paymentVoucherNOCSave((this.voucherFile))
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
        
        this.workPermitForm = {};
        this.workPermitForm.step6 = {};
        
          let dtFormat: string = '';
          if(this.voucherSentData['payment_date'] != undefined && 
            this.voucherSentData['payment_date']._i != undefined){
            var dtData = this.voucherSentData['payment_date']._i;
            var year = dtData.year;
            var month = dtData.month;
            var date = dtData.date;
            dtFormat = year + "-" + month + "-" + date;
          }else{
            var nFdate = new Date(this.voucherSentData['payment_date']);
            var nMonth = nFdate.getMonth();
            var nDate = nFdate.getDate();
            var nYear = nFdate.getFullYear();
            dtFormat = nYear + "-" + nMonth + "-" + nDate;
          }
          //     
        
        this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
        this.voucherFile.append('amount',this.voucherSentData['amount']);
        this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
        this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
        this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
        this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
        this.voucherFile.append('voucher_date',dtFormat);
        this.voucherFile.append('application_id',this.formApplicationId);
        this.voucherFile.append('is_draft', true);
        // this.voucherFile.append('application_id',this.formApplicationId);
            
          // //console.log(this.voucherFile);
        this._trainerService.paymentVoucherNOCSave((this.voucherFile))
        .subscribe(
            result => {
              this.loader = true;
              let data: any = result;
              ////console.log("submit voucher: ", data);
              if(data.status){
                this.toastr.success('Save Draft Successfully', '');
              }
            }
          )
    }
    else {
      this.toastr.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
  }

  openView(content, type:string) {
  
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
  // onSubmit(ngForm1){
    
  //   if(ngForm1.form.valid && this.isSubmit) {
  //     // this.workPermitForm.application_type = '';
  //     this.workPermitForm.is_draft = false;
  //     if(this.getWorkPermitId != undefined) {
  //       this.workPermitForm.application_id = this.getWorkPermitId;
  //     }
  //     this.workPermitFormData.append('data',JSON.stringify(this.workPermitForm));
  //     this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.workPermitFormData)
  //     .subscribe(
  //       res => {
  //         if(res['status']==true){
  //           this.toastr.success(res['msg'], '');
  //           this.router.navigate(['application-form/service/work_permit']);
  //         }
  //         else{
  //           this.toastr.error(res['msg'],'')
  //         }
  //       },
  //       error => {
  //         this.toastr.error('Something went wrong','')
  //     }
  //     )
  //   }
  //   else{
  //     this.toastr.warning('Please Fill required field','')
  //   }
  // }

  setexDate(date, index){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));   
  }

  savedraftStep(steps){
    if(steps == 'step1') {
      this.workPermitForm = {};
      this.workPermitForm.step1 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '1';
      this.step1Data.is_draft = true;
      if(this.formApplicationId > 0){
        this.step1Data.application_id = this.formApplicationId;
      }

      this.step1Data.is_bod = this.step1Data.is_bod == '0' ? false : true;
      // this.step1Data.is_hold_other_accreditation = this.step1Data.is_hold_other_accr == '0' ? false : true;

      this.workPermitForm.step1.is_draft = false;
      this.workPermitForm.step1 = this.step1Data;

      this.workPermitForm.step1['ownOrgBasicInfo'] = [];
      this.workPermitForm.step1['ownOrgMembInfo'] = [];
      
      if(this.ownOrgBasicInfo) {
        this.workPermitForm.step1['ownOrgBasicInfo'] = this.ownOrgBasicInfo;
      }
      if(this.ownOrgMembInfo) {
        this.workPermitForm.step1['ownOrgMembInfo'] = this.ownOrgMembInfo;
      }

      this.loader = false;

      this.step1DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {

            this.formApplicationId = (this.formApplicationId && this.formApplicationId != '') ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['id']);

            this.toastr.success('Save Draft Successfully', '');
          }
        });

    }else if(steps == 'step2') {
      this.workPermitForm = {};
      this.workPermitForm.step2 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '2';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step2Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

      this.step2Data.is_draft = true;
      this.step2Data.activity_section = this.activitySection;

      this.workPermitForm.step2 = this.step2Data;

      // this.loader = false;

      this.step2DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {
            this.toastr.success('Save Draft Successfully', '');
          }
        });
      
    }else if(steps == 'step3') {
      this.workPermitForm = {};
      this.workPermitForm.step3 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '3';
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step3Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

      this.step3Data.is_draft = true;
      this.workPermitForm.step3 = this.step3Data;

      // this.loader = false;

      this.step3DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {
            this.toastr.success('Save Draft Successfully', '');
          }
        });
    }else if(steps == 'step4') {
      this.workPermitForm = {};
      this.workPermitForm.step4 = {};
      this.workPermitForm.email = this.userEmail;
      this.workPermitForm.userType = this.userType;
      this.workPermitForm.saved_step = '4';
      this.step4Data.authorization_list_json = {'authorization_confirm1' : this.step4Data.authorization_confirm1};
      var applicationId = sessionStorage.getItem('applicationId');
      // this.step2Data.application_id = applicationId;
      this.step4Data.application_id = this.formApplicationId && this.formApplicationId != '' ?  this.formApplicationId : applicationId;

      this.step4Data.is_draft = true;
      this.step4Data.application_date = new Date();
      this.workPermitForm.step4 = this.step4Data;

      this.loader = false;

      this.step4DataBodyFormFile.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {
            this.toastr.success('Save Draft Successfully', '');
          }
        });
    }
  }

}

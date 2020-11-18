import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

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
  licence_document_validation:boolean = true;
  quality_manual_validation:boolean = true;
  work_instruction_validation:boolean = true;
  check_list_validation:boolean = true;
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

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.getWorkPermitId = sessionStorage.getItem('workPermitId');
    this.checkCaptchaValidation = true;
    this.authorizationList = {authorization_confirm1:false};
    this.loadData();

    this.headerSteps.push(
      {
      title:'application_information', desc:'1. Application Information', activeStep:true, stepComp:false, icon:'icon-doc-edit', activeClass:'user-present'
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

    this.workPermitForm.name_of_cab = '';
    this.workPermitForm.address = '';
    this.workPermitForm.cab_license_no = '';
    this.workPermitForm.cab_issue_date = null;
    this.workPermitForm.applicant_name = '';
    this.workPermitForm.designation = '';
    this.workPermitForm.tel_no = '';
    this.workPermitForm.email_address = '';
    this.workPermitForm.activity_section = '';
    this.workPermitForm.scopes_to_be_authorized = '';
    this.workPermitForm.license_no = '';
    this.workPermitForm.date_of_issue = null;
    this.workPermitForm.date_of_expiry = null; 

    this.workPermitFormData.append('licence_document_file','');
    this.workPermitFormData.append('quality_manual_file','');
    this.workPermitFormData.append('work_instruction_file','');
    this.workPermitFormData.append('check_list_file','');

    this.workPermitForm.organization_name = '';
    this.workPermitForm.representative_name = '';
    this.workPermitForm.behalf_designation = '';
    this.workPermitForm.digital_signature = '';
  }
 
  loadData() {
    // let url2 = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+this.urlVal;
    if(this.getWorkPermitId != 'undefined') {
      
      this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform+this.getWorkPermitId)
      .subscribe(
        res => {
          // console.log(res['data'],'res');
          var allData = res['data'];
          this.workPermitForm.name_of_cab = allData.name_of_cab;
          this.workPermitForm.address = allData.address;
          this.workPermitForm.cab_license_no = allData.cab_license_no;
          this.workPermitForm.cab_issue_date = new Date(allData.cab_issue_date);
          this.workPermitForm.applicant_name = allData.applicant_name;
          this.workPermitForm.designation = allData.designation;
          this.workPermitForm.tel_no = allData.tel_no;
          this.workPermitForm.email_address = allData.email_address;
          this.workPermitForm.activity_section = allData.activity_section;
          this.workPermitForm.scopes_to_be_authorized = allData.scopes_to_be_authorized;
          this.workPermitForm.license_no = allData.applicant_licence_no;
          this.workPermitForm.date_of_issue = allData.date_of_issue;
          this.workPermitForm.date_of_expiry = allData.date_of_expiry;

          var recognized_logo1 = allData.licence_document_file;
          if(recognized_logo1 != ''){
            let getFile =recognized_logo1.toString().split('/');
            if(getFile.length){
              this.workPermitForm.licence_document = getFile[4].toString().split('.')[0];
              this.licence_document_path = this.constant.mediaPath + recognized_logo1.toString();
            }
          }

          var quality_manual1 = allData.quality_manual_file;
          if(quality_manual1 != ''){
            let getFile = quality_manual1.toString().split('/');
            if(getFile.length){
              this.workPermitForm.quality_manual = getFile[4].toString().split('.')[0];
              this.quality_manual_path = this.constant.mediaPath + quality_manual1.toString();
            }
          }

          var work_instruction1 = allData.work_instruction_file;
          if(work_instruction1 != ''){
            let getFile = work_instruction1.toString().split('/');
            if(getFile.length){
              this.workPermitForm.work_instruction = getFile[4].toString().split('.')[0];
              this.work_instruction_path = this.constant.mediaPath + work_instruction1.toString();
            }
          }

          var check_list1 = allData.check_list_file;
          if(check_list1 != ''){
            let getFile = check_list1.toString().split('/');
            if(getFile.length){
              this.workPermitForm.check_list = getFile[4].toString().split('.')[0];
              this.check_list_path = this.constant.mediaPath + check_list1.toString();
            }
          }

          this.workPermitForm.organization_name = allData['onBehalfApplicant'][0].organization_name;
          this.workPermitForm.representative_name = allData['onBehalfApplicant'][0].representative_name;
          this.workPermitForm.behalf_designation = allData['onBehalfApplicant'][0].designation;
          this.workPermitForm.digital_signature = allData['onBehalfApplicant'][0].digital_signature;
      });
    }
  }
  
  validateFile(fileEvent: any,fileName?:any) {
    // console.log(fileName,'fileName')
    var file_name = fileEvent.target.files[0].name;
    console.log(file_name,'file_name')
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['doc','odt','pdf','rtf','docx','xlsx'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);

    if(ex_check && fileName == 'licence_document_file'){
      this.workPermitForm.licence_document = fileEvent.target.files[0].name;
      this.workPermitFormData.append(fileName,fileEvent.target.files[0]);
      this.licence_document_validation = true;
      return true;
    }else if(!ex_check && fileName == 'licence_document_file') {
      this.licence_document_validation = false;
      return false;
    }else if(ex_check && fileName == 'quality_manual_file'){
      this.workPermitForm.quality_manual = fileEvent.target.files[0].name;
      this.workPermitFormData.append(fileName,fileEvent.target.files[0]);
      this.quality_manual_validation = true;
      return true;
    }else if(!ex_check && fileName == 'quality_manual_file') {
      this.quality_manual_validation = false;
      return false;
    }else if(ex_check && fileName == 'work_instruction_file'){
      this.workPermitForm.work_instruction = fileEvent.target.files[0].name;
      this.workPermitFormData.append(fileName,fileEvent.target.files[0]);
      this.work_instruction_validation = true;
      return true;
    }else if(!ex_check && fileName == 'work_instruction_file') {
      this.work_instruction_validation = false;
      return false;
    }else if(ex_check && fileName == 'check_list_file'){
      this.workPermitForm.check_list = fileEvent.target.files[0].name;
      this.workPermitFormData.append(fileName,fileEvent.target.files[0]);
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

  onSubmit1(ngForm1) {
    this.Service.moveSteps('application_information', 'activities_scope', this.headerSteps);
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

      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcareForm,this.workPermitForm)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = res;
          if(res['status'] == true) {

            this.formApplicationId = (this.formApplicationId && this.formApplicationId != '') ?  this.formApplicationId : sessionStorage.setItem('applicationId',res['application_id']);
            // if(getData){
            //   console.log(">>> APP Id generate: ", getData);

            //   let appId: number = getData.application_id;
            //   this.formApplicationId = getData.application_id;
            // }
            this.Service.moveSteps('application_information', 'activities_scope', this.headerSteps);
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else {
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmit2(ngForm2) {
    this.Service.moveSteps('activities_scope', 'documents_tobe_attached', this.headerSteps);
    
  }

  onSubmit3(ngForm3) {
    this.Service.moveSteps('documents_tobe_attached', 'authorization_ofthe_application', this.headerSteps);
    
  }

  onSubmit4(ngForm4) {
    this.Service.moveSteps('documents_tobe_attached', 'authorization_ofthe_application', this.headerSteps);
    
  }

  onSubmit(ngForm1){
    
    if(ngForm1.form.valid && this.isSubmit) {
      // this.workPermitForm.application_type = '';
      this.workPermitForm.is_draft = false;
      if(this.getWorkPermitId != undefined) {
        this.workPermitForm.application_id = this.getWorkPermitId;
      }
      this.workPermitFormData.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.workPermitFormData)
      .subscribe(
        res => {
          if(res['status']==true){
            this.toastr.success(res['msg'], '');
            this.router.navigate(['application-form/service/work_permit']);
          }
          else{
            this.toastr.error(res['msg'],'')
          }
        },
        error => {
          this.toastr.error('Something went wrong','')
      }
      )
    }
    else{
      this.toastr.warning('Please Fill required field','')
    }
  }

  savedraftStep(){
    this.workPermitForm.is_draft = true;
    if(this.getWorkPermitId != 'undefined') {
      this.workPermitForm.application_id = this.getWorkPermitId;
    }
    this.workPermitFormData.append('data',JSON.stringify(this.workPermitForm));
    this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform,this.workPermitFormData)
    .subscribe(
      res => {
        if(res['status']==true){
          this.toastr.success('Save Draft Successfully', '');
          this.router.navigate(['application-form/service/work_permit']);
        }
        else{
          this.toastr.error(res['msg'],'')
        }
      },
      error => {
        this.toastr.error('Something went wrong','')
    }
    )
  }

}

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

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() { 
    this.getWorkPermitId = sessionStorage.getItem('workPermitId');
    this.checkCaptchaValidation = true;
    this.authorizationList = {authorization_confirm1:false};
    this.loadData();
    // console.log(this.getWorkPermitId,'getWorkPermitId');
  }
 
  loadData() {
    // let url2 = this.Service.apiServerUrl+"/"+'accrediation-details-show/'+this.urlVal;
      this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.workPermitform+this.getWorkPermitId)
      .subscribe(
        res => {
          console.log(res['data'],'res');
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
  onSubmit(ngForm){
    
    if(ngForm.form.valid && this.isSubmit){
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

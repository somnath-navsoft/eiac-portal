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

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() { 
    this.checkCaptchaValidation = true;
    this.authorizationList = {authorization_confirm1:false};
  }
  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
  }
 
//   validateFile(fileEvent: any) {
//     var ex = (fileEvent.target.files[0].type).split('/');
//     if(ex[1]=='png'||ex[1]=='jpg'||ex[1]=='jpeg'){
//       //console.log(fileEvent.target.files[0].name);
//       this.testingCalForm.trade_license_name ==fileEvent.target.files[0].name;
//       return true;
//     }
//     else{
//       //console.log('=>>>>>>>>>>>>>>>>>>>>>')
      
//       return false;
//     }
//     //console.log(ex[1])
// }
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
      this.workPermitForm.is_draft = false;
      this.workPermitFormData.append('data',JSON.stringify(this.workPermitForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.workPermitFormData)
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
    })
    }
    else{
      this.toastr.warning('Please Fill required field','')
    }
    }

}

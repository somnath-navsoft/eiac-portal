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
  public healthCareFormTemp:any = new FormData();
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

validateFile(fileEvent: any,type) {
   
   var file_name = fileEvent.target.files[0].name;
   var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
   var ex_type = ['pdf','png'];
   var ex_check = this.isInArray(file_exe,ex_type);
   var ex = (fileEvent.target.files[0].name).split('.');
  // if(ex_check){
    if(type=="licence_document_file" && ex_check == true){
      this.workPermitForm.licence_document_name = fileEvent.target.files[0].name;
      this.healthCareFormTemp.append('licence_document_file',fileEvent.target.files[0]);
      this.file_validation = true;
    }else if(type=="licence_document_file" && ex_check != true){
      this.file_validation = false;
    }
    else if(type=="quality_manual_file" && ex_check  == true){
      this.workPermitForm.quality_manual_name = fileEvent.target.files[0].name;
      this.healthCareFormTemp.append('quality_manual_file',fileEvent.target.files[0]);
      this.file_validation2 = true;
    }else if(type=="quality_manual_file" && ex_check  != true){
      this.file_validation2 = false;
    }
    else if(type=="check_list_file" && ex_check  == true){
      this.workPermitForm.check_list_name= fileEvent.target.files[0].name;
      this.healthCareFormTemp.append('check_list_file',fileEvent.target.files[0]);
      this.file_validation4 = true;
    }else if(type=="check_list_file" && ex_check  != true){
      this.file_validation4 = false;
    }
    else if(type=="work_instruction_file" && ex_check  == true){
      this.workPermitForm.work_instruction_name= fileEvent.target.files[0].name;
      this.healthCareFormTemp.append('work_instruction_file',fileEvent.target.files[0]);
      this.file_validation3 = true;
    }else if(type=="work_instruction_file" && ex_check != true){
      this.file_validation3 = false;
    }
    
    // return true;
  // }
  // else{
  //   this.file_validation = false;
  //   return false;
  // }
}
 
 isInArray(value, array) {
  return array.indexOf(value) > -1;
}
  onSubmit(ngForm){
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
    this.healthCareFormTemp.append('data',JSON.stringify(this.workPermitForm));
    if(this.checkSecurity == true)
    {
      this.checkCaptchaValidation = true;
    }else{
      this.checkCaptchaValidation = false;
    }
    
    if(ngForm.form.valid && this.isSubmit){

      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.healthCareFormTemp)
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

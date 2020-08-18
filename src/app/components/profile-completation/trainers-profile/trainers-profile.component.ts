import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-trainers-profile',
  templateUrl: './trainers-profile.component.html',
  styleUrls: ['./trainers-profile.component.scss']
})
export class TrainersProfileComponent implements OnInit {

  trainersProfile:any = {};
  step1Data:any = {};
  step2Data:any = {};
  step3Data:any = {};
  arabic:any = {};
  english:any = {};
  others:any = {};
  file_validation1:boolean;
  file_validation2:boolean;
  file_validation3:boolean;
  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  headerSteps:any[] = [];
  userEmail:any;
  userType:any;

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');

    this.headerSteps.push(
      {
        title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:true, active:'user-done', nextStep:'educational_information'
      },
      {
        title:'educational_information', desc:'2. Educational <br> Information', activeStep:false, stepComp:false, active:'', nextStep:'applicant_trainer'
      },
      {
        title:'applicant_trainer', desc:'3. Applicant <br> Trainer', activeStep:false, stepComp:false, active:'', nextStep:null
      }
    );
  }

  validateFile(fileEvent: any,doc_name:any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf','png'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check && doc_name == 'qualification_degree'){
      // this.step2Data.qualification_degree_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('qualification_degree_file',fileEvent.target.files[0]);
      this.file_validation1 = true;
      return true;
    }else if(!ex_check && doc_name == 'qualification_degree'){
      this.file_validation1 = false;
      return false;
    }
    else if(ex_check && doc_name == 'education_specialization'){
      // this.step2Data.education_specialization_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('education_specialization_file',fileEvent.target.files[0]);
      this.file_validation2 = true;
      return true;
    }else if(!ex_check && doc_name == 'education_specialization'){
      this.file_validation2 = false;
      return false;
    }else if(ex_check && doc_name == 'further_education'){
      // this.step2Data.further_education_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('further_education_file',fileEvent.target.files[0]);
      this.file_validation3 = true;
      return true;
    }else if(!ex_check && doc_name == 'further_education'){
      this.file_validation3 = false;
      return false;
    }
    
  }

  stepClick(event: any){
    this.stepper.selected.completed = false;
    this.stepper.previous();
    // return;
  }

  onSubmitStep1(ngForm1:any) {
    if(ngForm1.form.valid) {
      this.trainersProfile.step1 = {};
      this.trainersProfile.step1 = this.step1Data;
      //console.log(this.trainersProfile);
      // this.stepper.next();

      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            // this.router.navigateByUrl('/sign-in');
          }else{
            
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep2(ngForm2:any) {
    if(ngForm2.form.valid) {
      this.trainersProfile = {};
      this.trainersProfile.step2 = {};
      
      this.step2Data.arabic = this.arabic;
      this.step2Data.english = this.english;
      this.step2Data.others = this.others;

      this.trainersProfile.step2 = this.step2Data;
      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;

      //console.log(this.trainersProfile);
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      //console.log(this.step2DataBodyFormFile);

      this.step2DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            // this.router.navigateByUrl('/sign-in');
          }else{
            
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep3(ngForm3:any) {
    
    if(ngForm3.form.valid) {
      if(this.step3Data.confirm_box != true){
        this.toastr.warning('Please check confirm box first','');
      }else{
        this.trainersProfile = {};
        this.trainersProfile.step3 = {};
        this.trainersProfile.step3 = this.step3Data;
        //console.log(this.trainersProfile);
        // this.stepper.next();

        this.trainersProfile.email = this.userEmail;
        this.trainersProfile.userType = this.userType;
        this.step3DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              // this.router.navigateByUrl('/sign-in');
            }else{
              
              this.toastr.warning(res['msg'], '');
            }
          });
      }
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }
}

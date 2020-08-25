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
  file_validation1:boolean = true;
  file_validation2:boolean = true;
  file_validation3:boolean = true;
  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  headerSteps:any[] = [];
  userEmail:any;
  userType:any;
  progressValue:any = 0;
  isCompleteness:any;
  tradeLicensedValidation1:any = false;
  tradeLicensedValidation2:any = false;
  tradeLicensedValidation3:any;
  today = new Date();

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) {
    this.today.setDate(this.today.getDate());
   }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');

    this.headerSteps.push(
      {
        title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:true, active:'user-done', nextStep:'educational_information'
      },
      {
        title:'educational_information', desc:'2. Educational <br> Information', activeStep:false, stepComp:false, active:'', nextStep:'applicant_trainer'
      },
      {
        title:'applicant_trainer', desc:'3. Applicant <br> Trainer', activeStep:false, stepComp:false, active:'', nextStep:'null'
      }
    );

    this.loadStep1Data();
  }

  loadStep1Data(){
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        if(res['status'] == true) {
          // console.log(res,'res');
          this.step1Data.first_name = res['data']['user_data'][0].first_name;
          this.step1Data.last_name = res['data']['user_data'][0].last_name;
          this.step1Data.personal_email = res['data']['user_data'][0].email;

          if(res['data'].step1[0].office_email) {
            this.progressValue = 40;
            // this.headerSteps[1].stepComp = true;
          }if(res['data'].step1[0].office_email && res['data'].step2[0].other_course) {
            this.progressValue = 80;
            // this.headerSteps[2].stepComp = true;
          }if(res['data'].step1[0].office_email && res['data'].step2[0].language && res['data'].step2[0].place) {
            this.progressValue = 100;
            
          }

          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];

            this.step1Data.office_email = step1.office_email;
            this.step1Data.date_of_birth = new Date(step1.dob);
            this.step1Data.mailing_address = step1.mailing_address;
            this.step1Data.phone_with_area = step1.phone;
            this.step1Data.fax_with_area = step1.fax_no;
            this.step1Data.office_institution = step1.office;
            this.step1Data.designation = step1.designation;
            this.step1Data.office_address = step1.office_address;
            this.step1Data.officephone_with_area = step1.office_tel_no;
            this.step1Data.officefax_with_area = step1.office_fax_no;
          }
          if(res['data'].step2 != '') {
            var step2 = res['data'].step2[0];

            let other_course = JSON.parse(step2.other_course);
            this.step2Data.which = other_course.which;
            this.step2Data.completeProfileFrom = new Date(other_course.from);
            this.step2Data.completeProfileTill = new Date(other_course.to);

            let education = JSON.parse(step2.education);
            this.step2Data.qualification_degree = education.qualification;
            this.step2Data.university_college = education.institute;
            this.step2Data.education_specialization = education.specialization;
            this.step2Data.further_education = education.further_education;
            this.step2Data.others_education = education.other_education_details;

            let language = JSON.parse(step2.language);
            this.english = language.english
            this.arabic = language.arabic
            this.others = language.others

            this.tradeLicensedValidation1 = this.constant.mediaPath+step2.qualification_file;
            this.tradeLicensedValidation2 = this.constant.mediaPath+step2.specialization_file;
            this.tradeLicensedValidation3 = this.constant.mediaPath+step2.further_education_file;
            // var language = step1.office_address;
            // this.step2Data.officephone_with_area = step1.office_tel_no;
            // this.step2Data.officefax_with_area = step1.office_fax_no;
          }

          if(res['data'].step3 != '') {
            var step3 = res['data'].step3[0];
            this.step3Data.place = step3.place;
            this.step3Data.date = new Date(step3.registration_date);
            this.step3Data.digital_signature = step3.signature;
            this.step3Data.confirm_box = step3.signature;
          }
        }
      });
  }

  validateFile(fileEvent: any,doc_name:any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf','png','jpg','jpeg','JPEG'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check && doc_name == 'qualification_degree'){
      // this.step2Data.qualification_degree_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('qualification_degree_file',fileEvent.target.files[0]);
      this.file_validation1 = true;
      this.tradeLicensedValidation1 = true;
      return true;
    }else if(!ex_check && doc_name == 'qualification_degree'){
      this.file_validation1 = false;
      this.tradeLicensedValidation1 = false;
      return false;
    }
    else if(ex_check && doc_name == 'education_specialization'){
      // this.step2Data.education_specialization_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('education_specialization_file',fileEvent.target.files[0]);
      this.file_validation2 = true;
      this.tradeLicensedValidation2 = true;
      return true;
    }else if(!ex_check && doc_name == 'education_specialization'){
      this.file_validation2 = false;
      this.tradeLicensedValidation2 = true;
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
            this.progressValue == 0 || this.progressValue < 40 ? this.progressValue = 40 : this.progressValue = this.progressValue ;
            this.Service.headerStepMove('educational_information',this.headerSteps,'personal_details');
          }else{
            
            this.toastr.warning(res['msg'], '');
          }
        });
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep2(ngForm2:any) {
    if(this.tradeLicensedValidation1 == false)
      {
        this.file_validation1 = false;
        this.toastr.warning('Please Fill required field','');
      }else if(this.tradeLicensedValidation2 == false)
      {
        this.file_validation2 = false;
        this.toastr.warning('Please Fill required field','');
      }
      else if(ngForm2.form.valid) {

      this.trainersProfile = {};
      this.trainersProfile.step2 = {};
      
      this.step2Data.arabic = this.arabic;
      this.step2Data.english = this.english;
      this.step2Data.others = this.others;

      this.trainersProfile.step2 = this.step2Data;
      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;

      //console.log(this.trainersProfile);
      // this.step2DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      //console.log(this.step2DataBodyFormFile);

      this.step2DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            // this.router.navigateByUrl('/sign-in');
            this.progressValue == 40 || this.progressValue < 80 ? this.progressValue = 80 : this.progressValue = this.progressValue ;
            this.Service.headerStepMove('applicant_trainer',this.headerSteps,'personal_details');
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
              this.progressValue == 80 || this.progressValue < 100 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
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

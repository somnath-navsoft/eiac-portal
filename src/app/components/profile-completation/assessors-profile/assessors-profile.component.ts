import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-assessors-profile',
  templateUrl: './assessors-profile.component.html',
  styleUrls: ['./assessors-profile.component.scss']
})
export class AssessorsProfileComponent implements OnInit {

  isProfileData: boolean = true;
  assessorsProfile:any = {};
  step1Data:any = {};
  step2Data:any = {};
  step3Data:any = {};
  step4Data:any = {};
  step5Data:any = {};
  file_validation1:boolean = true;
  file_validation2:boolean = true;
  file_validation3:boolean = true;
  arabic:any = {};
  english:any = {};
  others:any = {};
  step3ClickObj:any = {};
  list_auditor:Array<any> = [{}]; 
  attend_accreditation:Array<any> = [{}];
  attend_accreditation2:Array<any> = [{}];
  practical_assessment_experience:Array<any> = [{}];
  schemeSlideData:any;
  flag:any = 'inspection-bodies';
  schemeMainData:any;
  userEmail:any;
  userType:any;
  isCompleteness:any;
  headerSteps:any[] = [];
  progressValue:any;

  step1DataBodyFormFile: any = new FormData();
  step2DataBodyFormFile: any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  step4DataBodyFormFile:any = new FormData();
  step5DataBodyFormFile:any = new FormData();
  technicalFields:any[] = [];
  tradeLicensedValidation1:any = false;
  tradeLicensedValidation2:any = false;
  tradeLicensedValidation3:any;
  public isAccData: any = '';
  isdDynamicsopenClose:any;
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
      title:'educational_information', desc:'2. Educational <br> Information', activeStep:false, stepComp:false, active:'', nextStep:'employment'
      },
      {
      title:'employment', desc:'3. Employment', activeStep:false, stepComp:false, active:'', nextStep:'knowledge_experience'
      },
      {
      title:'knowledge_experience', desc:'4. Knowledge <br> And Experience', activeStep:false, stepComp:false, active:'', nextStep:'applicant_trainer'
      },
      {
      title:'applicant_trainer', desc:'5. Applicant <br> Trainer', activeStep:false, stepComp:false, active:'', nextStep:null
      }
    );

    this.step3Data.list_auditor = '1' ;
    this.step3Data.attend_accreditation = '1' ;
    this.step3Data.attend_accreditation2 = '1' ;
    this.step3Data.practical_assessment_experience = '1' ;

    // this.loadknowledgeExperience();
    this.loadStepsData();
  }

  // setexDate(){
  //   let cdate =this.assessorsProfile.date_of_birth;
  //   this.minDate = new Date(cdate  + (60*60*24*1000));
  // }
  
  isTableAcc(id) {
    this.isAccData = id;
    //console.log(this.isAccData);
  }
  isTableClose() {
    this.isAccData = '';
    //console.log(this.isAccData,'jhhjhjgghjgh');
  }

  loadStepsData() {
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        // console.log(res['data'],'data');
        if(res['status'] == true) {
          
          this.step1Data.first_name = res['data']['user_data'][0].first_name;
          this.step1Data.last_name = res['data']['user_data'][0].last_name;
          this.step1Data.personal_email = res['data']['user_data'][0].email;
          this.step1Data.phone_with_area = res['data']['user_data'][0].contact;

          this.technicalFields = res['data'].technical_field;

          if(res['data'].step1[0].office_email) {
            this.progressValue = 22;
          }if(res['data'].step1[0].office_email && res['data'].step2.detail) {
            this.progressValue = 44;
          }if(res['data'].step1[0].office_email && res['data'].step2.detail && res['data'].step3.experience_1) {
            this.progressValue = 66;
          }if(res['data'].step1[0].office_email && res['data'].step2.detail && res['data'].step3.experience_1 && res['data'].step4['technical_experience']) {
            this.progressValue = 88;
          }if(res['data'].step1 && res['data'].step2 && res['data'].step3 && res['data'].step4 && res['data'].step5[0].place) {
            this.progressValue = 100;
          }

          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];
            this.step1Data.office_email = step1.office_email;
            this.step1Data.date_of_birth = step1.dob;
            this.step1Data.mailing_address = step1.mailing_address;
            // this.step1Data.phone_with_area = step1.first_name;
            this.step1Data.fax_with_area = step1.fax_no;
            this.step1Data.office_institution = step1.office;
            this.step1Data.designation = step1.designation;
            this.step1Data.office_address = step1.office_address;
            this.step1Data.officephone_with_area = step1.office_tel_no;
            this.step1Data.officefax_with_area = step1.office_fax_no;
          }
          if(res['data'].step2 != '') {
            var step2 = res['data'].step2;

            var language = step2['language'];
            for(let key in language)
            {
              if(language[key].language == 'arabic')
              {
                this.arabic = language[key];
              }
              if(language[key].language == 'english')
              {
                this.english = language[key];
              }
              if(language[key].language == 'others')
              {
                this.others = language[key];
              }
            }

            this.step2Data.qualification_degree = step2['education'][0].detail;
            this.step2Data.university_college = step2['education'][0].organization;
            this.step2Data.education_specialization = step2['education'][0].specialization;
            this.step2Data.further_education = step2['further_education'][0].detail;
            this.step2Data.others_education = step2['others_education'][0].detail;
            this.step2Data.which = step2['which_forum'][0].organization;
            this.step2Data.completeProfileFrom = new Date(step2['which_forum'][0].date_from);
            this.step2Data.completeProfileTill = new Date(step2['which_forum'][0].date_to);

            this.tradeLicensedValidation1 = this.constant.mediaPath+step2.qualification_file;
            this.tradeLicensedValidation2 = this.constant.mediaPath+step2.specialization_file;
            this.tradeLicensedValidation3 = this.constant.mediaPath+step2.further_education_file;
          }
          if(res['data'].step3 != '') {
            var step3 = res['data'].step3;
            this.step3Data.list_auditor = step3.experience_1 != '' ? '1' : '0';
            this.list_auditor = step3.experience_1;

            this.step3Data.attend_accreditation = step3.experience_2 != '' ? '1' : '0';
            this.attend_accreditation = step3.experience_2;

            this.step3Data.attend_accreditation2 = step3.experience_3 != '' ? '1' : '0';
            this.attend_accreditation2 = step3.experience_3;

            this.step3Data.practical_assessment_experience = step3.experience_4 != '' ? '1' : '0';
            this.practical_assessment_experience = step3.experience_4;
          }
          if(res['data'].step4 != '') {
            // console.log(res['data'].technical_field);
            var step4 = res['data'].step4;
            // console.log(step4['technical_experience'],'step5');
            for(let key in step4['technical_experience']) {
              this.technicalFields.forEach(res => {
                for(let nxtkey in res['technical_fields']) {
                  if(key == res['technical_fields'][nxtkey].field_mgmt) {
                    res['technical_fields'][nxtkey].knowledge_experienced = step4['technical_experience'][key];
                  }
                }
              });
            }
            // console.log(this.technicalFields,'step5');
          }
          if(res['data'].step5 != '') {
            var step5 = res['data'].step5[0];
            this.step5Data.confirm_box = step5.status;
            this.step5Data.place = step5.place;
            this.step5Data.digital_signature = step5.signature;
            this.step5Data.date = new Date(step5.date);
          }
        }
      });
  }

  dynamicsopenClose(id,status)
  {
    if(status == 'open')
    {
      this.isdDynamicsopenClose = id;
    }else if(status == 'close'){
      this.isdDynamicsopenClose = '0';
    }
    //console.log(this.isdDynamicsopenClose);
    //console.log(status);
  }

  // loadknowledgeExperience() {
  //   this.Service.getwithoutData('https://service.eiac.gov.ae/webservice/service_page/?data=inspection-bodies')
  //   .subscribe(
  //     res => {
  //       this.schemeMainData = res['schemeData'];
  //       this.schemeSlideData = res['schemeData'];
  //       // //console.log(this.schemeSlideData,'schemeSlideData');
  //     })
  // }

  profileData() {
    this.isProfileData = !this.isProfileData;
  }

  addRow(obj:any) {
    var newRow     =   {};
    obj.push(newRow);
  }

  removeRow(obj:any,index) {
    obj.splice(index, 1);
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
      this.tradeLicensedValidation2 = false;
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

  step3Click(val:any,type:any){
    if(type == "list_auditor_click" && val == 1){
      this.step3ClickObj.list_auditor = 1 ;
    }else if(type == "list_auditor_click" && val == 0){
      this.step3ClickObj.list_auditor = 0 ;
    }else if(type == "attend_accreditation_click" && val == 1){
      this.step3ClickObj.attend_accreditation = 1 ;
    }else if(type == "attend_accreditation_click" && val == 0){
      this.step3ClickObj.attend_accreditation = 0 ;
    }else if(type == "attend_accreditation2_click" && val == 1){
      this.step3ClickObj.attend_accreditation2 = 1 ;
    }else if(type == "attend_accreditation2_click" && val == 0){
      this.step3ClickObj.attend_accreditation2 = 0 ;
    }else if(type == "practical_assessment_experience" && val == 1){
      this.step3ClickObj.practical_assessment_experience = 1 ;
    }else if(type == "practical_assessment_experience" && val == 0){
      this.step3ClickObj.practical_assessment_experience = 0 ;
    }
  }

  onSubmitStep1(ngForm1:any) {
    if(ngForm1.form.valid) {
      this.assessorsProfile.step1 = {};
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;
      this.assessorsProfile.step1 = this.step1Data;
      //console.log(this.assessorsProfile);

      this.step1DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          console.log(res,'res')
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            this.progressValue == 0 || this.progressValue < 22 ? this.progressValue = 22 : this.progressValue = this.progressValue ;
            this.Service.headerStepMove('educational_information',this.headerSteps,'personal_details');
            // this.router.navigateByUrl('/sign-in');
          }else{
            
            this.toastr.warning(res['msg'], '');
          }
        });
      this.stepper.next();
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
        this.assessorsProfile = {};
        this.assessorsProfile.step2 = {};
        
        this.step2Data.arabic = this.arabic;
        this.step2Data.english = this.english;
        this.step2Data.others = this.others;

        this.assessorsProfile.step2 = this.step2Data;
        this.assessorsProfile.email = this.userEmail;
        this.assessorsProfile.userType = this.userType;

        //console.log(this.assessorsProfile);
        this.step2DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
        //console.log(this.step2DataBodyFormFile);
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              // this.router.navigateByUrl('/sign-in');
              this.progressValue == 22 || this.progressValue < 44 ? this.progressValue = 44 : this.progressValue = this.progressValue ;
              this.Service.headerStepMove('employment',this.headerSteps,'educational_information');
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
      this.assessorsProfile = {};
      this.assessorsProfile.step3 = {};
      this.assessorsProfile.step3 = this.step3Data;
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;

      this.assessorsProfile.step3['list_auditorArr'] = [];
      this.assessorsProfile.step3['attend_accreditationArr'] = [];
      this.assessorsProfile.step3['attend_accreditation2Arr'] = [];
      this.assessorsProfile.step3['practical_assessment_experienceArr'] = [];
      
      if(this.list_auditor){
        this.assessorsProfile.step3['list_auditorArr'] = this.list_auditor;
      }
      if(this.attend_accreditation){
        this.assessorsProfile.step3['attend_accreditationArr'] = this.attend_accreditation;
      }
      if(this.attend_accreditation2){
        this.assessorsProfile.step3['attend_accreditation2Arr'] = this.attend_accreditation2;
      }
      if(this.practical_assessment_experience){
        this.assessorsProfile.step3['practical_assessment_experienceArr'] = this.practical_assessment_experience;
      }

      this.step3DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      //console.log(this.step2DataBodyFormFile);
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            // this.router.navigateByUrl('/sign-in');
            this.progressValue == 44 || this.progressValue < 66 ? this.progressValue = 66 : this.progressValue = this.progressValue ;
            this.Service.headerStepMove('knowledge_experience',this.headerSteps,'employment');
          }else{
            
            this.toastr.warning(res['msg'], '');
          }
        });
      //console.log(this.assessorsProfile);
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep4(ngForm4:any) {
    // //console.log(this.schemeSlideData,'schemeSlideData');
    // schemeMainData
    if(ngForm4.form.valid) {

        this.assessorsProfile = {};
        this.assessorsProfile.step4 = {};
        this.assessorsProfile.email = this.userEmail;
        this.assessorsProfile.userType = this.userType;

        this.assessorsProfile.step4['technical_experience'] = [];

        var blankArr = {};
        // primaryJson['course'] = [];
        this.technicalFields.forEach((res,key) => {
          for(let key2 in res['technical_fields']){
            // console.log(res['technical_fields'][key2],'knowledge_experienced');
            if(res['technical_fields'][key2].knowledge_experienced && res['technical_fields'][key2].knowledge_experienced != ''){
              var key1 = res['technical_fields'][key2].field_mgmt;
              var value = res['technical_fields'][key2]['knowledge_experienced'];
              
              blankArr[key1] = value;
              
            }
            this.assessorsProfile.step4['technical_experience'] = blankArr;
            
          }
        });
        // console.log(this.technicalFields,'technicalFields');

        this.step4DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
        //console.log(this.step2DataBodyFormFile);
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step4DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              // this.router.navigateByUrl('/sign-in');
              this.progressValue == 66 || this.progressValue < 88 ? this.progressValue = 88 : this.progressValue = this.progressValue ;
              this.Service.headerStepMove('applicant_trainer',this.headerSteps,'knowledge_experience');
            }else{
              
              this.toastr.warning(res['msg'], '');
            }
          });
        // this.Service.headerStepMove('knowledge_experience',this.headerSteps,'applicant_trainer');
        
      }else{
        this.toastr.warning('Please Fill required field','');
      }

    // this.schemeSlideData.find(res => res['knowledge_experienced'] != '' );
  }

  onSubmitStep5(ngForm5:any) {
    
    if(ngForm5.form.valid) {
      if(this.step5Data.confirm_box != true){
        this.toastr.warning('Please check confirm box first','');
      }else{
        this.assessorsProfile = {};
        this.assessorsProfile.step5 = this.step5Data;
        //console.log(this.assessorsProfile);

        this.assessorsProfile.email = this.userEmail;
        this.assessorsProfile.userType = this.userType;
        this.step5DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step5DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              this.progressValue == 88 || this.progressValue < 100 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
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

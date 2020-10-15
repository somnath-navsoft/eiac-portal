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
  profileComplete:any;
  tradeLicensedValidation1:any = false;
  tradeLicensedValidation2:any = false;
  tradeLicensedValidation3:any;
  today = new Date();
  minDate = new Date();
  titleArr:any[] = [];
  titleFind:any;
  loader:boolean = true;
  firstName:any;
  searchCountryLists:any[] = [];
  userId:any;
  whichForum:any[] = [{}];
  whichLanguage:any[] = [{}];
  languageArr:any = [];

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) {
    this.today.setDate(this.today.getDate());
   }

  ngOnInit() {
    this.stepDefaultValue();
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');
    this.userId = sessionStorage.getItem('userId');

    this.headerSteps.push(
      {
        title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      },
      {
        title:'educational_information', desc:'2. Educational <br> Information', activeStep:false, stepComp:false, icon:'icon-book', activeClass:''
      },
      {
        title:'applicant_trainer', desc:'3. Applicant <br> Trainer', activeStep:false, stepComp:false, icon:'icon-doc-edit', activeClass:''
      }
    );

    this.loadStep1Data();
    this.titleArr = ['Mr.','Ms.','Dr.','Prof.','Mrs.'];
    this.loadLanguages();
  }

  addRow(obj:any) {
    var newRow     =   {};
    obj.push(newRow);
  }

  removeRow(obj:any,index) {
    obj.splice(index, 1);
  }

  loadLanguages = async() => {
    let countryList =  this.Service.getLanguages();
    await countryList.subscribe(record => {
      // console.log(record,'record');
      this.languageArr = record['languages'];
    });
    
  }

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }

  stepDefaultValue(){
    this.step1Data.first_name = '';
    this.step1Data.last_name = '';
    this.step1Data.personal_email = '';
    this.step1Data.office_email = '';
    this.step1Data.date_of_birth = '';
    this.step1Data.mailing_address = '';
    this.step1Data.phone_with_area = '';
    this.step1Data.fax_with_area = '';
    this.step1Data.office_institution = '';
    this.step1Data.designation = '';
    this.step1Data.office_address = '';
    this.step1Data.officephone_with_area = '';
    this.step1Data.officefax_with_area = '';

    this.step2Data.which = '';
    this.step2Data.completeProfileFrom = '';
    this.step2Data.completeProfileTill = '';

    this.step2Data.qualification_degree = '';
    this.step2Data.university_college = '';
    this.step2Data.education_specialization = '';
    this.step2Data.further_education = '';
    this.step2Data.others_education = '';

    this.english = {
      read:0,
      write:0,
      speak:0
    };
    this.arabic = {
      read:0,
      write:0,
      speak:0
    };
    this.others = {
      read:0,
      write:0,
      speak:0
    };

    this.step3Data.place = '';
    this.step3Data.date = '';
    this.step3Data.digital_signature = '';
    this.step3Data.confirm_box = '';
  }

  loadStep1Data(){
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail+'&id='+this.userId)
    .subscribe(
      res => {
        if(res['status'] == true) {
          this.loader = true;
          
          var first_nameData = res['data']['user_data'][0].first_name.split(' ');
          
          this.titleArr.forEach((res2,key) => {
            if(res2 == first_nameData[0]){
              this.titleFind = first_nameData[0];
              // this.firstName = first_nameData[1];
            }
          })
          this.step1Data.title = this.titleFind;
          this.step1Data.first_name = this.titleFind != '' && this.titleFind != undefined ? first_nameData[1] : first_nameData[0];
          this.step1Data.last_name = res['data']['user_data'][0].last_name;
          this.step1Data.personal_email = res['data']['user_data'][0].email;


          var other_course = res['data'].step2['all_data'][0].other_course != null ? JSON.parse(res['data'].step2['all_data'][0].other_course) : '';
          var education = res['data'].step2['all_data'][0].education != null ? JSON.parse(res['data'].step2['all_data'][0].education) : '';

          if(res['data'].step1 && res['data'].step1 != '' && res['data'].step1[0] && res['data']['user_data'][0].first_name != "" && res['data'].step1[0].office_email != "" && res['data'].step1[0].dob != "null" && res['data'].step1[0].mailing_address != "" && res['data'].step1[0].phone != "" && res['data'].step1[0].office != "" && res['data'].step1[0].designation != "" && res['data'].step1[0].office_address != "" && res['data'].step1[0].office_tel_no != "") {
            this.progressValue = 40;
            this.Service.moveSteps('personal_details','educational_information', this.headerSteps);
            // this.headerSteps[1].stepComp = true;
          }if(res['data'].step2 && res['data'].step2 != '' && res['data'].step2['all_data'][0] && education != null && education.qualification != '' && education.institute != '' && education.specialization != '' && res['data'].step2['all_data'][0].qualification_file != null && res['data'].step2['all_data'][0].specialization_file != null && res['data'].step2['language'].length > 0  && res['data'].step2['which_forum'].length > 0) {
            this.progressValue = 80;
            this.Service.moveSteps('educational_information','applicant_trainer', this.headerSteps);
            // this.headerSteps[2].stepComp = true;
          }if(res['data'].step3 != '' && res['data'].step3[0] && res['data'].step3[0].place && res['data'].step3[0].place != null && res['data'].step3[0].registration_date != null && res['data'].step3[0].signature != null) {
            this.progressValue = 100;
          }

          if(res['data'].step1 && res['data'].step1 != '' && res['data'].step1[0]) {
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
          if(res['data'].step2 && res['data'].step2 != '' && res['data'].step2['all_data'][0]) {
            var step2 = res['data'].step2['all_data'][0];

            // let other_course = JSON.parse(step2.other_course);
            // if(other_course != null) {
            //   this.step2Data.which = other_course.which;
            //   this.step2Data.completeProfileFrom = new Date(other_course.from);
            //   this.step2Data.completeProfileTill = new Date(other_course.to);
            // }
            this.whichLanguage = res['data'].step2.language.length > 0 ? res['data'].step2.language : [{}];
            this.whichForum = res['data'].step2.which_forum.length > 0 ? res['data'].step2.which_forum : [{}];

            if(education != null) {
              this.step2Data.qualification_degree = education.qualification;
              this.step2Data.university_college = education.institute;
              this.step2Data.education_specialization = education.specialization;
              this.step2Data.further_education = education.further_education;
              this.step2Data.others_education = education.other_education_details;

              this.tradeLicensedValidation1 = step2.qualification_file != null ? this.constant.mediaPath+step2.qualification_file : '';
              this.tradeLicensedValidation2 = step2.specialization_file != null ? this.constant.mediaPath+step2.specialization_file : '';
              this.tradeLicensedValidation3 = step2.further_education_file != null ? this.constant.mediaPath+step2.further_education_file : '';
            }

            // this.whichLanguage = step2.language;
            // this.whichForum = step2.which_forum;

            // let language = JSON.parse(step2.language);
            // if(language != null) {
            //   this.english = language.english
            //   this.arabic = language.arabic
            //   this.others = language.others
            // }
            // var language = step1.office_address;
            // this.step2Data.officephone_with_area = step1.office_tel_no;
            // this.step2Data.officefax_with_area = step1.office_fax_no;
          }

          if(res['data'].step3 && res['data'].step3 != '' && res['data'].step3[0]) {
            var step3 = res['data'].step3[0];

            this.step3Data.place = step3.place != null ? step3.place : '' ;
            this.step3Data.date = step3.registration_date != null ? new Date(step3.registration_date) : '';
            this.step3Data.digital_signature = step3.signature != null ? step3.signature : '';
            this.step3Data.confirm_box = step3.place  != null ? step3.status : '';
          }
          
        }
      });
  }

  getPlaceName(data)
    {
      if(typeof this.step3Data.place != 'undefined')
      {
        this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step3Data.place+'.json?access_token='+this.Service.mapboxToken+'','')
          .subscribe(res => {
              // //console.log(res['features']);
              this.searchCountryLists = res['features'];
            },
            error => {
            
        })
      }
    }

  validateFile(fileEvent: any,doc_name:any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check && doc_name == 'qualification_degree'){
      // this.step2Data.qualification_degree_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('qualification_file',fileEvent.target.files[0]);
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
      this.step2DataBodyFormFile.append('specialization_file',fileEvent.target.files[0]);
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
      this.trainersProfile = {};
      this.trainersProfile.step1 = {};
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.trainersProfile.step1 = this.step1Data;
      //console.log(this.trainersProfile);
      // this.stepper.next();

      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            // this.router.navigateByUrl('/sign-in');
            this.progressValue == 0 || this.progressValue < 40 ? this.progressValue = 40 : this.progressValue = this.progressValue ;
            // this.Service.headerStepMove('educational_information',this.headerSteps,'personal_details');
            this.Service.moveSteps('personal_details','educational_information', this.headerSteps);
            this.loader = true;
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
      
      // this.step2Data.arabic = this.arabic;
      // this.step2Data.english = this.english;
      // this.step2Data.others = this.others;

      this.trainersProfile.step2 = this.step2Data;
      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;
      this.trainersProfile.step2['whichLanguage'] = [];
      this.trainersProfile.step2['whichForum'] = [];
      if(this.whichLanguage){
        this.trainersProfile.step2['whichLanguage'] = this.whichLanguage;
      }
      if(this.whichForum){
        this.trainersProfile.step2['whichForum'] = this.whichForum;
      }

      //console.log(this.trainersProfile);
      // this.step2DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      //console.log(this.step2DataBodyFormFile);
      this.loader = false;

      this.step2DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
            // this.router.navigateByUrl('/sign-in');
            this.progressValue == 40 || this.progressValue < 80 ? this.progressValue = 80 : this.progressValue = this.progressValue ;
            // this.Service.headerStepMove('applicant_trainer',this.headerSteps,'personal_details');
            this.Service.moveSteps('educational_information','applicant_trainer', this.headerSteps);
            this.loader = true;
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
        this.loader = false;
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              this.progressValue == 80 || this.progressValue < 100 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
              this.loader = true;
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

  savedraftStep(stepCount) {
    if(stepCount == 'step1') {
      this.trainersProfile = {};
      this.trainersProfile.step1 = {};
      this.trainersProfile.isDraft = 1;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.trainersProfile.step1 = this.step1Data;

      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(stepCount == 'step2') {
      this.trainersProfile = {};
      this.trainersProfile.step2 = {};
      
      this.step2Data.arabic = this.arabic;
      this.step2Data.english = this.english;
      this.step2Data.others = this.others;
      this.trainersProfile.isDraft = 1;

      this.trainersProfile.step2 = this.step2Data;
      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;
      this.loader = false;
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }else if(stepCount == 'step3') {
      this.trainersProfile = {};
      this.trainersProfile.step3 = {};
      this.trainersProfile.isDraft = 1;
      this.trainersProfile.step3 = this.step3Data;

      this.trainersProfile.email = this.userEmail;
      this.trainersProfile.userType = this.userType;
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.trainersProfile));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          this.loader = true;
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
        });
    }
  }
}

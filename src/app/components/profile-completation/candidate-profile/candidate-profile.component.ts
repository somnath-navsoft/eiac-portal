import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  candidateProfile:any = {};
  // candidateFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  headerSteps:any[] = [];
  isCompleteness:any;
  profileComplete:any;
  progressValue:any = 0;
  today = new Date();
  step1Data:any = {};
  step2Data:any = {};
  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  tradeLicensedValidation:any = false;
  titleArr:any[] = [];
  titleFind:any;
  file_validation:boolean = true;
  nameOftheOwner:any[] = [{}];
  companyBodMembers:any[] = [{}];
  loader:boolean = true;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { 
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.stepDefaultValue();
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');

    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      },
      {
      title:'application_information', desc:'2. Application <br> Information', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      }
    );

    this.loadStep1Data();
    this.titleArr = ['Mr.','Ms.','Dr.','Prof.','Mrs.'];
  }

  stepDefaultValue() {
    // this.step1Data.title = '';
    this.step1Data.first_name = '';
    this.step1Data.last_name = '';
    this.step1Data.date_of_birth = '';
    this.step1Data.company_email = '';
    this.step1Data.personal_email = '';
    this.step1Data.designation = '';
    this.step1Data.nationality = '';
    this.step1Data.mailing_address = '';
    this.step1Data.office_institution = '';
    this.step1Data.phone_with_area = '';
    this.step1Data.fax_with_area = '';
    this.step1Data.office_address = '';
    this.step1Data.officephone_with_area = '';
    this.step1Data.trade_license_number = '';
    this.step2Data.contact_person_name = '';
    this.step2Data.contact_person_designation = '';
    this.step2Data.contact_person_email = '';
    this.step2Data.contact_person_phone = '';
    this.step2Data.contact_person_mobile = '';
    this.step2Data.authorised_contact = '';
    this.step2Data.date_of_establishment = '';
    this.step2Data.legal_license = '';
    this.step2Data.certification_main_activity = '';
    this.step2Data.main_activity_describe = '';
    this.nameOftheOwner = [{
      name:'',
      designation:'',
      mobile_no:'',
      phone_no:'',
      email:'',
    }];
    this.companyBodMembers = [{
      name:'',
      bod_company:'',
      director:'',
      designation:'',
      authorized_contact_person:'',
      mobile_no:'',
      phone_no:'',
      email:'',
    }];
  }

  validateFile(fileEvent: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.step1DataBodyFormFile.append('trade_license',fileEvent.target.files[0]);
      this.file_validation = true;
      this.tradeLicensedValidation = true;
      return true;
    }else{
      this.file_validation = false;
      this.tradeLicensedValidation = false;
    }
  }
  
  loadStep1Data() {
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {

        if(res['data'].step1) {
          this.progressValue = 100;
        }

        if(res['data'].step1 != '') {
          var first_nameData = res['data']['user_data'][0].first_name.split(' ');
          this.titleArr.forEach((res,key) => {
            if(res == first_nameData[0]){
              this.titleFind = first_nameData[0];
            }
          })
          
          this.step1Data.title = this.titleFind;
          this.step1Data.first_name = first_nameData[1];
          this.step1Data.last_name = res['data']['user_data'][0].last_name;
          this.step1Data.personal_email = res['data']['user_data'][0].email;
          
          if(res['data'].step1 && res['data'].step1[0].designation) {
            this.progressValue = 50;
            this.Service.moveSteps('personal_details','application_information', this.headerSteps);
          }if(res['data'].step1 && res['data'].step1[0].designation && res['data'].step2 && res['data'].step2.cabContactData[0].designation) {
            this.progressValue = 100;
          }
          
          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];

            this.step1Data.title = step1.cab_name;
            this.step1Data.date_of_birth = new Date(step1.dob);
            // this.fileType = this.constant.mediaPath+step1.trade_license;
            // this.step1Data.trade_license = this.constant.mediaPath+step1.trade_license;
            this.tradeLicensedValidation = this.constant.mediaPath+step1.trade_license;
            this.step1Data.phone_with_area = step1.tel_no;
            this.step1Data.fax_with_area = step1.fax_no;
            this.step1Data.office_email = step1.official_email;
            this.step1Data.registered_address = step1.registered_address;
            this.step1Data.mailing_address = step1.mailing_address;
            this.step1Data.zip = step1.po_box;
            this.step1Data.city = step1.city;
            this.step1Data.state = step1.state;
            this.step1Data.country = step1.country;
            this.step1Data.office_institution = step1.office;
            this.step1Data.designation = step1.designation;
            this.step1Data.office_address = step1.office_address;
            this.step1Data.officephone_with_area = step1.office_tel_no;
            this.step1Data.officefax_with_area = step1.office_fax_no;
            this.step1Data.trade_license_number = step1.trade_license_number;
            this.step1Data.official_website = step1.official_website;
            this.step1Data.date_issue = new Date(step1.date_of_issue);
            this.step1Data.date_expire = new Date(step1.date_of_expiry);
            this.step1Data.date_of_establisment = new Date(step1.date_of_establisment);
            // this.step1Data.title = step1.is_certification_main_activity;
          }
        }
      });
  }

  // onSubmit(ngForm:any) {
  //   if(ngForm.form.valid) {
  //     this.candidateProfile.email = this.userEmail;
  //     this.candidateProfile.userType = this.userType;
  //     this.candidateProfile.isDraft = 0;
  //     this.candidateFormFile.append('data',JSON.stringify(this.candidateProfile));
  //     this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.candidateFormFile)
  //       .subscribe(
  //         res => {
  //           console.log(res,'res')
  //           if(res['status'] == true) {
  //             this.toastr.success(res['msg'], '');
  //             this.progressValue == 0 || this.progressValue < 100 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
  //             // this.router.navigateByUrl('/sign-in');
  //           }else{
              
  //             this.toastr.warning(res['msg'], '');
  //           }
  //         });
  //   }else{
  //     this.toastr.warning('Please Fill required field','');
  //   }
  // }

  onSubmitStep1(ngForm1) {
    //console.log(this.candidateProfile);
    if(ngForm1.form.valid && this.tradeLicensedValidation != false) {
      this.candidateProfile = {};
      this.candidateProfile.step1 = {};
      this.candidateProfile.email = this.userEmail;
      this.candidateProfile.userType = this.userType;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.candidateProfile.step1 = this.step1Data;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.candidateProfile));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              this.progressValue == 0 || this.progressValue < 50 ? this.progressValue = 50 : this.progressValue = this.progressValue ;
              this.Service.moveSteps('personal_details','application_information', this.headerSteps);
            }else{
              this.toastr.warning(res['msg'], '');
            }
            this.loader = true;
          });
    }else if(ngForm1.form.valid && this.tradeLicensedValidation == false) {
      this.file_validation = false;
      this.toastr.warning('Please Fill required field','');
    }
    else {
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep2(ngForm2) {
    if(ngForm2.form.valid) {
      
      this.candidateProfile = {};
      this.candidateProfile.step2 = {};

      this.candidateProfile.email = this.userEmail;
      this.candidateProfile.userType = this.userType;
      this.candidateProfile.step2 = this.step2Data;

      this.candidateProfile.step2['nameOftheOwner'] = [];
      this.candidateProfile.step2['companyBodMembers'] = [];
      
      if(this.nameOftheOwner) {
        this.candidateProfile.step2['nameOftheOwner'] = this.nameOftheOwner;
      }
      if(this.companyBodMembers) {
        this.candidateProfile.step2['companyBodMembers'] = this.companyBodMembers;
      }
      // console.log(this.candidateProfile);
      // this.candidateProfileFile.append('data',JSON.stringify(this.candidateProfile));
      
      // this.candidateProfile.step2 = this.companyBodMembers;
      // this.candidateProfile.step2 = this.nameOftheOwner;
      this.loader = false;
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.candidateProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              this.progressValue == 50 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
              // this.router.navigateByUrl('/sign-in');
            }else{
              this.toastr.warning(res['msg'], '');
            }
            this.loader = true;
          });
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  savedraftStep(stepCount) {
    if(stepCount == 'step1') {
      this.candidateProfile = {};
      this.candidateProfile.step1 = {};
      this.candidateProfile.email = this.userEmail;
      this.candidateProfile.userType = this.userType;
      this.candidateProfile.isDraft = 1;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.candidateProfile.step1 = this.step1Data;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.candidateProfile));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }else if(stepCount == 'step2'){
      this.candidateProfile = {};
      this.candidateProfile.step2 = {};

      this.candidateProfile.email = this.userEmail;
      this.candidateProfile.userType = this.userType;
      this.candidateProfile.step2 = this.step2Data;
      this.candidateProfile.isDraft = 1;

      this.candidateProfile.step2['nameOftheOwner'] = [];
      this.candidateProfile.step2['companyBodMembers'] = [];
      
      if(this.nameOftheOwner) {
        this.candidateProfile.step2['nameOftheOwner'] = this.nameOftheOwner;
      }
      if(this.companyBodMembers) {
        this.candidateProfile.step2['companyBodMembers'] = this.companyBodMembers;
      }
      this.loader = false;
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.candidateProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
          }else{
            
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }
  }

  addRow(obj:any) {
    var newRow     =   {};
    obj.push(newRow);
  }

  removeRow(obj:any,index) {
    obj.splice(index, 1);
  }
}

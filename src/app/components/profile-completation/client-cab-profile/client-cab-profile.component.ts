import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import { async } from '@angular/core/testing';
// import * as data from '../../../../assets/csc-json/cities.json';
// import SampleJson from './cities.json';

@Component({
  selector: 'app-client-cab-profile',
  templateUrl: './client-cab-profile.component.html',
  styleUrls: ['./client-cab-profile.component.scss']
})
export class ClientCabProfileComponent implements OnInit {

  clientCabForm:any = {};
  step1Data:any = {};
  step2Data:any = {};
  // clientCabFormFile:any = new FormData();
  nameOftheOwner: Array<any> = [{}];
  companyBodMembers: Array<any> = [{}];
  is_bod:any;
  userEmail:any;
  userType:any;
  getCountryLists:any;
  allStateList: Array<any> = [];
  allCityList: Array<any> = [];
  step1DataBodyFormFile:any = new FormData();
  step2DataBodyFormFile:any = new FormData();
  file_validation:boolean = true;
  progressValue:any = 0;
  headerSteps:any[] = [];
  fileType:File;
  fileAny:any;
  isCompleteness:any;
  profileComplete:any;
  tradeLicensedValidation:any = false;
  today = new Date();
  criteriaMaster: any[] = [];
  dutyTime1:boolean = true;
  dutyTime2:boolean = true;
  dutyTime3:boolean = true;
  ownOrgBasicInfo:any[] = [{}];
  ownOrgMembInfo:any[] = [{}];
  accreditationInfo:any[] = [{}];
  addMinutesToTime:any;
  getDutyTimeForm1IndexValue:number;
  searchCountryLists:any[] = [];
  titleArr:any[] = [];
  titleFind:any;
  loader:boolean = true;
  
  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { 
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.stepDefaultValue();
    this.step2Data.is_bod = '0';
    this.addMinutesToTime = this.Service.addMinutesToTime();

    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');
    // this.nameOftheOwner ? this.clientCabForm.step2 = this.nameOftheOwner : '';
    // this.clientCabForm.nameOftheOwner = this.nameOftheOwner;
    // this.clientCabForm.companyBodMembers = this.companyBodMembers
    // this.companyBodMembers ? this.clientCabForm.step2 = this.companyBodMembers : '';
    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      },
      {
      title:'application_information', desc:'2. Application <br> Information', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      }
    );
   this.titleArr = ['Mr.','Ms.','Dr.','Prof.','Mrs.'];
   this.loadStep1Data();
    // console.log(this.constant.API_ENDPOINT.profileService,'hyyhhh')
  }

  stepDefaultValue() {
    this.step1Data.first_name = '';
    this.step1Data.last_name = '';
    this.step1Data.date_of_birth = '';
    this.step1Data.company_email = '';
    this.step1Data.designation = '';
    this.step1Data.nationality = '';
    this.step1Data.mailing_address = '';
    this.step1Data.office_institution = '';
    this.step1Data.phone_with_area = '';
    this.step1Data.fax_with_area = '';
    this.step1Data.office_address = '';
    this.step1Data.officephone_with_area = '';
    this.step1Data.trade_license_number = '';
    this.step1Data.applicant_commercial_name = '';
    this.step1Data.applicant_location = '';
    this.step1Data.applicant_mailing_address = '';
    this.step1Data.applicant_phone_with_area = '';
    this.step1Data.applicant_fax_with_area = '';
    this.step1Data.applicant_official_email = '';
    this.step2Data.contact_person_name = '';
    this.step2Data.contact_person_designation = '';
    this.step2Data.contact_person_email = '';
    this.step2Data.contact_person_phone = '';
    this.step2Data.contact_person_mobile = '';
    this.step2Data.authorised_contact = '';
    this.nameOftheOwner = [{
      name:'',
      designation:'',
      mobile_no:'',
      phone_no:'',
      email:'',
    }];
    this.step2Data.is_bod = '';
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
    this.step2Data.date_of_establishment = '';
    this.step2Data.legal_license = '';
    this.step2Data.certification_main_activity = '';
    this.step2Data.main_activity_describe = '';
  }

  getDutyTimeForm1Index(indexVal){
    //console.log('Get Index: ', indexVal.value, " -- ", indexVal);
      var keyVal;
      for(keyVal in this.addMinutesToTime){
          //console.log(keyVal);
          if(indexVal.value === this.addMinutesToTime[keyVal].val){
            //console.log("match ", this.addMinutesToTime[keyVal].val);
            this.getDutyTimeForm1IndexValue = keyVal;
            return;
          }
      }
  }

  loadStep1Data(){

    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        // console.log(res['data'],'data');
        if(res['status'] == true) {

          var first_nameData = res['data']['user_data'][0].first_name.split(' ');
          this.titleArr.forEach((res,key) => {
            if(res == first_nameData[0])
            this.titleFind = first_nameData[0];
          })
          
          this.step1Data.title = this.titleFind;
          this.step1Data.first_name = res['data']['user_data'][0].first_name;
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
          if(res['data'].step2 != '') {
            var step2 = res['data'].step2; 

            this.nameOftheOwner = step2.cabOwnerData;
            this.companyBodMembers = step2.cabBodData;
            this.step2Data.contact_person_name = step2.cabContactData[0].name;
            this.step2Data.contact_person_designation = step2.cabContactData[0].designation;
            this.step2Data.contact_person_email = step2.cabContactData[0].email;
            this.step2Data.contact_person_mobile = step2.cabContactData[0].mobile_no;
            this.step2Data.contact_person_phone = step2.cabContactData[0].phone_no;
            this.step2Data.authorised_contact = step2.cabContactData[0].contacts == true ? 1 : 0 ;
            this.step2Data.is_bod = step2.cabBodData != '' ? '1' : '0' ;
            this.is_bod = step2.cabBodData != '' ? '1' : '0' ;

            // this.step2Data.date_of_establishment = step2.date_of_establishment;
            // this.step2Data.legal_license = res['data'].step1[0].trade_license_number;
            // this.step2Data.certification_main_activity = step2.certification_main_activity;
            // this.step2Data.main_activity_describe = res['data'].step1[0].other_description;
            // this.step2Data.is_bod = step2.is_bod;
            // this.step2Data.companyBodMembers = step2.companyBodMembers;
            this.step2Data.date_of_establishment = new Date(res['data'].step1[0].date_of_establisment);
            this.step2Data.legal_license = res['data'].step1[0].trade_license_number;
            this.step2Data.main_activity_describe = res['data'].step1[0].other_description;
            this.step2Data.certification_main_activity = res['data'].step1[0].is_certification_main_activity == true ? 1 : 0;
          }

        }
      });
  }

  getPlaceName(data)
    {
      if(typeof this.step1Data.applicant_location != 'undefined')
      {
        this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step1Data.applicant_location+'.json?access_token='+this.Service.mapboxToken+'','')
          .subscribe(res => {
              // //console.log(res['features']);
              this.searchCountryLists = res['features'];
            },
            error => {
            
        })
      }
    }

  stepClick(event: any){
    this.stepper.selected.completed = false;
    this.stepper.previous();
    // return;
  }

  onSubmitStep1(ngForm1) {
    //console.log(this.clientCabForm);
    if(ngForm1.form.valid && this.tradeLicensedValidation != false) {
      this.clientCabForm.step1 = {};
      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.clientCabForm.step1 = this.step1Data;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.clientCabForm));
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

  onSubmitStep2(ngForm2) {
    if(ngForm2.form.valid) {
      
      this.clientCabForm = {};
      this.clientCabForm.step2 = {};

      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.clientCabForm.step2 = this.step2Data;

      this.clientCabForm.step2['nameOftheOwner'] = [];
      this.clientCabForm.step2['companyBodMembers'] = [];
      
      if(this.nameOftheOwner) {
        this.clientCabForm.step2['nameOftheOwner'] = this.nameOftheOwner;
      }
      if(this.companyBodMembers) {
        this.clientCabForm.step2['companyBodMembers'] = this.companyBodMembers;
      }
      // console.log(this.clientCabForm);
      // this.clientCabFormFile.append('data',JSON.stringify(this.clientCabForm));
      
      // this.clientCabForm.step2 = this.companyBodMembers;
      // this.clientCabForm.step2 = this.nameOftheOwner;
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.clientCabForm));
      this.loader = false;
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
      this.clientCabForm.step1 = {};
      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.clientCabForm.userType = this.userType;
      this.clientCabForm.isDraft = 1;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.clientCabForm.step1 = this.step1Data;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.clientCabForm));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success(res['msg'], '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = false;
        });
    }else if(stepCount == 'step2') {
      this.clientCabForm = {};
      this.clientCabForm.step2 = {};

      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.clientCabForm.isDraft = 1;
      this.clientCabForm.step2 = this.step2Data;

      this.clientCabForm.step2['nameOftheOwner'] = [];
      this.clientCabForm.step2['companyBodMembers'] = [];
      
      if(this.nameOftheOwner) {
        this.clientCabForm.step2['nameOftheOwner'] = this.nameOftheOwner;
      }
      if(this.companyBodMembers) {
        this.clientCabForm.step2['companyBodMembers'] = this.companyBodMembers;
      }
      this.loader = false;
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.clientCabForm));
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

  bod_toggle(option,){
    if(option == '0') {
      this.is_bod = 0;
    }else{
      this.is_bod = 1;
    }
  }

}

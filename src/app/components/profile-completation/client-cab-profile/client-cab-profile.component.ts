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

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.step2Data.is_bod = '0';
    
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    // this.nameOftheOwner ? this.clientCabForm.step2 = this.nameOftheOwner : '';
    // this.clientCabForm.nameOftheOwner = this.nameOftheOwner;
    // this.clientCabForm.companyBodMembers = this.companyBodMembers
    // this.companyBodMembers ? this.clientCabForm.step2 = this.companyBodMembers : '';
    this.loadCountryStateCity();
    this.loadStep1Data();
    // console.log(this.constant.API_ENDPOINT.profileService,'hyyhhh')
  }

  loadStep1Data(){
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        if(res['status'] == true) {
          // console.log(res['data'].step1[0],'data');
          this.step1Data.first_name = res['data']['user_data'][0].first_name;
          this.step1Data.last_name = res['data']['user_data'][0].last_name;
          this.step1Data.personal_email = res['data']['user_data'][0].email;
          var step1 = res['data'].step1[0];
          if(res['data'].step1 != '') {
            
            this.step1Data.title = step1.cab_name;
            this.step1Data.date_of_birth = new Date(step1.dob);
            this.step1Data.trade_license = step1.trade_license;
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
            this.step1Data.date_issue = new Date(step1.date_of_issue);
            this.step1Data.date_expire = new Date(step1.date_of_expiry);
            this.step1Data.date_establishment = new Date(step1.date_of_establisment);
            // this.step1Data.title = step1.is_certification_main_activity;
          }
        }
      });
  }

  stepClick(event: any){
    this.stepper.selected.completed = false;
    this.stepper.previous();
    // return;
  }

  onSubmitStep1(ngForm1) {
    // //console.log(this.clientCabForm);
    if(ngForm1.form.valid) {
      // this.clientCabFormFile.append('data',JSON.stringify(this.clientCabForm));
      this.clientCabForm.step1 = {};
      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.clientCabForm.step1.first_name = this.step1Data.cab_profile_title+" "+this.step1Data.first_name;
      // this.step1Data.city = 'mumbai';
      // this.step1Data.officephone_with_area = '7867667768876876';
      // this.step1Data.officefax_with_area = '7867667768876876';
      this.clientCabForm.step1 = this.step1Data;
      // console.log(this.clientCabForm);
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.clientCabForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
        .subscribe(
          res => {
            console.log(res,'res')
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              // this.router.navigateByUrl('/sign-in');
            }else{
              
              this.toastr.warning(res['msg'], '');
            }
          });
      // this.stepper.next();
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  validateFile(fileEvent: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf','png'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.step1DataBodyFormFile.append('qualification_degree',fileEvent.target.files[0]);
      this.file_validation = true;
      return true;
    }else{
      this.file_validation = false;
    }
  }

  statelistById = async(country_id) => {
    this.allStateList = [];
    let stateList =  this.Service.getState();
    await stateList.subscribe( result => {
        for(let key in result['states']) {
          if(result['states'][key]['country_id'] == country_id )
          {
            this.allStateList.push(result['states'][key]);
          }
        }
    });
    // console.log(this.allStateList);
  }

  citylistById = async(state_id) => {
    this.allCityList = [];
    let cityList =  this.Service.getCity();
    await cityList.subscribe( result => {
        for(let key in result['cities']) {
          if(result['cities'][key]['state_id'] == state_id )
          {
            this.allCityList.push(result['cities'][key]);
          }
        }
    },
    error =>{
        console.log("Error: ", error);
    }
    
    );
  }
  
  loadCountryStateCity = async() => {
    let countryList =  this.Service.getCountry();
    await countryList.subscribe(record => {
      // console.log(record,'record');
      this.getCountryLists = record['countries'];
    });
    
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
      console.log(this.clientCabForm);
      // this.clientCabFormFile.append('data',JSON.stringify(this.clientCabForm));
      
      // this.clientCabForm.step2 = this.companyBodMembers;
      // this.clientCabForm.step2 = this.nameOftheOwner;
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.clientCabForm));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
        .subscribe(
          res => {
            console.log(res,'res')
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

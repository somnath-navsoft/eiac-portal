import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import { async } from '@angular/core/testing';
// import * as data from '../../../../assets/csc-json/cities.json';
// import SampleJson from './cities.json';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

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
  nameOftheOwner:any[] = [{}];
  companyBodMembers:any[] = [{}];
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
  firstName:any;
  minDate:any;
  step1SaveDraft:any;
  step2SaveDraft:any;
  personalEmailReadonly:any;
  userId:any;
  modalOptions:NgbModalOptions;
  closeResult: string;
  
  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,private modalService: NgbModal) { 
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.stepDefaultValue();
    // this.step2Data.is_bod = '0';
    this.addMinutesToTime = this.Service.addMinutesToTime();

    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');
    this.profileComplete = sessionStorage.getItem('profileComplete');
    this.userId = sessionStorage.getItem('userId');
    // this.nameOftheOwner ? this.clientCabForm.step2 = this.nameOftheOwner : '';
    // this.clientCabForm.nameOftheOwner = this.nameOftheOwner;
    // this.clientCabForm.companyBodMembers = this.companyBodMembers
    // this.companyBodMembers ? this.clientCabForm.step2 = this.companyBodMembers : '';
    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      },
      {
      title:'application_information', desc:'2. Applicant <br> Information', activeStep:false, stepComp:false, icon:'icon-doc-edit', activeClass:''
      }
    );
   this.titleArr = ['Mr.','Ms.','Dr.','Prof.','Mrs.'];
   this.loadStep1Data();
   this.loadCountryStateCity();
    // console.log(this.constant.API_ENDPOINT.profileService,'hyyhhh')
  }

  stepDefaultValue() {
    this.step1Data.title = '';
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
    this.step2Data.trade_license_number = '';
    this.step2Data.applicant_commercial_name = '';
    this.step2Data.applicant_location = '';
    this.step2Data.applicant_mailing_address = '';
    this.step2Data.applicant_phone_with_area = '';
    this.step2Data.applicant_fax_with_area = '';
    this.step2Data.applicant_official_email = '';
    this.step2Data.applicant_official_website = '';

    this.step2Data.contact_person_name = '';
    this.step2Data.contact_person_designation = '';
    this.step2Data.contact_person_email = '';
    this.step2Data.contact_person_phone = '';
    this.step2Data.contact_person_mobile = '';
    this.step2Data.authorised_contact = '';
    this.step2Data.trade_license_name = '';
    this.step2Data.date_issue = '';
    this.step2Data.date_expire = '';
    this.step2Data.date_establishment = '';
    this.step2Data.zip = '';
    this.step2Data.country = '';
    this.step2Data.state = '';
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
      designation:'',
      authorized_contact_person:'',
      mobile_no:'',
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
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail+'&id='+this.userId)
    .subscribe(
      res => {
        // console.log(res['data'],'data');
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
          this.personalEmailReadonly = this.step1Data.personal_email != '' ? true : false;
          
          if(res['data'].step1 !='' && res['data'].step1[0] && res['data'].step1[0].dob != null && res['data'].step1[0].official_email !='' && res['data'].step1[0].office_tel_no !='' && res['data'].step1[0].designation !='' && res['data'].step1[0].nationality != null && res['data'].step1[0].mailing_address !='' && res['data'].step1[0].office !='' && res['data'].step1[0].tel_no !='' && res['data'].step1[0].office_address !='') {
            this.progressValue = 50;
            this.Service.moveSteps('personal_details','application_information', this.headerSteps);
          }if(res['data'].step2 !='' && res['data'].step2 && res['data'].step1[0].trade_license_number !='' && res['data'].step1[0].applicant_location !='' && res['data'].step1[0].applicant_address !='' && res['data'].step1[0].applicant_tel_no !='' && res['data'].step1[0].applicant_email !='' && res['data'].step1[0].applicant_website !='' && res['data'].step1[0].date_of_issue != null && res['data'].step1[0].date_of_expiry != null && res['data'].step1[0].cab_name !='' && res['data'].step1[0].po_box !='' && res['data'].step1[0].country !='' && res['data'].step1[0].state !='' && res['data'].step1[0].city !='' && res['data'].step2.cabOwnerData != '' && res['data'].step2.cabBodData != '') {
            this.progressValue = 100;
          }

          // if(res['data'].step1 !='' && res['data'].step1[0] && res['data'].step1[0].application_status == 1) {
          //   this.progressValue = 50;
          //   this.Service.moveSteps('personal_details','application_information', this.headerSteps);
          //   this.step1SaveDraft = '1';
          // }else if(res['data'].step2 !='' && res['data'].step2[0] && res['data'].step2[0].application_status == 1) {
          //   this.step2SaveDraft = '1';
          //   this.progressValue = 100;
          // }
          
          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];
            
            this.step1Data.date_of_birth = new Date(step1.dob);
            
            this.step1Data.company_email = step1.official_email;
            this.step1Data.designation = step1.designation;
            this.step1Data.nationality = step1.nationality;
            this.step1Data.mailing_address = step1.mailing_address;
            this.step1Data.office_institution = step1.office;
            this.step1Data.phone_with_area = step1.tel_no;
            this.step1Data.fax_with_area = step1.fax_no;
            this.step1Data.office_address = step1.office_address;
            this.step1Data.officephone_with_area = step1.office_tel_no;
            
          }
          if(res['data'].step2 != '') {
            var step2 = res['data'].step2;

            this.tradeLicensedValidation = this.constant.mediaPath+step1.trade_license;
            var trade_license_split = step1.trade_license != null ? step1.trade_license.split('/') : '';

            var stateList =  this.Service.getState();
            var cityList =  this.Service.getCity();

            stateList.subscribe( result => {
              for(let key in result['states']) {
                if(result['states'][key]['name'] == step1.state )
                {
                  this.allStateList.push(result['states'][key]);
                }
              }
            });

            cityList.subscribe( result => {
              for(let key in result['cities']) {
                if(result['cities'][key]['name'] == step1.city )
                {
                  this.allCityList.push(result['cities'][key]);
                }
              }
            });

            this.step2Data.trade_license_number = step1.trade_license_number;
            this.step2Data.trade_license_name = trade_license_split[4];
            this.step2Data.applicant_commercial_name = step1.cab_name;
            this.step2Data.zip = step1.po_box;
            this.step2Data.country = step1.country;
            this.step2Data.state = step1.state;
            this.step2Data.city = step1.city;
            this.step2Data.applicant_location = step1.applicant_location;
            this.step2Data.applicant_mailing_address = step1.applicant_address;
            this.step2Data.applicant_phone_with_area = step1.applicant_tel_no;
            this.step2Data.applicant_fax_with_area = step1.applicant_fax_no;
            this.step2Data.applicant_official_email = step1.applicant_email;
            this.step2Data.applicant_official_website = step1.applicant_website;
            this.step2Data.date_establishment = new Date(step1.date_of_establisment);
            this.step2Data.date_issue = new Date(step1.date_of_issue);
            this.step2Data.date_expire = new Date(step1.date_of_expiry);
            
            this.nameOftheOwner = step2.cabOwnerData != '' ? step2.cabOwnerData : this.nameOftheOwner ;
            this.companyBodMembers = step2.cabBodData != '' ? step2.cabBodData : this.companyBodMembers ;
            // this.step2Data.contact_person_name = step2.cabContactData[0].name;
            // this.step2Data.contact_person_designation = step2.cabContactData[0].designation;
            // this.step2Data.contact_person_email = step2.cabContactData[0].email;
            // this.step2Data.contact_person_mobile = step2.cabContactData[0].mobile_no;
            // this.step2Data.contact_person_phone = step2.cabContactData[0].phone_no;
            this.step2Data.authorised_contact = step2.cabContactData[0].contacts == true ? 1 : 0 ;
            this.step2Data.is_bod = step2.cabBodData != '' ? '1' : '0' ;
            this.is_bod = step2.cabBodData != '' ? '1' : '0' ;

            // this.step2Data.date_of_establishment = step2.date_of_establishment;
            // this.step2Data.legal_license = res['data'].step1[0].trade_license_number;
            // this.step2Data.certification_main_activity = step2.certification_main_activity;
            // this.step2Data.main_activity_describe = res['data'].step1[0].other_description;
            // this.step2Data.is_bod = step2.is_bod;
            // this.step2Data.companyBodMembers = step2.companyBodMembers;
            // this.step2Data.date_of_establishment = res['data'].step1[0].date_of_establisment != null ? new Date(res['data'].step1[0].date_of_establisment) : '';
            // this.step2Data.legal_license = res['data'].step1[0].trade_license_number;
            // this.step2Data.main_activity_describe = res['data'].step1[0].other_description;
            // this.step2Data.certification_main_activity = res['data'].step1[0].is_certification_main_activity == true ? 1 : 0;
          }


        }
      });
  }

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }

  getPlaceName(data)
    {
      if(typeof this.step2Data.applicant_location != 'undefined')
      {
        this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step2Data.applicant_location+'.json?access_token='+this.Service.mapboxToken+'','')
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

  dateChanged(evt){
    let selectedDate = new Date(evt);
    console.log("by default:", selectedDate);
    console.log("by UTCString:", selectedDate.toUTCString());
    console.log("by LocaleString:", selectedDate.toLocaleString());
    console.log("by LocaleTimeString:", selectedDate.toLocaleTimeString());
    return selectedDate.toISOString();
  }

  onSubmitStep1(ngForm1) {
    // console.log(new Date(this.step1Data.date_of_birth));
    if(ngForm1.form.valid) {
      // var datestr = (new Date(this.step1Data.date_of_birth)).toISOString();
      // console.log(datestr,'datestr');
      // let newDate= new Date(this.step1Data.date_of_birth);
      // newDate = newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());

      let newDate= new Date(this.step1Data.date_of_birth);
      newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
      
      this.clientCabForm.step1 = {};
      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.step1Data.date_of_birth = newDate;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.clientCabForm.step1 = this.step1Data;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.clientCabForm));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
        .subscribe(
          res => {
            // console.log(">>>> prof...", res);
            if(res['status'] == true) {
              // this.toastr.success(res['msg'], '');
              this.progressValue == 0 || this.progressValue < 50 ? this.progressValue = 50 : this.progressValue = this.progressValue ;
              this.Service.moveSteps('personal_details','application_information', this.headerSteps);
            }else{
              this.toastr.warning(res['msg'], '');
            }
            this.loader = true;
          });
    }
    else {
      this.toastr.warning('Please Fill required field','');
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

  validateFile(fileEvent: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.step2Data.trade_license_name = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('trade_license',fileEvent.target.files[0]);
      this.file_validation = true;
      this.tradeLicensedValidation = true;
      return true;
    }else{
      this.file_validation = false;
      this.tradeLicensedValidation = false;
    }
  }

  onSubmitStep2(ngForm2) {
    if(ngForm2.form.valid  && this.tradeLicensedValidation != false) {

      let date_establishment= new Date(this.step2Data.date_establishment);
      date_establishment.setMinutes(date_establishment.getMinutes() - date_establishment.getTimezoneOffset());

      let date_issue= new Date(this.step2Data.date_issue);
      date_issue.setMinutes(date_issue.getMinutes() - date_issue.getTimezoneOffset());

      let date_expire= new Date(this.step2Data.date_expire);
      date_expire.setMinutes(date_expire.getMinutes() - date_expire.getTimezoneOffset());
      
      this.clientCabForm = {};
      this.clientCabForm.step2 = {};

      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.step2Data.date_establishment = date_establishment;
      this.step2Data.date_issue = date_issue;
      this.step2Data.date_expire = date_expire;
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
              if(sessionStorage.getItem('profileComplete') == '0') {
                setTimeout(()=>{
                  let elem = document.getElementById('openAppDialog');
                  //console.log("App dialog hash....", elem);
                  if(elem){
                    elem.click();
                  }
                }, 100)
              }
            }else{
              
              this.toastr.warning(res['msg'], '');
            }
            this.loader = true;
          });
    }else if(ngForm2.form.valid && this.tradeLicensedValidation == false) {
      this.file_validation = false;
      this.toastr.warning('Please Fill required field','');
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  openView(content, type:string) {
    
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //////console.log("Closed: ", this.closeResult);
      //this.courseViewData['courseDuration'] = '';
      //this.courseViewData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeChecklistDialog(){
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //////console.log("Closed with ESC ");
      
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //////console.log("Closed with CLOSE ICON ");
     
      return 'by clicking on a backdrop';
    } else {
      //////console.log("Closed ",`with: ${reason}`);
      
      return  `with: ${reason}`;
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
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }else if(stepCount == 'step2') {
      this.clientCabForm = {};
      this.clientCabForm.step2 = {};

      this.clientCabForm.email = this.userEmail;
      this.clientCabForm.userType = this.userType;
      this.clientCabForm.isDraft = 1;

      this.step2Data.date_issue = this.step2Data.date_issue != '' ? this.step2Data.date_issue : new Date();
      this.step2Data.date_expire = this.step2Data.date_expire != '' ? this.step2Data.date_expire : new Date();
      this.step2Data.date_establishment = this.step2Data.date_establishment != '' ? this.step2Data.date_establishment : new Date();

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
            this.toastr.success('Save draft successfully', '');
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../../../store/app.states';
import { LogOut, LogInSuccess } from '../../../store/actions/auth.actions';

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
  readOnly:boolean = false;
  userId:any;
  modalOptions:NgbModalOptions;
  closeResult: string;
  user: any = null;

  constructor(public Service: AppService, private store: Store<AppState>, public constant:Constants,public router: Router,public toastr: ToastrService,private modalService: NgbModal) { 
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.step1Data.application_info = "0";
    this.stepDefaultValue();
    this.userEmail = localStorage.getItem('email');
    this.userType = localStorage.getItem('type');
    this.isCompleteness = localStorage.getItem('isCompleteness');
    this.profileComplete = localStorage.getItem('profileComplete');
    this.userId = localStorage.getItem('userId');

    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      }      
    );
    /*
      {
      title:'application_information', desc:'2. Application <br> Information', activeStep:false, stepComp:false, icon:'icon-doc-edit', activeClass:''
      }
    */

    this.loadStep1Data();
    this.titleArr = ['Mr.','Ms.','Dr.','Prof.','Mrs.'];

    // console.log(this.step1Data.application_info);
    this.applicationInfo(0);
  }

  applicationInfo(param) {
    if(param == '1') {
      this.step1Data.applicant_office_institution = this.step1Data.office_institution;
      this.step1Data.applicant_phone_with_area = this.step1Data.phone_with_area;
      this.step1Data.applicant_fax_with_area = this.step1Data.fax_with_area;
      this.step1Data.applicant_office_address = this.step1Data.office_address;
      this.step1Data.applicant_officephone_with_area = this.step1Data.officephone_with_area;
      this.step1Data.applicant_mailing_address = this.step1Data.mailing_address;
      this.readOnly = true;
    }else if(param == '0') {
      this.readOnly = false;
      this.step1Data.applicant_office_institution = '';
      this.step1Data.applicant_phone_with_area = '';
      this.step1Data.applicant_fax_with_area = '';
      this.step1Data.applicant_office_address = '';
      this.step1Data.applicant_officephone_with_area = '';
      this.step1Data.applicant_mailing_address = '';
      
    }
  }

  stepDefaultValue() {
    this.step1Data.title = '';
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
    
    this.step1Data.applicant_office_institution = '';
    this.step1Data.applicant_phone_with_area = '';
    this.step1Data.applicant_fax_with_area = '';
    this.step1Data.applicant_office_address = '';
    this.step1Data.applicant_officephone_with_area = '';
    this.step1Data.applicant_mailing_address = '';
    this.step1Data.applicant_official_email = '';
    this.step1Data.applicant_official_website = '';

    this.step2Data.date_establishment = '';
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

          if(res['data'].step1 != '') {
            
            if(res['data'].step1 != '' && res['data'].step1[0] && res['data'].step1[0].dob != null && res['data'].step1[0].office_email != '' && res['data'].step1[0].designation != '' && res['data'].step1[0].nationality != null && res['data'].step1[0].mailing_address != '' && res['data'].step1[0].office != '' && res['data'].step1[0].tel_no != '' && res['data'].step1[0].office_address != '' && res['data'].step1[0].office_tel_no != '' && res['data'].step1[0].office_tel_no != '' && res['data'].step1[0].applicant_office != '' && res['data'].step1[0].applicant_tel_no != '' && res['data'].step1[0].applicant_office_address != '' && res['data'].step1[0].applicant_office_tel_no != '' && res['data'].step1[0].applicant_address != '') {
              this.progressValue = 50;
              //this.Service.moveSteps('personal_details','application_information', this.headerSteps);
            }if(res['data'].step2 != '' && res['data'].step2.candidateOwnerData != '' && res['data'].step2.candidateBodData != '' && res['data'].step1[0].legal_status != '' && res['data'].step1[0].date_of_establisment != null) {
              this.progressValue = 100;
            }
            
            if(res['data'].step1 != '') {
              var step1 = res['data'].step1[0];

              this.step1Data.date_of_birth = new Date(step1.dob); 
              this.step1Data.company_email = step1.office_email;
              this.step1Data.designation = step1.designation;
              this.step1Data.nationality = step1.nationality;
              this.step1Data.mailing_address = step1.mailing_address;
              this.step1Data.office_institution = step1.office;
              this.step1Data.phone_with_area = step1.tel_no;
              this.step1Data.fax_with_area = step1.fax_no;
              this.step1Data.office_address = step1.office_address;
              this.step1Data.officephone_with_area = step1.office_tel_no;

              this.step1Data.application_info = step1.office == step1.applicant_office && step1.tel_no == step1.applicant_tel_no && step1.fax_no == step1.applicant_fax_no && step1.office_address == step1.applicant_office_address ? '1' : '0';

              this.step1Data.applicant_office_institution = step1.applicant_office;
              this.step1Data.applicant_phone_with_area = step1.applicant_tel_no;
              this.step1Data.applicant_fax_with_area = step1.applicant_fax_no;
              this.step1Data.applicant_office_address = step1.applicant_office_address;
              this.step1Data.applicant_officephone_with_area = step1.applicant_office_tel_no;
              this.step1Data.applicant_mailing_address = step1.applicant_address;
              
              // this.step1Data.trade_license_number = step1.trade_license_number;
              // this.tradeLicensedValidation = step1['further_education'][0].qualification_file != null ? this.constant.mediaPath+step1['further_education'][0].qualification_file : '';
              // this.step1Data.title = step1.is_certification_main_activity;
            }

            if(res['data'].step2 != '') {
              var step1 = res['data'].step1[0];
              var step2 = res['data'].step2;

              // this.step2Data.date_establishment = '';
              this.step2Data.is_bod = step2.candidateBodData != '' ? '1' : '0';
              this.step2Data.legal_license = step1.legal_status;
              // this.step2Data.certification_main_activity = step1.legal_status;
              // this.step2Data.main_activity_describe = step1.is_certification_main_activity;
              this.nameOftheOwner = step2.candidateOwnerData != '' ? step2.candidateOwnerData : this.nameOftheOwner ;
              this.companyBodMembers =  step2.candidateBodData != '' ? step2.candidateBodData : this.companyBodMembers ;

              this.step2Data.date_establishment = res['data'].step1[0].date_of_establisment != null ? new Date(res['data'].step1[0].date_of_establisment) : '';
              // this.step2Data.legal_license = res['data'].step1[0].trade_license_number;
              this.step2Data.main_activity_describe = res['data'].step1[0].other_description;
              this.step2Data.certification_main_activity = res['data'].step1[0].is_certification_main_activity == true ? 1 : 0;
            }
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
    if(ngForm1.form.valid) {
      this.candidateProfile = {};
      this.candidateProfile.step1 = {};
      this.candidateProfile.email = this.userEmail;
      this.candidateProfile.userType = this.userType;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.step1Data.applicant_official_email = "test@test.com";
      this.step1Data.applicant_official_website = "test";
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
    }else {
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
              if(localStorage.getItem('profileComplete') == '0') {
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
    this.store.dispatch(new LogOut(this.user));
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
            this.toastr.success('Save draft successfully', '');
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
}

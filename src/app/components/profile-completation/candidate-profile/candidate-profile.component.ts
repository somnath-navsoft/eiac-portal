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
  candidateFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  headerSteps:any[] = [];

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');

    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:true, active:'user-done', nextStep:'application_information'
      }
    );

    this.loadStep1Data();
  }

  loadStep1Data() {
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        if(res['status'] == true) {
          // console.log(res['data'].step1[0],'data');
          this.candidateProfile.first_name = res['data']['user_data'][0].first_name;
          this.candidateProfile.last_name = res['data']['user_data'][0].last_name;
          this.candidateProfile.personal_email = res['data']['user_data'][0].email;
          this.candidateProfile.phone_with_area = res['data']['user_data'][0].contact;
          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];
            this.candidateProfile.date_of_birth = new Date(step1.dob);
            this.candidateProfile.company_email = step1.office_email;
            this.candidateProfile.designation = step1.designation;
            this.candidateProfile.fax_with_area = step1.fax_no;
            this.candidateProfile.office_institution = step1.office;
            this.candidateProfile.pobox_mailing_address = step1.mailing_address;
            this.candidateProfile.office_address = step1.office_address;
            this.candidateProfile.officephone_with_area = step1.office_tel_no;
          }
        }
      });
  }

  onSubmit(ngForm:any) {
    // this.clientCabFormFile.append('data',JSON.stringify(this.candidateProfile));
    //console.log(this.candidateProfile);
    if(ngForm.form.valid) {
      this.candidateProfile.email = this.userEmail;
      this.candidateProfile.userType = this.userType;
      this.candidateFormFile.append('data',JSON.stringify(this.candidateProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.candidateFormFile)
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
}

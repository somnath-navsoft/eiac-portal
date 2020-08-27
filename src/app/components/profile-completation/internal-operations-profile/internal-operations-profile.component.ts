import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-internal-operations-profile',
  templateUrl: './internal-operations-profile.component.html',
  styleUrls: ['./internal-operations-profile.component.scss']
})
export class InternalOperationsProfileComponent implements OnInit {

  eiacStaff:any = {};
  eiacStaffFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  headerSteps:any[] = [];
  isCompleteness:any;
  profileComplete:any;
  progressValue:any = 0;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('profileComplete');
    this.profileComplete = sessionStorage.getItem('profileComplete');

    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
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
          if(res['data'].step1) {
            this.progressValue = 100;
          }

          this.eiacStaff.first_name = res['data']['user_data'][0].first_name;
          this.eiacStaff.last_name = res['data']['user_data'][0].last_name;
          this.eiacStaff.personal_email = res['data']['user_data'][0].email;
          this.eiacStaff.personal_phone_with_area = res['data']['user_data'][0].contact;
          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];
            this.eiacStaff.date_of_birth = new Date(step1.dob);
            this.eiacStaff.department = step1.department;
            this.eiacStaff.company_email = step1.office_email;
            this.eiacStaff.company_phone_with_area = step1.office_tel_no;
            // this.eiacStaff.personal_phone_with_area = step1.personal_phone_with_area;
            this.eiacStaff.pobox_mailing_address = step1.pobox_mailing_address;
            this.eiacStaff.designation = step1.designation;
          }
        }
      });
  }

  onSubmit(ngForm:any) {
    if(ngForm.form.valid) {
      //console.log(this.eiacStaff);
      this.eiacStaff.email = this.userEmail;
      this.eiacStaff.userType = this.userType;
      this.eiacStaffFormFile.append('data',JSON.stringify(this.eiacStaff));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.eiacStaffFormFile)
        .subscribe(
          res => {
            console.log(res,'res')
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              this.progressValue == 0 || this.progressValue < 100 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
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

import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import  { UiDialogService } from  'src/app/services/uiDialog.service';

@Component({
  selector: 'app-operations-company-profile',
  templateUrl: './operations-company-profile.component.html',
  styleUrls: ['./operations-company-profile.component.scss']
})
export class OperationsCompanyProfileComponent implements OnInit {

  userType:any;
  userEmail:any;
  routeId:any;
  cabUserDetails:any;
  serviceDetail: any;
  cabStep1:any;
  cabStep2:any;
  tabId:any = 'personal_details';
  approveRejectStatus:any = '';
  loader:boolean = true;
  tradeLicenseFile:any;
  tradeLicenseText:any;
  rejectedMessageId:boolean = false;
  progressValue:number = 0;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public route: ActivatedRoute,public toastr: ToastrService,public uiDialog: UiDialogService) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('type');
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.loadData()
  }

  loadData() {
    this.loader = false;
    let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    console.log(">>> Profile: ", url);
    //this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?id='+this.routeId)
    this.Service.getwithoutData(url)
    .subscribe(
      res => {
        console.log("Dta: ", res);
        this.loader = true;
        this.serviceDetail = res['data'];
        this.cabUserDetails = res['data']['user_data'][0];
        this.approveRejectStatus = res['data']['user_data'][0].approved;
        this.cabStep1 = res['data']['step1'][0];
        this.cabStep2 = res['data']['step2'];

        //Calculate progression 
        if(res['data'].step1 !='' && res['data'].step1[0] && res['data'].step1[0].department != null 
        && res['data'].step1[0].office_tel_no !='' && res['data'].step1[0].office_email !='' 
        && res['data'].step1[0].designation !='' && res['data'].step1[0].nationality != null 
        && res['data'].step1[0].mailing_address !='' && res['data'].step1[0].office !='' 
        && res['data'].step1[0].tel_no !='' && res['data'].step1[0].office_address !='') {
          this.progressValue = 50; 
        }
        // if(res['data'].step2 !='' && res['data'].step2 && res['data'].step1[0].trade_license_number !='' && res['data'].step1[0].applicant_location !='' && res['data'].step1[0].applicant_address !='' && res['data'].step1[0].applicant_tel_no !='' && res['data'].step1[0].applicant_email !='' && res['data'].step1[0].applicant_website !='' && res['data'].step1[0].date_of_issue != null && res['data'].step1[0].date_of_expiry != null && res['data'].step1[0].cab_name !='' && res['data'].step1[0].po_box !='' && res['data'].step1[0].country !='' && res['data'].step1[0].state !='' && res['data'].step1[0].city !='' && res['data'].step2.cabOwnerData != '' && res['data'].step2.cabBodData != '') {
        //   this.progressValue = 100;
        // }



        this.tradeLicenseFile = this.constant.mediaPath+this.cabStep1.trade_license
        var tradeLicenseField = this.cabStep1.trade_license != null ? this.cabStep1.trade_license.split('/') : '';
        this.tradeLicenseText = tradeLicenseField[4];
    });
  }

  tabClick(id) {
    this.tabId = id;
    if(this.tabId == 'application_info') {
      var element = document.querySelector('#'+this.tabId);
      element.classList.remove("tab-active");
      

      var element2 = document.querySelector('#personal_details');
      element2.classList.add("tab-active");
    }else if(this.tabId == 'personal_details') {
      var element = document.querySelector('#'+this.tabId);
      element.classList.remove("tab-active");

      var element2 = document.querySelector('#application_info');
      element2.classList.add("tab-active");
    }
  }

  approveOrReject(status) {
    if(status == 'approve') {
      this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileApproval+'?id='+this.routeId+'&status=1')
      .subscribe(
        res => {
          this.approveRejectStatus = '1';
      });
      
    }
  }

  openRejectedPop() {
    this.rejectedMessageId = true;
  }

  getAllData(event) {
    // console.log(event);
    if(event.rejectId == 2) {
      this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileApproval+'?id='+this.routeId+'&status=2'+'&message='+event.message)
      .subscribe(
        res => {
          this.toastr.success('Message sent successfully', '');
          this.approveRejectStatus = '2';
      });
      
    }
  }

}

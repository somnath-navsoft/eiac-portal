import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import  { UiDialogService } from  'src/app/services/uiDialog.service';

@Component({
  selector: 'app-asessors-company-profile',
  templateUrl: './assessors-company-profile.component.html',
  styleUrls: ['./assessors-company-profile.component.scss']
})
export class AssessorsCompanyProfileComponent implements OnInit {

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

  assessorEduDetails: any = {};
  assessorsEmployment: any = {};
  isdDynamicsopenClose:any;
  assessorsKnowledge: any = [];


  constructor(public Service: AppService, public constant:Constants,public router: Router,public route: ActivatedRoute,public toastr: ToastrService,public uiDialog: UiDialogService) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('type');
    this.userEmail = sessionStorage.getItem('email'); 
    // this.routeId = this.route.snapshot.queryParamMap.get('id');
    // console.log(sessionStorage.getItem('routeId'));
    this.routeId = 1061;//sessionStorage.getItem('routeId');

    this.userType = sessionStorage.getItem('type');
    // if(this.userType != 'operations')
    // {
    //   var landUrl = '/dashboard'+this.userType+'/home'
    //   this.router.navigateByUrl(landUrl);
    // }
    //alert(">>>>>"); 
    this.loadData()
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

  getFile(file: string){
    let fname: string = file.split('/')[4].split('.')[0];
    console.log(fname);
    return fname;
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
        let getData: any = res['data'];
        this.loader = true;
        this.serviceDetail = res['data'];
        this.cabUserDetails = res['data']['user_data'][0];
        this.approveRejectStatus = res['data']['user_data'][0].approved;
        this.cabStep1 = res['data']['step1'][0];
        this.cabStep2 = res['data']['step2'];

        console.log(">>>>", this.cabUserDetails);

        //Calculate progression
        if(res['data'].step1 !='' && res['data'].step1[0] && res['data'].step1[0].dob != null && res['data'].step1[0].official_email !='' && res['data'].step1[0].office_tel_no !='' && res['data'].step1[0].designation !='' && res['data'].step1[0].nationality != null && res['data'].step1[0].mailing_address !='' && res['data'].step1[0].office !='' && res['data'].step1[0].tel_no !='' && res['data'].step1[0].office_address !='') {
          this.progressValue = 50; 
        }if(res['data'].step2 !='' && res['data'].step2 && res['data'].step1[0].trade_license_number !='' && res['data'].step1[0].applicant_location !='' && res['data'].step1[0].applicant_address !='' && res['data'].step1[0].applicant_tel_no !='' && res['data'].step1[0].applicant_email !='' && res['data'].step1[0].applicant_website !='' && res['data'].step1[0].date_of_issue != null && res['data'].step1[0].date_of_expiry != null && res['data'].step1[0].cab_name !='' && res['data'].step1[0].po_box !='' && res['data'].step1[0].country !='' && res['data'].step1[0].state !='' && res['data'].step1[0].city !='' && res['data'].step2.cabOwnerData != '' && res['data'].step2.cabBodData != '') {
          this.progressValue = 100;
        }
        //Education information
        if(getData.step2 != undefined){
          if(getData.step2.education != undefined && getData.step2.education.length > 0){
            this.assessorEduDetails['education'] = {};
            this.assessorEduDetails['education'] = getData.step2.education[0];
          }
          if(getData.step2.further_education != undefined && getData.step2.further_education.length > 0){
            this.assessorEduDetails['further_education'] = {};
            this.assessorEduDetails['further_education'] = getData.step2.further_education[0];
          }
          if(getData.step2.which_forum != undefined && getData.step2.which_forum.length > 0){
            this.assessorEduDetails['which_forum'] = [];
            this.assessorEduDetails['which_forum'] = getData.step2.which_forum;
          }
          if(getData.step2.language != undefined && getData.step2.language.length > 0){
            this.assessorEduDetails['language'] = [];
            this.assessorEduDetails['language'] = getData.step2.language;
          }
          if(getData.step2.others_education != undefined && getData.step2.others_education.length > 0){
            this.assessorEduDetails['others_education'] = {};
            this.assessorEduDetails['others_education'] = getData.step2.others_education[0];
          }
        }
        if(getData.step3 != undefined){
          if(getData.step3.experience_1 != undefined && getData.step3.experience_1.length > 0){
            this.assessorsEmployment['experience_1'] = [];
            this.assessorsEmployment['experience_1'] = getData.step3.experience_1;
          }
          if(getData.step3.experience_2 != undefined && getData.step3.experience_2.length > 0){
            this.assessorsEmployment['experience_2'] = [];
            this.assessorsEmployment['experience_2'] = getData.step3.experience_2;
          }
          if(getData.step3.experience_3 != undefined && getData.step3.experience_3.length > 0){
            this.assessorsEmployment['experience_3'] = [];
            this.assessorsEmployment['experience_3'] = getData.step3.experience_3;
          }
          if(getData.step3.experience_4 != undefined && getData.step3.experience_4.length > 0){
            this.assessorsEmployment['experience_4'] = [];
            this.assessorsEmployment['experience_4'] = getData.step3.experience_4;
          }
        }

        if(getData.technical_field != undefined && getData.technical_field.length > 0){
          this.assessorsKnowledge = getData.technical_field;
        }
        if(getData.step4 != undefined){
          console.log(".....");
            let step4Data: any = getData.step4;
            for(let key in step4Data['technical_experience']) {
              getData.technical_field.forEach(rec => {
                for(let nxtkey in rec['technical_fields']) {
                  if(key == rec['technical_fields'][nxtkey].field_mgmt) {
                    rec['technical_fields'][nxtkey].knowledge_experienced = step4Data['technical_experience'][key];
                  }
                }
              });
            }

            console.log(">>>Technical...", getData.technical_field);
        }



        // this.tradeLicenseFile = this.constant.mediaPath+this.cabStep1.trade_license
        // var tradeLicenseField = this.cabStep1.trade_license != null ? this.cabStep1.trade_license.split('/') : '';
        // this.tradeLicenseText = tradeLicenseField[4];
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

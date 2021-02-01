import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import  { UiDialogService } from  'src/app/services/uiDialog.service';

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.scss']
})
export class MessageDetailsComponent implements OnInit {

  userType:any;
  userEmail:any;
  routeId:any;
  cabUserDetails:any;
  cabStep1:any;
  cabStep2:any;
  tabId:any = 'personal_details';
  approveRejectStatus:any = '';
  loader:boolean = true;
  tradeLicenseFile:any;
  qualificationFile:any;
  qualificationText:any;
  specializationFile:any;
  specializationText:any;
  educationalDoc:any;
  whichForum:any;
  rejectedMessageId:boolean = false;
  assessorStep3:any;
  assessorStep4:any;
  assessorStep5:any;
  arabic:any = {};
  english:any = {};
  others:any = {};

  constructor(public Service: AppService, public constant:Constants,public router: Router,public route: ActivatedRoute,public toastr: ToastrService,public uiDialog: UiDialogService) { }

  ngOnInit() {
    this.userType = localStorage.getItem('type');
    this.userEmail = localStorage.getItem('email');
    // this.routeId = this.route.snapshot.queryParamMap.get('id');
    // console.log(localStorage.getItem('routeId'));
    this.routeId = localStorage.getItem('routeId');

    this.userType = localStorage.getItem('type');
    if(this.userType != 'operations')
    {
      var landUrl = '/dashboard'+this.userType+'/home'
      this.router.navigateByUrl(landUrl);
    }
    this.loadData()
  }

  loadData() {
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?id='+this.routeId)
    .subscribe(
      res => {
        this.loader = true;
        this.cabUserDetails = res['data']['user_data'][0];
        this.approveRejectStatus = res['data']['user_data'][0].approved;
        this.cabStep1 = res['data']['step1'][0];
        this.cabStep2 = res['data']['step2'];
        this.assessorStep3 = res['data']['step3'];
        this.assessorStep4 = res['data']['step4'];
        this.assessorStep5 = res['data']['step5'];
        this.qualificationFile = this.constant.mediaPath+this.cabStep2['education'][0].qualification_file;
        var qualificationPath = this.cabStep2['education'][0].qualification_file != null ? this.cabStep2['education'][0].qualification_file.split('/') : '';
        this.qualificationText = qualificationPath[4];
        this.specializationFile = this.constant.mediaPath+this.cabStep2['education'][0].specialization_file;
        var specializationPath = this.cabStep2['education'][0].specialization_file != null ? this.cabStep2['education'][0].specialization_file.split('/') : '';
        this.specializationText = specializationPath[4];

        this.educationalDoc = this.cabStep2['education'][0];
        this.whichForum = this.cabStep2['which_forum'][0];

        var language = this.cabStep2['language'];
          if(language != null) {
            for(let key in language)
            {
              if(language[key].language == 'arabic')
              {
                this.arabic = language[key];
              }
              if(language[key].language == 'english')
              {
                this.english = language[key];
              }
              if(language[key].language == 'others')
              {
                this.others = language[key];
              }
            }
          }
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

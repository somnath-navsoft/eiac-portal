import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import  { UiDialogService } from  'src/app/services/uiDialog.service';

@Component({
  selector: 'app-trainers-message-details',
  templateUrl: './trainers-message-details.component.html',
  styleUrls: ['./trainers-message-details.component.scss']
})
export class TrainersMessageDetailsComponent implements OnInit {

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
  education:any;
  other_course:any;
  rejectedMessageId:boolean = false;;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public route: ActivatedRoute,public toastr: ToastrService,public uiDialog: UiDialogService) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('type');
    this.userEmail = sessionStorage.getItem('email');
    // this.routeId = this.route.snapshot.queryParamMap.get('id');
    // console.log(sessionStorage.getItem('routeId'));
    this.routeId = sessionStorage.getItem('routeId');

    this.userType = sessionStorage.getItem('type');
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
        this.cabStep2 = res['data']['step2'][0];

        this.other_course = res['data'].step2[0].other_course != null ? JSON.parse(res['data'].step2[0].other_course) : '';
        this.education = res['data'].step2[0].education != null ? JSON.parse(res['data'].step2[0].education) : '';

        this.qualificationFile = this.constant.mediaPath+this.cabStep2.qualification_file;
        var qualification = this.cabStep2.qualification_file != null ? this.cabStep2.qualification_file.split('/') : '';
        this.qualificationText = qualification[4];
        this.specializationFile = this.constant.mediaPath+this.cabStep2.specialization_file;
        var specialization = this.cabStep2.specialization_file != null ? this.cabStep2.specialization_file.split('/') : '';
        this.specializationText = specialization[4];
    });
  }

  openRejectedPop() {
    this.rejectedMessageId = true;
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
    // else if(status == 'reject') {
    //   this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileApproval+'?id='+this.routeId+'&status=2')
    //   .subscribe(
    //     res => {
    //       this.approveRejectStatus = '2';
    //   });
      
    // }
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

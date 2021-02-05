import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import  { UiDialogService } from  'src/app/services/uiDialog.service';

@Component({
  selector: 'app-trainer-company-profile',
  templateUrl: './trainer-company-profile.component.html',
  styleUrls: ['./trainer-company-profile.component.scss']
})
export class TrainerCompanyProfileComponent implements OnInit {

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

  trainerEducation:any;
  trainerForum: any[] =[];
  trainerLang: any[] =[];

  constructor(public Service: AppService, public constant:Constants,public router: Router,public route: ActivatedRoute,public toastr: ToastrService,public uiDialog: UiDialogService) { }

  ngOnInit() {
    this.userType = localStorage.getItem('type');
    this.userEmail = localStorage.getItem('email'); 
    // this.routeId = this.route.snapshot.queryParamMap.get('id');
    // console.log(localStorage.getItem('routeId'));
    this.routeId = localStorage.getItem('routeId');

    this.userType = localStorage.getItem('type');
    // if(this.userType != 'operations')
    // {
    //   var landUrl = '/dashboard'+this.userType+'/home'
    //   this.router.navigateByUrl(landUrl);
    // }
    //alert(">>>>>"); 
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
        let getData: any = res['data'];
        this.serviceDetail = res['data'];
        this.cabUserDetails = res['data']['user_data'][0];
        this.approveRejectStatus = res['data']['user_data'][0].approved;
        this.cabStep1 = res['data']['step1'][0];
        this.cabStep2 = res['data']['step2'];

        //Calculate progression
        if(res['data'].step1 != undefined  && res['data'].step1[0].dob != '' 
        && res['data'].step1[0].applicant_email !='' && res['data'].step1[0].applicant_tel_no !='' 
        && res['data'].user_data[0].designation !='' && res['data'].step1[0].nationality != '' 
        && res['data'].step1[0].mailing_address !='' && res['data'].step1[0].office !='' 
        && res['data'].step1[0].office_tel_no !='' && res['data'].step1[0].office_address !='') {
          this.progressValue = 50; 
        }if(res['data'].step2 != undefined && getData.step2.all_data[0].education != '' &&
            res['data'].step2.which_forum.length > 0 && res['data'].step2.language.length > 0) {
          this.progressValue = 100;
        }

        //Trainer Education
        if(getData.step2 != undefined && getData.step2.all_data.length > 0){
            //this.trainerEducation = getData.step2.all_data;
            let educationData: any = getData.step2.all_data[0].education;
            this.trainerEducation = JSON.parse(educationData);
            console.log(">>> ", JSON.parse(educationData))
        }
        if(getData.step2 != undefined && getData.step2.which_forum.length > 0){
            this.trainerForum = getData.step2.which_forum;
        }
        if(getData.step2 != undefined && getData.step2.language.length > 0){
            this.trainerLang = getData.step2.language;
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

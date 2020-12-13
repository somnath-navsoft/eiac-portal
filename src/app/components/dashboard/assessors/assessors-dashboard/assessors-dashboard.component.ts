import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assessors-dashboard',
  templateUrl: './assessors-dashboard.component.html',
  styleUrls: ['./assessors-dashboard.component.scss']
})
export class AssessorsDashboardComponent implements OnInit { 

  messageList: any = [];
  userId: any;
  loader: boolean = true;
  recordsTotal: any;
  config: any;
  userDetails:any;
  userEmail:any;
  userType:any;
  step1Data:any;
  step2Data:any;

  dashboardItemData: any = {};
  dashboardRecentUpdates: any[] = [];
  dashboardTradeLicFile: any;
  dashboardTradeLicExDate: any;
  dashboardTradeLicExStatus: boolean = false;
  licence_document_file: string;
  licence_document_path: string;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) {
    this.config = {
      itemsPerPage: this.Service.dashBoardPagination,
      currentPage: 1,
    };
  }

  
  //Load Dashboatd data
  loadDashData(){
    this.loader = false;
    let getURL: string =this.Service.apiServerUrl + "/" + 'assessor-dashboard/' ;
    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = {};
          getData = res;
          // console.log(res,'res');
          if(res['status'] == 200){
            this.dashboardItemData = res['dashBoardData'];

            console.log(">>>>> ", res['dashBoardData'], " == ", getData);
            //Get recent updates
            if(this.dashboardItemData.lastLogin != undefined){
              let datePart: any = this.dashboardItemData.lastLogin.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              console.log(">>>>... ", time1Ar, " -- ", time1Ar.length);
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "+ time2;
              console.log(datePart, " == ", date, " -- ",time);  
              this.dashboardRecentUpdates.push({title: "Assessor Last Login",date:date, time: time});
            }
            
          }
          console.log(">>>> Load Data: ", res, " == ", this.dashboardRecentUpdates);

        });
  }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');
    this.loader = false;


    this.loadDashData();

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService + '?userType=' + this.userType + '&email=' + this.userEmail)
    .subscribe(
      res => {
        this.loader = true;
        this.userDetails = res['data']['user_data'][0];
        this.step1Data = res['data']['step1'][0];
        this.step1Data = res['data']['step1'][0];
        this.step2Data = res['data']['step2']['education'][0];
        // console.log(res,'res');
      });

      
        
    this.userId = sessionStorage.getItem('userId');

    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          // this.messageList = res['data'].message_list;
          res['data'].message_list.forEach((rec, index) => {
            if (rec.meta_title != 'user_registration') {
              this.messageList.push(rec);
            }
          });
          // console.log(this.messageList);
          this.loader = true;
          this.recordsTotal = res['data'].recordsTotal;
          // console.log(res['data'].message_list);
        });
  }
  getUserDetails(user) {
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

}

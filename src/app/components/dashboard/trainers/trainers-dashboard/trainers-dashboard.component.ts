import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trainers-dashboard',
  templateUrl: './trainers-dashboard.component.html',
  styleUrls: ['./trainers-dashboard.component.scss']
})
export class TrainersDashboardComponent implements OnInit { 

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
  dashboardEvents: any = [];
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
    let getURL: string =this.Service.apiServerUrl + "/" + 'trainer-dashboard/' ;
    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          // console.log(res,'res');
          if(res['status'] == 200){
            this.dashboardItemData = res['dashBoardData'];

            //dashboardEvents
            if(this.dashboardItemData.eventDetails != undefined && this.dashboardItemData.eventDetails.length > 0){
                this.dashboardEvents = this.dashboardItemData.eventDetails;
                console.log(">>>Events: ", this.dashboardEvents);
            }

            //Get recent updates
            if(this.dashboardItemData.lastLogin != undefined){
              // let dt = new Date(this.dashboardItemData.lastLogin);
              // let date = dt.toLocaleDateString();
              // let time = dt.toLocaleTimeString();
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
              this.dashboardRecentUpdates.push({title: "Trainer Last Login",date:date, time: time});
            }
            if(this.dashboardItemData.lastAccrApplied != undefined){
              let datePart: any = this.dashboardItemData.lastAccrApplied.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "Trainer Accreditation Applied",date:date, time: time});
            }
            if(this.dashboardItemData.lastRegApplied != undefined){
              let datePart: any = this.dashboardItemData.lastRegApplied.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "Trainer Registration Applied",date:date, time: time});
            }
            if(this.dashboardItemData.lastTrainingApplied != undefined){
              let datePart: any = this.dashboardItemData.lastTrainingApplied.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" " + time2;
              this.dashboardRecentUpdates.push({title: "Trainer Training Applied",date:date, time: time});
            }
            if(this.dashboardItemData.lastAccrPayment != undefined){
              let datePart: any = this.dashboardItemData.lastAccrPayment.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "Trainer Accreditation Payment",date:date, time: time});
            }
            if(this.dashboardItemData.lastRegPayment != undefined){
              let datePart: any = this.dashboardItemData.lastRegPayment.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "Trainer Registration Payment",date:date, time: time});
            }
            if(this.dashboardItemData.lastTrainingPayment != undefined){
              let datePart: any = this.dashboardItemData.lastTrainingPayment.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "Trainer Training Payment",date:date, time: time});
            }
          }
          console.log(">>>> Load Data: ", res, " == ", this.dashboardRecentUpdates);

        });
  }

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');

    this.loadDashData();

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService + '?userType=' + this.userType + '&email=' + this.userEmail)
    .subscribe(
      res => {
        this.loader = true;
        this.userDetails = res['data']['user_data'][0];
        this.step1Data = res['data']['step1'][0];
        //this.step2Data = res['data']['step2']['education'][0];
        console.log(res,'res');
      });

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
          this.recordsTotal = res['data'].recordsTotal;
          this.loader = true;
        });
  }

  getUserDetails(user) {
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

}

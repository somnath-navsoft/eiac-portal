import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-cab-dashboard',
  templateUrl: './cab-dashboard.component.html',
  styleUrls: ['./cab-dashboard.component.scss']
})
export class CabDashboardComponent implements OnInit {

  userEmail: any;
  userType: any;
  userDetails: any[] = []
  step1Data: any;
  loader: boolean = true;
  messageList: any = [];
  userId: any;
  recordsTotal: any;
  config: any;

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

  getFile(file: string){
    let fname: string = file.split('/')[4].split('.')[0];
    console.log(fname, " == ", file);
    return fname;
  }

  //Load Dashboatd data
  loadDashData(){
    this.loader = false;
    let getURL: string =this.Service.apiServerUrl + "/" + 'cab-dashboard/' ;
    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          // console.log(res,'res');
          if(res['status'] == 200){
            this.dashboardItemData = res['dashBoardData'];

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
              this.dashboardRecentUpdates.push({title: "CAB Last Login",date:date, time: time});
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
              this.dashboardRecentUpdates.push({title: "CAB Accreditation Applied",date:date, time: time});
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
              this.dashboardRecentUpdates.push({title: "CAB Registration Applied",date:date, time: time});
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
              this.dashboardRecentUpdates.push({title: "CAB Training Applied",date:date, time: time});
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
              this.dashboardRecentUpdates.push({title: "CAB Accreditation Payment",date:date, time: time});
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
              this.dashboardRecentUpdates.push({title: "CAB Registration Payment",date:date, time: time});
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
              this.dashboardRecentUpdates.push({title: "CAB Training Payment",date:date, time: time});
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
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService + '?userType=' + this.userType + '&email=' + this.userEmail)
      .subscribe(
        res => {
          this.loader = true;
          this.userDetails = res['data']['user_data'][0];
          this.step1Data = res['data']['step1'][0];
          //
          if(this.step1Data && this.step1Data.date_of_expiry != null){
            this.dashboardTradeLicExDate = this.step1Data.date_of_expiry;
            let date = new Date();
            let yr = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let todays: any = new Date(yr+"-"+month+"-"+day);
            let expiryData: any = this.step1Data.date_of_expiry;;//new Date("2021-1-15");;
            let diffDate: any = Math.round((expiryData-todays)/(1000*60*60*24))
            if(diffDate > 0){
              //console.log("#########");
              this.licence_document_file = this.getFile(this.step1Data.trade_license);
              this.licence_document_path = this.constant.mediaPath + this.step1Data.trade_license;
              this.dashboardTradeLicExStatus = false;
            }else{
              //console.log("....");
              this.dashboardTradeLicExStatus = true;
            }
            console.log("diffdaat: ", diffDate, " -- ",todays," == ",expiryData, " == ", this.dashboardTradeLicExStatus);
          }
          if(this.step1Data && this.step1Data.trade_license != null){
            this.dashboardTradeLicFile = this.step1Data.trade_license;
          }
          // console.log(res,'res');
        });

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          res['data'].message_list.forEach((rec, index) => {
            if (rec.meta_title != 'user_registration') {
              this.messageList.push(rec);
            }
          });
          // this.messageList = res['data'].message_list;
          this.recordsTotal = res['data'].recordsTotal;
          this.loader = true;
        });
        this.loadDashData();
  }

  getUserDetails(user) {
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

}

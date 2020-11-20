import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cab-dashboard',
  templateUrl: './cab-dashboard.component.html',
  styleUrls: ['./cab-dashboard.component.scss']
})
export class CabDashboardComponent implements OnInit {

  userEmail:any;
  userType:any;
  userDetails:any[] = []
  step1Data:any;
  loader:boolean = true;
  messageList: any;
  userId: any;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        this.loader = true;
        this.userDetails = res['data']['user_data'][0];
        this.step1Data = res['data']['step1'][0]
        // console.log(res,'res');
      });

      this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          // console.log(this.messageList);
          this.loader = true;
          // console.log(res['data'].message_list);
        });
  }

  getUserDetails(user){
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
  }

}

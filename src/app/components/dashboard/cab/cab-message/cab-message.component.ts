import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cab-message',
  templateUrl: './cab-message.component.html',
  styleUrls: ['./cab-message.component.scss']
})
export class CabMessage implements OnInit {

  userEmail:any;
  userType:any;
  userDetails:any[] = []
  step1Data:any;
  loader:boolean = true;
  messageList: any;
  userId: any;
  recordsTotal: any;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    this.userType = localStorage.getItem('type');
    this.userId = localStorage.getItem('userId');
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
          this.recordsTotal = res['data'].recordsTotal;
          this.loader = true;          
        });
  }

  getUserDetails(user){
    localStorage.setItem('messageUserDetails', JSON.stringify(user));
  }

}

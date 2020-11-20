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

  messageList: any;
  userId: any;
  loader: boolean = true;
  recordsTotal: any;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) { }

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');

    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          this.recordsTotal = res['data'].recordsTotal;
          this.loader = true;          
        });
  }

  getUserDetails(user){
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
  }

}

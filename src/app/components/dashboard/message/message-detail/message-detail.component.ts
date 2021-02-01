import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit {

  userType: any;
  userEmail: any;
  

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) { }

  ngOnInit() {
    this.userType = localStorage.getItem('type');
    this.userEmail = localStorage.getItem('email');

    this.userType = localStorage.getItem('type');
    if (this.userType != 'operations') {
      var landUrl = '/dashboard' + this.userType + '/home'
      this.router.navigateByUrl(landUrl);
    }
  }

}

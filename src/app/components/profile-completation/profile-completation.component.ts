import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-completation',
  templateUrl: './profile-completation.component.html',
  styleUrls: ['./profile-completation.component.scss'],
  providers: [Constants, AppService, ToastrService]
})
export class ProfileCompletationComponent implements OnInit {

  userType:any;

  constructor(public appService: AppService, public constant:Constants,public toastr: ToastrService, public router: Router) { }

  ngOnInit() {
    this.userType = localStorage.getItem('type');
    // //console.log(this.userType,'userType');
  }

}

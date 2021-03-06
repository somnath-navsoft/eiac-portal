import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-application-registration',
  templateUrl: './application-registration.component.html',
  styleUrls: ['./application-registration.component.scss']
})
export class ApplicationRegistrationComponent implements OnInit {

  serviceList:any;
  loader:boolean = true;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    // console.log(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService);
    this.loadService();
  }

  loadService() {
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.service_details_page+"?data=registration_service&language_id=1")
    .subscribe(
      res => {
        // console.log(res,'res');
        this.serviceList  = res['allServiceList'];
        this.loader = true;
      });
  }
}

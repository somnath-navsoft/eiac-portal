import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-accreditation',
  templateUrl: './application-accreditation.component.html',
  styleUrls: ['./application-accreditation.component.scss']
})
export class ApplicationAccreditationComponent implements OnInit {

  serviceList:any;
  loader:boolean = true;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    // console.log(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService);
    this.loadService();
  }

  loadService() {
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.service_details_page+"?data=accreditation_service")
      .subscribe(
        res => {
          // console.log(res,'res');
          this.serviceList  = res['allServiceList'];
          this.loader = true;
        });
  }

}

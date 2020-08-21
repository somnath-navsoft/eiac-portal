import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
  providers: [Constants, AppService]
})
export class VerifyAccountComponent implements OnInit {
  @Input() verifyId:any;
  constructor(public router: Router,public appService: AppService, public constant:Constants) { }

  ngOnInit() {
    var splitId = this.verifyId.split('=');
    var splitEmail = splitId[1].split('&');
    
    var email = splitEmail[0];
    var hash = splitId[2];

    // console.log(email);
    // console.log(hash);
    // console.log(this.appService.apiServerUrl+"/"+this.constant.API_ENDPOINT.emailVerification+'?email='+email+'&hash='+hash);
    this.appService.getwithoutData(this.appService.apiServerUrl+"/"+this.constant.API_ENDPOINT.emailVerification+'?email='+email+'&hash='+hash)
    .subscribe(
      res => {
        if(res['status'] != true) {
          this.router.navigateByUrl('/sign-in');
        }
      });
      
  }

}

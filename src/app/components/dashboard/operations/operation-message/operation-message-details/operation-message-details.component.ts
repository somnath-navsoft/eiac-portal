import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operation-message-details',
  templateUrl: './operation-message-details.component.html',
  styleUrls: ['./operation-message-details.component.scss']
})
export class OperationMessageDetailsComponent implements OnInit {

  userType:any;

  constructor(public router: Router) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('type');
    if(this.userType != 'operations')
    {
      var landUrl = '/dashboard'+this.userType+'/home'
      this.router.navigateByUrl(landUrl);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Constants } from 'src/app/services/constant.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  accountDetailId:any;

  constructor(private _service:AppService,private _constants:Constants) { }

  ngOnInit() {
    this.accountDetailId = sessionStorage.getItem('accountDetailId');
    console.log(this.accountDetailId,'sdgfd')
  }

}
